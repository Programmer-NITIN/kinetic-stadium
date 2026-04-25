"""
ai_engine/food_recommender.py
-------------------------------
Gemini-powered personalized food recommendation engine.

Analyzes crowd density at food stations, wait times, menu options,
and generates context-aware "Chef's Pick" recommendations.
"""

import logging
from typing import Dict, List

from app.config import ZONE_REGISTRY
from app.ai_engine.gemini_caller import call_gemini, create_gemini_model
from app.crowd_engine.simulator import get_zone_density_map

logger = logging.getLogger(__name__)

_model = create_gemini_model("FoodRecommender")

_FOOD_SYSTEM = """You are the Kinetic Stadium AI Food Concierge.
Analyze the fan's context and recommend the BEST food option.

Rules:
1. Consider wait times, crowd density, and distance.
2. Recommend a specific item with its price.
3. Explain WHY this is the best choice right now (speed, value, proximity).
4. Keep it to 2-3 sentences max.
5. Use 1-2 food emojis.
6. Be enthusiastic but practical."""


def generate_food_recommendation(menu_data: dict) -> dict:
    """Generates a personalized AI food recommendation.

    Returns dict with 'recommendation' text and metadata.
    """
    from datetime import datetime
    now = datetime.now()
    density_map = get_zone_density_map(now)

    # Build station context
    station_lines = []
    best_station = None
    best_density = 100

    for station in menu_data.get("stations", []):
        sid = station.get("station_id", "")
        name = station.get("name", sid)
        walk_min = station.get("walk_minutes", 5)
        items_str = ", ".join(
            f"{i['name']} (${i['price']:.2f})"
            for i in station.get("items", [])[:3]
        )
        # Estimate density near food court
        fc_density = density_map.get("FC", 30)
        station_lines.append(
            f"- {name}: {walk_min} min walk, items: {items_str}"
        )
        if fc_density < best_density:
            best_density = fc_density
            best_station = station

    station_summary = "\n".join(station_lines)
    fc_density = density_map.get("FC", 30)

    prompt = f"""{_FOOD_SYSTEM}

CURRENT TIME: {now.strftime('%H:%M')}
FOOD COURT DENSITY: {fc_density}% capacity

AVAILABLE STATIONS:
{station_summary}

Generate a personalized food recommendation:"""

    def _fallback():
        if best_station and best_station.get("items"):
            item = best_station["items"][0]
            return (
                f"🍕 Quick pick: {item['name']} (${item['price']:.2f}) from "
                f"{best_station['name']}. Food court is at {fc_density}% — "
                f"{'great time to grab a bite!' if fc_density < 40 else 'move quick before it fills up!'}"
            )
        return "🍔 Head to any food station — lines are short right now!"

    recommendation = call_gemini(_model, prompt, _fallback, "FoodRecommender")

    return {
        "recommendation": recommendation,
        "food_court_density": fc_density,
        "best_station": best_station.get("name", "Food Court") if best_station else "Food Court",
    }
