"""Fetches an earnings call transcript from Alpha Vantage by ticker symbol."""

import httpx
from datetime import date
from config import ALPHA_VANTAGE_API_KEY

_BASE_URL = "https://www.alphavantage.co/query"


def _recent_quarters(n: int = 8) -> list[str]:
    """Return the last n calendar quarters in YYYY-Qn format, newest first."""
    today = date.today()
    year, month = today.year, today.month
    quarter = (month - 1) // 3 + 1
    quarters = []
    for _ in range(n):
        quarters.append(f"{year}Q{quarter}")
        quarter -= 1
        if quarter == 0:
            quarter = 4
            year -= 1
    return quarters


def _parse_segments(segments: list) -> str | None:
    parts = []
    for seg in segments:
        speaker = seg.get("speaker", "Unknown")
        title = seg.get("title", "")
        content = seg.get("content", "").strip()
        if content:
            label = f"{speaker} ({title})" if title else speaker
            parts.append(f"{label}: {content}")
    return "\n\n".join(parts) if parts else None


def fetch_transcript(ticker: str) -> str | None:
    """Retrieve the most recent earnings call transcript for a stock ticker.

    Tries the last 8 calendar quarters newest-first and returns the first
    non-empty transcript found.

    Args:
        ticker: Stock ticker symbol (e.g. 'AAPL', 'MSFT').

    Returns:
        The transcript text as a string, or None if unavailable.
    """
    try:
        with httpx.Client(timeout=30.0) as client:
            for quarter in _recent_quarters(8):
                params = {
                    "function": "EARNINGS_CALL_TRANSCRIPT",
                    "symbol": ticker.upper(),
                    "quarter": quarter,
                    "apikey": ALPHA_VANTAGE_API_KEY,
                }
                response = client.get(_BASE_URL, params=params)
                response.raise_for_status()
                data = response.json()

                if "Error Message" in data or "Note" in data:
                    return None

                segments = data.get("transcript")
                if segments and isinstance(segments, list) and len(segments) > 0:
                    return _parse_segments(segments)

        return None

    except Exception:
        return None
