"""
concession_models.py
--------------------
Pydantic models for the Express Concessions feature.

Covers menu items, cart/order submission, and order status tracking.
"""

from __future__ import annotations

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


# ── Enums ────────────────────────────────────────────────────────────────────

class MenuCategory(str, Enum):
    """Menu categories displayed as filter tabs."""
    HOT_FOOD = "hot_food"
    DRINKS = "drinks"
    SNACKS = "snacks"
    MERCH_EXPRESS = "merch_express"


class OrderStatus(str, Enum):
    """Lifecycle status of a concession order."""
    CONFIRMED = "confirmed"
    PREPARING = "preparing"
    READY = "ready"
    PICKED_UP = "picked_up"


# ── Menu Models ──────────────────────────────────────────────────────────────

class MenuItem(BaseModel):
    """A single purchasable item on a concession menu."""
    item_id: str = Field(..., description="Unique item identifier")
    name: str = Field(..., max_length=100)
    description: str = Field("", max_length=300)
    price: float = Field(..., ge=0)
    calories: int = Field(0, ge=0)
    category: MenuCategory
    image_emoji: str = Field("🍔", description="Emoji representation of the item")
    available: bool = True


class ConcessionStation(BaseModel):
    """A food/drink/merch station inside the venue."""
    station_id: str
    name: str
    section: str = Field(..., description="Venue section, e.g. 'Section 110'")
    walk_minutes: int = Field(0, ge=0, description="Est. walk time from user seat")
    prep_time_minutes: str = Field("4-7", description="Current estimated prep time range")
    items: list[MenuItem] = []


class MenuResponse(BaseModel):
    """Full menu response grouped by stations."""
    stations: list[ConcessionStation]
    live_prep_time: str = Field("4-7 mins", description="Global live prep time badge")


# ── Order Models ─────────────────────────────────────────────────────────────

class OrderItem(BaseModel):
    """A single item in an order with quantity and customisation."""
    item_id: str
    name: str
    quantity: int = Field(1, ge=1, le=10)
    unit_price: float
    customisation: str = Field("", max_length=200)


class OrderRequest(BaseModel):
    """Request body for placing a new concession order."""
    user_id: str = Field(..., max_length=100)
    station_id: str
    items: list[OrderItem] = Field(..., min_length=1)


class OrderResponse(BaseModel):
    """Response after placing an order."""
    order_id: str
    status: OrderStatus = OrderStatus.CONFIRMED
    items: list[OrderItem]
    subtotal: float
    tax: float
    total: float
    station_name: str
    estimated_ready_minutes: int = 5
    pickup_code: str = Field(..., description="Short code for pickup, e.g. '#A942'")


class OrderStatusResponse(BaseModel):
    """Response for checking order status."""
    order_id: str
    status: OrderStatus
    station_name: str
    pickup_code: str
    items: list[OrderItem]
    total: float
    estimated_ready_minutes: Optional[int] = None
    message: str = ""
