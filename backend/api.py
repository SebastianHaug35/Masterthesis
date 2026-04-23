from __future__ import annotations

import json
import time
from typing import Any, Dict, Iterable, List
from uuid import uuid4

from flask import Flask, Response, jsonify, request, stream_with_context

from buddy_proxy import BuddyProxy
from session_store import ChatSession, store

MAX_CONTEXT_CHARS_PER_FILE = 12000
OPENAI_MODEL_ID = "buddy-openclaw"
OPENAI_MODEL_DESCRIPTION = "Buddy proxy orchestrating OpenClaw and remote n8n workflow generation."

app = Flask(__name__)


def _session_to_dict(session: ChatSession) -> Dict[str, Any]:
    return {
        "session_id": session.session_id,
        "status": session.status,
        "messages": [{"role": msg.role, "content": msg.content} for msg in session.messages],
        "context_docs": [{"name": doc.name, "content": doc.content} for doc in session.context_docs],
        "last_trace": session.last_trace,
    }


def _get_session_or_404(session_id: str) -> ChatSession:
    session = store.get_session(session_id)
    if session is None:
        raise KeyError("Session nicht gefunden.")
    return session


def _truncate_context(content: str) -> str:
    if len(content) <= MAX_CONTEXT_CHARS_PER_FILE:
        return content
    return content[:MAX_CONTEXT_CHARS_PER_FILE] + "\n...[truncated]"


def _extract_text_from_content(content: Any) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts: List[str] = []
        for item in content:
            if not isinstance(item, dict):
                continue
            if item.get("type") == "text":
                parts.append(str(item.get("text", "")))
            elif item.get("type") == "image_url":
                parts.append("[image omitted]")
        return "\n".join(part for part in parts if part)
    return str(content or "")


def _build_buddy_requirement(messages: List[Dict[str, Any]]) -> str:
    transcript: List[str] = []
    latest_user = ""
    for message in messages:
        role = str(message.get("role", "user"))
        content = _extract_text_from_content(message.get("content"))
        if not content.strip():
            continue
        transcript.append(f"{role.upper()}:\n{content.strip()}")
        if role == "user":
            latest_user = content.strip()

    if not latest_user:
        raise ValueError("Es wurde keine User-Nachricht in 'messages' gefunden.")

    return (
        f"Aktuelle User-Anforderung:\n{latest_user}\n\n"
        "Bisheriger Konversationsverlauf:\n"
        f"{chr(10).join(transcript)}"
    )


def _make_openai_completion_payload(content: str, model: str, completion_id: str) -> Dict[str, Any]:
    return {
        "id": completion_id,
        "object": "chat.completion",
        "created": int(time.time()),
        "model": model,
        "choices": [
            {
                "index": 0,
                "message": {"role": "assistant", "content": content},
                "finish_reason": "stop",
            }
        ],
        "usage": {
            "prompt_tokens": 0,
            "completion_tokens": 0,
            "total_tokens": 0,
        },
    }


def _stream_openai_chunks(content: str, model: str, completion_id: str) -> Iterable[str]:
    created = int(time.time())
    first_chunk = {
        "id": completion_id,
        "object": "chat.completion.chunk",
        "created": created,
        "model": model,
        "choices": [{"index": 0, "delta": {"role": "assistant"}, "finish_reason": None}],
    }
    yield f"data: {json.dumps(first_chunk)}\n\n"

    content_chunk = {
        "id": completion_id,
        "object": "chat.completion.chunk",
        "created": created,
        "model": model,
        "choices": [{"index": 0, "delta": {"content": content}, "finish_reason": None}],
    }
    yield f"data: {json.dumps(content_chunk)}\n\n"

    finish_chunk = {
        "id": completion_id,
        "object": "chat.completion.chunk",
        "created": created,
        "model": model,
        "choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}],
    }
    yield f"data: {json.dumps(finish_chunk)}\n\n"
    yield "data: [DONE]\n\n"


@app.errorhandler(KeyError)
def handle_not_found(err: KeyError):
    return jsonify({"error": str(err)}), 404


@app.errorhandler(ValueError)
def handle_bad_request(err: ValueError):
    return jsonify({"error": str(err)}), 400


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/v1/models")
def openai_models():
    return jsonify(
        {
            "object": "list",
            "data": [
                {
                    "id": OPENAI_MODEL_ID,
                    "object": "model",
                    "created": 0,
                    "owned_by": "buddy",
                    "description": OPENAI_MODEL_DESCRIPTION,
                    "architecture": {"input_modalities": ["text"]},
                    "providers": [{"supports_tools": False}],
                }
            ],
        }
    )


@app.post("/v1/chat/completions")
def openai_chat_completions():
    payload = request.get_json(silent=True) or {}
    messages = payload.get("messages")
    if not isinstance(messages, list) or not messages:
        raise ValueError("Das JSON-Feld 'messages' ist erforderlich.")

    model = str(payload.get("model") or OPENAI_MODEL_ID)
    stream = bool(payload.get("stream", False))
    requirement = _build_buddy_requirement(messages)

    trace: List[str] = []

    def on_progress(message: str) -> None:
        trace.append(message)

    result = BuddyProxy().run(requirement, context_docs=None, on_progress=on_progress)
    completion_id = f"chatcmpl-{uuid4().hex}"

    if stream:
        return Response(
            stream_with_context(_stream_openai_chunks(result.message, model, completion_id)),
            mimetype="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )

    return jsonify(_make_openai_completion_payload(result.message, model, completion_id))


@app.post("/api/sessions")
def create_session():
    session = store.create_session()
    return jsonify({"session_id": session.session_id, "status": session.status})


@app.get("/api/sessions/<session_id>")
def get_session(session_id: str):
    session = _get_session_or_404(session_id)
    return jsonify(_session_to_dict(session))


@app.post("/api/sessions/<session_id>/context")
def upload_context_file(session_id: str):
    _get_session_or_404(session_id)
    uploaded = request.files.get("file")
    if uploaded is None:
        raise ValueError("Es wurde keine Datei unter dem Feld 'file' hochgeladen.")

    content = uploaded.read().decode("utf-8", errors="replace")
    store.upsert_context_doc(session_id, uploaded.filename or "upload.txt", _truncate_context(content))
    return jsonify(_session_to_dict(_get_session_or_404(session_id)))


@app.post("/api/sessions/<session_id>/messages")
def send_message(session_id: str):
    session = _get_session_or_404(session_id)
    payload = request.get_json(silent=True) or {}
    content = str(payload.get("content", "")).strip()
    if not content:
        raise ValueError("Das JSON-Feld 'content' ist erforderlich.")

    store.append_message(session_id, "user", content)
    store.set_status(session_id, "running")

    trace = []

    def on_progress(message: str) -> None:
        trace.append(message)
        store.set_trace(session_id, trace)

    buddy = BuddyProxy()
    result = buddy.run(
        content,
        context_docs=[{"name": doc.name, "content": doc.content} for doc in session.context_docs],
        on_progress=on_progress,
    )

    store.append_message(session_id, "assistant", result.message)
    store.set_trace(session_id, result.trace or trace)
    store.set_status(session_id, "idle")

    return jsonify(
        {
            "session_id": session_id,
            "status": "idle",
            "assistant_message": result.message,
            "trace": result.trace or trace,
        }
    )
