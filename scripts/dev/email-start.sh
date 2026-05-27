#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

docker compose -f "$ROOT_DIR/infra/email/docker-compose.yml" up -d

echo "Local email system started"
echo "SMTP: 127.0.0.1:1025"
echo "Web/API: http://127.0.0.1:8077"

