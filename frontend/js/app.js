/**
 * app.js
 * Frontend logic for Kinetic Stadium SPA.
 * Fully functional standalone version with built-in mock data
 * for hackathon demos when backend cannot start.
 */

// ── View Navigation ────────────────────────────────────────────────────────
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        // Update active nav
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const targetLink = e.currentTarget;
        targetLink.classList.add('active');

        // Update active section
        const targetId = targetLink.getAttribute('data-target');
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');

        // Trigger view-specific loads
        if (targetId === 'view-dashboard') loadDashboard();
        if (targetId === 'view-concessions') loadConcessions();
        if (targetId === 'view-feed') loadFanFeed();
        if (targetId === 'view-map') initMap();
    });
});

// ── Mock Data for Standalone Demo ──────────────────────────────────────────
const MOCK_DATA = {
    crowd: {
        zones: [
            { name: "North Concourse", density_level: "High", current_occupancy: 1800, capacity: 2000 },
            { name: "South Concourse", density_level: "Medium", current_occupancy: 900, capacity: 2000 },
            { name: "Food Court", density_level: "Medium", current_occupancy: 450, capacity: 600 },
            { name: "Gate A", density_level: "Low", current_occupancy: 150, capacity: 1000 }
        ]
    },
    concessions: {
        live_prep_time: "4-7 mins",
        stations: [
            {
                station_id: "grill-alpha",
                name: "Grill Station Alpha",
                walk_minutes: 2,
                items: [
                    { item_id: "burger", name: "Kinetic Classic Burger", description: "Double smash patty, house sauce.", price: 14.00, image_emoji: "🍔" },
                    { item_id: "fries", name: "High-Voltage Fries", description: "Crispy fries, cheese sauce.", price: 9.00, image_emoji: "🍟" },
                    { item_id: "hotdog", name: "Stadium Dog", description: "All-beef frank, relish, mustard.", price: 10.00, image_emoji: "🌭" }
                ]
            },
            {
                station_id: "drinks-central",
                name: "Drinks Central",
                walk_minutes: 3,
                items: [
                    { item_id: "soda", name: "Large Draft Soda", description: "Coca-Cola, Sprite, or Fanta. 32oz.", price: 6.00, image_emoji: "🥤" },
                    { item_id: "beer", name: "Craft IPA Draft", description: "Local craft IPA, 16oz pour.", price: 12.00, image_emoji: "🍺" },
                    { item_id: "water", name: "Premium Water", description: "Chilled spring water, 500ml.", price: 4.00, image_emoji: "💧" }
                ]
            },
            {
                station_id: "merch-express",
                name: "Merch Express",
                walk_minutes: 4,
                items: [
                    { item_id: "jersey", name: "Home Jersey 2026", description: "Official home team jersey.", price: 89.00, image_emoji: "👕" },
                    { item_id: "cap", name: "Team Snapback Cap", description: "Adjustable snapback.", price: 34.00, image_emoji: "🧢" }
                ]
            }
        ]
    },
    fanFeed: {
        match: {
            ticker_text: "LIVE Q3 08:42 | KNT 84 - 76 AWY • POSSESSION: KNT 62% • FOULS: KNT 8 - 11 AWY",
            score: { score_a: 84, score_b: 76, period: "Q3", clock: "08:42" },
            stats: [
                { label: "Possession", value_a: "62%", value_b: "38%", bar_pct_a: 0.62, bar_pct_b: 0.38 },
                { label: "Shots on Goal", value_a: "16", value_b: "10", bar_pct_a: 0.61, bar_pct_b: 0.39 },
                { label: "Pass Accuracy", value_a: "88%", value_b: "72%", bar_pct_a: 0.88, bar_pct_b: 0.72 }
            ]
        },
        replays: [
            { thumbnail_emoji: "🏀", title: "Incredible three-point shot from half court", period: "Q3", timestamp: "08:42" },
            { thumbnail_emoji: "⚡", title: "Defensive stop leads to fast break score", period: "Q2", timestamp: "14:12" },
            { thumbnail_emoji: "🔥", title: "Massive slam dunk ignites crowd eruption", period: "Q2", timestamp: "05:33" }
        ],
        buzz: [
            { avatar_color: "#0066ff", avatar_letter: "KS", author: "Kinetic Stadium", is_official: true, handle: "@KineticStadium", time_ago: "2m ago", content: "Halftime show starting in 5 minutes! Grab your snacks and return to your seats. 🎪✨" },
            { avatar_color: "#ff5e07", avatar_letter: "S", author: "Sarah K", is_official: false, handle: "@SarahK_Sports", time_ago: "12m ago", content: "The energy in here is UNREAL tonight! Let's go KNT! 🔥🔥" },
            { avatar_color: "#00dbe9", avatar_letter: "M", author: "Mike The Fan", is_official: false, handle: "@MikeTheFan", time_ago: "18m ago", content: "That last play was insane. Worth the ticket price alone." }
        ]
    }
};

