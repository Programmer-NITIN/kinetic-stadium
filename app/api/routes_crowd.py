"""
api/routes_crowd.py
-------------------
Endpoints for live crowd density, predictions, service wait times,
and Gemini-powered AI crowd intelligence.
"""

from datetime import datetime
from fastapi import APIRouter, HTTPException, Query

from app.config import ZONE_REGISTRY
from app.crowd_engine.simulator import get_zone_density_map, get_zone_crowd_detail
from app.crowd_engine.predictor import predict_zone_density, PredictContext, predict_all_zones
from app.crowd_engine.wait_times import (
    calculate_service_wait_time,
    determine_wait_trend,
    get_wait_status,
)
from app.ai_engine.crowd_narrator import generate_crowd_narrative
from app.ai_engine.gemini_caller import call_gemini, create_gemini_model
from app.models.crowd_models import (
    CrowdStatusResponse,
    CrowdPredictionResponse,
    WaitTimeResponse,
    ServiceWaitTime,
)

router = APIRouter()

_egress_model = create_gemini_model("EgressAdvisor")


@router.get(
    "/crowd/status",
    response_model=CrowdStatusResponse,
    summary="Live crowd density for all zones",
)
async def get_crowd_status():
    """Returns current density readings for every zone in the venue.

    Data refreshes every 2 seconds via the simulation engine.
    """
    now = datetime.now()
    density_map = get_zone_density_map(now)
    zones = [
        get_zone_crowd_detail(zone_id, density_map)
        for zone_id in ZONE_REGISTRY
    ]
    return CrowdStatusResponse(timestamp=now, zones=zones)


@router.get(
    "/crowd/predict",
    response_model=CrowdPredictionResponse,
    summary="30-minute density prediction for a zone",
)
async def get_crowd_prediction(
    zone_id: str = Query(..., max_length=32, description="Zone ID to predict"),
    inflow_rate: float = Query(0.0, ge=0, le=100),
    outflow_rate: float = Query(0.0, ge=0, le=100),
    event_phase: str = Query("live", description="Current event phase"),
):
    """Predicts where crowd density is heading for a specific zone.

    Combines time-of-day peak analysis, manual flow overrides, and event
    phase surges into a single predicted density value.
    """
    if zone_id not in ZONE_REGISTRY:
        raise HTTPException(status_code=404, detail=f"Zone '{zone_id}' not found.")

    density_map = get_zone_density_map()
    ctx = PredictContext(
        inflow_rate=inflow_rate,
        outflow_rate=outflow_rate,
        event_phase=event_phase,
    )
    result = predict_zone_density(
        zone_id,
        density_map[zone_id],
        ctx
    )
    return CrowdPredictionResponse(**result)


@router.get(
    "/crowd/wait-times",
    response_model=WaitTimeResponse,
    summary="Service availability and estimated wait times",
)
async def get_wait_times():
    """Returns estimated wait times for all service zones (gates, food, restrooms, etc.)."""
    now = datetime.now()
    density_map = get_zone_density_map(now)
    predictions = predict_all_zones(now, density_map=density_map)

    services = []
    service_types = {"gate", "amenity", "restroom", "medical"}
    for zone_id, zone_data in ZONE_REGISTRY.items():
        if zone_data.get("type") not in service_types:
            continue
        density = density_map[zone_id]
        wait = calculate_service_wait_time(zone_id, zone_data, density)
        trend = determine_wait_trend(density, predictions.get(zone_id, {}))
        status = get_wait_status(wait)
        services.append(
            ServiceWaitTime(
                zone_id=zone_id,
                name=zone_data["name"],
                wait_minutes=wait,
                trend=trend,
                status=status,
            )
        )

    return WaitTimeResponse(timestamp=now, services=services)


