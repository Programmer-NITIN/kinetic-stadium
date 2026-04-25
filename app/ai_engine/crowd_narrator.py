"""
ai_engine/crowd_narrator.py
-----------------------------
Gemini-powered real-time crowd intelligence narrator.

Generates natural language "stadium pulse" narratives from live telemetry,
like a sports commentator for crowd dynamics.
"""

import logging
from typing import Dict

from app.config import ZONE_REGISTRY
from app.ai_engine.gemini_caller import call_gemini, create_gemini_model
from app.crowd_engine.simulator import get_zone_density_map, _density_to_status
from app.crowd_engine.predictor import predict_all_zones

logger = logging.getLogger(__name__)

_model = create_gemini_model("CrowdNarrator")

_NARRATOR_SYSTEM = """You are the Kinetic Stadium AI — a smart, witty crowd intelligence narrator.
You analyze LIVE venue telemetry and produce a short, engaging narrative (3-4 sentences max).

Rules:
1. Reference specific zone names and exact density percentages.
2. Highlight the most important insight FIRST (busiest zone, sudden spike, or opportunity).
3. Give one actionable tip (best time to move, quietest route, food court window).
4. Use confident, energetic tone — like a savvy sports analyst.
5. Use 1-2 relevant emojis per response.
6. NEVER make up data — only use what's provided."""


def generate_crowd_narrative() -> str:
    """Generates a real-time AI narrative from live crowd data."""
    from datetime import datetime
    now = datetime.now()
    density_map = get_zone_density_map(now)
    predictions = predict_all_zones(now, density_map=density_map)

    # Build context
    lines = []
    hotspots = []
    quiet_zones = []
    for zone_id, density in density_map.items():
        zone = ZONE_REGISTRY.get(zone_id, {})
        name = zone.get("name", zone_id)
        status = _density_to_status(density)
        trend = predictions.get(zone_id, {}).get("trend", "STABLE")
        lines.append(f"- {name}: {density}% ({status}, trend: {trend})")
        if density >= 60:
            hotspots.append((name, density))
        if density < 25 and zone.get("type") in ("amenity", "gate"):
            quiet_zones.append((name, density))

    zone_summary = "\n".join(lines)
    hotspot_str = ", ".join(f"{n} ({d}%)" for n, d in hotspots) if hotspots else "None"
    quiet_str = ", ".join(f"{n} ({d}%)" for n, d in quiet_zones) if quiet_zones else "None"

    prompt = f"""{_NARRATOR_SYSTEM}

LIVE VENUE TELEMETRY ({now.strftime('%H:%M:%S')}):
{zone_summary}

HOTSPOTS: {hotspot_str}
OPPORTUNITY ZONES: {quiet_str}

Generate a 3-4 sentence stadium pulse narrative:"""

    def _fallback():
        if hotspots:
            top = hotspots[0]
            return (
                f"🔴 {top[0]} is running hot at {top[1]}% capacity. "
                f"{'The ' + quiet_zones[0][0] + ' is wide open at just ' + str(quiet_zones[0][1]) + '%.' if quiet_zones else 'All other zones are holding steady.'} "
                f"Head there now to beat the rush!"
            )
        return "🟢 All zones are flowing smoothly. Great time to grab food or visit the merch store!"

    return call_gemini(_model, prompt, _fallback, "CrowdNarrator")