// ── API Helpers ────────────────────────────────────────────────────────────
async function fetchAPI(endpoint, options = {}) {
    const res = await fetch(endpoint, options);
    if (!res.ok) {
        console.error(`API error: ${res.status} on ${endpoint}`);
        return null;
    }
    return await res.json();
}

// ── 1. Dashboard Logic ─────────────────────────────────────────────────────
async function loadDashboard() {
    const data = await fetchAPI('/crowd/status');
    if (!data) return;

    const container = document.getElementById('dashboard-crowd-stats');
    container.innerHTML = '';

    data.zones.forEach(zone => {
        let colorClass = 'text-primary';
        if (zone.status === 'CRITICAL' || zone.status === 'HIGH') colorClass = 'text-danger';
        else if (zone.status === 'MEDIUM') colorClass = 'text-warning';
        else if (zone.status === 'LOW') colorClass = 'text-success';

        const fillPct = zone.density;

        container.innerHTML += `
            <div class="mb-4">
                <div class="flex-between mb-2">
                    <span>${zone.name}</span>
                    <span class="${colorClass}">${zone.status} (${fillPct}%)</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${fillPct}%"></div>
                </div>
            </div>
        `;
    });
}

// ── AI Insights Loader ─────────────────────────────────────────────────────
async function loadAIInsights() {
    const container = document.getElementById('ai-insights-text');
    if (!container) return;
    try {
        const data = await fetchAPI('/crowd/ai-insights');
        if (data && data.narrative) {
            container.innerHTML = '';
            // Typing effect
            const p = document.createElement('p');
            container.appendChild(p);
            const text = data.narrative;
            let i = 0;
            function typeChar() {
                if (i < text.length) {
                    p.textContent += text[i];
                    i++;
                    setTimeout(typeChar, 12);
                }
            }
            typeChar();
        }
    } catch(e) {
        console.warn('AI Insights unavailable:', e);
    }
}

