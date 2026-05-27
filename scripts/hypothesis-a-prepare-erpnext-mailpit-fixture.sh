#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

python3 "${ROOT_DIR}/experiments/hypothesis_a/prepare_erpnext_mailpit_fixture.py" "$@"
