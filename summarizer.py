"""Calls Claude API to extract structured data from an earnings call transcript."""

import json
import anthropic
from config import ANTHROPIC_API_KEY

_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

_SYSTEM_PROMPT = (
    "You are a professional financial analyst specializing in earnings call analysis. "
    "Extract structured information from earnings call transcripts with precision and objectivity."
)

_OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "company_name": {"type": "string"},
        "quarter": {"type": "string"},
        "date": {"type": "string"},
        "financial_highlights": {
            "type": "array",
            "items": {"type": "string"},
        },
        "key_positives": {
            "type": "array",
            "items": {"type": "string"},
        },
        "key_risks": {
            "type": "array",
            "items": {"type": "string"},
        },
        "forward_guidance": {"type": "string"},
        "notable_analyst_questions": {
            "type": "array",
            "items": {"type": "string"},
        },
        "sentiment": {"type": "string", "enum": ["Bullish", "Neutral", "Bearish"]},
        "management_confidence_score": {"type": "integer"},
        "guidance_direction": {
            "type": "string",
            "enum": ["Raised", "Maintained", "Lowered"],
        },
        "verdict": {"type": "string"},
    },
    "required": [
        "company_name",
        "quarter",
        "date",
        "financial_highlights",
        "key_positives",
        "key_risks",
        "forward_guidance",
        "notable_analyst_questions",
        "sentiment",
        "management_confidence_score",
        "guidance_direction",
        "verdict",
    ],
    "additionalProperties": False,
}


def summarize_transcript(transcript: str) -> dict:
    """Call Claude to extract structured summary data from an earnings transcript.

    Args:
        transcript: Raw text of the earnings call transcript.

    Returns:
        A dict with keys: company_name, quarter, date, financial_highlights,
        key_positives, key_risks, forward_guidance, notable_analyst_questions,
        sentiment (Bullish/Neutral/Bearish), management_confidence_score (1-10),
        guidance_direction (Raised/Maintained/Lowered), verdict.
    """
    user_prompt = (
        "Analyze the following earnings call transcript and extract the requested fields.\n\n"
        "Rules:\n"
        "- financial_highlights: 3-6 bullet-point figures (revenue, EPS, margins, etc.)\n"
        "- key_positives: 3-5 growth drivers or wins mentioned by management\n"
        "- key_risks: 3-5 headwinds, concerns, or risks mentioned\n"
        "- forward_guidance: 1-2 sentence summary of next quarter/year outlook\n"
        "- notable_analyst_questions: top 3 analyst questions asked\n"
        "- sentiment: overall tone of management (Bullish / Neutral / Bearish)\n"
        "- management_confidence_score: integer 1-10 based on tone and language\n"
        "- guidance_direction: whether guidance was Raised, Maintained, or Lowered\n"
        "- verdict: single sentence summarizing the key takeaway\n\n"
        f"TRANSCRIPT:\n{transcript}"
    )

    # Use streaming to guard against timeout on long transcripts
    with _client.messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        system=[
            {
                "type": "text",
                "text": _SYSTEM_PROMPT,
                # Cache the system prompt since it never changes
                "cache_control": {"type": "ephemeral"},
            }
        ],
        output_config={"format": {"type": "json_schema", "schema": _OUTPUT_SCHEMA}},
        messages=[{"role": "user", "content": user_prompt}],
    ) as stream:
        message = stream.get_final_message()

    text = next(b.text for b in message.content if b.type == "text")
    return json.loads(text)