// ── 2. Fan Feed Logic ──────────────────────────────────────────────────────
async function loadFanFeed() {
    const data = await fetchAPI('/fan-feed/live');
    if (!data) return;

    // Ticker
    const ticker = document.getElementById('top-score-ticker');
    if (ticker) {
        ticker.innerHTML = `
            <span class="live-badge">LIVE</span>
            <span>${data.match.ticker_text}</span>
        `;
    }

    // Match Centre
    const scoreEl = document.getElementById('feed-score');
    if (scoreEl) scoreEl.textContent = `${data.match.score.score_a} - ${data.match.score.score_b}`;
    
    const clockEl = document.getElementById('feed-clock');
    if (clockEl) clockEl.textContent = `${data.match.score.period} ${data.match.score.clock}`;
    
    const statsContainer = document.getElementById('feed-stats');
    if (statsContainer) {
        statsContainer.innerHTML = '';
        data.match.stats.forEach(stat => {
            statsContainer.innerHTML += `
                <div class="mb-4">
                    <div class="flex-between mb-2 text-muted" style="font-size: 0.9rem">
                        <span>${stat.value_a}</span>
                        <span>${stat.label}</span>
                        <span>${stat.value_b}</span>
                    </div>
                    <div style="display: flex; gap: 4px; height: 6px;">
                        <div style="flex: 1; background: rgba(255,255,255,0.1); border-radius: 3px; display:flex; justify-content:flex-end">
                            <div style="width: ${stat.bar_pct_a * 100}%; background: var(--primary-blue); border-radius: 3px;"></div>
                        </div>
                        <div style="flex: 1; background: rgba(255,255,255,0.1); border-radius: 3px;">
                            <div style="width: ${stat.bar_pct_b * 100}%; background: var(--accent-orange); border-radius: 3px; height: 100%;"></div>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // Replays
    const replaysContainer = document.getElementById('feed-replays');
    if (replaysContainer) {
        replaysContainer.innerHTML = '';
        data.replays.forEach(r => {
            replaysContainer.innerHTML += `
                <div class="glass-panel" style="padding: 1rem; display: flex; gap: 1rem; align-items: center; cursor: pointer;">
                    <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 8px; display:flex; align-items:center; justify-content:center; font-size: 1.5rem;">
                        ${r.thumbnail_emoji}
                    </div>
                    <div>
                        <p style="font-weight: 500">${r.title}</p>
                        <p class="text-muted" style="font-size: 0.8rem">${r.period} • ${r.timestamp}</p>
                    </div>
                </div>
            `;
        });
    }

    // Buzz
    const buzzContainer = document.getElementById('feed-buzz');
    if (buzzContainer) {
        buzzContainer.innerHTML = '';
        data.buzz.forEach(b => {
            const officialBadge = b.is_official ? `<span class="material-symbols-outlined text-primary" style="font-size: 1rem">verified</span>` : '';
            buzzContainer.innerHTML += `
                <div style="padding-bottom: 1rem; border-bottom: 1px solid var(--border-glass)">
                    <div class="flex-between mb-2">
                        <div style="display:flex; align-items:center; gap: 0.5rem">
                            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${b.avatar_color}; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.8rem">
                                ${b.avatar_letter}
                            </div>
                            <div>
                                <span style="font-weight: 500">${b.author}</span> ${officialBadge}
                                <div class="text-muted" style="font-size: 0.75rem">${b.handle} • ${b.time_ago}</div>
                            </div>
                        </div>
                    </div>
                    <p style="font-size: 0.9rem">${b.content}</p>
                </div>
            `;
        });
    }
}

// ── 3. Concessions Logic ───────────────────────────────────────────────────
let cart = [];
let currentMenu = null;

async function loadConcessions() {
    const data = await fetchAPI('/concessions/menu');
    if (!data) return;
    currentMenu = data;

    const prepTimeEl = document.getElementById('global-prep-time');
    if (prepTimeEl) prepTimeEl.textContent = `Live Prep: ${data.live_prep_time}`;
    
    const container = document.getElementById('menu-container');
    if (!container) return;
    container.innerHTML = '';

    data.stations.forEach(station => {
        let itemsHtml = '';
        station.items.forEach(item => {
            itemsHtml += `
                <div class="glass-panel menu-card">
                    <div class="menu-card-header">
                        <span style="font-size: 2rem">${item.image_emoji}</span>
                        <strong class="text-teal">$${item.price.toFixed(2)}</strong>
                    </div>
                    <h4>${item.name}</h4>
                    <p class="text-muted" style="font-size: 0.8rem">${item.description}</p>
                    <button class="btn btn-outline mt-2" onclick="addToCart('${station.station_id}', '${item.item_id}', '${item.name}', ${item.price})">
                        Add to Order
                    </button>
                </div>
            `;
        });

        container.innerHTML += `
            <h3 class="mt-4 mb-2">${station.name} <span class="text-muted" style="font-size:0.9rem; font-weight:normal">(${station.walk_minutes} min walk)</span></h3>
            <div class="menu-grid">
                ${itemsHtml}
            </div>
        `;
    });

    // Load AI food recommendation
    loadFoodRecommendation();
}

async function loadFoodRecommendation() {
    const panel = document.getElementById('ai-food-rec');
    const textEl = document.getElementById('ai-food-rec-text');
    if (!panel || !textEl) return;
    try {
        const data = await fetchAPI('/concessions/ai-recommend');
        if (data && data.recommendation) {
            textEl.textContent = data.recommendation;
            panel.style.display = 'block';
        }
    } catch(e) {
        console.warn('AI food recommendation unavailable:', e);
    }
}

window.addToCart = function(stationId, itemId, name, price) {
    if (cart.length > 0 && cart[0].stationId !== stationId) {
        alert("You can only order from one station at a time. Clear cart?");
        return;
    }
    
    const existing = cart.find(i => i.itemId === itemId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ stationId, itemId, name, price, quantity: 1 });
    }
    renderCart();
}

function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-muted">Cart is empty.</p>';
        document.getElementById('checkout-btn').disabled = true;
        document.getElementById('cart-subtotal').textContent = '$0.00';
        document.getElementById('cart-tax').textContent = '$0.00';
        document.getElementById('cart-total').textContent = '$0.00';
        return;
    }

    document.getElementById('checkout-btn').disabled = false;
    cartContainer.innerHTML = '';
    
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        cartContainer.innerHTML += `
            <div class="flex-between mb-2" style="font-size: 0.9rem">
                <span>${item.quantity}x ${item.name}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });

    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
        if (cart.length === 0) return;

        const payload = {
            user_id: "user-123",
            station_id: cart[0].stationId,
            items: cart.map(i => ({
                item_id: i.itemId,
                name: i.name,
                quantity: i.quantity,
                unit_price: i.price
            }))
        };

        const res = await fetchAPI('/concessions/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res) {
            cart = []; // clear cart
            renderCart();
            
            const panel = document.getElementById('order-status-panel');
            panel.style.display = 'block';
            document.getElementById('order-pickup-code').textContent = res.pickup_code;
            document.getElementById('order-status-msg').textContent = res.message;
            
            const walkToggle = document.getElementById('walkthrough-toggle');
            if (walkToggle && walkToggle.checked) {
                // Feature 4: Walk-Through Pickup Simulation
                const tracker = document.getElementById('proximity-tracker');
                const bar = document.getElementById('proximity-bar');
                const distText = document.getElementById('proximity-distance');
                const statusText = document.getElementById('proximity-status');
                
                tracker.style.display = 'block';
                bar.style.width = '0%';
                
                let dist = 50;
                const interval = setInterval(() => {
                    dist -= 5;
                    const pct = ((50 - dist) / 50) * 100;
                    bar.style.width = `${pct}%`;
                    distText.textContent = `~${dist}m`;
                    
                    if (dist <= 0) {
                        clearInterval(interval);
                        statusText.textContent = "Handoff Complete! Enjoy your order.";
                        statusText.className = "text-success mt-2";
                        document.getElementById('order-status-msg').textContent = "Automatically handed off via Bluetooth proximity.";
                        panel.style.background = 'rgba(34, 197, 94, 0.2)';
                    }
                }, 800);
            } else {
                // Standard Polling simulation
                setTimeout(() => {
                    document.getElementById('order-status-msg').textContent = "Your order is READY! Pick up at station.";
                    panel.style.background = 'rgba(34, 197, 94, 0.2)'; // success green
                }, 5000);
            }
        }
    });
}

