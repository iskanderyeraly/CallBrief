"""Scrapes plain text from a URL using httpx and BeautifulSoup."""

import httpx
from bs4 import BeautifulSoup

# Browser-like headers to avoid 403s on news/IR sites
_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

# Tags that contain noise rather than article content
_NOISE_TAGS = ["script", "style", "nav", "header", "footer", "aside", "form", "iframe"]

# CSS class keywords that suggest main content containers
_CONTENT_KEYWORDS = ["article", "content", "transcript", "body", "post", "entry"]


def _find_container(soup: BeautifulSoup):
    """Return the most likely main content element from a parsed page."""
    # Prefer semantic article/main tags
    for tag in ("article", "main"):
        found = soup.find(tag)
        if found:
            return found

    # Look for divs/sections whose id or class suggests article content
    for attr in ("id", "class"):
        found = soup.find(
            ["div", "section"],
            attrs={attr: lambda v: v and any(
                kw in (" ".join(v) if isinstance(v, list) else v).lower()
                for kw in _CONTENT_KEYWORDS
            )},
        )
        if found:
            return found

    return soup.body


def scrape_url(url: str) -> str | None:
    """Fetch a URL and extract the main article text.

    Removes navigation, scripts, and boilerplate then joins all substantive
    paragraph blocks into a single string.

    Args:
        url: Fully-qualified URL to fetch (http/https).

    Returns:
        Cleaned text as a single string, or None if fetching or parsing fails.
    """
    try:
        with httpx.Client(timeout=20.0, follow_redirects=True) as client:
            response = client.get(url, headers=_HEADERS)
            response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # Strip noise tags before extracting text
        for tag in soup(_NOISE_TAGS):
            tag.decompose()

        container = _find_container(soup)
        if not container:
            return None

        # Collect paragraphs longer than 40 chars (filters menu links, labels, etc.)
        paragraphs = [
            p.get_text(separator=" ", strip=True)
            for p in container.find_all("p")
            if len(p.get_text(strip=True)) > 40
        ]

        if paragraphs:
            return "\n\n".join(paragraphs)

        # Fallback: dump all text from the container
        fallback = container.get_text(separator="\n", strip=True)
        return fallback if len(fallback) > 200 else None

    except Exception:
        return None
