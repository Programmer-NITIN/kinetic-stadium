"""
routes_fan_feed.py
------------------
Fan Feed & Live Info API — real-time match data, replays, social buzz.

Endpoints:
  GET /fan-feed/live — Complete fan feed with match data, replays, buzz, post-match info
"""

from __future__ import annotations

import random

from fastapi import APIRouter

from app.models.fan_feed_models import (
    BuzzPost,
    FanFeedResponse,
    LiveMatchData,
    MatchScore,
    MatchStat,
    PostMatchInfo,
    PromoOffer,
    ReplayEntry,
    ShuttleInfo,
    TrafficAlert,
)

router = APIRouter(prefix="/fan-feed", tags=["Fan Feed"])


def _generate_match_data() -> LiveMatchData:
    """Generate simulated live match data with slight variations each call."""
    base_a = 84 + random.randint(-2, 3)
    base_b = 76 + random.randint(-2, 3)
    minutes = random.randint(0, 11)
    seconds = random.randint(0, 59)
    periods = ["Q1", "Q2", "Q3", "Q4"]
    period = random.choice(periods[1:])  # Bias toward later periods

    possession_a = random.randint(55, 68)
    possession_b = 100 - possession_a

    shots_a = random.randint(12, 18)
    shots_b = random.randint(6, 12)

    pass_a = random.randint(82, 92)
    pass_b = random.randint(68, 80)

    return LiveMatchData(
        score=MatchScore(
            team_a="KNT",
            team_b="AWY",
            score_a=base_a,
            score_b=base_b,
            period=period,
            clock=f"{minutes:02d}:{seconds:02d}",
            is_live=True,
            event_name="Championship Finals",
            venue="Kinetic Stadium",
            attendance=64021,
        ),
        stats=[
            MatchStat(
                label="Possession",
                value_a=f"{possession_a}%",
                value_b=f"{possession_b}%",
                bar_pct_a=possession_a / 100,
                bar_pct_b=possession_b / 100,
            ),
            MatchStat(
                label="Shots on Goal",
                value_a=str(shots_a),
                value_b=str(shots_b),
                bar_pct_a=shots_a / (shots_a + shots_b),
                bar_pct_b=shots_b / (shots_a + shots_b),
            ),
            MatchStat(
                label="Pass Accuracy",
                value_a=f"{pass_a}%",
                value_b=f"{pass_b}%",
                bar_pct_a=pass_a / 100,
                bar_pct_b=pass_b / 100,
            ),
        ],
        ticker_text=(
            f"LIVE {period} {minutes:02d}:{seconds:02d} | "
            f"KNT {base_a} - {base_b} AWY  •  "
            f"POSSESSION: KNT {possession_a}%  •  "
            f"TIMEOUTS: KNT 2 - 3 AWY  •  "
            f"FOULS: KNT 8 - 11 AWY"
        ),
    )


def _generate_replays() -> list[ReplayEntry]:
    """Return a list of simulated instant replay entries."""
    return [
        ReplayEntry(
            replay_id="rpl-001",
            title="Incredible three-point shot from half court",
            period="Q3",
            timestamp="08:42",
            duration_seconds=15,
            thumbnail_emoji="🏀",
        ),
        ReplayEntry(
            replay_id="rpl-002",
            title="Defensive stop leads to fast break score",
            period="Q2",
            timestamp="14:12",
            duration_seconds=24,
            thumbnail_emoji="⚡",
        ),
        ReplayEntry(
            replay_id="rpl-003",
            title="Massive slam dunk ignites crowd eruption",
            period="Q3",
            timestamp="05:33",
            duration_seconds=12,
            thumbnail_emoji="🔥",
        ),
        ReplayEntry(
            replay_id="rpl-004",
            title="Contested buzzer-beater at the half",
            period="Q2",
            timestamp="00:02",
            duration_seconds=18,
            thumbnail_emoji="🎯",
        ),
    ]


def _generate_buzz() -> list[BuzzPost]:
    """Return simulated social buzz posts."""
    return [
        BuzzPost(
            post_id="bz-001",
            author="Kinetic Stadium",
            handle="@KineticStadium",
            time_ago="2m ago",
            content="Halftime show starting in 5 minutes! Grab your snacks and return to your seats. 🎪✨",
            is_official=True,
            avatar_letter="KS",
            avatar_color="#0066ff",
        ),
        BuzzPost(
            post_id="bz-002",
            author="Sarah K",
            handle="@SarahK_Sports",
            section="Sec 204",
            time_ago="12m ago",
            content="The energy in here is UNREAL tonight! Let's go KNT! 🔥🔥",
            is_official=False,
            avatar_letter="S",
            avatar_color="#ff5e07",
        ),
        BuzzPost(
            post_id="bz-003",
            author="Mike The Fan",
            handle="@MikeTheFan",
            section="Sec 112",
            time_ago="18m ago",
            content="That last play was insane. Worth the ticket price alone.",
            is_official=False,
            avatar_letter="M",
            avatar_color="#00dbe9",
        ),
        BuzzPost(
            post_id="bz-004",
            author="Sports Central",
            handle="@SportsCentral",
            time_ago="25m ago",
            content="KNT leads by 8 heading into the fourth. This crowd is electric! 📊⚡",
            is_official=False,
            avatar_letter="SC",
            avatar_color="#b3c5ff",
        ),
    ]


def _generate_post_match() -> PostMatchInfo:
    """Return simulated post-match information."""
    return PostMatchInfo(
        traffic_alerts=[
            TrafficAlert(
                alert_type="traffic",
                title="TRAFFIC ALERT",
                description="Heavy congestion expected on I-95 North exit. Consider alternate route via Main St.",
                severity="warning",
            ),
        ],
        shuttles=[
            ShuttleInfo(
                destination="Downtown Transit Hub",
                departure_location="Gate B",
                next_departure_minutes=10,
                frequency_minutes=8,
            ),
            ShuttleInfo(
                destination="Parking Lot D",
                departure_location="Gate E",
                next_departure_minutes=5,
                frequency_minutes=5,
            ),
        ],
        promos=[
            PromoOffer(
                title="HAPPY HOUR",
                description="50% off drinks at The Draft",
                emoji="🍹",
            ),
        ],
    )


@router.get("/live", response_model=FanFeedResponse)
async def get_fan_feed():
    """Returns complete fan feed: live match, replays, buzz, post-match info."""
    return FanFeedResponse(
        match=_generate_match_data(),
        replays=_generate_replays(),
        buzz=_generate_buzz(),
        post_match=_generate_post_match(),
    )
