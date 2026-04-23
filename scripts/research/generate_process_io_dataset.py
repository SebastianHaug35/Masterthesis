import json
import re
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = PROJECT_ROOT / "thesis" / "n8n" / "process_io" / "processes"


def normalize_text(text: str) -> str:
    return " ".join(text.replace("\ufeff", "").split())


def load_description_from_process_folder(process_dir: Path) -> str:
    md_path = process_dir / f"{process_dir.name}.md"
    content = md_path.read_text(encoding="utf-8", errors="replace")
    match = re.search(
        r"##\s+Source Description\s+(.*?)\s+##\s+Artifacts\b",
        content,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if match:
        return normalize_text(match.group(1))
    return normalize_text(content)


def to_title_case(process_id: str) -> str:
    return process_id.replace("_", " ").title()


def extract_domain(description: str) -> str:
    patterns = [
        r"about\s+the\s+process\s+of\s+the\s+(.+?)(?:\s+and\s+begins|\s+which\s+begins|\s+which\s+starts|[.,:;])",
        r"about\s+the\s+(.+?)\s+process(?:\s|[.,:;])",
        r"about\s+the\s+(.+?)(?:,\s+which|\s+which|[.,:;])",
    ]
    for pattern in patterns:
        match = re.search(pattern, description, flags=re.IGNORECASE)
        if match:
            return re.sub(r"[^a-z0-9]+", "_", match.group(1).strip().lower()).strip("_")
    return "business_workflow"


def clean_phrase(phrase: str) -> str:
    phrase = phrase.strip(" .,:;")
    phrase = re.sub(r"^(the|a|an)\s+", "", phrase, flags=re.IGNORECASE)
    phrase = re.sub(r"\s+", " ", phrase)
    return phrase.strip()


def extract_start_action(description: str) -> str:
    patterns = [
        r"starts with\s+([^.,:;]+)",
        r"begins with\s+([^.,:;]+)",
        r"which starts with\s+([^.,:;]+)",
        r"which begins with\s+([^.,:;]+)",
    ]
    for pattern in patterns:
        match = re.search(pattern, description, flags=re.IGNORECASE)
        if match:
            return clean_phrase(match.group(1))
    return "manual process initiation"


def sentence_candidates(description: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\s+", description)
    return [part.strip() for part in parts if part.strip()]


def extract_final_action(description: str) -> str:
    candidates = [
        sentence
        for sentence in sentence_candidates(description)
        if "process is now" not in sentence.lower()
    ]
    if not candidates:
        return "workflow completion"

    final_sentence = candidates[-1].strip()
    final_sentence = re.sub(
        r"^(when|once|after|then|immediately after that|after that|thereafter)\b",
        "",
        final_sentence,
        flags=re.IGNORECASE,
    ).strip(" ,")

    if "," in final_sentence:
        final_sentence = final_sentence.split(",")[-1].strip()

    final_sentence = re.sub(
        r"^(you\s+must|you\s+can|it\s+should|it\s+must|the\s+next\s+tasks\s+should\s+be|be\s+prepared\s+to)\b",
        "",
        final_sentence,
        flags=re.IGNORECASE,
    ).strip(" ,")

    replacements = [
        (r"\s+should be done for\s+(.+)$", r" for \1"),
        (r"\s+should be done to\s+(.+)$", r" to \1"),
        (r"\s+should be done$", ""),
        (r"\s+should be created$", ""),
        (r"\s+should be generated$", ""),
        (r"\s+should be performed$", ""),
        (r"\s+should be executed$", ""),
        (r"^must\s+", ""),
    ]
    for pattern, repl in replacements:
        final_sentence = re.sub(pattern, repl, final_sentence, flags=re.IGNORECASE)

    return clean_phrase(final_sentence)


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", text.lower()).strip("_") or "artifact"


def infer_input_channel(start_action: str) -> str:
    lowered = start_action.lower()
    if any(keyword in lowered for keyword in ("email", "mail", "send", "sending", "information")):
        return "email"
    if any(keyword in lowered for keyword in ("enter", "record", "input")):
        return "manual_entry"
    return "erp_request"


def infer_output_channel(final_action: str) -> str:
    lowered = final_action.lower()
    if any(keyword in lowered for keyword in ("enter", "invoice", "payment", "accounts payable", "voucher")):
        return "erp_request"
    if any(keyword in lowered for keyword in ("report", "inform", "notify", "email")):
        return "email"
    return "file_write"


def infer_input_counterparties(start_action: str) -> tuple[str, str]:
    lowered = start_action.lower()
    if "vendor" in lowered:
        return ("procurement.operations@company.example", "vendor.accounting@partner.example")
    if "receiving department" in lowered:
        return ("procurement.operations@company.example", "receiving.department@company.example")
    return ("operations.control@company.example", "shared.services@company.example")


def infer_output_counterparties(final_action: str, channel: str, domain: str) -> tuple[str, str]:
    if channel == "email":
        return (f"n8n.{domain}.workflow", "process.owner@company.example")
    if channel == "erp_request":
        return (f"n8n.{domain}.workflow", f"erp.{domain}.local")
    return (f"n8n.{domain}.workflow", "document.archive.local")


def build_payload(process_id: str, description: str) -> dict:
    start_action = extract_start_action(description)
    final_action = extract_final_action(description)
    domain = extract_domain(description)

    input_channel = infer_input_channel(start_action)
    input_sender, input_receiver = infer_input_counterparties(start_action)

    output_channel = infer_output_channel(final_action)
    output_sender, output_receiver = infer_output_counterparties(final_action, output_channel, domain)

    input_object = f"{domain}_request"
    output_object = f"{domain}_result"
    start_slug = slugify(start_action)
    final_slug = slugify(final_action)

    return {
        "process_id": process_id,
        "process_name": to_title_case(process_id),
        "description": description,
        "input": {
            "channel": input_channel,
            "sender": input_sender,
            "receiver": input_receiver,
            "what_is_being_sent": {
                "business_object": input_object,
                "fields": {
                    "process_id": process_id,
                    "trigger_step": start_action,
                    "reference_case_id": f"{process_id.upper()}-CASE-001",
                    "business_domain": domain,
                    "message_purpose": f"trigger_{start_slug}",
                },
                "attachments": [
                    {
                        "name": f"{process_id}_source_description.txt",
                        "type": "text/plain",
                    }
                ],
            },
        },
        "output": {
            "channel": output_channel,
            "sender": output_sender,
            "receiver": output_receiver,
            "what_is_being_sent": {
                "business_object": output_object,
                "fields": {
                    "process_id": process_id,
                    "completion_step": final_action,
                    "business_domain": domain,
                    "workflow_status": "completed",
                    "result_artifact_key": final_slug,
                },
                "attachments": [
                    {
                        "name": f"{process_id}_{final_slug}.json",
                        "type": "application/json",
                    }
                ],
            },
        },
    }


def main() -> None:
    for process_dir in sorted(path for path in SOURCE_DIR.iterdir() if path.is_dir()):
        process_id = process_dir.name
        description = load_description_from_process_folder(process_dir)
        payload = build_payload(process_id, description)
        output_path = process_dir / f"{process_id}_io.json"
        output_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    print(f"generated {len(list(path for path in SOURCE_DIR.iterdir() if path.is_dir()))} files in {SOURCE_DIR}")


if __name__ == "__main__":
    main()
