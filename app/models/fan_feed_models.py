"""
fan_feed_models.py
------------------
Pydantic models for the Fan Feed & Live Info feature.

Covers live match statistics, instant replays, social venue buzz,
and post-match information (traffic, shuttles, promos).
"""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


# ── Live Match ───────────────────────────────────────────────────────────────

class MatchScore(BaseModel):
    """Current match score and timing."""
    team_a: str = "KNT"
    team_b: str = "AWY"
    score_a: int = 84
    score_b: int = 76
    period: str = "Q3"
    clock: str = "08:42"
    is_live: bool = True
    event_name: str = "Championship Finals"
    venue: str = "Kinetic Stadium"
    attendance: int = 64021


class MatchStat(BaseModel):
    """A single match statistic comparison."""
    label: str
    value_a: str
    value_b: str
    bar_pct_a: float = Field(0.5, ge=0, le=1)
    bar_pct_b: float = Field(0.5, ge=0, le=1)


class LiveMatchData(BaseModel):
    """Complete live match centre data."""
    score: MatchScore
    stats: list[MatchStat] = []
    ticker_text: str = ""


# ── Instant Replays ──────────────────────────────────────────────────────────

class ReplayEntry(BaseModel):
    """A single instant replay clip entry."""
    replay_id: str
    title: str
    period: str = "Q3"
    timestamp: str = "08:42"
    duration_seconds: int = 15
    thumbnail_emoji: str = "🏀"


# ── Venue Buzz (Social Feed) ────────────────────────────────────────────────

class BuzzPost(BaseModel):
    """A single social feed post in the Venue Buzz section."""
    post_id: str
    author: str
    handle: str
    section: Optional[str] = None
    time_ago: str = "2m ago"
    content: str
    is_official: bool = False
    avatar_letter: str = "U"
    avatar_color: str = "#0066ff"


# ── Post-Match Info ──────────────────────────────────────────────────────────

class TrafficAlert(BaseModel):
    """Traffic or transport alert for post-match exit."""
    alert_type: str = "traffic"
    title: str
    description: str
    severity: str = "warning"


class ShuttleInfo(BaseModel):
    """Express shuttle departure info."""
    destination: str
    departure_location: str
    next_departure_minutes: int
    frequency_minutes: int = 10


class PromoOffer(BaseModel):
    """Promotional offer for venue services."""
    title: str
    description: str
    emoji: str = "🎉"


class PostMatchInfo(BaseModel):
    """Aggregated post-match information."""
    traffic_alerts: list[TrafficAlert] = []
    shuttles: list[ShuttleInfo] = []
    promos: list[PromoOffer] = []


# ── Full Fan Feed Response ───────────────────────────────────────────────────

class FanFeedResponse(BaseModel):
    """Complete response for the Fan Feed & Live Info view."""
    match: LiveMatchData
    replays: list[ReplayEntry] = []
    buzz: list[BuzzPost] = []
    post_match: PostMatchInfo = PostMatchInfo()
