// =============================================
// MODERATION & SECURITY SYSTEM
// =============================================
// =============================================
// SUPABASE LIVE CONNECTION CONFIGURATION
// =============================================
// =============================================
// SUPABASE LIVE CONNECTION CONFIGURATION
// =============================================
// =============================================
// SUPABASE LIVE CONNECTION CONFIGURATION
// =============================================

const SUPABASE_URL = "https://iaadxkvwrlvorvtaztnt.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhYWR4a3Z3cmx2b3J2dGF6dG50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMDcwMDQsImV4cCI6MjA5NTg4MzAwNH0.I8SNFq1IuVY4k7_l6qL68nFTfFquON_tUyI-WMXNJgk";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Your global state variable
// List of words to block (case-insensitive)
const BANNED_WORDS = [
    'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'cunt', 'whore',
    // You can add local/campus-specific profanities here too
];

/**
 * Checks a string for profanity. 
 * Returns true if clean, false if it contains banned words.
 */
function checkContentSafety(text) {
    if (!text) return true;
    
    const cleanText = text.toLowerCase();
    
    // Check if any banned word is included as a distinct word or substring
    const hasProfanity = BANNED_WORDS.some(word => cleanText.includes(word));
    
    return !hasProfanity; // returns true if it's safe to post
}
// =============================================
// DATA - Hostels & Reviews
// =============================================

// const hostels = [
// { id: 1, block: 'A', name: 'A - ALBERT EINSTEIN BLOCK',image: 'hostelpics/test.jpeg', roomTypes: ['2 Bed AC','2 Bed NAC','4 Bed AC','4 Bed NAC','6 Bed NAC'] },

// { id: 2, block: 'C', name: 'C - RABINDRANATH TAGORE BLOCK',image: 'hostelpics/test1.jpeg', roomTypes: ['2 Bed NAC','4 Bed NAC'] },

// { id: 3, block: 'D', name: 'D - NELSON MANDELA BLOCK', roomTypes: ['1 Bed AC','1 Bed NAC'] },

// { id: 4, block: 'DX', name: 'DX - NELSON MANDELA BLOCK', roomTypes: ['3 Bed AC','3 Bed NAC','4 Bed AC','4 Bed NAC'] },

// { id: 5, block: 'E', name: 'E - SIR C V RAMAN BLOCK', roomTypes: ['2 Bed NAC'] },

// { id: 6, block: 'F', name: 'F - RAMANUJAM BLOCK', roomTypes: ['2 Bed AC','4 Bed AC','6 Bed AC'] },

// { id: 7, block: 'G', name: 'G - SOCRATES BLOCK', roomTypes: ['1 Bed AC','1 Bed NAC','4 Bed AC','4 Bed NAC'] },

// { id: 8, block: 'H', name: 'H - JOHN KENNEDY BLOCK', roomTypes: ['1 Bed AC','1 Bed NAC','3 Bed NAC'] },

// { id: 9, block: 'J', name: 'J - JOHN KENNEDY BLOCK', roomTypes: ['1 Bed AC','1 Bed NAC','3 Bed NAC'] },

// { id: 10, block: 'K', name: 'K - DR SARVAPALLI RADHAKRISHNAN BLOCK', roomTypes: ['4 Bed AC','6 Bed AC'] },

// { id: 11, block: 'L', name: 'L - NETAJI SUBASH CHANDRA BOSE BLOCK', roomTypes: ['1 Bed AC','2 Bed AC','2 Bed NAC','3 Bed AC','4 Bed AC','4 Bed NAC','6 Bed AC'] },

// { id: 12, block: 'M', name: 'M - QUAID-E-MILLAT MUHAMMED ISMAIL BLOCK', roomTypes: ['2 Bed AC','3 Bed AC','6 Bed AC'] },

// { id: 13, block: 'MX', name: 'MX - QUAID-E-MILLAT MUHAMMED ISMAIL BLOCK', roomTypes: ['4 Bed NAC','6 Bed NAC'] },

// { id: 14, block: 'N', name: 'N - CHARLES DARWIN BLOCK', roomTypes: ['2 Bed AC','3 Bed AC','6 Bed AC'] },

// { id: 15, block: 'P', name: 'P - SARDAR PATEL BLOCK', roomTypes: ['2 Bed NAC','3 Bed NAC','4 Bed NAC','6 Bed NAC'] },

// { id: 16, block: 'Q', name: 'Q - VAJPAYEE BLOCK', roomTypes: ['2 Bed AC','3 Bed AC','4 Bed AC'], bedType: 'Deluxe' },

// { id: 17, block: 'R', name: 'R - MUTHAMIZHARINGNAR KALAIGNAR M KARUNANIDHI BLOCK', roomTypes: ['2 Bed AC','3 Bed AC','4 Bed AC'], bedType: 'Deluxe' },

// { id: 18, block: 'T', name: 'T - JAGDISH CHANDRA BOSE BLOCK', roomTypes: ['2 Bed AC','3 Bed AC','4 Bed AC'], bedType: 'Deluxe' }
// ];


// 🌟 FIX: Add global placeholders for uploaded photo URLs
let currentRoomPhotoUrl = null;
let currentOutsideViewPhotoUrl = null;
let hostels = [];
let reviews = [];

// =============================================
// STATE
// =============================================
// =============================================
// DATA PREPROCESSING (Fixes data structure mismatches)
// =============================================
// =============================================
// DATA PREPROCESSING (Fixes data structure mismatches)
// =============================================
function preprocessHostelData(dataArray) {
    if (!dataArray) return;
    
    dataArray.forEach(h => {
        // 1. Provide a default description so searches and rendering don't crash
        h.description = h.description || `Welcome to ${h.name} (Block ${h.block}).`;
        
        // 2. Map the string array into the expected object structure matching your code
        if (h.roomTypes && !h.room_types) {
            h.room_types = h.roomTypes.map(roomStr => {
                const parts = roomStr.split(' '); // Splits "2 Bed AC" into ["2", "Bed", "AC"]
                return {
                    room_size: parseInt(parts[0]) || 2,   // 2
                    ac: parts[2] === 'AC',               // true if 'AC', false if 'NAC'
                    bed_type: h.bedType || 'Bunk'         // Uses 'Deluxe' if specified, otherwise defaults to 'Bunk'
                };
            });
        }
    });
}
let currentView = 'home';
let currentHostelId = null;
let currentTab = 'overview';
let filters = {
    roomSize: null,
    ac: null,
    bedType: null,
    search: ''
};

// =============================================
// UTILITIES
// =============================================

function getHostelRating(hostelId) {
    const hostelReviews = reviews.filter(r => r.hostel_id === hostelId);
    if (hostelReviews.length === 0) return { overall: 0, count: 0, wifi: 0, noise: 0, lift_wait: 0, cleanliness: 0, queue: 0, hot_water: 0, maintenance: 0, laundry: 0, mess_distance: 0 };
    const avg = (key) => (hostelReviews.reduce((sum, r) => sum + r[key], 0) / hostelReviews.length).toFixed(1);
    return {
        overall: parseFloat(avg('overall_rating')),
        count: hostelReviews.length,
        wifi: parseFloat(avg('wifi')),
        noise: parseFloat(avg('noise')),
        lift_wait: parseFloat(avg('lift_wait')),
        cleanliness: parseFloat(avg('cleanliness')),
        queue: parseFloat(avg('queue')),
        hot_water: parseFloat(avg('hot_water')),
        maintenance: parseFloat(avg('maintenance'))
    };
}
function renderAboutPage() {
    return `
    <section class="max-w-4xl mx-auto px-6 py-16">

        <div class="bg-hostel-card border border-hostel-border rounded-3xl p-8">

            <h1 class="font-heading text-4xl font-bold mb-4">
                👋 About The Project
            </h1>

            <p class="text-gray-300 leading-relaxed mb-6">
                Bro, Which Hostel? is built by Vansh Chaudhry, a Computer Science student at VIT, Vellore.
            </p>

            <p class="text-gray-400 mb-6">
                The goal was simple:
                help hostel students compare blocks using
                actual student experiences instead of random WhatsApp rumours.
            </p>

            <div class="space-y-3 text-sm text-hostel-muted">

                <div>🏠 Real student reviews</div>
                <div>📸 Room & window photos</div>
                <div>🚿 Bathroom discussions</div>
                <div>📊 Ratings that actually matter</div>

            </div>

            <div class="mt-6 inline-block relative group text-sm font-medium text-brand-400 cursor-pointer hover:text-brand-300 transition-colors">
                Connect with me
                
                <div class="absolute left-1/2 -translate-x-1/2 bottom-full mb-3
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible
                    transition-all duration-200 z-50">

                    <div class="bg-hostel-card border border-hostel-border rounded-2xl shadow-2xl p-4 w-64 text-left font-normal">

                        <div class="text-sm font-heading font-semibold text-white mb-3">
                            Let's link up! 👋
                        </div>

                        <div class="space-y-2">

                            <a href="https://www.linkedin.com/in/vansh-chaudhry-31794a333"
                               target="_blank"
                               class="flex items-center gap-3 p-2 rounded-lg hover:bg-hostel-surface transition-colors">
                                <span class="text-xl">💼</span>
                                <div>
                                    <div class="text-sm text-gray-200">LinkedIn</div>
                                    <div class="text-xs text-hostel-muted">Professional profile</div>
                                </div>
                            </a>

                            <a href="https://github.com/VanchChau"
                               target="_blank"
                               class="flex items-center gap-3 p-2 rounded-lg hover:bg-hostel-surface transition-colors">
                                <span class="text-xl">💻</span>
                                <div>
                                    <div class="text-sm text-gray-200">GitHub</div>
                                    <div class="text-xs text-hostel-muted">Projects & source code</div>
                                </div>
                            </a>

                        </div>

                    </div>

                </div>
            </div>

            <div class="mt-4 pt-6 border-t border-hostel-border">

                <p class="text-gray-400 text-sm">
                    Built with HTML, Tailwind, JS, and sleep deprivation.
                </p>

            </div>

        </div>

    </section>
    `;
}
function renderStars(rating, size = 'sm') {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    const sizeClass = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
    let html = '';
    for (let i = 0; i < full; i++) html += `<i data-lucide="star" class="${sizeClass} text-yellow-400 fill-yellow-400"></i>`;
    if (half) html += `<i data-lucide="star-half" class="${sizeClass} text-yellow-400 fill-yellow-400"></i>`;
    for (let i = 0; i < empty; i++) html += `<i data-lucide="star" class="${sizeClass} text-gray-600"></i>`;
    return html;
}

