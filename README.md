<p align="center">
  <img src="https://img.shields.io/badge/⚡-KINETIC_STADIUM-0066ff?style=for-the-badge&labelColor=0a0a1a" alt="Kinetic Stadium" />
</p>

<h1 align="center">KINETIC STADIUM</h1>
<h3 align="center">AI-Powered Smart Venue Experience Platform</h3>

<p align="center">
  <em>Transforming how 50,000+ fans experience live sporting events — in real-time.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11+-3776ab?logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.0_Flash-4285F4?logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Google_Cloud-7_Services-EA4335?logo=googlecloud&logoColor=white" alt="GCP" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT" />
</p>

---

## 🎯 Problem Statement

> *"Design a solution that improves the physical event experience for attendees at large-scale sporting venues. The system should address challenges such as crowd movement, waiting times, and real-time coordination, while ensuring a seamless and enjoyable experience."*

**The Reality:** Every major sporting event puts 50,000+ people in a confined space. Fans waste **35+ minutes per event** in congestion, miss crucial moments waiting in lines, and face dangerous crowd surges during exits. Current solutions are either staff-heavy manual systems or basic signage that can't adapt in real-time.

**Our Answer:** Kinetic Stadium is a complete AI-powered platform that transforms passive spectators into connected, informed participants — with real-time crowd intelligence, personalized navigation, smart food ordering, and AI-driven safety orchestration.

---

## 🧠 What Makes This Different

| Traditional Approach | Kinetic Stadium |
|---|---|
| Static signs saying "Exit This Way" | **Gemini AI generates personalized exit strategies** based on live gate congestion |
| Guessing which food line is shortest | **AI Chef's Pick** recommends optimal food + station based on your zone & wait times |
| Staff manually counting crowds | **13-zone real-time density simulation** with trend prediction & anomaly detection |
| Generic PA announcements | **AI Crowd Narrator** generates natural-language stadium intelligence every 20 seconds |
| "Check the app for info" | **Grounded AI Chatbot** answers venue questions using structured knowledge, not hallucinations |
| Post-event crowd crush risk | **Smart Egress Advisor** with per-gate analysis saves fans ~18 minutes on exit |

---

## ⚡ Key Features

### 🔴 Real-Time Crowd Intelligence
- **13-zone density monitoring** with IoT-simulated telemetry (gates, corridors, amenities, stadium bowl)
- **Live Heatmap** with color-coded density visualization (green → amber → red → pulsing critical)
- **Trend prediction engine** forecasting crowd movements 30 minutes ahead
- **Anomaly detection** triggering automatic crowd-shaping promotions

### 🧠 Gemini AI Integration (5 Touch-Points)

| # | Feature | What Gemini Does | Fallback |
|---|---------|-----------------|----------|
| 1 | **AI Crowd Narrator** | Generates real-time stadium pulse narratives from all 13 zones | Deterministic summary |
| 2 | **AI Chef's Pick** | Personalized food recommendations based on density, wait times, menu | Lowest-wait station pick |
| 3 | **Smart Egress Advisor** | Personalized exit strategy comparing all gates with time-saving estimates | Best-gate static advice |
| 4 | **Event Assistant Chatbot** | Grounded Q&A on venue policies, facilities, navigation (never hallucinates) | Pattern-matched FAQ |
| 5 | **Staff Operations Advisor** | Generates deployment recommendations from triage alerts | Rule-based alert priority |

> **Design Principle:** Gemini is used for intelligence augmentation, not decision-making. All routing uses Dijkstra's algorithm; all density data is deterministic. Gemini adds the "explain why" layer that makes the system trustworthy.

### 🗺️ Smart Navigation
- **Dijkstra-based pathfinding** across a weighted venue graph with real-time edge cost updates
- **AR Wayfinding** using device camera with overlay navigation markers
- **Accessibility-aware routing** with wheelchair-friendly path alternatives
- **Voice-activated navigation** via Web Speech API integration

### 🍕 Express Concessions
- **Order-ahead system** with 5 food/drink stations + merch kiosk
- **Live prep time estimates** based on current queue depth
- **Walk-through pickup** with simulated Bluetooth proximity handoff
- **AI-powered recommendations** that consider your location and crowd conditions

### 🏆 Gamification Engine
- **Kinetic Points (KP)** awarded for crowd-shaping behavior, smart actions, and engagement
- **Crowd-shaping promotions** — AI detects congestion and generates incentive offers to redistribute fans
- **Real-time KP wallet** with animated point awards and toast notifications

### 📊 Live Fan Feed
- **Real-time match score and statistics** with period-by-period updates
- **Key moment replays** (goals, penalties, cards) with timeline integration
- **Social buzz feed** with verified account badges and live commentary