// ── 4. Map & Navigation Logic ──────────────────────────────────────────────
// Zone positions for heatmap (matching ZONE_REGISTRY from backend)
const ZONE_MAP_COORDS = {
    'GA': { cx: 400, cy: 50,  rx: 60, ry: 25, label: 'Gate A' },
    'GB': { cx: 650, cy: 300, rx: 25, ry: 60, label: 'Gate B' },
    'GC': { cx: 400, cy: 550, rx: 60, ry: 25, label: 'Gate C' },
    'GD': { cx: 100, cy: 300, rx: 25, ry: 60, label: 'Gate D' },
    'FC': { cx: 150, cy: 150, rx: 45, ry: 30, label: 'Food Court' },
    'ST': { cx: 400, cy: 300, rx: 120, ry: 80, label: 'Stadium Bowl' },
    'RR': { cx: 650, cy: 150, rx: 35, ry: 25, label: 'Restrooms' },
    'MC': { cx: 700, cy: 200, rx: 30, ry: 20, label: 'Medical' },
    'MS': { cx: 130, cy: 450, rx: 40, ry: 25, label: 'Merch Store' },
    'C1': { cx: 550, cy: 150, rx: 50, ry: 20, label: 'Corridor 1' },
    'C2': { cx: 300, cy: 200, rx: 20, ry: 50, label: 'Corridor 2' },
    'C3': { cx: 600, cy: 400, rx: 50, ry: 20, label: 'Corridor 3' },
    'C4': { cx: 200, cy: 400, rx: 50, ry: 20, label: 'Corridor 4' },
};

function densityToColor(density) {
    if (density >= 80) return 'rgba(220, 38, 38, 0.6)';  // CRITICAL - red
    if (density >= 60) return 'rgba(239, 68, 68, 0.45)'; // HIGH - orange-red
    if (density >= 35) return 'rgba(245, 158, 11, 0.35)'; // MEDIUM - amber
    return 'rgba(34, 197, 94, 0.25)';                     // LOW - green
}

