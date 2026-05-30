"""FastAPI backend for the earnings call summarizer."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel

from summarizer import summarize_transcript
from fetcher import fetch_transcript
from exporter import export_pdf
from scraper import scrape_url

app = FastAPI(title="Earnings Summarizer API")

# Allow all origins so the React frontend can connect during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TranscriptRequest(BaseModel):
    """Request body for /summarize."""

    transcript: str


class TickerRequest(BaseModel):
    """Request body for /fetch-transcript."""

    ticker: str


class UrlRequest(BaseModel):
    """Request body for /fetch-url."""

    url: str


class ExportRequest(BaseModel):
    """Request body for /export-pdf; accepts the summary dict as a JSON object."""

    summary: dict


@app.post("/summarize")
async def summarize(request: TranscriptRequest) -> dict:
    """Accept raw transcript text and return a structured earnings summary.

    Args:
        request: Contains the transcript text.

    Returns:
        Structured summary dict from Claude.
    """
    if not request.transcript.strip():
        raise HTTPException(status_code=400, detail="Transcript text cannot be empty.")
    try:
        return summarize_transcript(request.transcript)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/fetch-transcript")
async def fetch_transcript_route(request: TickerRequest) -> dict:
    """Fetch a transcript from Alpha Vantage and return it (or an error flag).

    Args:
        request: Contains the stock ticker symbol.

    Returns:
        {"transcript": <text>} on success, or {"transcript": None, "error": <msg>}.
    """
    if not request.ticker.strip():
        raise HTTPException(status_code=400, detail="Ticker symbol cannot be empty.")

    transcript = fetch_transcript(request.ticker)
    if transcript is None:
        return {
            "transcript": None,
            "error": (
                f"Could not fetch transcript for '{request.ticker}'. "
                "Please paste the transcript manually."
            ),
        }
    return {"transcript": transcript}


@app.post("/fetch-url")
async def fetch_url_route(request: UrlRequest) -> dict:
    """Scrape article text from a URL and return it as transcript text.

    Args:
        request: Contains the URL to scrape.

    Returns:
        {"transcript": <text>} on success, or {"transcript": None, "error": <msg>}.
    """
    if not request.url.strip():
        raise HTTPException(status_code=400, detail="URL cannot be empty.")
    transcript = scrape_url(request.url)
    if transcript is None:
        return {
            "transcript": None,
            "error": "Could not extract transcript from URL.",
        }
    return {"transcript": transcript}


@app.post("/export-pdf")
async def export_pdf_route(request: ExportRequest) -> Response:
    """Generate a PDF from a summary dict and return it as a binary download.

    Args:
        request: Contains the summary dict.

    Returns:
        PDF file as an octet-stream response.
    """
    if not request.summary:
        raise HTTPException(status_code=400, detail="Summary data cannot be empty.")
    try:
        pdf_bytes = export_pdf(request.summary)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": (
                    f"attachment; filename="
                    f"\"{request.summary.get('company_name', 'summary').replace(' ', '_')}_earnings.pdf\""
                )
            },
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
