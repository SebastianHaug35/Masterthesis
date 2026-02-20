# app/generator.py
import json
from dataclasses import dataclass
from typing import Any, Dict, List, Optional

from .llm_providers import OpenAILLM

SYSTEM_PROMPT = """
SYSTEM PROMPT (für den LLM-Generator)

You are a compiler that converts structured business requirements into a valid n8n workflow JSON.

STRICT RULES (non-negotiable):
- Output ONLY valid JSON. No markdown. No explanations. No comments.
- The JSON must be directly usable as an n8n workflow export.
- Top-level keys REQUIRED: name, nodes, connections, active, settings.
- Each node MUST contain: name, type, typeVersion, position, parameters.
- Node names MUST be unique.
- Connections MUST reference existing node names.
- Do NOT include credentials, API keys, passwords, tokens, or secrets.
- Do NOT include pinned data.
- Positions are UI-only; choose reasonable coordinates.

ALLOWED NODE TYPES ONLY:
- n8n-nodes-base.manualTrigger
- n8n-nodes-base.set
- n8n-nodes-base.if
- n8n-nodes-base.httpRequest

MODELING GUIDELINES:
- Use Manual Trigger as the entry point.
- Use Set nodes to model data preparation, enrichment, and intermediate results.
- Use IF nodes for decision points (yes/no, exists/does not exist).
- Use HTTP Request nodes to represent integrations or external lookups (even if URLs are placeholders).
- Model the process as a clear, linear or branched graph.
- Prefer clarity over completeness. This is a conceptual automation blueprint.

SEMANTIC CONSTRAINTS:
- The workflow represents a customer complaint (Reklamation) handling process.
- The workflow MUST include:
  - Detection of incoming complaint
  - Research for repeat complaint
  - Decision whether a kick-off meeting is required
  - Preparation of internal information for stakeholders
  - Generation of a draft email to the customer (NOT sent)
  - Optional generation of a draft email to a supplier
- Human decisions must be represented as IF nodes.
- Communication steps must be represented as Set nodes that generate text content.

OUTPUT CONTRACT:
- Return a SINGLE JSON object.
- The JSON MUST be syntactically valid.
- The JSON MUST pass a basic validator checking nodes and connections.

You are not allowed to ask questions.
If information is missing, make reasonable assumptions and proceed.
"""

@dataclass
class GenerationResult:
    workflow: Dict[str, Any]
    rationale: str
    followup_question: Optional[str] = None

def generate_workflow_from_chat(chat: List[Dict[str, str]]) -> GenerationResult:
    llm = OpenAILLM()

    user_messages = [
        {"role": m["role"], "content": m["content"]}
        for m in chat
        if m["role"] in ("user", "assistant")
    ]

    raw = llm.generate(SYSTEM_PROMPT, user_messages)

    try:
        workflow = json.loads(raw)
    except json.JSONDecodeError as e:
        raise RuntimeError(f"LLM did not return valid JSON: {e}\n\n{raw}")

    return GenerationResult(
        workflow=workflow,
        rationale="Workflow generated directly by LLM using strict system prompt.",
        followup_question=None,
    )
