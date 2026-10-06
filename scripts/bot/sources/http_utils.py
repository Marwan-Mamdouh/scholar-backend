"""
Shared HTTP helpers with session reuse, timeouts, and error handling.
"""

import logging
from curl_cffi import requests
from config import REQUEST_TIMEOUT

log = logging.getLogger(__name__)

_session = requests.Session(impersonate="chrome")


def get_json(url: str, params: dict = None, headers: dict = None,
             timeout: int = REQUEST_TIMEOUT) -> dict | list | None:
    """GET request returning parsed JSON, or None on error."""
    try:
        resp = _session.get(url, params=params, headers=headers, timeout=timeout)
        resp.raise_for_status()
        return resp.json()
    except requests.errors.RequestsError as e:
        log.warning(f"GET {url} failed: {e}")
        return None
    except ValueError as e:
        log.warning(f"JSON parse error for {url}: {e}")
        return None


def post_json(url: str, payload: dict = None, headers: dict = None,
              timeout: int = REQUEST_TIMEOUT) -> dict | list | None:
    """POST request with JSON body, returning parsed JSON or None."""
    try:
        resp = _session.post(url, json=payload, headers=headers, timeout=timeout)
        resp.raise_for_status()
        return resp.json()
    except requests.errors.RequestsError as e:
        log.warning(f"POST {url} failed: {e}")
        return None
    except ValueError as e:
        log.warning(f"JSON parse error for {url}: {e}")
        return None


def get_text(url: str, params: dict = None, headers: dict = None,
             timeout: int = REQUEST_TIMEOUT) -> str | None:
    """GET request returning raw text, or None on error."""
    try:
        resp = _session.get(url, params=params, headers=headers, timeout=timeout)
        resp.raise_for_status()
        return resp.text
    except requests.errors.RequestsError as e:
        log.warning(f"GET text {url} failed: {e}")
        return None
