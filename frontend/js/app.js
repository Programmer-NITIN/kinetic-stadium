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
    try {
        const res = await fetch(`/api${endpoint}`, options);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.warn(`Falling back to mock data for ${endpoint}`);
        if (endpoint.includes('/crowd/status')) return MOCK_DATA.crowd;
        if (endpoint.includes('/fan-feed/live')) return MOCK_DATA.fanFeed;
        if (endpoint.includes('/concessions/menu')) return MOCK_DATA.concessions;
        if (endpoint.includes('/concessions/order')) {
            return {
                order_id: "ORD-" + Date.now(),
                pickup_code: "#K88",
                message: "Order confirmed! Preparation starting shortly.",
                status: "confirmed"
            };
        }
        if (endpoint.includes('/navigation/route')) {
            return {
                distance_meters: 150,
                estimated_time_minutes: 2,
                routing_reason: "Avoiding North Concourse due to high density.",
                path: [document.getElementById('origin').value, "Concourse B", document.getElementById('destination').value]
            };
        }
        if (endpoint.includes('/assistant/chat')) {
            return { response: "I'm your Kinetic AI Assistant. I operate offline during this demo mode, but I can tell you that the Food Court has medium wait times right now!" };
        }
        return null;
    }
}

// ── 1. Dashboard Logic ─────────────────────────────────────────────────────
async function loadDashboard() {
    const data = await fetchAPI('/crowd/status');
    if (!data) return;

    const container = document.getElementById('dashboard-crowd-stats');
    container.innerHTML = '';

    data.zones.forEach(zone => {
        let colorClass = 'text-primary';
        if (zone.density_level === 'High') colorClass = 'text-danger';
        if (zone.density_level === 'Medium') colorClass = 'text-warning';

        const fillPct = (zone.current_occupancy / zone.capacity) * 100;

        container.innerHTML += `
            <div class="mb-4">
                <div class="flex-between mb-2">
                    <span>${zone.name}</span>
                    <span class="${colorClass}">${zone.density_level} (${Math.round(fillPct)}%)</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${fillPct}%"></div>
                </div>
            </div>
        `;
    });
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
            
            // Polling simulation
            setTimeout(() => {
                document.getElementById('order-status-msg').textContent = "Your order is READY! Pick up at station.";
                panel.style.background = 'rgba(34, 197, 94, 0.2)'; // success green
            }, 5000);
        }
    });
}

// ── 4. Map & Navigation Logic ──────────────────────────────────────────────
function initMap() {
    const container = document.getElementById('map-container');
    if (!container || container.innerHTML.includes('svg')) return; 

    container.innerHTML = `
        <svg id="route-svg" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            <!-- Pitch -->
            <rect x="250" y="200" width="300" height="200" rx="20" fill="rgba(34, 197, 94, 0.1)" stroke="var(--border-glass)" />
            <!-- Stands -->
            <path d="M150,100 Q400,0 650,100 L600,180 Q400,100 200,180 Z" fill="rgba(255,255,255,0.05)" stroke="var(--border-glass)" />
            <path d="M150,500 Q400,600 650,500 L600,420 Q400,500 200,420 Z" fill="rgba(255,255,255,0.05)" stroke="var(--border-glass)" />
            <path d="M100,150 Q0,300 100,450 L180,400 Q100,300 180,200 Z" fill="rgba(255,255,255,0.05)" stroke="var(--border-glass)" />
            <path d="M700,150 Q800,300 700,450 L620,400 Q700,300 620,200 Z" fill="rgba(255,255,255,0.05)" stroke="var(--border-glass)" />
            
            <g id="map-nodes"></g>
            <g id="map-path"></g>
        </svg>
    `;
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

    if (res && res.response) {
        appendChatMsg(res.response, 'bot');
    } else {
        appendChatMsg("Sorry, I'm having trouble connecting right now.", 'bot');
    }
}

function appendChatMsg(text, sender) {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    container.innerHTML += `<div class="chat-msg msg-${sender}">${text}</div>`;
    container.scrollTop = container.scrollHeight;
}

// ── Init ───────────────────────────────────────────────────────────────────
// Load data on startup
setTimeout(() => {
    loadDashboard();
    loadFanFeed(); 
    loadConcessions();
}, 500);

setInterval(() => {
    loadDashboard();
}, 15000); 