### 🚨 Smart Egress Intelligence
- **Per-gate congestion analysis** with current vs. peak wait time predictions
- **Gemini AI exit strategy** — personalized advice naming exact gates, corridors, and time savings
- **Transport integration** — transit schedules, rideshare surge pricing, parking exit estimates

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│              Frontend (Glassmorphism SPA)                     │
│  Landing Page (index.html) → Dashboard (app.html)            │
│  5 Views: Dashboard • Live Map • Express Orders • Fan Feed   │
│  AI Insights Panel • Chat Widget • AR Modal • Egress Modal   │
└──────────────────┬───────────────────────────────────────────┘
                   │ REST API (JSON)
┌──────────────────▼───────────────────────────────────────────┐
│                    FastAPI Backend                            │
│  CSP Headers • CORS • Rate Limiting • Input Validation       │
├──────────────────────────────────────────────────────────────┤
│ ┌───────────────┐ ┌───────────────┐ ┌──────────────────────┐│
│ │ Crowd Engine   │ │ Decision      │ │ AI Engine            ││
│ │ • Simulator    │ │ Engine        │ │ • Gemini Caller      ││
│ │ • Predictor    │ │ • Zone Scorer │ │ • Crowd Narrator  🆕 ││
│ │ • Wait Times   │ │ • Dijkstra    │ │ • Food Recommender🆕 ││
│ │ • TTL Cache    │ │ • Route Planner│ │ • Egress Advisor  🆕 ││
│ │ • Anomaly Det. │ │               │ │ • Chatbot            ││
│ └───────────────┘ └───────────────┘ │ • Staff Advisor      ││
│                                      │ • Route Explainer    ││
│                                      └──────────────────────┘│
├──────────────────────────────────────────────────────────────┤
│              Google Cloud Service Layer                       │
│  Gemini 2.0 Flash • Firestore • BigQuery • Maps             │
│  Cloud Logging • Firebase Auth • Cloud Run                   │
│  ────── All services have zero-dependency mock fallbacks ──── │
└──────────────────────────────────────────────────────────────┘
```

### Design Decisions

| Decision | Why |
|---|---|
| **Deterministic-first AI** | Dijkstra computes routes, Gemini explains them — AI never makes safety-critical decisions |
| **Mock-first architecture** | Every Google Cloud service has an in-process mock — app runs with zero API keys |
| **5 Gemini touch-points** | Each uses structured prompts with live telemetry injection and deterministic fallbacks |
| **TTL-cached density** | 2-second cache prevents redundant computation under high request volume |
| **Sliding-window rate limiting** | Per-IP deque-based counters with configurable thresholds per route |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- pip

### Run Locally (Works Without Any API Keys)

```bash
# Clone the repository
git clone https://github.com/Programmer-NITIN/kinetic-stadium.git
cd kinetic-stadium

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Run the application
uvicorn app.main:app --reload --port 8000
```

Open **http://localhost:8000** → Landing Page → Click "Experience the Stadium" → Full Dashboard

### Enable Gemini AI (Recommended)

```bash
# Create .env file
echo GEMINI_API_KEY=your-key-from-aistudio.google.com > .env

# Restart the server — all 5 AI features activate automatically
uvicorn app.main:app --reload --port 8000
```

> Without the API key, all AI features gracefully degrade to deterministic fallbacks — the app is fully functional either way.

---

## 📡 API Reference

| Method | Endpoint | Description | Auth | Rate Limit |
|--------|----------|-------------|------|------------|
| `GET` | `/health` | Service health & dependency status | — | — |
| `GET` | `/crowd/status` | Live density for all 13 zones | — | 30/min |
| `GET` | `/crowd/predict` | 30-min density prediction per zone | — | 30/min |
| `GET` | `/crowd/wait-times` | Service wait times (gates, food, restrooms) | — | 30/min |
| `GET` | `/crowd/promotions` | AI-triggered crowd-shaping offers | — | 30/min |
| `GET` | `/crowd/ai-insights` | **🆕** Gemini crowd intelligence narrative | — | 30/min |
| `GET` | `/crowd/egress` | **🆕** Smart egress with AI exit strategy | — | 30/min |
| `POST` | `/navigation/route` | Dijkstra optimal route computation | — | 10/min |
| `POST` | `/assistant/chat` | Grounded AI Event Assistant | — | 20/min |
| `GET` | `/concessions/menu` | Full menu with live prep times | — | 30/min |
| `GET` | `/concessions/ai-recommend` | **🆕** AI food recommendation | — | 30/min |
| `POST` | `/concessions/order` | Place express order, get pickup code | — | 30/min |
| `GET` | `/fan-feed/live` | Live match data, replays, social buzz | — | 30/min |
| `GET` | `/analytics/dashboard` | Staff operations dashboard | — | 15/min |

Interactive docs at **http://localhost:8000/docs** (Swagger UI)

---

## 🔒 Security

| Layer | Implementation |
|-------|---------------|
| **CSP** | Strict Content-Security-Policy with allowlisted CDN origins |
| **HSTS** | `max-age=63072000; includeSubDomains; preload` in production |
| **Clickjacking** | `X-Frame-Options: DENY` |
| **MIME Sniffing** | `X-Content-Type-Options: nosniff` |
| **Referrer** | `strict-origin-when-cross-origin` |
| **Rate Limiting** | Sliding-window per-IP counters (configurable per-route) |
| **Input Validation** | Pydantic models with bounded lengths and enum constraints |
| **Docker** | Non-root `appuser` execution in production container |
| **Permissions** | Camera/mic self-only, payment disabled |

---

## ☁️ Google Cloud Integration (7 Services)

| # | Service | Purpose | Mock Fallback |
|---|---------|---------|---------------|
| 1 | **Gemini 2.0 Flash** | 5 AI features: narrator, recommender, egress, chatbot, staff advisor | Deterministic text |
| 2 | **Cloud Firestore** | Navigation session persistence | Bounded OrderedDict |
| 3 | **BigQuery** | Historical hotspot analytics | Seeded RNG data |
| 4 | **Google Maps** | Walking distances & coordinates | Zone registry distances |
| 5 | **Cloud Logging** | Structured request/error logging | Console logger |
| 6 | **Firebase Auth** | User token verification | `mock-*` token acceptance |
| 7 | **Cloud Run** | Container deployment | Local uvicorn |

---

## 🧪 Testing

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=app --cov-report=term-missing

# Run specific categories
pytest tests/test_security.py -v
pytest tests/test_crowd_engine.py -v
pytest tests/test_chatbot.py -v
```