function initMap() {
    const container = document.getElementById('map-container');
    if (!container || container.querySelector('#route-svg')) return;

    // Build heatmap zone ellipses
    let heatmapZones = '';
    let heatmapLabels = '';
    for (const [zoneId, z] of Object.entries(ZONE_MAP_COORDS)) {
        heatmapZones += `<ellipse id="hz-${zoneId}" class="heatmap-zone" cx="${z.cx}" cy="${z.cy}" rx="${z.rx}" ry="${z.ry}" fill="rgba(255,255,255,0.05)" stroke="none"/>`;
        heatmapLabels += `<text x="${z.cx}" y="${z.cy + 4}" fill="rgba(255,255,255,0.8)" font-size="10" text-anchor="middle" font-family="var(--font-body)" font-weight="500">${z.label}</text>`;
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'route-svg');
    svg.setAttribute('viewBox', '0 0 800 600');
    svg.style.width = '100%';
    svg.style.maxHeight = '600px';
    svg.innerHTML = `
        <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <radialGradient id="pitch-gradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="rgba(34,197,94,0.15)" />
                <stop offset="100%" stop-color="rgba(34,197,94,0.02)" />
            </radialGradient>
            <linearGradient id="corridor-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="rgba(255,255,255,0.03)" />
                <stop offset="50%" stop-color="rgba(255,255,255,0.08)" />
                <stop offset="100%" stop-color="rgba(255,255,255,0.03)" />
            </linearGradient>
        </defs>

        <!-- Stadium outer ring -->
        <ellipse cx="400" cy="300" rx="360" ry="260" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2" />
        <ellipse cx="400" cy="300" rx="340" ry="240" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1" />

        <!-- Seating sections (arc segments) -->
        <path d="M 400 60 A 340 240 0 0 1 740 300" fill="none" stroke="rgba(0,102,255,0.15)" stroke-width="18" />
        <path d="M 740 300 A 340 240 0 0 1 400 540" fill="none" stroke="rgba(255,94,7,0.15)" stroke-width="18" />
        <path d="M 400 540 A 340 240 0 0 1 60 300" fill="none" stroke="rgba(0,219,233,0.12)" stroke-width="18" />
        <path d="M 60 300 A 340 240 0 0 1 400 60" fill="none" stroke="rgba(180,130,255,0.12)" stroke-width="18" />

        <!-- Corridors (connecting paths) -->
        <line x1="400" y1="80" x2="400" y2="220" stroke="url(#corridor-grad)" stroke-width="8" stroke-linecap="round" />
        <line x1="580" y1="160" x2="520" y2="230" stroke="url(#corridor-grad)" stroke-width="8" stroke-linecap="round" />
        <line x1="300" y1="220" x2="300" y2="380" stroke="url(#corridor-grad)" stroke-width="6" stroke-linecap="round" />
        <line x1="580" y1="380" x2="520" y2="350" stroke="url(#corridor-grad)" stroke-width="6" stroke-linecap="round" />
        <line x1="200" y1="380" x2="280" y2="350" stroke="url(#corridor-grad)" stroke-width="6" stroke-linecap="round" />
        <line x1="650" y1="300" x2="520" y2="300" stroke="url(#corridor-grad)" stroke-width="6" stroke-linecap="round" />
        <line x1="100" y1="300" x2="280" y2="300" stroke="url(#corridor-grad)" stroke-width="6" stroke-linecap="round" />
        <line x1="400" y1="380" x2="400" y2="540" stroke="url(#corridor-grad)" stroke-width="8" stroke-linecap="round" />

        <!-- Pitch / Playing field -->
        <rect x="280" y="230" width="240" height="140" rx="15" fill="url(#pitch-gradient)" stroke="rgba(34,197,94,0.35)" stroke-width="1.5" />
        <line x1="400" y1="230" x2="400" y2="370" stroke="rgba(34,197,94,0.2)" stroke-width="1" />
        <circle cx="400" cy="300" r="30" fill="none" stroke="rgba(34,197,94,0.2)" stroke-width="1" />
        <text x="400" y="305" fill="rgba(34,197,94,0.5)" font-size="11" text-anchor="middle" font-family="var(--font-heading)">PITCH</text>

        <!-- Heatmap zone ellipses -->
        <g id="heatmap-zones">${heatmapZones}</g>

        <!-- Gate icons -->
        <rect x="375" y="35" width="50" height="20" rx="4" fill="rgba(0,102,255,0.15)" stroke="rgba(0,102,255,0.4)" stroke-width="1" />
        <rect x="635" y="290" width="20" height="50" rx="4" fill="rgba(0,102,255,0.15)" stroke="rgba(0,102,255,0.4)" stroke-width="1" />
        <rect x="375" y="540" width="50" height="20" rx="4" fill="rgba(0,102,255,0.15)" stroke="rgba(0,102,255,0.4)" stroke-width="1" />
        <rect x="85" y="275" width="20" height="50" rx="4" fill="rgba(0,102,255,0.15)" stroke="rgba(0,102,255,0.4)" stroke-width="1" />

        <!-- Amenity icons -->
        <rect x="120" y="130" width="55" height="35" rx="6" fill="rgba(255,94,7,0.1)" stroke="rgba(255,94,7,0.3)" stroke-width="1" stroke-dasharray="3,2" />
        <rect x="625" y="130" width="50" height="35" rx="6" fill="rgba(0,219,233,0.1)" stroke="rgba(0,219,233,0.3)" stroke-width="1" stroke-dasharray="3,2" />
        <rect x="100" y="430" width="55" height="35" rx="6" fill="rgba(180,130,255,0.1)" stroke="rgba(180,130,255,0.3)" stroke-width="1" stroke-dasharray="3,2" />

        <!-- Zone labels -->
        <g id="zone-labels">${heatmapLabels}</g>
        <g id="map-nodes"></g>
        <g id="map-path"></g>
    `;
    container.insertBefore(svg, container.querySelector('.heatmap-legend'));

    // Start heatmap polling
    updateHeatmap();
    setInterval(updateHeatmap, 5000);
}