@router.get(
    "/crowd/promotions",
    summary="Dynamic crowd-shaping promotions",
)
async def get_crowd_promotions():
    """Returns dynamic incentive offers based on real-time density differentials.

    The Crowd-Shaping engine detects high-density zones and generates
    time-limited promotions to redistribute fans toward low-density areas.
    """
    import random as _rand
    now = datetime.now()
    density_map = get_zone_density_map(now)

    # Find zones with capacity headroom
    promotions = []
    promo_templates = [
        {"type": "discount", "icon": "local_offer", "color": "#22c55e"},
        {"type": "upgrade", "icon": "upgrade", "color": "#0066ff"},
        {"type": "fastpass", "icon": "bolt", "color": "#f59e0b"},
    ]

    for zone_id, zone_data in ZONE_REGISTRY.items():
        density = density_map.get(zone_id, 50)
        if density < 30 and zone_data.get("type") in ("amenity", "gate"):
            tpl = _rand.choice(promo_templates)
            if tpl["type"] == "discount":
                promotions.append({
                    "zone_id": zone_id,
                    "zone_name": zone_data["name"],
                    "promo_type": "discount",
                    "headline": f"🔥 20% OFF at {zone_data['name']}!",
                    "detail": f"Low crowd right now ({int(density)}% full). Offer expires in {_rand.randint(8,15)} minutes.",
                    "icon": tpl["icon"],
                    "color": tpl["color"],
                    "density_pct": int(density),
                })
            elif tpl["type"] == "upgrade":
                promotions.append({
                    "zone_id": zone_id,
                    "zone_name": zone_data["name"],
                    "promo_type": "upgrade",
                    "headline": f"⬆️ Free Upgrade — move to {zone_data['name']}!",
                    "detail": f"This area is only {int(density)}% occupied. Skip the crowd!",
                    "icon": tpl["icon"],
                    "color": tpl["color"],
                    "density_pct": int(density),
                })
            else:
                promotions.append({
                    "zone_id": zone_id,
                    "zone_name": zone_data["name"],
                    "promo_type": "fastpass",
                    "headline": f"⚡ Fast Pass — {zone_data['name']} express lane open!",
                    "detail": f"Only {int(density)}% capacity. Walk right through, zero wait.",
                    "icon": tpl["icon"],
                    "color": tpl["color"],
                    "density_pct": int(density),
                })

    # Always provide at least one promo for demo purposes
    if not promotions:
        promotions.append({
            "zone_id": "MS",
            "zone_name": "Merchandise Store",
            "promo_type": "discount",
            "headline": "🔥 15% OFF Merch Store — Beat the Rush!",
            "detail": "Low crowd at the Merchandise Store. Grab your gear now!",
            "icon": "local_offer",
            "color": "#22c55e",
            "density_pct": 22,
        })

    return {"timestamp": now.isoformat(), "promotions": promotions[:3]}


@router.get(
    "/crowd/ai-insights",
    summary="Gemini-powered real-time crowd intelligence narrative",
)
async def get_ai_insights():
    """Returns a Gemini-generated natural language narrative about current crowd conditions.

    The AI Crowd Narrator analyzes all zone telemetry and produces an engaging,
    actionable stadium pulse commentary — like a sports analyst for crowd dynamics.
    """
    narrative = generate_crowd_narrative()
    return {"narrative": narrative, "timestamp": datetime.now().isoformat()}


@router.get(
    "/crowd/egress",
    summary="Smart egress prediction with AI-powered exit strategy",
)
async def get_egress_prediction():
    """Returns predicted exit wait times, gate recommendations, and a
    Gemini-generated personalized exit strategy.
    """
    import random as _rand
    now = datetime.now()
    density_map = get_zone_density_map(now)

    gates = []
    for zone_id, zone_data in ZONE_REGISTRY.items():
        if zone_data.get("type") != "gate":
            continue
        density = density_map.get(zone_id, 50)
        base_wait = int(density * 0.6) + _rand.randint(2, 8)
        peak_delay = _rand.randint(15, 40)
        gates.append({
            "gate_id": zone_id,
            "gate_name": zone_data["name"],
            "current_density_pct": int(density),
            "exit_wait_now_minutes": base_wait,
            "exit_wait_peak_minutes": base_wait + peak_delay,
            "recommendation": "Leave now" if density < 40 else "Wait 15 min" if density < 70 else "Heavy congestion — wait 25+ min",
            "transport_tips": {
                "transit": f"Churchgate Station: {max(5, base_wait - 5)} min walk. Train every 8 min.",
                "rideshare": f"Pickup Zone {zone_id}: estimated surge {1.2 + density / 100:.1f}x",
                "car": f"D-Road Parking: {base_wait + _rand.randint(5, 15)} min to exit structure",
            },
        })

    best_gate = min(gates, key=lambda g: g["exit_wait_now_minutes"])

    # Gemini AI exit strategy
    gate_summary = "\n".join(
        f"- {g['gate_name']}: {g['current_density_pct']}% density, {g['exit_wait_now_minutes']} min wait"
        for g in gates
    )
    egress_prompt = f"""You are the Kinetic Stadium Smart Exit Advisor.
The match just ended. Analyze gate congestion and give a personalized exit strategy.

Rules:
1. Be direct and specific — name exact gates and corridors.
2. Compare options with numbers.
3. Include a time-saving estimate.
4. Max 3 sentences.
5. Use 1-2 emojis.

LIVE GATE DATA:
{gate_summary}

BEST GATE: {best_gate['gate_name']} ({best_gate['exit_wait_now_minutes']} min wait)

Generate exit strategy:"""

    def _egress_fallback():
        return (
            f"🚶 Head to {best_gate['gate_name']} — it's the fastest exit at "
            f"{best_gate['exit_wait_now_minutes']} min. Avoid the main gates "
            f"for at least 15 minutes to skip the peak rush."
        )

    ai_strategy = call_gemini(_egress_model, egress_prompt, _egress_fallback, "EgressAdvisor")

    return {
        "timestamp": now.isoformat(),
        "match_status": "Final Whistle — Match Over",
        "gates": gates,
        "ai_strategy": ai_strategy,
        "recommendation": {
            "best_gate": best_gate["gate_name"],
            "best_wait": best_gate["exit_wait_now_minutes"],
            "advice": f"Exit via {best_gate['gate_name']} now for the shortest wait ({best_gate['exit_wait_now_minutes']} min). Delay of 15 minutes will add ~{_rand.randint(12, 25)} minutes.",
        },
    }