function ratingColor(val) {
    if (val >= 4) return 'text-green-400';
    if (val >= 3) return 'text-yellow-400';
    if (val >= 2) return 'text-orange-400';
    return 'text-red-400';
}

function ratingBarColor(val) {
    if (val >= 4) return 'bg-green-500';
    if (val >= 3) return 'bg-yellow-500';
    if (val >= 2) return 'bg-orange-500';
    return 'bg-red-500';
}

function ratingLabel(val) {
    if (val >= 4.5) return 'Excellent';
    if (val >= 4) return 'Great';
    if (val >= 3) return 'Decent';
    if (val >= 2) return 'Meh';
    return 'Brutal';
}

function roomTypeLabel(rt) {
    return `${rt.room_size} Bed ${rt.ac ? 'AC' : 'Non-AC'} ${rt.bed_type}`;
}

function roomTypeShort(rt) {
    return `${rt.room_size}B ${rt.ac ? 'AC' : 'Non-AC'}`;
}

function hostelHasAC(hostel) {
    return hostel.room_types.some(rt => rt.ac);
}

function hostelHasNonAC(hostel) {
    return hostel.room_types.some(rt => !rt.ac);
}

function hostelHasDeluxe(hostel) {
    return hostel.room_types.some(rt => rt.bed_type === 'Deluxe');
}

function hostelHasBunk(hostel) {
    return hostel.room_types.some(rt => rt.bed_type === 'Bunk');
}

