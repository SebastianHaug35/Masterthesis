#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLANTUML_JAR="${ROOT_DIR}/plantuml-1.2025.10.jar"
INPUT_DIR="${ROOT_DIR}/docs/architecture"
OUTPUT_DIR="${INPUT_DIR}/rendered"

if ! command -v java >/dev/null 2>&1; then
  echo "Error: Java is not installed or not on PATH." >&2
  echo "Install Java (JRE/JDK 17+) and run again." >&2
  exit 1
fi

if [[ ! -f "${PLANTUML_JAR}" ]]; then
  echo "Error: ${PLANTUML_JAR} not found." >&2
  echo "Place plantuml-1.2025.10.jar in the repository root." >&2
  exit 1
fi

mkdir -p "${OUTPUT_DIR}"

if [[ $# -gt 0 ]]; then
  INPUT_FILES=("$@")
else
  mapfile -t INPUT_FILES < <(find "${INPUT_DIR}" -maxdepth 1 -type f -name "*.puml" | sort)
fi

if [[ ${#INPUT_FILES[@]} -eq 0 ]]; then
  echo "No .puml files found to render." >&2
  exit 1
fi

java -jar "${PLANTUML_JAR}" -tpng -o "${OUTPUT_DIR}" "${INPUT_FILES[@]}"

echo "Rendered ${#INPUT_FILES[@]} diagram(s) to ${OUTPUT_DIR}."
