// =============================================
// moderate-review
// Supabase Edge Function (Deno runtime)
//
// Trigger flow: a Postgres trigger on reviews (AFTER INSERT) calls this
// function with { review_id }. This function:
//   1. Fetches the full review row from Postgres (service role — bypasses RLS,
//      which is fine here because this function IS the trusted backend)
//   2. Downloads the room/outside-view photos (if present) and base64-encodes
//      them for Gemini's inline image input
//   3. Sends comment + outside_view_description + photos to Gemini 2.5 Flash
//      with a strict JSON-only response format
//   4. Writes ai_checked / ai_flagged / ai_reason back to the row, and
//      auto-approves (status -> 'approved') if Gemini found nothing wrong
//
// Env vars required (set via `supabase secrets set`):
//   GEMINI_API_KEY        - from https://aistudio.google.com/apikey
//   SUPABASE_URL          - auto-provided by Supabase at deploy time
//   SUPABASE_SERVICE_ROLE_KEY - auto-provided by Supabase at deploy time
// =============================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
);

// Fetches an image URL and returns { mimeType, base64Data }, or null if it
// can't be fetched / isn't an image. Caps size so we don't choke on huge
// uploads or hang on a slow/broken URL.
async function fetchImageAsBase64(url) {
  if (!url) return null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;

    const mimeType = res.headers.get("content-type") || "image/jpeg";
    if (!mimeType.startsWith("image/")) return null;

    const buf = await res.arrayBuffer();
    if (buf.byteLength > 8 * 1024 * 1024) return null; // 8MB safety cap

    const base64Data = btoa(
      new Uint8Array(buf).reduce((s, b) => s + String.fromCharCode(b), ""),
    );
    return { mimeType, base64Data };
  } catch (_err) {
    return null;
  }
}

function buildPrompt(review) {
  return `You are a content moderator for "Bro, Which Hostel?", a review site \
where VIT University students post reviews of their hostel rooms. Decide \
whether the SUBMISSION below is acceptable to publish.

A submission is UNACCEPTABLE if any of these are true:
- The written text is vulgar, hateful, harassing, sexual, or otherwise \
inappropriate for a public student-facing website
- The written text has nothing to do with describing a hostel room, \
hostel block, or its surroundings (e.g. spam, unrelated rant, gibberish)
- Any attached photo is NOT a plausible photo of a hostel room or the \
view/surroundings from one (e.g. it's a screenshot, a meme, an ID card or \
other personal document, a photo of a person/selfie, a video game \
screenshot, or anything sexual/inappropriate/unrelated)

A submission is ACCEPTABLE if the text plausibly describes a real hostel \
room/view experience (even if short, casually written, or critical/negative \
in tone) and any attached photos plausibly show a room interior or an \
outside view from a building.

Err toward ACCEPTABLE for genuine, if blunt or unpolished, student reviews. \
Only flag things that are actually irrelevant, inappropriate, or clearly \
mismatched photos.

SUBMISSION:
Room comment: "${review.comment || "(none provided)"}"
Outside view description: "${review.outside_view_description || "(none provided)"}"
[Room photo and/or outside-view photo are attached below, if present]

Respond with ONLY a JSON object, no markdown formatting, no code fences, \
in exactly this shape:
{"acceptable": true or false, "reason": "one short sentence explaining your decision"}`;
}

Deno.serve(async (req) => {
  // Clone up front: req.json() can only be consumed once, but the catch
  // block below also needs the body if something fails partway through.
  const reqForErrorHandling = req.clone();

  try {
    const { review_id } = await req.json();
    if (!review_id) {
      return new Response(JSON.stringify({ error: "review_id is required" }), {
        status: 400,
      });
    }

    // 1. Fetch the review row
    const { data: review, error: fetchErr } = await supabase
      .from("reviews")
      .select("id, comment, outside_view_description, room_photo, outside_view_photo")
      .eq("id", review_id)
      .single();

    if (fetchErr || !review) {
      return new Response(
        JSON.stringify({ error: fetchErr?.message || "Review not found" }),
        { status: 404 },
      );
    }

    // 2. Download photos (in parallel) for inline image input
    const [roomImg, viewImg] = await Promise.all([
      fetchImageAsBase64(review.room_photo),
      fetchImageAsBase64(review.outside_view_photo),
    ]);

    // 3. Build Gemini request: text prompt + any images we successfully fetched
    const parts = [{ text: buildPrompt(review) }];
    if (roomImg) {
      parts.push({
        inline_data: { mime_type: roomImg.mimeType, data: roomImg.base64Data },
      });
    }
    if (viewImg) {
      parts.push({
        inline_data: { mime_type: viewImg.mimeType, data: viewImg.base64Data },
      });
    }

    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0,
          responseMimeType: "application/json",
        },
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      throw new Error(`Gemini API error (${geminiRes.status}): ${errText}`);
    }

    const geminiJson = await geminiRes.json();
    const rawText = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("Gemini returned no usable response");

    let verdict;
    try {
      verdict = JSON.parse(rawText);
    } catch (_e) {
      throw new Error(`Could not parse Gemini response as JSON: ${rawText}`);
    }

    const acceptable = verdict.acceptable === true;
    const reason = typeof verdict.reason === "string"
      ? verdict.reason.slice(0, 500)
      : "No reason provided.";

    // 4. Write the verdict back. Clean reviews get auto-approved; flagged
    // ones stay 'pending' (so they still show in your moderation queue) but
    // get ai_flagged=true so the UI can badge them for you to check.
    const updatePayload = {
      ai_checked: true,
      ai_flagged: !acceptable,
      ai_reason: reason,
      ...(acceptable ? { status: "approved" } : {}),
    };

    const { error: updateErr } = await supabase
      .from("reviews")
      .update(updatePayload)
      .eq("id", review_id);

    if (updateErr) throw updateErr;

    return new Response(JSON.stringify({ ok: true, acceptable, reason }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("moderate-review error:", err.message);

    // Best-effort: if we at least know the review_id, mark it checked+flagged
    // so a Gemini outage or bug doesn't silently leave it unflagged forever
    // with no trace that anything went wrong. It stays in your queue either way.
    try {
      const body = await reqForErrorHandling.json().catch(() => ({}));
      if (body?.review_id) {
        await supabase
          .from("reviews")
          .update({
            ai_checked: true,
            ai_flagged: true,
            ai_reason: `AI check failed (${err.message}) — please review manually.`,
          })
          .eq("id", body.review_id);
      }
    } catch (_e) {
      // swallow — we did our best
    }

    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});