async function updateHeatmap() {
    const data = await fetchAPI('/crowd/status');
    if (!data || !data.zones) return;

    const legend = document.getElementById('heatmap-legend');
    if (legend) legend.style.display = 'flex';

    data.zones.forEach(zone => {
        const el = document.getElementById(`hz-${zone.zone_id}`);
        if (!el) return;
        const color = densityToColor(zone.density);
        el.setAttribute('fill', color);
        // Pulse critical zones
        if (zone.density >= 80) {
            el.style.animation = 'heatmapPulse 2s ease infinite';
        } else {
            el.style.animation = 'none';
        }
    });
}

const routeForm = document.getElementById('route-form');
if (routeForm) {
    routeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const origin = document.getElementById('origin').value;
        const dest = document.getElementById('destination').value;
        const access = document.getElementById('accessible').checked;

        const data = await fetchAPI(`/navigation/route?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&accessible=${access}`);
        
        if (data) {
            document.getElementById('route-results').style.display = 'block';
            document.getElementById('route-distance').textContent = `Distance: ${data.distance_meters}m`;
            document.getElementById('route-time').textContent = `Est. Time: ${data.estimated_time_minutes} mins`;
            document.getElementById('route-reason').textContent = data.routing_reason;
            
            drawRouteOnMap(data.path);
        }
    });
}

function drawRouteOnMap(path) {
    const svgPath = document.getElementById('map-path');
    const svgNodes = document.getElementById('map-nodes');
    
    if (!svgPath || !svgNodes) return;

    const nodeCoords = {
        'Gate A': [400, 550],
        'Gate B': [400, 50],
        'Section 110': [200, 300],
        'Food Court': [150, 150],
        'Restroom 1': [650, 150],
        'Concourse B': [300, 300]
    };

    let d = '';
    svgNodes.innerHTML = '';

    path.forEach((node, idx) => {
        const coords = nodeCoords[node] || [200 + Math.random()*400, 200 + Math.random()*200];
        
        if (idx === 0) d += `M${coords[0]},${coords[1]} `;
        else d += `L${coords[0]},${coords[1]} `;

        svgNodes.innerHTML += `<circle cx="${coords[0]}" cy="${coords[1]}" r="6" fill="var(--primary-blue)" filter="url(#glow)"/>`;
        svgNodes.innerHTML += `<text x="${coords[0]+10}" y="${coords[1]+5}" fill="white" font-size="12" filter="url(#glow)">${node}</text>`;
    });

    svgPath.innerHTML = `<path d="${d}" fill="none" stroke="var(--primary-blue)" stroke-width="4" stroke-dasharray="8,8" filter="url(#glow)" />`;
}

