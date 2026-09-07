"""Builds the JSON Schema sent to the model for structured output."""

from typing import Any

from app.schemas.cv import CVProfile

# Keep the payload small: strip long free-text descriptions from the wire
# schema; the model can leave those fields null rather than guessing.
_JSON_SCHEMA_CACHE: dict[str, Any] | None = None


def cv_json_schema() -> dict[str, Any]:
    """JSON Schema for CVProfile, derived from the Pydantic model."""
    global _JSON_SCHEMA_CACHE
    if _JSON_SCHEMA_CACHE is None:
        _JSON_SCHEMA_CACHE = CVProfile.model_json_schema()
    return _JSON_SCHEMA_CACHE


def response_schema() -> dict[str, Any]:
    """JSON Schema accepted by Gemini structured output."""
    return cv_json_schema()
