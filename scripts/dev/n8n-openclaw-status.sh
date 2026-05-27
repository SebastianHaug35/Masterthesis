#!/usr/bin/env bash
set -euo pipefail

CONTAINER="${1:-openclaw-0txg-openclaw-1}"

docker exec "$CONTAINER" sh -lc '
if [ -f /tmp/n8n.pid ] && kill -0 "$(cat /tmp/n8n.pid)" 2>/dev/null; then
  echo "n8n process is running: pid=$(cat /tmp/n8n.pid)"
else
  echo "n8n process is not running"
fi

curl -fsS -I http://127.0.0.1:8070/healthz || true
'