// Feature 1: AR Wayfinding with REAL CAMERA
const arBtn = document.getElementById('ar-view-btn');
const arModal = document.getElementById('ar-modal');
const arCloseBtn = document.getElementById('ar-close-btn');
let arStream = null;

async function startARCamera() {
    const video = document.getElementById('ar-camera-feed');
    const fallback = document.getElementById('ar-camera-fallback');
    try {
        arStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        video.srcObject = arStream;
        video.style.display = 'block';
        if (fallback) fallback.style.display = 'none';
    } catch (err) {
        console.warn('Camera not available, using fallback:', err.message);
        video.style.display = 'none';
        if (fallback) fallback.style.display = 'block';
    }
}

function stopARCamera() {
    if (arStream) {
        arStream.getTracks().forEach(track => track.stop());
        arStream = null;
    }
    const video = document.getElementById('ar-camera-feed');
    if (video) video.srcObject = null;
}

if (arBtn) {
    arBtn.addEventListener('click', async () => {
        arModal.style.display = 'flex';
        document.getElementById('ar-dest-label').textContent = document.getElementById('destination').value || 'Destination';
        await startARCamera();
    });
}
if (arCloseBtn) {
    arCloseBtn.addEventListener('click', () => {
        arModal.style.display = 'none';
        stopARCamera();
    });
}

// ── 5. Chat Assistant Logic ────────────────────────────────────────────────
const chatHeader = document.getElementById('chat-header');
const chatWidget = document.getElementById('chat-widget');
const chatToggleIcon = document.getElementById('chat-toggle-icon');

if (chatHeader) {
    chatHeader.addEventListener('click', () => {
        chatWidget.classList.toggle('collapsed');
        chatToggleIcon.textContent = chatWidget.classList.contains('collapsed') ? 'expand_less' : 'expand_more';
    });
}

const chatSendBtn = document.getElementById('chat-send');
if (chatSendBtn) chatSendBtn.addEventListener('click', sendChatMessage);

const chatInput = document.getElementById('chat-input');
if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    appendChatMsg(msg, 'user');
    input.value = '';

    const res = await fetchAPI('/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, user_id: 'user-123' })
    });

    if (res && res.reply) {
        appendChatMsg(res.reply, 'bot');
        speakText(res.reply);
    } else if (res && res.response) {
        appendChatMsg(res.response, 'bot');
        speakText(res.response);
    } else {
        const errStr = "Sorry, I'm having trouble connecting right now.";
        appendChatMsg(errStr, 'bot');
        speakText(errStr);
    }
}

function appendChatMsg(text, sender) {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    container.innerHTML += `<div class="chat-msg msg-${sender}">${text}</div>`;
    container.scrollTop = container.scrollHeight;
}

// Feature 3: Voice Concierge
let voiceEnabled = false;
const voiceBtn = document.getElementById('voice-btn');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognition && voiceBtn) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onstart = function() {
        voiceBtn.classList.add('listening');
        voiceEnabled = true;
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const input = document.getElementById('chat-input');
        if (input) input.value = transcript;
        sendChatMessage();
    };

    recognition.onerror = function() {
        voiceBtn.classList.remove('listening');
    };

    recognition.onend = function() {
        voiceBtn.classList.remove('listening');
    };

    voiceBtn.addEventListener('click', () => {
        if (voiceBtn.classList.contains('listening')) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });
}

