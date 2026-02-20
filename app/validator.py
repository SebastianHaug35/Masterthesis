# app/validator.py
import json
import re
from typing import Any, Dict, List, Tuple

ALLOWED_NODE_TYPES = {
    "n8n-nodes-base.manualTrigger",
    "n8n-nodes-base.set",
    "n8n-nodes-base.httpRequest",
    "n8n-nodes-base.if",
}

def validate_workflow_json(
    workflow: Dict[str, Any], strict: bool = False
) -> Tuple[bool, List[str], List[str]]:
    errors: List[str] = []
    warnings: List[str] = []

    if not isinstance(workflow, dict):
        return False, ["Workflow must be a JSON object."], []

    for k in ("nodes", "connections"):
        if k not in workflow:
            errors.append(f"Missing top-level key: '{k}'.")

    nodes = workflow.get("nodes", [])
    conns = workflow.get("connections", {})

    if not isinstance(nodes, list) or not nodes:
        errors.append("'nodes' must be a non-empty list.")
    if not isinstance(conns, dict):
        errors.append("'connections' must be an object/dict.")

    workflow_str = json.dumps(workflow, ensure_ascii=False)
    if re.search(r"(api[_-]?key|secret|password|bearer\s+[a-z0-9\-_\.]+)", workflow_str, re.IGNORECASE):
        warnings.append("Potential secret detected in workflow JSON.")

    node_names = set()
    for i, n in enumerate(nodes):
        if not isinstance(n, dict):
            errors.append(f"Node #{i} must be an object.")
            continue

        name = n.get("name")
        ntype = n.get("type")

        if not isinstance(name, str) or not name:
            errors.append(f"Node #{i} missing valid 'name'.")
        elif name in node_names:
            errors.append(f"Duplicate node name: '{name}'.")
        node_names.add(name)

        if not isinstance(ntype, str):
            errors.append(f"Node '{name}' missing valid 'type'.")
        elif ntype not in ALLOWED_NODE_TYPES:
            warnings.append(f"Node '{name}' uses unsupported type '{ntype}'.")

    if strict and warnings:
        errors.extend([f"(Strict) {w}" for w in warnings])
        warnings = []

    return len(errors) == 0, errors, warnings
