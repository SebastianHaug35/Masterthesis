#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PROJECT_NAME="masterthesis-erpnext"

docker compose \
  -p "$PROJECT_NAME" \
  -f "$ROOT_DIR/infra/erpnext/frappe_docker/pwd.yml" \
  -f "$ROOT_DIR/infra/erpnext/compose.override.yml" \
  up --no-start backend

docker compose \
  -p "$PROJECT_NAME" \
  -f "$ROOT_DIR/infra/erpnext/frappe_docker/pwd.yml" \
  -f "$ROOT_DIR/infra/erpnext/compose.override.yml" \
  up -d

echo "ERPNext stack starting"
echo "URL: http://127.0.0.1:8076"
echo "Username: Administrator"
echo "Password: admin"
echo "Initial site creation can take a few minutes."