function speakText(text) {
    if (!voiceEnabled || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    // try to find a natural sounding voice
    const voices = window.speechSynthesis.getVoices();
    const goodVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || voices[0];
    if (goodVoice) utterance.voice = goodVoice;
    window.speechSynthesis.speak(utterance);
    voiceEnabled = false; // Reset after speaking so we don't speak normal text replies
}

// Feature 1: Crowd-Shaping Promotions
async function loadPromotions() {
    const data = await fetchAPI('/crowd/promotions');
    if (!data || !data.promotions || data.promotions.length === 0) return;
    
    const banner = document.getElementById('promo-banner');
    const icon = document.getElementById('promo-icon');
    const text = document.getElementById('promo-text');
    
    if (banner && icon && text) {
        const promo = data.promotions[0];
        icon.textContent = promo.icon;
        text.innerHTML = `<strong>${promo.headline}</strong> — ${promo.detail}`;
        banner.style.display = 'flex';
    }
}

// Feature 4: Kinetic Points Gamification
let kineticPoints = 0;

function awardKineticPoints(amount, reason) {
    kineticPoints += amount;
    // Update wallet display
    const counter = document.getElementById('kinetic-points-count');
    if (counter) {
        counter.textContent = kineticPoints;
        const wallet = document.getElementById('kinetic-points-wallet');
        if (wallet) {
            wallet.classList.remove('kp-bump');
            void wallet.offsetWidth; // force reflow
            wallet.classList.add('kp-bump');
        }
    }
    // Show toast
    const toast = document.getElementById('kp-toast');
    const toastText = document.getElementById('kp-toast-text');
    if (toast && toastText) {
        toastText.textContent = `+${amount} KP — ${reason}`;
        toast.style.display = 'flex';
        setTimeout(() => { toast.style.display = 'none'; }, 3000);
    }
}

// Hook: Accept promo → earn points
const promoAcceptBtn = document.getElementById('promo-accept-btn');
if (promoAcceptBtn) {
    promoAcceptBtn.addEventListener('click', () => {
        awardKineticPoints(50, 'Accepted crowd-shaping offer!');
        document.getElementById('promo-banner').style.display = 'none';
    });
}

// Feature 5: Smart Egress Alerts
const simulateEgressBtn = document.getElementById('simulate-match-end-btn');
const egressModal = document.getElementById('egress-modal');
const egressCloseBtn = document.getElementById('egress-close-btn');

if (simulateEgressBtn) {
    simulateEgressBtn.addEventListener('click', async () => {
        const data = await fetchAPI('/crowd/egress');
        if (!data) return;
        
        const recDiv = document.getElementById('egress-recommendation');
        recDiv.innerHTML = `
            <h3>${data.recommendation.best_gate} is the fastest exit</h3>
            <p>${data.recommendation.advice}</p>
        `;
        
        const gatesDiv = document.getElementById('egress-gates');
        gatesDiv.innerHTML = '';
        data.gates.forEach(g => {
            const isBest = g.gate_name === data.recommendation.best_gate ? 'best-gate' : '';
            gatesDiv.innerHTML += `
                <div class="egress-gate-card ${isBest}">
                    <h4>${g.gate_name}</h4>
                    <div class="egress-wait ${isBest ? 'text-success' : 'text-orange'}">${g.exit_wait_now_minutes}</div>
                    <p class="text-muted" style="font-size:0.8rem">min wait</p>
                </div>
            `;
        });
        
        const transDiv = document.getElementById('egress-transport');
        transDiv.innerHTML = '<h4><span class="material-symbols-outlined">directions_car</span> Transport Updates</h4>';
        if (data.gates.length > 0) {
            const t = data.gates[0].transport_tips;
            transDiv.innerHTML += `
                <div class="transport-option"><span class="material-symbols-outlined">train</span> ${t.transit}</div>
                <div class="transport-option"><span class="material-symbols-outlined">local_taxi</span> ${t.rideshare}</div>
                <div class="transport-option"><span class="material-symbols-outlined">directions_car</span> ${t.car}</div>
            `;
        }
        
        // AI Strategy
        const aiPanel = document.getElementById('egress-ai-strategy');
        const aiText = document.getElementById('egress-ai-text');
        if (aiPanel && aiText && data.ai_strategy) {
            aiText.textContent = data.ai_strategy;
            aiPanel.style.display = 'block';
        }
        
        egressModal.style.display = 'flex';
        // Award points for using smart egress
        awardKineticPoints(25, 'Used Smart Exit Guide!');
    });
}

if (egressCloseBtn) {
    egressCloseBtn.addEventListener('click', () => {
        egressModal.style.display = 'none';
    });
}

// ── Init ───────────────────────────────────────────────────────────────────
// Load data on startup
setTimeout(() => {
    loadDashboard();
    loadFanFeed(); 
    loadConcessions();
    loadPromotions();
    loadAIInsights();
    // Award welcome points
    awardKineticPoints(100, 'Welcome to Kinetic Stadium!');
}, 500);

setInterval(() => {
    loadDashboard();
}, 15000); 

setInterval(() => {
    loadPromotions();
}, 30000);

// Refresh AI insights every 20 seconds
setInterval(() => {
    loadAIInsights();
}, 20000);
