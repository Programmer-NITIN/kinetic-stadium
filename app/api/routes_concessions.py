"""
routes_concessions.py
---------------------
Express Concessions API — order-ahead food, drinks, snacks, and merch.

Endpoints:
  GET  /concessions/menu           — Full menu with live prep times
  POST /concessions/order          — Place a new order
  GET  /concessions/order/{id}     — Check order status
"""

from __future__ import annotations

import random
import string
import time
from typing import Dict

from fastapi import APIRouter, HTTPException

from app.models.concession_models import (
    ConcessionStation,
    MenuCategory,
    MenuItem,
    MenuResponse,
    OrderItem,
    OrderRequest,
    OrderResponse,
    OrderStatus,
    OrderStatusResponse,
)

router = APIRouter(prefix="/concessions", tags=["Concessions"])

# ── In-memory order store (demo) ─────────────────────────────────────────────
_orders: Dict[str, dict] = {}


# ── Mock Menu Data ───────────────────────────────────────────────────────────
def _build_menu() -> list[ConcessionStation]:
    """Returns the full concession menu with realistic items."""
    return [
        ConcessionStation(
            station_id="grill-alpha",
            name="Grill Station Alpha",
            section="Section 110",
            walk_minutes=2,
            prep_time_minutes="4-7",
            items=[
                MenuItem(
                    item_id="burger-classic",
                    name="Kinetic Classic Burger",
                    description="Double smash patty, house sauce, brioche.",
                    price=14.00,
                    calories=850,
                    category=MenuCategory.HOT_FOOD,
                    image_emoji="🍔",
                ),
                MenuItem(
                    item_id="fries-hv",
                    name="High-Voltage Fries",
                    description="Crispy fries, cheese sauce, bacon bits.",
                    price=9.00,
                    calories=1120,
                    category=MenuCategory.HOT_FOOD,
                    image_emoji="🍟",
                ),
                MenuItem(
                    item_id="hotdog-stadium",
                    name="Stadium Dog",
                    description="All-beef frank, relish, mustard, onions.",
                    price=10.00,
                    calories=680,
                    category=MenuCategory.HOT_FOOD,
                    image_emoji="🌭",
                ),
                MenuItem(
                    item_id="chicken-tenders",
                    name="MVP Chicken Tenders",
                    description="Hand-breaded tenders, honey mustard dip.",
                    price=12.00,
                    calories=720,
                    category=MenuCategory.HOT_FOOD,
                    image_emoji="🍗",
                ),
            ],
        ),
        ConcessionStation(
            station_id="drinks-central",
            name="Drinks Central",
            section="Section 108",
            walk_minutes=3,
            prep_time_minutes="2-4",
            items=[
                MenuItem(
                    item_id="soda-lg",
                    name="Large Draft Soda",
                    description="Coca-Cola, Sprite, or Fanta. 32oz.",
                    price=6.00,
                    calories=380,
                    category=MenuCategory.DRINKS,
                    image_emoji="🥤",
                ),
                MenuItem(
                    item_id="beer-craft",
                    name="Craft IPA Draft",
                    description="Local craft IPA, 16oz pour.",
                    price=12.00,
                    calories=210,
                    category=MenuCategory.DRINKS,
                    image_emoji="🍺",
                ),
                MenuItem(
                    item_id="water-bottle",
                    name="Premium Water",
                    description="Chilled spring water, 500ml.",
                    price=4.00,
                    calories=0,
                    category=MenuCategory.DRINKS,
                    image_emoji="💧",
                ),
                MenuItem(
                    item_id="energy-drink",
                    name="Surge Energy",
                    description="High-caffeine energy drink, 16oz.",
                    price=7.00,
                    calories=160,
                    category=MenuCategory.DRINKS,
                    image_emoji="⚡",
                ),
            ],
        ),
        ConcessionStation(
            station_id="snacks-corner",
            name="Snack Attack Corner",
            section="Section 112",
            walk_minutes=1,
            prep_time_minutes="1-3",
            items=[
                MenuItem(
                    item_id="nachos-loaded",
                    name="Loaded Nachos",
                    description="Tortilla chips, queso, jalapeños, sour cream.",
                    price=11.00,
                    calories=960,
                    category=MenuCategory.SNACKS,
                    image_emoji="🧀",
                ),
                MenuItem(
                    item_id="popcorn-lg",
                    name="Jumbo Popcorn",
                    description="Butter-drizzled movie-style popcorn.",
                    price=8.00,
                    calories=580,
                    category=MenuCategory.SNACKS,
                    image_emoji="🍿",
                ),
                MenuItem(
                    item_id="pretzel-soft",
                    name="Soft Pretzel",
                    description="Warm salt pretzel with cheese dip.",
                    price=7.00,
                    calories=440,
                    category=MenuCategory.SNACKS,
                    image_emoji="🥨",
                ),
            ],
        ),
        ConcessionStation(
            station_id="merch-express",
            name="Merch Express Kiosk",
            section="Section 106",
            walk_minutes=4,
            prep_time_minutes="1-2",
            items=[
                MenuItem(
                    item_id="jersey-home",
                    name="Home Jersey 2026",
                    description="Official home team jersey, all sizes.",
                    price=89.00,
                    calories=0,
                    category=MenuCategory.MERCH_EXPRESS,
                    image_emoji="👕",
                ),
                MenuItem(
                    item_id="cap-team",
                    name="Team Snapback Cap",
                    description="Adjustable snapback, embroidered logo.",
                    price=34.00,
                    calories=0,
                    category=MenuCategory.MERCH_EXPRESS,
                    image_emoji="🧢",
                ),
                MenuItem(
                    item_id="scarf-fan",
                    name="Fan Scarf",
                    description="Knit scarf with team colors and logo.",
                    price=24.00,
                    calories=0,
                    category=MenuCategory.MERCH_EXPRESS,
                    image_emoji="🧣",
                ),
            ],
        ),
    ]


