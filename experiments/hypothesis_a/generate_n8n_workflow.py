"""Generate n8n workflow candidates for Hypothesis A.

The script prepares a reproducible prompt from local process artifacts and can
optionally call the OpenAI API when OPENAI_API_KEY is available. Without a key,
use --dry-run to write the prompt bundle only.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.error import HTTPError
from urllib.request import Request, urlopen


PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_PROCESS_DIR = (
    PROJECT_ROOT
    / "thesis"
    / "n8n"
    / "process_io"
    / "processes"
    / "account_payable_process_0"
)
DEFAULT_SYSTEM_PROMPT = PROJECT_ROOT / "prompts" / "hypothesis_a" / "n8n_workflow_generator_system.txt"
DEFAULT_SYSTEM_LANDSCAPE = PROJECT_ROOT / "thesis" / "n8n" / "process_io" / "system_landscape.json"
DEFAULT_REUSABLE_EXECUTION_CONTRACT = (
    PROJECT_ROOT / "thesis" / "n8n" / "process_io" / "reusable_workflow_execution_contract.md"
)
DEFAULT_OUTPUT_DIR = PROJECT_ROOT / "artifacts" / "hypothesis_a" / "generated_workflows"
DEFAULT_ENV_FILES = [
    PROJECT_ROOT / "frontend" / ".env",
    PROJECT_ROOT / ".env",
]


def read_text(path: Path) -> str:
    with path.open("r", encoding="utf-8") as file:
        return file.read()


def read_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        file.write(content)


def write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        json.dump(data, file, indent=2, sort_keys=True)
        file.write("\n")


def load_env_files(paths: list[Path]) -> None:
    for path in paths:
        if not path.exists():
            continue
        for line in read_text(path).splitlines():
            stripped = line.strip()
            if not stripped or stripped.startswith("#") or "=" not in stripped:
                continue
            key, value = stripped.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)


def find_single(process_dir: Path, pattern: str) -> Path:
    candidates = sorted(process_dir.glob(pattern))
    if not candidates:
        raise FileNotFoundError(f"No {pattern} found in {process_dir}")
    if len(candidates) > 1:
        raise RuntimeError(f"Expected one {pattern} in {process_dir}, found {len(candidates)}")
    return candidates[0]


def compact_landscape(system_landscape: dict[str, Any]) -> dict[str, Any]:
    return {
        "system_types": system_landscape.get("system_types", []),
        "shared_interfaces": system_landscape.get("shared_interfaces", []),
        "trigger_taxonomy": system_landscape.get("trigger_taxonomy", []),
        "mock_runtime_reference": system_landscape.get("mock_runtime_reference", {}),
    }


def build_user_prompt(
    process_id: str,
    process_description: str,
    test_cases: dict[str, Any],
    system_landscape: dict[str, Any],
    reusable_execution_contract: str | None = None,
    system_contract: str | None = None,
    test_setup: dict[str, Any] | None = None,
) -> str:
    payload = {
        "task": "Generate an importable n8n workflow JSON for Hypothesis A workflow testing.",
        "process_id": process_id,
        "process_description_markdown": process_description,
        "test_case_contract": test_cases,
        "system_landscape_excerpt": compact_landscape(system_landscape),
        "required_webhook_path": process_id,
        "runner_command_after_import": (
            "powershell -NoProfile -ExecutionPolicy Bypass -File "
            f".\\scripts\\hypothesis-a-test-runner.ps1 --mode workflow "
            f"--workflow-url http://127.0.0.1:5678/webhook/{process_id}"
        ),
    }
    if reusable_execution_contract:
        payload["reusable_workflow_execution_contract_markdown"] = reusable_execution_contract
    if system_contract:
        payload["process_system_contract_markdown"] = system_contract
    if test_setup:
        payload["first_workflow_test_setup"] = test_setup
    return json.dumps(payload, indent=2, sort_keys=True)


def extract_json_object(text: str) -> dict[str, Any]:
    stripped = text.strip()
    if stripped.startswith("```"):
        stripped = re.sub(r"^```(?:json)?", "", stripped).strip()
        stripped = re.sub(r"```$", "", stripped).strip()
    try:
        return json.loads(stripped)
    except json.JSONDecodeError:
        start = stripped.find("{")
        end = stripped.rfind("}")
        if start == -1 or end == -1 or end <= start:
            raise
        return json.loads(stripped[start : end + 1])


def validate_n8n_workflow(workflow: dict[str, Any]) -> list[str]:
    failures: list[str] = []
    required = ["name", "nodes", "connections", "active", "settings"]
    for key in required:
        if key not in workflow:
            failures.append(f"missing top-level key: {key}")

    nodes = workflow.get("nodes", [])
    if not isinstance(nodes, list) or not nodes:
        failures.append("nodes must be a non-empty list")
        return failures

    names = []
    node_types = set()
    for index, node in enumerate(nodes):
        if not isinstance(node, dict):
            failures.append(f"node {index} is not an object")
            continue
        for key in ["name", "type", "typeVersion", "position", "parameters"]:
            if key not in node:
                failures.append(f"node {index} missing key: {key}")
        name = node.get("name")
        if name in names:
            failures.append(f"duplicate node name: {name}")
        names.append(name)
        node_types.add(node.get("type"))

    required_types = {
        "n8n-nodes-base.webhook",
        "n8n-nodes-base.httpRequest",
        "n8n-nodes-base.respondToWebhook",
    }
    for node_type in sorted(required_types - node_types):
        failures.append(f"missing required node type: {node_type}")

    connections = workflow.get("connections", {})
    if not isinstance(connections, dict):
        failures.append("connections must be an object")
    else:
        known_names = set(names)
        for source_name, connection in connections.items():
            if source_name not in known_names:
                failures.append(f"connection references unknown source node: {source_name}")
            encoded = json.dumps(connection)
            for target_name in re.findall(r'"node"\s*:\s*"([^"]+)"', encoded):
                if target_name not in known_names:
                    failures.append(f"connection references unknown target node: {target_name}")

    return failures


def call_openai(system_prompt: str, user_prompt: str, model: str, api_key: str) -> str:
    body = {
        "model": model,
        "input": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "text": {"format": {"type": "json_object"}},
    }
    request = Request(
        "https://api.openai.com/v1/responses",
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urlopen(request, timeout=120) as response:
            data = json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        error_body = exc.read().decode("utf-8")
        raise RuntimeError(f"OpenAI API request failed with HTTP {exc.code}: {error_body}") from exc

    if "output_text" in data:
        return data["output_text"]

    chunks: list[str] = []
    for item in data.get("output", []):
        for content in item.get("content", []):
            if content.get("type") in {"output_text", "text"} and "text" in content:
                chunks.append(content["text"])
    if not chunks:
        raise RuntimeError("OpenAI API response did not contain output text")
    return "".join(chunks)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate an n8n workflow for Hypothesis A.")
    parser.add_argument("--process-dir", type=Path, default=DEFAULT_PROCESS_DIR)
    parser.add_argument("--system-prompt", type=Path, default=DEFAULT_SYSTEM_PROMPT)
    parser.add_argument("--system-landscape", type=Path, default=DEFAULT_SYSTEM_LANDSCAPE)
    parser.add_argument("--reusable-execution-contract", type=Path, default=DEFAULT_REUSABLE_EXECUTION_CONTRACT)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--model", default=os.environ.get("OPENAI_MODEL", "gpt-5.4-mini"))
    parser.add_argument("--dry-run", action="store_true", help="Write prompt files but do not call the API.")
    parser.add_argument(
        "--test-case-file",
        type=Path,
        default=None,
        help="Optional explicit test case JSON. Defaults to *_test_cases.json in --process-dir.",
    )
    parser.add_argument(
        "--system-contract",
        type=Path,
        default=None,
        help="Optional process system-contract markdown to include in the prompt.",
    )
    parser.add_argument(
        "--test-setup",
        type=Path,
        default=None,
        help="Optional machine-readable first-workflow test setup JSON to include in the prompt.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    load_env_files(DEFAULT_ENV_FILES)

    args.process_dir = args.process_dir.resolve()
    args.system_prompt = args.system_prompt.resolve()
    args.system_landscape = args.system_landscape.resolve()
    args.reusable_execution_contract = args.reusable_execution_contract.resolve()
    args.output_dir = args.output_dir.resolve()
    if args.test_case_file:
        args.test_case_file = args.test_case_file.resolve()
    if args.system_contract:
        args.system_contract = args.system_contract.resolve()
    if args.test_setup:
        args.test_setup = args.test_setup.resolve()

    process_md = find_single(args.process_dir, "*.md")
    test_case_file = args.test_case_file or find_single(args.process_dir, "*_test_cases.json")
    test_cases = read_json(test_case_file)
    process_id = test_cases["process_id"]
    system_prompt = read_text(args.system_prompt)
    reusable_execution_contract = (
        read_text(args.reusable_execution_contract)
        if args.reusable_execution_contract and args.reusable_execution_contract.exists()
        else None
    )
    system_contract = read_text(args.system_contract) if args.system_contract else None
    test_setup = read_json(args.test_setup) if args.test_setup else None
    user_prompt = build_user_prompt(
        process_id=process_id,
        process_description=read_text(process_md),
        test_cases=test_cases,
        system_landscape=read_json(args.system_landscape),
        reusable_execution_contract=reusable_execution_contract,
        system_contract=system_contract,
        test_setup=test_setup,
    )

    run_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    process_output_dir = args.output_dir / process_id
    prompt_bundle = {
        "run_id": run_id,
        "process_id": process_id,
        "model": args.model,
        "source_files": {
            "process_markdown": str(process_md.relative_to(PROJECT_ROOT)),
            "test_cases": str(test_case_file.relative_to(PROJECT_ROOT)),
            "system_landscape": str(args.system_landscape.relative_to(PROJECT_ROOT)),
            "reusable_execution_contract": (
                str(args.reusable_execution_contract.relative_to(PROJECT_ROOT))
                if reusable_execution_contract
                else None
            ),
            "system_prompt": str(args.system_prompt.relative_to(PROJECT_ROOT)),
            "system_contract": (
                str(args.system_contract.relative_to(PROJECT_ROOT))
                if args.system_contract
                else None
            ),
            "test_setup": str(args.test_setup.relative_to(PROJECT_ROOT)) if args.test_setup else None,
        },
        "system_prompt": system_prompt,
        "user_prompt": user_prompt,
    }
    prompt_path = process_output_dir / f"{process_id}_generation_prompt_{run_id}.json"
    latest_prompt_path = process_output_dir / f"{process_id}_generation_prompt_latest.json"
    write_json(prompt_path, prompt_bundle)
    write_json(latest_prompt_path, prompt_bundle)

    if args.dry_run:
        print(f"process_id: {process_id}")
        print("mode: dry-run")
        print(f"prompt: {prompt_path}")
        return 0

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("ERROR: OPENAI_API_KEY is missing. Add it to frontend/.env or run with --dry-run.", file=sys.stderr)
        print(f"prompt: {prompt_path}", file=sys.stderr)
        return 1

    started = time.perf_counter()
    run_report_base = {
        "run_id": run_id,
        "process_id": process_id,
        "model": args.model,
        "prompt": str(prompt_path.relative_to(PROJECT_ROOT)),
    }
    try:
        raw_output = call_openai(system_prompt, user_prompt, args.model, api_key)
    except Exception as exc:  # noqa: BLE001 - CLI/report boundary.
        report_path = process_output_dir / f"{process_id}_generation_report_{run_id}.json"
        latest_report_path = process_output_dir / f"{process_id}_generation_report_latest.json"
        report = {
            **run_report_base,
            "duration_ms": round((time.perf_counter() - started) * 1000),
            "workflow": None,
            "validation_status": "error",
            "validation_failures": [],
            "error": str(exc),
        }
        write_json(report_path, report)
        write_json(latest_report_path, report)
        print(f"process_id: {process_id}")
        print(f"model: {args.model}")
        print("validation: error")
        print(f"prompt: {prompt_path}")
        print(f"report: {report_path}")
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    workflow = extract_json_object(raw_output)
    validation_failures = validate_n8n_workflow(workflow)

    workflow_path = process_output_dir / f"{process_id}_workflow_{run_id}.json"
    latest_workflow_path = process_output_dir / f"{process_id}_workflow_latest.json"
    report_path = process_output_dir / f"{process_id}_generation_report_{run_id}.json"
    latest_report_path = process_output_dir / f"{process_id}_generation_report_latest.json"

    write_json(workflow_path, workflow)
    write_json(latest_workflow_path, workflow)
    write_json(
        report_path,
        {
            **run_report_base,
            "duration_ms": round((time.perf_counter() - started) * 1000),
            "workflow": str(workflow_path.relative_to(PROJECT_ROOT)),
            "validation_status": "passed" if not validation_failures else "failed",
            "validation_failures": validation_failures,
        },
    )
    write_json(latest_report_path, read_json(report_path))

    print(f"process_id: {process_id}")
    print(f"model: {args.model}")
    print(f"validation: {'passed' if not validation_failures else 'failed'}")
    print(f"workflow: {workflow_path}")
    print(f"report: {report_path}")
    return 0 if not validation_failures else 1


if __name__ == "__main__":
    raise SystemExit(main())