**366 tests** across 21 test files • **94% code coverage**

---

## 📁 Project Structure

```
kinetic-stadium/
├── app/
│   ├── main.py                     # FastAPI app factory, CSP, CORS, lifecycle
│   ├── config.py                   # Pydantic Settings + venue graph (13 zones)
│   ├── config_data.py              # Ground-truth venue data & policies
│   ├── models/                     # Pydantic request/response models
│   ├── api/
│   │   ├── routes_crowd.py         # Density, predictions, promotions, AI insights, egress
│   │   ├── routes_navigation.py    # Dijkstra routing + AR wayfinding
│   │   ├── routes_assistant.py     # Gemini-grounded chatbot
│   │   ├── routes_concessions.py   # Express ordering + AI food recommendations
│   │   ├── routes_fan_feed.py      # Live match data & social buzz
│   │   ├── routes_analytics.py     # Staff operations dashboard
│   │   ├── routes_auth.py          # Firebase token verification
│   │   └── routes_health.py        # Health check & dependency status
│   ├── ai_engine/
│   │   ├── gemini_caller.py        # Centralized Gemini client with timeout & fallback
│   │   ├── crowd_narrator.py       # 🆕 Real-time AI stadium pulse narrator
│   │   ├── food_recommender.py     # 🆕 Context-aware AI food recommendations
│   │   ├── chatbot.py              # Deterministic intent + Gemini phrasing
│   │   ├── staff_advisor.py        # AI operations recommendations
│   │   ├── explainer.py            # Route decision explanation
│   │   └── prompt_builder.py       # Structured prompt construction
│   ├── crowd_engine/               # Simulator, predictor, wait times, TTL cache
│   ├── decision_engine/            # Zone scorer + Dijkstra router
│   ├── google_services/            # Firestore, BigQuery, Maps, Auth, Logging (all with mocks)
│   └── middleware/                 # Rate limiter
├── frontend/
│   ├── index.html                  # Landing page (glassmorphism hero)
│   ├── app.html                    # Main SPA dashboard (5 views)
│   ├── css/style.css               # Premium design system
│   └── js/app.js                   # Client logic, AI polling, enhanced SVG map
├── tests/                          # 366 tests, 94% coverage
├── .github/workflows/ci.yml       # GitHub Actions CI pipeline
├── Dockerfile                      # Multi-stage, non-root container
├── pyproject.toml                  # Modern Python project config
├── requirements.txt                # Pinned dependencies
├── .env.example                    # Environment template
└── README.md                       # You are here
```

---

## 🐳 Deployment

```bash
# Docker
docker build -t kinetic-stadium .
docker run -p 8000:8000 -e GEMINI_API_KEY=your-key kinetic-stadium

# Google Cloud Run
gcloud run deploy kinetic-stadium \
  --image gcr.io/PROJECT/kinetic-stadium \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your-key
```

---

## 🏆 Hackathon Highlights

- **5 Gemini AI integrations** — not just a chatbot, but crowd narration, food recommendations, exit planning, staff advising, and route explanation
- **Zero-dependency architecture** — runs completely offline with graceful AI fallbacks
- **Real-time simulation engine** — 13-zone crowd dynamics with trend prediction
- **Production-grade security** — CSP, HSTS, rate limiting, input validation, non-root Docker
- **366 automated tests** with 94% code coverage
- **Glassmorphism UI** with AR camera integration, voice commands, and gamification

---

## 👥 Team

Built for the hackathon by **Nitin Patidar** and team.

## 📜 License

MIT License — see [LICENSE](LICENSE) for details.