function hostelRoomSizes(hostel) {
    return [...new Set(hostel.room_types.map(rt => rt.room_size))].sort((a, b) => a - b);
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-brand-600';
    toast.className = `${bgColor} text-white px-5 py-3 rounded-xl shadow-2xl animate-fade-in-up flex items-center gap-2 text-sm font-medium`;
    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info';
    toast.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4"></i> ${message}`;
    container.appendChild(toast);
    lucide.createIcons({ nodes: [toast] });
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

// =============================================
// NAVIGATION
// =============================================

function navigateTo(view, hostelId = null) {
    currentView = view;
    if (view === 'detail' && hostelId) {
        currentHostelId = hostelId;
        currentTab = 'overview';
    }
    renderApp();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', isDark ? 'dark' : 'light');
    // Update icon visibility
    document.querySelectorAll('.dark-icon').forEach(el => el.style.display = isDark ? 'block' : 'none');
    document.querySelectorAll('.light-icon').forEach(el => el.style.display = isDark ? 'none' : 'block');
    renderApp();
}

function switchTab(tab) {
    currentTab = tab;
    renderApp();
}

function closeImageModal(event) {
    if (event && event.target !== event.currentTarget && event.target.id !== 'modalImage') return;
    const modal = document.getElementById('imageModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function openImageModal(src, alt) {
    const modal = document.getElementById('imageModal');
    document.getElementById('modalImage').src = src;
    document.getElementById('modalImage').alt = alt;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// =============================================
// RENDER - Homepage
// =============================================

function renderHomePage() {
    const filteredHostels = hostels.filter(h => {
        if (filters.search && !h.name.toLowerCase().includes(filters.search.toLowerCase()) && !h.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
        // Check if any room type in this hostel matches ALL active filters
        return h.room_types.some(rt => {
            if (filters.roomSize && rt.room_size !== parseInt(filters.roomSize)) return false;
            if (filters.ac !== null && rt.ac !== (filters.ac === 'true')) return false;
            if (filters.bedType && rt.bed_type !== filters.bedType) return false;
            return true;
        });
    });

    return `
        <section class="hero-gradient relative overflow-hidden">
            <div class="absolute inset-0 opacity-20">
                <div class="absolute top-20 left-10 w-72 h-72 bg-brand-500 rounded-full blur-[120px]"></div>
                <div class="absolute bottom-10 right-20 w-96 h-96 bg-purple-600 rounded-full blur-[150px]"></div>
            </div>
            <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
                <div class="text-center max-w-3xl mx-auto">
                    <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-500/10 border border-brand-500/20 rounded-full text-brand-400 text-sm font-medium mb-6 animate-fade-in-up">
                        <span class="emoji-bounce">🏠</span> Made for students, by students
                    </div>
                    <h1 class="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold hero-text mb-6 animate-fade-in-up stagger-1">
                        Bro, Which <span class="text-brand-400">Hostel?</span>
                    </h1>
                    <p class="hero-subtitle text-lg sm:text-xl text-gray-400 mb-8 leading-relaxed animate-fade-in-up stagger-2">
                        Compare hostel blocks using real student reviews, bathroom discussions, room photos, and insider experiences. 
                        <span class="text-brand-400">Just the facts, built on your honesty.</span>
                    </p>
                    <div class="flex flex-wrap justify-center gap-3 animate-fade-in-up stagger-3">
                        <div class="flex items-center gap-2 px-3 py-1.5 bg-hostel-card/60 rounded-lg text-sm text-gray-300">
                            <i data-lucide="message-square" class="w-4 h-4 text-brand-400"></i>
                            ${reviews.length}+ Reviews
                        </div>
                        <div class="flex items-center gap-2 px-3 py-1.5 bg-hostel-card/60 rounded-lg text-sm text-gray-300">
                            <i data-lucide="building-2" class="w-4 h-4 text-brand-400"></i>
                            ${hostels.length} Hostels
                        </div>
                        <div class="flex items-center gap-2 px-3 py-1.5 bg-hostel-card/60 rounded-lg text-sm text-gray-300">
                            <i data-lucide="bath" class="w-4 h-4 text-brand-400"></i>
                            Bathroom Truths
                        </div>
                    </div>
                </div>
            </div>
            <div class="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
                    <path d="M0 60L48 52C96 44 192 28 288 20C384 12 480 12 576 16C672 20 768 28 864 32C960 36 1056 36 1152 32C1248 28 1344 20 1392 16L1440 12V60H0Z" class="fill-hostel-dark"/>
                </svg>
            </div>
        </section>

        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="bg-hostel-card border border-hostel-border rounded-2xl p-4 sm:p-6">
                <div class="flex items-center gap-2 mb-4">
                    <i data-lucide="sliders-horizontal" class="w-5 h-5 text-brand-400"></i>
                    <span class="font-heading font-semibold text-lg">Filter Hostels</span>
                </div>
                
                <div class="relative mb-4">
                    <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hostel-muted"></i>
                    <input type="text" placeholder="Search hostel name then press ENTER..." 
                        class="w-full pl-10 pr-4 py-2.5 bg-hostel-surface border border-hostel-border rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
                        value="${filters.search}"
                        onkeydown="handleSearch(event, this.value)">
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label class="text-xs text-hostel-muted uppercase tracking-wider mb-2 block font-medium">Room Size</label>
                        <div class="flex flex-wrap gap-2">
                            ${[1,2,3,4,6].map(size => `
                                <button onclick="filters.roomSize = filters.roomSize === '${size}' ? null : '${size}'; renderApp();"
                                    class="filter-chip px-3 py-1.5 rounded-lg text-sm border transition-all ${
                                        filters.roomSize === String(size) 
                                            ? 'active bg-brand-600 text-white border-brand-600' 
                                            : 'bg-hostel-surface border-hostel-border text-gray-300 hover:border-brand-500/50'
                                    }">
                                    ${size} Bed
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div>
                        <label class="text-xs text-hostel-muted uppercase tracking-wider mb-2 block font-medium">Cooling</label>
                        <div class="flex flex-wrap gap-2">
                            <button onclick="filters.ac = filters.ac === 'true' ? null : 'true'; renderApp();"
                                class="filter-chip px-3 py-1.5 rounded-lg text-sm border transition-all ${
                                    filters.ac === 'true' 
                                        ? 'active bg-cyan-600 text-white border-cyan-600' 
                                        : 'bg-hostel-surface border-hostel-border text-gray-300 hover:border-cyan-500/50'
                                }">
                                ❄️ AC
                            </button>
                            <button onclick="filters.ac = filters.ac === 'false' ? null : 'false'; renderApp();"
                                class="filter-chip px-3 py-1.5 rounded-lg text-sm border transition-all ${
                                    filters.ac === 'false' 
                                        ? 'active bg-orange-600 text-white border-orange-600' 
                                        : 'bg-hostel-surface border-hostel-border text-gray-300 hover:border-orange-500/50'
                                }">
                                🪭 Non-AC
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <label class="text-xs text-hostel-muted uppercase tracking-wider mb-2 block font-medium">Bed Type</label>
                        <div class="flex flex-wrap gap-2">
                            <button onclick="filters.bedType = filters.bedType === 'Bunk' ? null : 'Bunk'; renderApp();"
                                class="filter-chip px-3 py-1.5 rounded-lg text-sm border transition-all ${
                                    filters.bedType === 'Bunk' 
                                        ? 'active bg-violet-600 text-white border-violet-600' 
                                        : 'bg-hostel-surface border-hostel-border text-gray-300 hover:border-violet-500/50'
                                }">
                                🛏️ Bunk
                            </button>
                            <button onclick="filters.bedType = filters.bedType === 'Deluxe' ? null : 'Deluxe'; renderApp();"
                                class="filter-chip px-3 py-1.5 rounded-lg text-sm border transition-all ${
                                    filters.bedType === 'Deluxe' 
                                        ? 'active bg-brand-600 text-white border-brand-600' 
                                        : 'bg-hostel-surface border-hostel-border text-gray-300 hover:border-brand-500/50'
                                }">
                                ✨ Deluxe
                            </button>
                        </div>
                    </div>
                </div>

                ${(filters.roomSize || filters.ac || filters.bedType || filters.search) ? `
                    <div class="mt-4 pt-3 border-t border-hostel-border flex items-center justify-between">
                        <span class="text-sm text-hostel-muted">${filteredHostels.length} hostel${filteredHostels.length !== 1 ? 's' : ''} found</span>
                        <button onclick="filters = {roomSize: null, ac: null, bedType: null, search: ''}; renderApp();"
                            class="text-sm text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
                            <i data-lucide="x" class="w-3 h-3"></i> Clear all
                        </button>
                    </div>
                ` : ''}
            </div>
        </section>

        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div class="flex items-center justify-between mb-6">
                <h2 class="font-heading text-2xl font-bold">
                    All Hostels <span class="text-hostel-muted text-base font-normal">(${filteredHostels.length})</span>
                </h2>
            </div>
            
            ${filteredHostels.length === 0 ? `
                <div class="text-center py-20">
                    <div class="text-6xl mb-4">🔍</div>
                    <h3 class="font-heading text-xl font-semibold mb-2">No hostels match your filters</h3>
                    <p class="text-hostel-muted">Try adjusting your filters to see more results</p>
                    <button onclick="filters = {roomSize: null, ac: null, bedType: null, search: ''}; renderApp();"
                        class="mt-4 px-5 py-2 bg-brand-600 hover:bg-brand-700 rounded-xl text-sm font-medium transition-colors">
                        Clear Filters
                    </button>
                </div>
            ` : `
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    ${filteredHostels.map((hostel, idx) => {
                        const rating = getHostelRating(hostel.id);
                        const hasAC = hostelHasAC(hostel);
                        const hasNonAC = hostelHasNonAC(hostel);
                        const hasDeluxe = hostelHasDeluxe(hostel);
                        const hasBunk = hostelHasBunk(hostel);
                        const sizes = hostelRoomSizes(hostel);
                        return `
                            <div class="group bg-hostel-card border border-hostel-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-brand-500/30 hover:bg-hostel-cardHover animate-fade-in-up "
                                onclick="navigateTo('detail', ${hostel.id})">
                                
                                <div class="relative h-44 overflow-hidden bg-hostel-surface border-b border-hostel-border/30">
                                    <img src="${hostel.image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500'}" 
                                         alt="${hostel.name}" 
                                         class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                         onerror="this.src='https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500'">
                                    
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                                    
                                    <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[75%]">
                                        ${hasAC ? '<span class="px-2 py-0.5 rounded-md text-xs font-semibold text-white badge-ac">❄️ AC</span>' : ''}
                                        ${hasNonAC ? '<span class="px-2 py-0.5 rounded-md text-xs font-semibold text-white badge-nonac">🪭 Non-AC</span>' : ''}
                                        ${hasDeluxe ? '<span class="px-2 py-0.5 rounded-md text-xs font-semibold text-white badge-deluxe">✨ Deluxe</span>' : ''}
                                        ${hasBunk ? '<span class="px-2 py-0.5 rounded-md text-xs font-semibold text-white badge-bunk">🛏️ Bunk</span>' : ''}
                                    </div>
                                    
                                    <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 border border-white/10">
                                        <i data-lucide="star" class="w-3.5 h-3.5 text-yellow-400 fill-yellow-400"></i>
                                        <span class="text-sm font-bold text-white">${rating.overall || '—'}</span>
                                    </div>
                                </div>

                                <div class="p-4">
                                    <div class="flex items-start justify-between mb-2 gap-2">
                                        <h3 class="font-heading font-bold text-lg text-white group-hover:text-brand-400 transition-colors line-clamp-1">${hostel.name}</h3>
                                        <span class="text-xs text-hostel-muted bg-hostel-surface px-2 py-0.5 rounded-md whitespace-nowrap">${sizes.join('/')} Bed</span>
                                    </div>

                                    <div class="flex flex-wrap gap-1 mb-2">
                                        ${hostel.room_types.map(rt => `
                                            <span class="text-[10px] px-1.5 py-0.5 rounded-md border border-hostel-border bg-hostel-surface text-gray-400">${roomTypeShort(rt)} ${rt.bed_type === 'Deluxe' ? '✨' : '🛏️'}</span>
                                        `).join('')}
                                    </div>
                                    
                                    <p class="text-sm text-hostel-muted line-clamp-2 mb-3">${hostel.description}</p>
                                    
                                    <div class="grid grid-cols-3 gap-2 mb-3 pt-2 border-t border-hostel-border/40">
                                        <div class="text-center">
                                            <div class="text-[10px] text-hostel-muted uppercase tracking-wider mb-0.5">WiFi</div>
                                            <div class="text-sm font-bold ${ratingColor(rating.wifi)}">${rating.wifi || '—'}</div>
                                        </div>
                                        <div class="text-center">
                                            <div class="text-[10px] text-hostel-muted uppercase tracking-wider mb-0.5">Bathroom</div>
                                            <div class="text-sm font-bold ${ratingColor(rating.cleanliness)}">${rating.cleanliness || '—'}</div>
                                        </div>
                                        <div class="text-center">
                                            <div class="text-[10px] text-hostel-muted uppercase tracking-wider mb-0.5">Lift</div>
                                            <div class="text-sm font-bold ${ratingColor(rating.lift_wait)}">${rating.lift_wait || '—'}</div>
                                        </div>
                                    </div>

                                    <div class="flex items-center justify-between pt-3 border-t border-hostel-border/50">
                                        <span class="text-xs text-hostel-muted">${rating.count} review${rating.count !== 1 ? 's' : ''}</span>
                                        <span class="text-xs text-brand-400 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                            View Details <i data-lucide="arrow-right" class="w-3 h-3"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `}
        </section>
    `;
}

// =============================================
// RENDER - Detail Page
// =============================================

function renderDetailPage() {
    const hostel = hostels.find(h => h.id === currentHostelId);
    if (!hostel) return '<div class="text-center py-20">Hostel not found</div>';
    
    const rating = getHostelRating(hostel.id);
    const hostelReviews = reviews.filter(r => r.hostel_id === hostel.id);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'layout-dashboard' },
        { id: 'bathrooms', label: 'Bathrooms', icon: 'bath' },
        { id: 'reviews', label: 'Reviews', icon: 'message-square' },
    ];

    return `
        <!-- Hero Banner -->
        <section class="relative h-56 sm:h-72 overflow-hidden">
            <img src="${hostel.image}" alt="${hostel.name}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-hostel-dark via-hostel-dark/60 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div class="max-w-7xl mx-auto">
                    <button onclick="navigateTo('home')" class="mb-3 flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors">
                        <i data-lucide="arrow-left" class="w-4 h-4"></i> Back to all hostels
                    </button>
                    <div class="flex flex-wrap items-end gap-4">
                        <div>
                            <div class="flex flex-wrap items-center gap-2 mb-1">
                                ${hostelHasAC(hostel) ? '<span class="px-2 py-0.5 rounded-md text-xs font-semibold text-white badge-ac">❄️ AC</span>' : ''}
                                ${hostelHasNonAC(hostel) ? '<span class="px-2 py-0.5 rounded-md text-xs font-semibold text-white badge-nonac">🪭 Non-AC</span>' : ''}
                                ${hostelHasDeluxe(hostel) ? '<span class="px-2 py-0.5 rounded-md text-xs font-semibold text-white badge-deluxe">✨ Deluxe</span>' : ''}
                                ${hostelHasBunk(hostel) ? '<span class="px-2 py-0.5 rounded-md text-xs font-semibold text-white badge-bunk">🛏️ Bunk</span>' : ''}
                                <span class="px-2 py-0.5 rounded-md text-xs font-semibold text-white bg-gray-700">
                                    ${hostelRoomSizes(hostel).join('/')} Bed
                                </span>
                            </div>
                            <h1 class="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">${hostel.name}</h1>
                        </div>
                        <div class="flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2">
                            <div class="flex">${renderStars(rating.overall, 'md')}</div>
                            <span class="text-2xl font-bold ${ratingColor(rating.overall)}">${rating.overall || '—'}</span>
                            <span class="text-sm text-hostel-muted">(${rating.count})</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Tabs -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex gap-1 border-b border-hostel-border mt-2">
                ${tabs.map(tab => `
                    <button onclick="switchTab('${tab.id}')"
                        class="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative ${
                            currentTab === tab.id 
                                ? 'text-brand-400 tab-active' 
                                : 'text-hostel-muted hover:text-gray-300'
                        }">
                        <i data-lucide="${tab.icon}" class="w-4 h-4"></i>
                        <span class="hidden sm:inline">${tab.label}</span>
                    </button>
                `).join('')}
            </div>
        </section>

        <!-- Tab Content -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            ${currentTab === 'overview' ? renderOverviewTab(hostel, rating, hostelReviews) : ''}
            ${currentTab === 'bathrooms' ? renderBathroomsTab(hostel, rating, hostelReviews) : ''}
            ${currentTab === 'reviews' ? renderReviewsTab(hostel, hostelReviews) : ''}
        </section>
    `;
}

function renderOverviewTab(hostel, rating, hostelReviews) {
    const generalRatings = [
        { key: 'wifi', label: 'WiFi Quality', icon: 'wifi', emoji: '📶' },
        { key: 'noise', label: 'Noise Level', icon: 'volume-2', emoji: '🔊', invert: true, invertLabel: 'Quietness' },
        { key: 'lift_wait', label: 'Lift Waiting', icon: 'arrow-up-from-line', emoji: '🛗' },
        { key: 'cleanliness', label: 'Cleanliness', icon: 'sparkles', emoji: '✨' },
        { key: 'maintenance', label: 'Maintenance', icon: 'wrench', emoji: '🔧' },
    ];

    function displayRating(key, val) {
    if (!val) return 0;

    return (key === 'noise' || key === 'lift_wait')
        ? 6 - val
        : val;
}

    const hasAC = hostelHasAC(hostel);
    const hasNonAC = hostelHasNonAC(hostel);
    const hasDeluxe = hostelHasDeluxe(hostel);
    const hasBunk = hostelHasBunk(hostel);

    return `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left: Description + Room Types + Ratings -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Description Card -->
                <div class="detail-section bg-hostel-card border border-hostel-border rounded-2xl p-5">
                    <h2 class="font-heading font-semibold text-lg mb-3 flex items-center gap-2">
                        <span>📝</span> About ${hostel.name}
                    </h2>
                    <p class="text-gray-300 leading-relaxed">${hostel.description}</p>
                </div>

                <!-- Available Room Types -->
                <div class="detail-section bg-hostel-card border border-hostel-border rounded-2xl p-5">
                    <h2 class="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                        <span>🛏️</span> Available Room Types
                    </h2>
                    <p class="text-sm text-hostel-muted mb-4">This block offers multiple room configurations. Pick what suits your budget and vibe.</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        ${hostel.room_types.map(rt => `
                            <div class="p-4 bg-hostel-surface rounded-xl border border-hostel-border hover:border-brand-500/30 transition-colors">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="font-heading font-semibold text-base">${rt.room_size} Bed</span>
                                    <span class="px-2 py-0.5 rounded-md text-xs font-semibold text-white ${rt.ac ? 'badge-ac' : 'badge-nonac'}">
                                        ${rt.ac ? '❄️ AC' : '🪭 Non-AC'}
                                    </span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="px-2 py-0.5 rounded-md text-xs font-semibold text-white ${rt.bed_type === 'Deluxe' ? 'badge-deluxe' : 'badge-bunk'}">
                                        ${rt.bed_type === 'Deluxe' ? '✨ Deluxe' : '🛏️ Bunk'}
                                    </span>
                                    <span class="text-xs text-hostel-muted">${rt.room_size === 1 ? 'Single occupancy' : rt.room_size + ' sharing'}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- General Ratings -->
                <div class="detail-section bg-hostel-card border border-hostel-border rounded-2xl p-5">
                    <h2 class="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                        <span>📊</span> General Ratings
                    </h2>
                    <div class="space-y-4">
                        ${generalRatings.map(r => {
                            const val = rating[r.key] || 0;
                            const displayVal = displayRating(r.key, val);
                            return `
                                <div class="flex items-center gap-4">
                                    <span class="text-lg w-8 text-center">${r.emoji}</span>
                                    <div class="flex-1">
                                        <div class="flex items-center justify-between mb-1">
                                            <span class="text-sm font-medium">${r.key === 'noise' ? 'Quietness' : r.key === 'lift_wait' ? 'Lift Wait time' : r.label}</span>
                                            <span class="text-sm font-bold ${displayVal ? ratingColor(displayVal) : 'text-hostel-muted'}">
    ${displayVal ? `${displayVal}/5` : '—'}
</span>
                                        </div>
                                        <div class="rating-bar-bg h-2 rounded-full bg-hostel-surface overflow-hidden">
                                            <div class="rating-bar-fill h-full rounded-full ${ratingBarColor(displayVal)}" style="width: ${(displayVal / 5) * 100}%"></div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Recent Reviews Preview -->
                <div class="detail-section bg-hostel-card border border-hostel-border rounded-2xl p-5">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="font-heading font-semibold text-lg flex items-center gap-2">
                            <span>💬</span> Recent Reviews
                        </h2>
                        <button onclick="switchTab('reviews')" class="text-sm text-brand-400 hover:text-brand-300 transition-colors">
                            View all →
                        </button>
                    </div>
                    <div class="space-y-3">
                        ${hostelReviews.slice(0, 3).map(r => `
                            <div class="p-3 bg-hostel-surface rounded-xl">
                                <div class="flex items-center justify-between mb-1">
                                    <div class="flex items-center gap-2">
                                        <span class="text-sm font-medium">${r.room_identifier}</span>
                                        ${r.room_type ? `<span class="text-[10px] px-1.5 py-0.5 rounded-md bg-hostel-card text-hostel-muted border border-hostel-border">${r.room_type}</span>` : ''}
                                    </div>
                                    <div class="flex items-center gap-1">
                                        ${renderStars(r.overall_rating)}
                                        <span class="text-xs text-hostel-muted ml-1">${r.overall_rating}</span>
                                    </div>
                                </div>
                                <p class="text-sm text-gray-400 line-clamp-2">${r.comment}</p>
                            </div>
                        `).join('')}
                        ${hostelReviews.length === 0 ? '<p class="text-hostel-muted text-sm">No reviews yet. Be the first to share your experience!</p>' : ''}
                    </div>
                </div>
            </div>

            <!-- Right: Quick Info + Photo -->
            <div class="space-y-6">
                <!-- Quick Info -->
                <div class="detail-section bg-hostel-card border border-hostel-border rounded-2xl p-5">
                    <h3 class="font-heading font-semibold mb-4 flex items-center gap-2">
                        <span>📋</span> Quick Info
                    </h3>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between py-2 border-b border-hostel-border">
                            <span class="text-sm text-hostel-muted">Room Types</span>
                            <span class="text-sm font-semibold">${hostel.room_types.length} config${hostel.room_types.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div class="flex items-center justify-between py-2 border-b border-hostel-border">
                            <span class="text-sm text-hostel-muted">AC</span>
                            <span class="text-sm font-semibold">${hasAC && hasNonAC ? '❄️ AC + 🪭 Non-AC' : hasAC ? '❄️ AC Only' : '🪭 Non-AC Only'}</span>
                        </div>
                        <div class="flex items-center justify-between py-2 border-b border-hostel-border">
                            <span class="text-sm text-hostel-muted">Bed Type</span>
                            <span class="text-sm font-semibold">${hasDeluxe && hasBunk ? '✨ Deluxe + 🛏️ Bunk' : hasDeluxe ? '✨ Deluxe Only' : '🛏️ Bunk Only'}</span>
                        </div>
                        <div class="flex items-center justify-between py-2 border-b border-hostel-border">
                            <span class="text-sm text-hostel-muted">Room Sizes</span>
                            <span class="text-sm font-semibold">${hostelRoomSizes(hostel).join(', ')} Bed</span>
                        </div>
                        <div class="flex items-center justify-between py-2 border-b border-hostel-border">
                            <span class="text-sm text-hostel-muted">Bathrooms</span>
                            <span class="text-sm font-semibold text-brand-400">Shared / Floor</span>
                        </div>
                        <div class="flex items-center justify-between py-2 border-b border-hostel-border">
                            <span class="text-sm text-hostel-muted">Reviews</span>
                            <span class="text-sm font-semibold">${rating.count}</span>
                        </div>
                        <div class="flex items-center justify-between py-2">
                            <span class="text-sm text-hostel-muted">Overall</span>
                            <span class="text-lg font-bold ${ratingColor(rating.overall)}">${rating.overall || '—'}</span>
                        </div>
                    </div>
                </div>

                <!-- Room Photos -->
                <div class="detail-section bg-hostel-card border border-hostel-border rounded-2xl p-5">
                    <h3 class="font-heading font-semibold mb-4 flex items-center gap-2">
                        <span>📸</span> Room Photos
                    </h3>
                    <div class="grid grid-cols-2 gap-2">
                        ${hostelReviews.filter(r => r.room_photo).slice(0, 4).map(r => `
                            <div class="relative h-24 rounded-lg overflow-hidden cursor-pointer group" onclick="openImageModal('${r.room_photo}', '${hostel.name} - ${r.room_identifier}')">
                                <img src="${r.room_photo}" alt="Room" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
                                <div class="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
                                <span class="absolute bottom-1 left-1 text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-white">${r.room_identifier}</span>
                            </div>
                        `).join('')}
                        ${hostelReviews.filter(r => r.room_photo).length === 0 ? `
                            <p class="col-span-2 text-sm text-hostel-muted text-center py-4">No photos yet</p>
                        ` : ''}
                    </div>
                </div>

                <!-- View Photos -->
                <div class="detail-section bg-hostel-card border border-hostel-border rounded-2xl p-5">
                    <h3 class="font-heading font-semibold mb-4 flex items-center gap-2">
                        <span>🌅</span> Window Views
                    </h3>
                    <div class="grid grid-cols-2 gap-2">
                        ${hostelReviews.filter(r => r.outside_view_photo).slice(0, 4).map(r => `
                            <div class="relative h-24 rounded-lg overflow-hidden cursor-pointer group" onclick="openImageModal('${r.outside_view_photo}', '${hostel.name} - View from ${r.room_identifier}')">
                                <img src="${r.outside_view_photo}" alt="View" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
                                <div class="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
                                <span class="absolute bottom-1 left-1 text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-white">${r.room_identifier}</span>
                            </div>
                        `).join('')}
                        ${hostelReviews.filter(r => r.outside_view_photo).length === 0 ? `
                            <p class="col-span-2 text-sm text-hostel-muted text-center py-4">No view photos yet</p>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}
function handleSearch(event, value) {
    if (event.key === 'Enter') {
        filters.search = value;
        renderApp();
    }
}
function renderBathroomsTab(hostel, rating, hostelReviews) {
    const bathroomRatings = [
        { key: 'cleanliness', label: 'Cleanliness', emoji: '✨', desc: 'How clean are the shared bathrooms on a typical day?' },
        { key: 'queue', label: 'Queue / Wait Time', emoji: '⏳', desc: 'Morning rush — how long until you get a spot?' },
        { key: 'hot_water', label: 'Hot Water Reliability', emoji: '🚿', desc: 'Does hot water actually show up when you need it?' },
        { key: 'maintenance', label: 'Maintenance', emoji: '🔧', desc: 'How fast are broken things fixed?' },
    ];

    const smellRating = Math.max(1, Math.min(5, Math.round((rating.cleanliness * 0.6 + rating.maintenance * 0.4))));

    return `
        <div class="max-w-4xl mx-auto space-y-6">
            <!-- Header -->
            <div class="detail-section bg-hostel-card border border-hostel-border rounded-2xl p-6">
                <div class="flex items-center gap-3 mb-2">
                    <span class="text-3xl">🚽</span>
                    <div>
                        <h2 class="font-heading text-xl font-bold">Common Bathroom Discussions</h2>
                        <p class="text-sm text-hostel-muted">The real truth about shared bathrooms in ${hostel.name}</p>
                    </div>
                </div>
                <!-- Shared bathroom info callout -->
                <div class="mt-3 flex items-start gap-3 p-3 bg-brand-500/5 border border-brand-500/20 rounded-xl">
                    <i data-lucide="info" class="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5"></i>
                    <div>
                        <p class="text-sm text-gray-300"><span class="font-semibold text-brand-400">Shared / Common Bathrooms</span> — Bathrooms in all blocks are not attached to individual rooms. They are shared common bathrooms available on each floor for all residents of that floor/block.</p>
                    </div>
                </div>
                <div class="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl ${rating.cleanliness >= 4 ? 'bg-green-500/10 border border-green-500/30' : rating.cleanliness >= 3 ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-red-500/10 border border-red-500/30'}">
                    <span class="text-2xl">${rating.cleanliness >= 4 ? '😌' : rating.cleanliness >= 3 ? '😐' : '😩'}</span>
                    <span class="font-heading font-bold text-lg ${ratingColor(rating.cleanliness)}">${ratingLabel(rating.cleanliness)}</span>
                    <span class="text-sm text-hostel-muted">overall shared bathroom experience</span>
                </div>
            </div>

            <!-- Rating Bars -->
            <div class="detail-section bg-hostel-card border border-hostel-border rounded-2xl p-6">
                <h3 class="font-heading font-semibold text-lg mb-5 flex items-center gap-2">
                    <span>📊</span> Shared Bathroom Ratings
                </h3>
                <div class="space-y-5">
                    ${bathroomRatings.map(r => {
                        const val = rating[r.key] || 0;
                        return `
                            <div>
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center gap-2">
                                        <span class="text-lg">${r.emoji}</span>
                                        <div>
                                            <span class="text-sm font-medium">${r.label}</span>
                                            <p class="text-xs text-hostel-muted">${r.desc}</p>
                                        </div>
                                    </div>
                                    <span class="text-lg font-bold ${ratingColor(val)}">${val}/5</span>
                                </div>
                                <div class="rating-bar-bg h-3 rounded-full bg-hostel-surface overflow-hidden">
                                    <div class="rating-bar-fill h-full rounded-full ${ratingBarColor(val)}" style="width: ${(val / 5) * 100}%"></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                    
                    <!-- Smell / Ventilation (derived) -->
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center gap-2">
                                <span class="text-lg">💨</span>
                                <div>
                                    <span class="text-sm font-medium">Smell / Ventilation</span>
                                    <p class="text-xs text-hostel-muted">Can you breathe comfortably? (Derived from cleanliness + maintenance)</p>
                                </div>
                            </div>
                            <span class="text-lg font-bold ${ratingColor(smellRating)}">${smellRating}/5</span>
                        </div>
                        <div class="rating-bar-bg h-3 rounded-full bg-hostel-surface overflow-hidden">
                            <div class="rating-bar-fill h-full rounded-full ${ratingBarColor(smellRating)}" style="width: ${(smellRating / 5) * 100}%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Floor-Specific Bathroom Notes -->
            ${hostelReviews.some(r => r.floor_bathroom_note) ? `
            <div class="detail-section bg-hostel-card border border-hostel-border rounded-2xl p-6">
                <h3 class="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                    <span>🏢</span> Floor-Specific Bathroom Experiences
                </h3>
                <p class="text-sm text-hostel-muted mb-4">Bathroom conditions can vary by floor. Here's what students report from their floors.</p>
                <div class="space-y-3">
                    ${hostelReviews.filter(r => r.floor_bathroom_note).map(r => `
                        <div class="p-4 bg-hostel-surface rounded-xl border-l-4 border-brand-500">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="text-sm font-semibold">${r.room_identifier}</span>
                                <span class="text-xs text-hostel-muted">Floor ${r.floor}</span>
                                <span class="text-xs px-2 py-0.5 rounded-md ${r.resident_status === 'Current' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}">${r.resident_status}</span>
                            </div>
                            <p class="text-sm text-gray-300">${r.floor_bathroom_note}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <!-- Student Bathroom Comments -->
            <div class="detail-section bg-hostel-card border border-hostel-border rounded-2xl p-6">
                <h3 class="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                    <span>💬</span> What Students Say About Bathrooms
                </h3>
                <div class="space-y-3">
                    ${hostelReviews.map(r => `
                        <div class="review-card p-4 bg-hostel-surface rounded-xl">
                            <div class="flex items-start justify-between mb-2">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-medium">${r.room_identifier}</span>
                                    ${r.room_type ? `<span class="text-[10px] px-1.5 py-0.5 rounded-md bg-hostel-card text-hostel-muted border border-hostel-border">${r.room_type}</span>` : ''}
                                    <span class="text-xs px-2 py-0.5 rounded-md ${r.resident_status === 'Current' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}">${r.resident_status}</span>
                                </div>
                                <span class="text-xs text-hostel-muted">${formatDate(r.date)}</span>
                            </div>
                            <!-- Mini bathroom ratings -->
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                                <div class="text-center p-1.5 bg-hostel-card rounded-lg">
                                    <div class="text-[10px] text-hostel-muted">Clean</div>
                                    <div class="text-xs font-bold ${ratingColor(r.cleanliness)}">${r.cleanliness}</div>
                                </div>
                                <div class="text-center p-1.5 bg-hostel-card rounded-lg">
                                    <div class="text-[10px] text-hostel-muted">Queue</div>
                                    <div class="text-xs font-bold ${ratingColor(6 - r.queue)}">${r.queue}</div>
                                </div>
                                <div class="text-center p-1.5 bg-hostel-card rounded-lg">
                                    <div class="text-[10px] text-hostel-muted">Hot Water</div>
                                    <div class="text-xs font-bold ${ratingColor(r.hot_water)}">${r.hot_water}</div>
                                </div>
                                <div class="text-center p-1.5 bg-hostel-card rounded-lg">
                                    <div class="text-[10px] text-hostel-muted">Maint.</div>
                                    <div class="text-xs font-bold ${ratingColor(r.maintenance)}">${r.maintenance}</div>
                                </div>
                            </div>
                            <p class="text-sm text-gray-300">${r.comment}</p>
                            ${r.floor_bathroom_note ? `
                                <div class="mt-2 flex items-start gap-2 p-2 bg-brand-500/5 border border-brand-500/20 rounded-lg">
                                    <i data-lucide="building" class="w-3.5 h-3.5 text-brand-400 flex-shrink-0 mt-0.5"></i>
                                    <span class="text-xs text-gray-400"><span class="text-brand-400 font-medium">Floor ${r.floor} bathroom:</span> ${r.floor_bathroom_note}</span>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                    ${hostelReviews.length === 0 ? '<p class="text-hostel-muted text-sm">No bathroom reviews yet. Be the first to spill the truth!</p>' : ''}
                </div>
            </div>
        </div>
    `;
}

function renderReviewsTab(hostel, hostelReviews) {
    return `
        <div class="max-w-4xl mx-auto space-y-6">
            <!-- Write Review Button -->
            <div class="flex items-center justify-between">
                <h2 class="font-heading text-xl font-bold flex items-center gap-2">
                    <span>💬</span> Student Reviews (${hostelReviews.length})
                </h2>
                <button onclick="document.getElementById('reviewForm').scrollIntoView({behavior: 'smooth'})"
                    class="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 rounded-xl text-sm font-medium transition-colors">
                    <i data-lucide="pen-line" class="w-4 h-4"></i> Write Review
                </button>
            </div>

            <!-- Reviews List -->
            <div class="space-y-4">
                ${hostelReviews.map(r => `
                    <div class="review-card bg-hostel-card border border-hostel-border rounded-2xl p-5 animate-fade-in">
                        <!-- Header -->
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
                                    <i data-lucide="user" class="w-5 h-5 text-brand-400"></i>
                                </div>
                                <div>
                                    <div class="flex flex-wrap items-center gap-2">
    <span class="font-medium text-sm font-heading">${r.room_identifier}</span>
    <!-- Room details chip -->
    ${r.room_type ? `<span class="text-[11px] px-2 py-0.5 rounded-md bg-hostel-surface text-brand-400 border border-hostel-border font-medium">${r.room_type}</span>` : ''}
    <span class="text-xs px-2 py-0.5 rounded-md ${r.resident_status === 'Current' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}">${r.resident_status}</span>
</div>
                                    <span class="text-xs text-hostel-muted">${formatDate(r.date)}</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-1">
                                ${renderStars(r.overall_rating)}
                            </div>
                        </div>

                        <!-- Rating Grid -->
                        <div class="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                            <div class="text-center p-2 bg-hostel-surface rounded-lg">
                                <div class="text-[10px] text-hostel-muted mb-0.5">Overall</div>
                                <div class="text-sm font-bold ${ratingColor(r.overall_rating)}">${r.overall_rating}</div>
                            </div>
                            <div class="text-center p-2 bg-hostel-surface rounded-lg">
                                <div class="text-[10px] text-hostel-muted mb-0.5">WiFi</div>
                                <div class="text-sm font-bold ${ratingColor(r.wifi)}">${r.wifi}</div>
                            </div>
                            <div class="text-center p-2 bg-hostel-surface rounded-lg">
                                <div class="text-[10px] text-hostel-muted mb-0.5">Noise</div>
                                <div class="text-sm font-bold ${ratingColor(6 - r.noise)}">${r.noise}</div>
                            </div>
                            <div class="text-center p-2 bg-hostel-surface rounded-lg">
                                <div class="text-[10px] text-hostel-muted mb-0.5">Lift Wait</div>
                                <div class="text-sm font-bold ${ratingColor(6 - r.lift_wait)}">${r.lift_wait}</div>
                            </div>
                            <div class="text-center p-2 bg-hostel-surface rounded-lg">
                                <div class="text-[10px] text-hostel-muted mb-0.5">Clean</div>
                                <div class="text-sm font-bold ${ratingColor(r.cleanliness)}">${r.cleanliness}</div>
                            </div>
                        </div>

                        <!-- Comment -->
                        <p class="text-gray-300 text-sm leading-relaxed mb-3">"${r.comment}"</p>

                        <!-- View description -->
                        ${r.outside_view_description ? `
                            <div class="flex items-start gap-2 mb-3 p-2 bg-hostel-surface rounded-lg">
                                <i data-lucide="mountain" class="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0"></i>
                                <span class="text-sm text-gray-400"><span class="text-gray-300 font-medium">View:</span> ${r.outside_view_description}</span>
                            </div>
                        ` : ''}

                        <!-- Photos -->
                        ${(r.room_photo || r.outside_view_photo) ? `
                            <div class="flex gap-2">
                                ${r.room_photo ? `
                                    <div class="relative h-20 w-28 rounded-lg overflow-hidden cursor-pointer group" onclick="openImageModal('${r.room_photo}', 'Room - ${r.room_identifier}')">
                                        <img src="${r.room_photo}" alt="Room" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
                                        <div class="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors"></div>
                                        <span class="absolute bottom-1 left-1 text-[9px] bg-black/60 px-1 py-0.5 rounded text-white">Room</span>
                                    </div>
                                ` : ''}
                                ${r.outside_view_photo ? `
                                    <div class="relative h-20 w-28 rounded-lg overflow-hidden cursor-pointer group" onclick="openImageModal('${r.outside_view_photo}', 'View from ${r.room_identifier}')">
                                        <img src="${r.outside_view_photo}" alt="View" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
                                        <div class="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors"></div>
                                        <span class="absolute bottom-1 left-1 text-[9px] bg-black/60 px-1 py-0.5 rounded text-white">View</span>
                                    </div>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
                ${hostelReviews.length === 0 ? `
                    <div class="text-center py-12">
                        <div class="text-5xl mb-3">✍️</div>
                        <h3 class="font-heading text-lg font-semibold mb-2">No reviews yet</h3>
                        <p class="text-hostel-muted text-sm">Be the first to share your experience at ${hostel.name}!</p>
                    </div>
                ` : ''}
            </div>

            <!-- Review Form -->
            <div id="reviewForm" class="submit-form bg-hostel-card border border-hostel-border rounded-2xl p-6">
                <h3 class="font-heading text-xl font-bold mb-1 flex items-center gap-2">
                    <span>✍️</span> Share Your Experience
                </h3>
                ${!currentUser ? `
                <div class="py-8 text-center">
                    <div class="text-5xl mb-3">🔐</div>
                    <p class="text-gray-300 font-medium mb-1">Login to submit a review</p>
                    <p class="text-sm text-hostel-muted mb-5">Only verified VIT students can post reviews.</p>
                    <button onclick="openAuthModal('login')" class="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 rounded-xl font-heading font-semibold text-sm transition-colors inline-flex items-center gap-2">
                        <i data-lucide="log-in" class="w-4 h-4"></i> Login with VIT Email
                    </button>
                </div>
                ` : `
                <p class="text-sm text-hostel-muted mb-5">Logged in as <span class="text-brand-400">${currentUser.email}</span></p>
                <form onsubmit="submitReview(event, ${hostel.id})" class="space-y-5">
                    <!-- Resident Status & Room -->
                    <!-- Resident Status & Room -->
<div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
    <div>
        <label class="text-xs text-hostel-muted uppercase tracking-wider mb-1.5 block font-medium">Resident Status *</label>
        <select id="rev_status" required class="w-full px-3 py-2.5 bg-hostel-surface border border-hostel-border rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30">
            <option value="">Select...</option>
            <option value="Current">Current Resident</option>
            <option value="Former">Former Resident</option>
        </select>
    </div>
    <div>
        <label class="text-xs text-hostel-muted uppercase tracking-wider mb-1.5 block font-medium">Room Identifier *</label>
        <input id="rev_room" type="text" required placeholder="e.g., Q-512" class="w-full px-3 py-2.5 bg-hostel-surface border border-hostel-border rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30">
    </div>
    <div>
        <label class="text-xs text-hostel-muted uppercase tracking-wider mb-1.5 block font-medium">Room Type *</label>
        <select id="rev_type" required class="w-full px-3 py-2.5 bg-hostel-surface border border-hostel-border rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30">
            <option value="">Select configuration...</option>
            ${hostel.room_types.map(rt => {
                const label = `${rt.room_size} Bed ${rt.ac ? 'AC' : 'Non-AC'} ${rt.bed_type || 'Bunk'}`;
                return `<option value="${label}">${label}</option>`;
            }).join('')}
        </select>
    </div>
    <div>
        <label class="text-xs text-hostel-muted uppercase tracking-wider mb-1.5 block font-medium">Floor</label>
        <input id="rev_floor" type="number" min="0" max="15" placeholder="e.g., 5" class="w-full px-3 py-2.5 bg-hostel-surface border border-hostel-border rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30">
    </div>
</div>

                    <!-- General Ratings -->
                    <div>
                        <label class="text-xs text-hostel-muted uppercase tracking-wider mb-3 block font-medium">General Ratings (1-5) *</label>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            ${[
                                { id: 'rev_overall', label: 'Overall Rating', emoji: '⭐' },
                                { id: 'rev_wifi', label: 'WiFi Quality', emoji: '📶' },
                                { id: 'rev_noise', label: 'Noise Level', emoji: '🔊' },
                                { id: 'rev_lift', label: 'Lift Wait', emoji: '🛗' },
                            ].map(r => `
                                <div class="bg-hostel-surface rounded-xl p-3">
                                    <div class="text-center mb-2">
                                        <span class="text-lg">${r.emoji}</span>
                                        <div class="text-xs font-medium mt-1">${r.label}</div>
                                    </div>
                                    <input id="${r.id}" type="range" min="1" max="5" value="3" 
                                        oninput="this.nextElementSibling.textContent = this.value"
                                        class="w-full">
                                    <div class="text-center text-lg font-bold mt-1 ${ratingColor(3)}">3</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Bathroom Ratings -->
                    <div>
                        <label class="text-xs text-hostel-muted uppercase tracking-wider mb-3 block font-medium">🚽 Bathroom Ratings (1-5) *</label>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            ${[
                                { id: 'rev_clean', label: 'Cleanliness', emoji: '✨' },
                                { id: 'rev_queue', label: 'Queue / Wait', emoji: '⏳' },
                                { id: 'rev_hotwater', label: 'Hot Water', emoji: '🚿' },
                                { id: 'rev_maint', label: 'Maintenance', emoji: '🔧' },
                            ].map(r => `
                                <div class="bg-hostel-surface rounded-xl p-3">
                                    <div class="text-center mb-2">
                                        <span class="text-lg">${r.emoji}</span>
                                        <div class="text-xs font-medium mt-1">${r.label}</div>
                                    </div>
                                    <input id="${r.id}" type="range" min="1" max="5" value="3" 
                                        oninput="this.nextElementSibling.textContent = this.value"
                                        class="w-full">
                                    <div class="text-center text-lg font-bold mt-1">3</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Written Review -->
                    <div>
                        <label class="text-xs text-hostel-muted uppercase tracking-wider mb-1.5 block font-medium">Your Experience *</label>
                        <textarea id="rev_comment" required rows="4" placeholder="Tell it like it is — the good and the bad..." 
                            class="w-full px-3 py-2.5 bg-hostel-surface border border-hostel-border rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 resize-none"></textarea>
                    </div>

                    <!-- Outside View -->
                    <div>
                        <label class="text-xs text-hostel-muted uppercase tracking-wider mb-1.5 block font-medium">Outside View Description</label>
                        <input id="rev_view" type="text" placeholder="e.g., Cricket ground sunset view from balcony" class="w-full px-3 py-2.5 bg-hostel-surface border border-hostel-border rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30">
                    </div>

                    <!-- Photo Uploads -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="text-xs text-hostel-muted uppercase tracking-wider mb-1.5 block font-medium">📸 Room Interior Photo</label>
                            <div class="photo-upload-area rounded-xl p-6 text-center cursor-pointer" onclick="document.getElementById('rev_room_photo').click()">
                                <input id="rev_room_photo" type="file" accept="image/*" class="hidden" onchange="handlePhotoUpload(this, 'room_preview')">
                                <div id="room_preview" class="space-y-2">
                                    <i data-lucide="camera" class="w-8 h-8 mx-auto text-hostel-muted"></i>
                                    <p class="text-sm text-hostel-muted">Click to upload room photo - Keep uploads appropriate </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label class="text-xs text-hostel-muted uppercase tracking-wider mb-1.5 block font-medium">🌅 Outside View Photo</label>
                            <div class="photo-upload-area rounded-xl p-6 text-center cursor-pointer" onclick="document.getElementById('rev_view_photo').click()">
                                <input id="rev_view_photo" type="file" accept="image/*" class="hidden" onchange="handlePhotoUpload(this, 'view_preview')">
                                <div id="view_preview" class="space-y-2">
                                    <i data-lucide="mountain" class="w-8 h-8 mx-auto text-hostel-muted"></i>
                                    <p class="text-sm text-hostel-muted">Click to upload window view (Optional but helps!) - Keep uploads appropriate</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Submit -->
                    <button type="submit" class="w-full py-3 bg-brand-600 hover:bg-brand-700 rounded-xl font-heading font-semibold text-base transition-colors flex items-center justify-center gap-2">
                        <i data-lucide="send" class="w-5 h-5"></i> Submit Review
                    </button>
                </form>
                `}
            </div>
        </div>
    `;
}

// =============================================
// REVIEW SUBMISSION
// =============================================

// =============================================
// PHOTO UPLOAD TO SUPABASE STORAGE
// =============================================
async function handlePhotoUpload(input, previewId) {
    const preview = document.getElementById(previewId);
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    
    // 1. Show a loading status inside the upload box UI
    preview.innerHTML = `
        <div class="animate-pulse space-y-2">
            <div class="w-6 h-6 border-2 border-t-transparent border-brand-400 rounded-full mx-auto animate-spin"></div>
            <p class="text-xs text-brand-400">Uploading to cloud...</p>
        </div>
    `;

    try {
        // 2. Generate a clean, unique file name to avoid overwriting files (e.g., "1715694830112-room.jpg")
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${previewId}.${fileExt}`;
        const filePath = `${fileName}`;

        // 3. Upload the file to your Supabase Storage Bucket ('hostel-images')
        showToast("Uploading image to cloud storage... 📸", "info");
        const { data, error } = await db.storage
            .from('hostel-images') // Make sure this matches your bucket name exactly!
            .upload(filePath, file);

        if (error) throw error;

        // 4. Extract the Public URL for that uploaded object
        const { data: urlData } = db.storage
            .from('hostel-images')
            .getPublicUrl(filePath);

        const publicUrl = urlData.publicUrl;

        // 5. Update the correct global variable based on which input box was clicked
        if (previewId === 'room_preview') {
            currentRoomPhotoUrl = publicUrl;
            showToast("Room photo uploaded successfully! 🛏️", "success");
        } else if (previewId === 'view_preview') {
            currentOutsideViewPhotoUrl = publicUrl;
            showToast("Window view photo uploaded successfully! 🌅", "success");
        }

        // 6. Replace the upload text with a small thumbnail preview of the actual hosted image
        preview.innerHTML = `
            <img src="${publicUrl}" class="w-full h-24 object-cover rounded-lg shadow-md border border-brand-500/30">
            <p class="text-[10px] text-green-400 mt-1">✓ Cloud Synchronized</p>
        `;

    } catch (err) {
        console.error("Storage upload failed:", err.message);
        showToast("Photo upload failed. Check bucket permissions!", "error");
        
        // Reset the UI back to standard icon if it crashes
        preview.innerHTML = `
            <i data-lucide="${previewId === 'room_preview' ? 'camera' : 'mountain'}" class="w-8 h-8 mx-auto text-hostel-muted"></i>
            <p class="text-sm text-hostel-muted">Click to retry upload</p>
        `;
        lucide.createIcons({ nodes: [preview] });
    }
}

/**
 * Handles submission of a new hostel review and saves it to the Supabase database
 */
/**
 * Handles submission of a new hostel review and saves it to the public.reviews table
 */
// =============================================
// REVIEW SUBMISSION
// =============================================
// =============================================
// REVIEW SUBMISSION
// =============================================
// =============================================
// REVIEW SUBMISSION
// =============================================
async function submitReview(e, hostelId) {
    if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
    }
    // Use passed hostelId if provided, otherwise fall back to global currentHostelId
    if (hostelId) currentHostelId = hostelId;
    console.log("Form submission pipeline engaged...");

    // 1. Grab references to your elements
    const commentInput = document.getElementById('rev_comment');
    const roomNoInput = document.getElementById('rev_room');
    const roomTypeSelect = document.getElementById('rev_type'); // Added for Room Configuration
    const viewDescInput = document.getElementById('rev_view'); // Outside View Text
    
    const ratingOverallInput = document.getElementById('rev_overall');
    const ratingWifiInput = document.getElementById('rev_wifi');
    const ratingCleanInput = document.getElementById('rev_clean');
    const ratingMaintInput = document.getElementById('rev_maint');
    const ratingNoiseInput = document.getElementById('rev_noise');
    const ratingLiftInput = document.getElementById('rev_lift');
    const ratingQueueInput = document.getElementById('rev_queue');
    const ratingHotWaterInput = document.getElementById('rev_hotwater');
    
    // 2. Extract values safely
    const comment = commentInput ? commentInput.value.trim() : "";
    const roomNo = roomNoInput ? roomNoInput.value.trim() : "";
    const roomType = roomTypeSelect ? roomTypeSelect.value : ""; // Added
    const outsideViewDescription = viewDescInput ? viewDescInput.value.trim() : ""; // Added
    const residentStatus = document.getElementById('rev_status')?.value || "Current";

    // Content Safety Moderation
    if (!checkContentSafety(comment) || !checkContentSafety(outsideViewDescription)) {
        showToast("Review contains prohibited language. Keep it clean! ⚠️", "error");
        return;
    }

    // 3. Build the payload matching your database columns
    const reviewPayload = {
        hostel_id: currentHostelId,
        room_identifier: roomNo || "Unknown Room",
        room_type: roomType, // Now getting saved!
        outside_view_description: outsideViewDescription, // Now getting saved!
        comment: comment,
        
        overall_rating: ratingOverallInput ? parseInt(ratingOverallInput.value) : 3,
        wifi: ratingWifiInput ? parseInt(ratingWifiInput.value) : 3,
        cleanliness: ratingCleanInput ? parseInt(ratingCleanInput.value) : 3,
        maintenance: ratingMaintInput ? parseInt(ratingMaintInput.value) : 3,
        noise: ratingNoiseInput ? parseInt(ratingNoiseInput.value) : 3,
        lift_wait: ratingLiftInput ? parseInt(ratingLiftInput.value) : 3,
        queue: ratingQueueInput ? parseInt(ratingQueueInput.value) : 3,
        hot_water: ratingHotWaterInput ? parseInt(ratingHotWaterInput.value) : 3,
        
        room_photo: currentRoomPhotoUrl,
        outside_view_photo: currentOutsideViewPhotoUrl,
        created_at: new Date().toISOString(),
        resident_status: residentStatus
    };

    try {
        const { data, error } = await db
            .from('reviews')
            .insert([reviewPayload])
            .select();

        if (error) throw error;
        console.log("Successfully stored review in database:", data);
        showToast("Review submitted successfully! 🙌", "success");

        if (typeof fetchReviewsFromDatabase === 'function') {
            await fetchReviewsFromDatabase();
        }

        // Hide modal form layout manually
        document.getElementById('reviewModal')?.classList.add('hidden');

        // Reset global variables
        if (typeof currentRoomPhotoUrl !== 'undefined') currentRoomPhotoUrl = null;
        if (typeof currentOutsideViewPhotoUrl !== 'undefined') currentOutsideViewPhotoUrl = null;

        if (e && e.target && typeof e.target.reset === 'function') {
            e.target.reset();
        }
        
        renderApp();
    } catch (err) {
        console.error("Database submission failed:", err.message);
        showToast("Failed to sync review online. 😢", "error");
    }
}

// =============================================
// MAIN RENDER
// =============================================
/**
 * Removes a specific review by its unique ID and refreshes the page
 */
function adminDeleteReview(reviewId) {
    // Find the index of the review you want to remove
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex !== -1) {
        // Remove it from your local array
        reviews.splice(reviewIndex, 1);
        
        alert("Review successfully removed by admin.");
        
        // Re-render whatever view you are currently on to show changes instantly
        renderApp(); 
    } else {
        console.error("Review not found.");
    }
}
function renderApp() {
    const app = document.getElementById('app');
    if (currentView === 'home') {
        app.innerHTML = renderHomePage();
    } else if (currentView === 'detail') {
        app.innerHTML = renderDetailPage();
    }
    else if (currentView === 'about') {
    app.innerHTML = renderAboutPage();
}
    // Re-create Lucide icons
    lucide.createIcons();

    // Animate rating bars after render
    setTimeout(() => {
        document.querySelectorAll('.rating-bar-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => { bar.style.width = width; }, 50);
        });
    }, 100);
}

// =============================================
// INIT
// =============================================

function initApp() {
    // Check dark mode preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'light') {
        document.documentElement.classList.remove('dark');
    } else {
        document.documentElement.classList.add('dark');
    }
    
    const isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.dark-icon').forEach(el => el.style.display = isDark ? 'block' : 'none');
    document.querySelectorAll('.light-icon').forEach(el => el.style.display = isDark ? 'none' : 'block');
    if (typeof monitorAuthState === 'function') {
        monitorAuthState();
    }
    fetchHostelsFromDatabase();
    fetchReviewsFromDatabase();
    renderApp();
}
// Temporary test login to populate auth.role() = 'authenticated'

// =============================================
// DATABASE INTEGRATION FETCH PIPELINE
// =============================================

/**
 * Fetches the baseline hostels data from your live Supabase database
 */
// =============================================
// DATABASE INTEGRATION FETCH PIPELINE
// =============================================
// =============================================
// DATABASE INTEGRATION PIPELINES
// =============================================

/**
 * Channel 1: Fetches the baseline hostels data from your live Supabase database
 */
/**
 * Channel 1: Fetches the baseline hostels data dynamically from your live Supabase database
 */
/**
 * Channel 1: Fetches the baseline hostels data dynamically from your live Supabase database
 */
async function fetchHostelsFromDatabase() {
    try {
        const { data, error } = await db
            .from('hostels')
            .select('*')
            .order('block', { ascending: true });

        if (error) throw error;

        // Save the live database entries into your global state variable
        hostels = data || [];
        console.log("Successfully loaded hostels from database:", hostels);

        // Simple sanitary check to ensure text fallbacks and images map correctly
        hostels.forEach(h => {
            h.description = h.description || `Welcome to ${h.name} (Block ${h.block}).`;
            
            // 🌟 IMAGE ALIGNMENT PIPELINE
            // Maps your database 'image_url' column to the 'image' property your templates expect!
            if (h.image_url) {
                h.image = h.image_url; 
            } else {
                h.image = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"; // Global fallback placeholder
            }

            // If room_types column is null or empty for some reason, ensure it stays a safe array
            if (!h.room_types) {
                h.room_types = [];
            }
        });

        // Re-render layout dynamically with pure database configurations
        renderApp(); 
    } catch (err) {
        console.error("Error fetching hostels data:", err.message);
        if (typeof showToast === "function") {
            showToast("Failed to load hostel blocks from database 😢", "error");
        }
    }
}

/**
 * Channel 2: Fetches all student reviews directly from your live Supabase database
 */
async function fetchReviewsFromDatabase() {
    try {
        console.log("Fetching live student reviews...");
        const { data, error } = await db
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Save live database entries into your global reviews state
        reviews = data || [];
        console.log("Successfully loaded reviews from database:", reviews);

        // Force a re-render so math calculations update with live scores
        renderApp();
    } catch (err) {
        console.error("Error fetching reviews data:", err.message);
    }
}
// Automatically trigger the database check as soon as your script finishes initializing
// =============================================
// AUTHENTICATION SYSTEM (VIT Email Only)
// =============================================

let currentUser = null;

function monitorAuthState() {
    db.auth.onAuthStateChange((event, session) => {
        currentUser = session?.user || null;
        updateNavAuth();
        renderApp();
    });
    // Also check immediately on load
    db.auth.getSession().then(({ data: { session } }) => {
        currentUser = session?.user || null;
        updateNavAuth();
        renderApp();
    });
}

function updateNavAuth() {
    const btn = document.getElementById('nav-auth-btn');
    if (!btn) return;
    if (currentUser) {
        const initials = currentUser.email?.slice(0, 2).toUpperCase() || '?';
        btn.innerHTML = `
            <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white">${initials}</div>
                <span class="hidden sm:inline text-sm text-gray-300">${currentUser.email?.split('@')[0]}</span>
                <button onclick="handleSignOut()" class="text-xs text-gray-500 hover:text-red-400 transition-colors ml-1">Sign out</button>
            </div>
        `;
    } else {
        btn.innerHTML = `
            <button onclick="openAuthModal()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-brand-600 hover:bg-brand-700 text-white font-medium transition-all">
                <i data-lucide="log-in" class="w-4 h-4"></i> Login
            </button>
        `;
        lucide.createIcons({ nodes: [btn] });
    }
}

function openAuthModal(mode = 'login') {
    const existing = document.getElementById('authModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'authModal';
    modal.className = 'fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-hostel-card border border-hostel-border rounded-2xl p-7 w-full max-w-md shadow-2xl animate-fade-in-up">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="font-heading text-2xl font-bold">
                        ${mode === 'login' ? '👋 Welcome back' : '🎓 Join the community'}
                    </h2>
                    <p class="text-sm text-hostel-muted mt-1">VIT student emails only (@vitstudent.ac.in)</p>
                </div>
                <button onclick="closeAuthModal()" class="text-gray-500 hover:text-gray-300 transition-colors">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <div class="flex rounded-xl bg-hostel-surface p-1 mb-6">
                <button id="tab-login" onclick="switchAuthTab('login')"
                    class="flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'login' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-gray-200'}">
                    Login
                </button>
                <button id="tab-signup" onclick="switchAuthTab('signup')"
                    class="flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'signup' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-gray-200'}">
                    Sign Up
                </button>
            </div>

            <div class="space-y-4">
                <div>
                    <label class="text-xs text-hostel-muted uppercase tracking-wider mb-1.5 block">VIT Email</label>
                    <input id="auth-email" type="email" placeholder="your.name20xx@vitstudent.ac.in"
                        class="w-full px-3 py-2.5 bg-hostel-surface border border-hostel-border rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30">
                </div>
                <div>
                    <label class="text-xs text-hostel-muted uppercase tracking-wider mb-1.5 block">Password</label>
                    <input id="auth-password" type="password" placeholder="••••••••"
                        class="w-full px-3 py-2.5 bg-hostel-surface border border-hostel-border rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30">
                </div>

                <button id="auth-submit-btn" onclick="handleAuthSubmit()"
                    class="w-full py-3 bg-brand-600 hover:bg-brand-700 rounded-xl font-heading font-semibold text-base transition-colors flex items-center justify-center gap-2">
                    <i data-lucide="log-in" class="w-5 h-5"></i>
                    <span id="auth-btn-label">${mode === 'login' ? 'Login' : 'Create Account'}</span>
                </button>

                <p id="auth-message" class="text-sm text-center text-hostel-muted hidden"></p>
            </div>
        </div>
    `;
    modal.setAttribute('data-mode', mode);
    document.body.appendChild(modal);
    lucide.createIcons({ nodes: [modal] });
    document.getElementById('auth-email').focus();
}

function switchAuthTab(mode) {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.setAttribute('data-mode', mode);

    document.getElementById('tab-login').className = `flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'login' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-gray-200'}`;
    document.getElementById('tab-signup').className = `flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'signup' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-gray-200'}`;
    document.getElementById('auth-btn-label').textContent = mode === 'login' ? 'Login' : 'Create Account';
    document.querySelector('#authModal h2').textContent = mode === 'login' ? '👋 Welcome back' : '🎓 Join the community';
    document.getElementById('auth-message').classList.add('hidden');
}

function closeAuthModal() {
    document.getElementById('authModal')?.remove();
}

async function handleAuthSubmit() {
    const modal = document.getElementById('authModal');
    const mode = modal?.getAttribute('data-mode') || 'login';
    const email = document.getElementById('auth-email')?.value.trim();
    const password = document.getElementById('auth-password')?.value;
    const msgEl = document.getElementById('auth-message');
    const btn = document.getElementById('auth-submit-btn');

    // VIT domain check
    if (!email.endsWith('@vitstudent.ac.in')) {
        msgEl.textContent = '⚠️ Only @vitstudent.ac.in emails are allowed.';
        msgEl.className = 'text-sm text-center text-red-400';
        msgEl.classList.remove('hidden');
        return;
    }
    if (!password || password.length < 6) {
        msgEl.textContent = '⚠️ Password must be at least 6 characters.';
        msgEl.className = 'text-sm text-center text-red-400';
        msgEl.classList.remove('hidden');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = `<svg class="animate-spin w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> Please wait...`;

    try {
        if (mode === 'signup') {
            const { error } = await db.auth.signUp({ email, password });
            if (error) throw error;
            msgEl.textContent = '✅ Check your VIT email for a confirmation link!';
            msgEl.className = 'text-sm text-center text-green-400';
            msgEl.classList.remove('hidden');
            btn.disabled = false;
            btn.innerHTML = `<i data-lucide="mail" class="w-5 h-5"></i> <span>Confirmation sent</span>`;
            lucide.createIcons({ nodes: [btn] });
        } else {
            const { error } = await db.auth.signInWithPassword({ email, password });
            if (error) throw error;
            showToast('Logged in! Welcome back 🎉', 'success');
            closeAuthModal();
        }
    } catch (err) {
        msgEl.textContent = `⚠️ ${err.message}`;
        msgEl.className = 'text-sm text-center text-red-400';
        msgEl.classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="log-in" class="w-5 h-5"></i> <span>${mode === 'login' ? 'Login' : 'Create Account'}</span>`;
        lucide.createIcons({ nodes: [btn] });
    }
}

async function handleSignOut() {
    await db.auth.signOut();
    showToast('Logged out successfully!', 'success');
}