def _generate_pickup_code() -> str:
    """Generate a short pickup code like #A942."""
    letter = random.choice(string.ascii_uppercase)
    digits = "".join(random.choices(string.digits, k=3))
    return f"#{letter}{digits}"


# ── Endpoints ────────────────────────────────────────────────────────────────

@router.get("/menu", response_model=MenuResponse)
async def get_menu():
    """Returns the full concession menu with live prep time estimates."""
    stations = _build_menu()
    # Simulate varying prep times
    prep_min = random.randint(3, 5)
    prep_max = prep_min + random.randint(2, 4)
    return MenuResponse(
        stations=stations,
        live_prep_time=f"{prep_min}-{prep_max} mins",
    )


@router.get("/ai-recommend")
async def get_ai_recommendation():
    """Returns a Gemini-powered personalized food recommendation.

    Analyzes crowd density, wait times, and menu to suggest the optimal order.
    """
    from app.ai_engine.food_recommender import generate_food_recommendation
    stations = _build_menu()
    menu_data = {
        "stations": [
            {
                "station_id": s.station_id,
                "name": s.name,
                "walk_minutes": s.walk_minutes,
                "items": [
                    {"name": i.name, "price": i.price, "description": i.description}
                    for i in s.items
                ],
            }
            for s in stations
        ]
    }
    result = generate_food_recommendation(menu_data)
    return result


@router.post("/order", response_model=OrderResponse)
async def place_order(req: OrderRequest):
    """Place a new concession order and receive a pickup code."""
    stations = {s.station_id: s for s in _build_menu()}
    station = stations.get(req.station_id)
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")

    valid_ids = {item.item_id for item in station.items}
    for oi in req.items:
        if oi.item_id not in valid_ids:
            raise HTTPException(
                status_code=400,
                detail=f"Item '{oi.item_id}' not found at station '{req.station_id}'",
            )

    subtotal = sum(i.unit_price * i.quantity for i in req.items)
    tax = round(subtotal * 0.08, 2)
    total = round(subtotal + tax, 2)
    pickup_code = _generate_pickup_code()
    order_id = f"ORD-{int(time.time())}-{random.randint(100,999)}"

    order_data = {
        "order_id": order_id,
        "status": OrderStatus.CONFIRMED,
        "items": req.items,
        "subtotal": subtotal,
        "tax": tax,
        "total": total,
        "station_name": station.name,
        "estimated_ready_minutes": random.randint(4, 8),
        "pickup_code": pickup_code,
        "created_at": time.time(),
    }
    _orders[order_id] = order_data

    return OrderResponse(**order_data)


@router.get("/order/{order_id}", response_model=OrderStatusResponse)
async def get_order_status(order_id: str):
    """Check the status of an existing order."""
    order = _orders.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Simulate order progression based on time elapsed
    elapsed = time.time() - order["created_at"]
    if elapsed > 300:
        status = OrderStatus.PICKED_UP
        msg = "Order has been picked up. Enjoy!"
        eta = None
    elif elapsed > 180:
        status = OrderStatus.READY
        msg = f"Your order is READY! Pick up at {order['station_name']}. Code: {order['pickup_code']}"
        eta = 0
    elif elapsed > 60:
        status = OrderStatus.PREPARING
        remaining = max(1, int((180 - elapsed) / 60))
        msg = f"Being prepared now. ~{remaining} min remaining."
        eta = remaining
    else:
        status = OrderStatus.CONFIRMED
        msg = "Order confirmed! Preparation starting shortly."
        eta = order["estimated_ready_minutes"]

    return OrderStatusResponse(
        order_id=order["order_id"],
        status=status,
        station_name=order["station_name"],
        pickup_code=order["pickup_code"],
        items=order["items"],
        total=order["total"],
        estimated_ready_minutes=eta,
        message=msg,
    )
