"""AI provider abstraction for CV parsing."""

import json
import logging
import re
from typing import Any, Protocol

from google import genai
from google.genai import types
from pydantic import ValidationError

from app.ai import prompts, schema
from app.config import settings
from app.schemas.cv import CVProfile

logger = logging.getLogger("cv_parser.ai")

_FENCE = re.compile(r"```(?:json)?\s*|\s*```")


class AIParsingError(Exception):
    """The AI request itself failed (network, auth, timeout, bad output)."""


class OutputValidationError(Exception):
    """The AI produced output that failed schema validation after repair."""

    def __init__(self, message: str, errors: str):
        self.errors = errors
        super().__init__(message)


def extract_json(raw: str) -> Any:
    """Robustly pull a JSON object out of an LLM response.

    Handles clean JSON, markdown code fences, and JSON embedded in
    surrounding prose (some models return explanatory text).
    Raises json.JSONDecodeError when nothing parseable is found.
    """
    text = _FENCE.sub("", (raw or "").strip()).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # Fall back to the outermost {...} block in the response.
    start, end = text.find("{"), text.rfind("}")
    if start != -1 and end > start:
        return json.loads(text[start : end + 1])
    raise json.JSONDecodeError("no JSON object found", text[:200], 0)


class CVParser(Protocol):
    async def parse(self, document_text: str) -> dict[str, Any]:
        """Return the raw parsed profile dict (not yet validated)."""
        ...


class GeminiCVParser:
    def __init__(self, api_key: str | None = None, model: str | None = None):
        self.model = model or settings.ai_model
        self.client = genai.Client(
            api_key=api_key or settings.ai_api_key,
            http_options=types.HttpOptions(
                timeout=settings.ai_timeout_seconds * 1000,
            ),
        )

    async def _complete(self, messages: list[dict[str, str]],
                        use_structured: bool) -> str:
        system_instruction = next(
            (message["content"] for message in messages
             if message["role"] == "system"),
            None,
        )
        contents = [
            types.Content(
                role="model" if message["role"] == "assistant" else "user",
                parts=[types.Part.from_text(text=message["content"])],
            )
            for message in messages
            if message["role"] != "system"
        ]
        config_kwargs: dict[str, Any] = {
            "temperature": 0,
            "system_instruction": system_instruction,
        }
        if use_structured:
            config_kwargs.update(
                response_mime_type="application/json",
                response_schema=schema.response_schema(),
            )
        history = contents[:-1]
        message = contents[-1].parts[0].text if contents else ""
        chat = self.client.aio.chats.create(
            model=self.model,
            history=history,
            config=types.GenerateContentConfig(**config_kwargs),
        )
        response = await chat.send_message(message)
        return response.text or ""

    async def parse(self, document_text: str) -> dict[str, Any]:
        """One primary call + limited retries + one repair attempt."""
        messages: list[dict[str, str]] = [
            {"role": "system", "content": prompts.SYSTEM_PROMPT},
            {"role": "user", "content": prompts.build_user_prompt(document_text)},
        ]

        use_structured = True
        last_error: Exception | None = None
        raw = ""
        for attempt in range(max(1, settings.ai_max_retries)):
            try:
                raw = await self._complete(messages, use_structured)
                data = extract_json(raw)
                self._quick_check(data)
                return data
            except (json.JSONDecodeError, ValueError) as exc:
                logger.warning(
                    "Unparseable AI output (len=%d): %.200s",
                    len(raw), raw,
                )
                last_error = exc
            except Exception as exc:
                # Retry without structured output if Gemini rejects its schema.
                if use_structured and any(
                    term in str(exc)
                    for term in ("response_schema", "response_mime_type")
                ):
                    use_structured = False
                    continue
                last_error = exc
                break

        raise AIParsingError(f"AI request failed: {last_error}")

    @staticmethod
    def _quick_check(data: Any) -> None:
        if not isinstance(data, dict):
            raise ValueError("AI output is not a JSON object")

    async def parse_and_validate(self, document_text: str) -> CVProfile:
        data = await self.parse(document_text)

        try:
            return CVProfile.model_validate(data)
        except ValidationError as exc:
            # One targeted repair attempt with validation errors fed back.
            try:
                messages = [
                    {"role": "system", "content": prompts.SYSTEM_PROMPT},
                    {"role": "user", "content": prompts.build_user_prompt(document_text)},
                    {"role": "assistant", "content": json.dumps(data)},
                    {"role": "user", "content": prompts.build_repair_prompt(exc.json())},
                ]
                raw = await self._complete(messages, use_structured=False)
                repaired = extract_json(raw)
                return CVProfile.model_validate(repaired)
            except Exception as repair_exc:
                logger.warning("Repair attempt failed: %s", type(repair_exc).__name__)
                raise OutputValidationError(
                    "Extracted profile failed schema validation",
                    exc.json(),
                ) from exc
