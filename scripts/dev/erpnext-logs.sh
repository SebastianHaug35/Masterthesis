#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PROJECT_NAME="masterthesis-erpnext"

docker compose \
  -p "$PROJECT_NAME" \
  -f "$ROOT_DIR/infra/erpnext/frappe_docker/pwd.yml" \
  -f "$ROOT_DIR/infra/erpnext/compose.override.yml" \
  logs -f

