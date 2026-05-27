#!/usr/bin/env bash
set -euo pipefail

CONTAINER="${1:-openclaw-0txg-openclaw-1}"

docker exec "$CONTAINER" sh -lc '
if [ -f /tmp/n8n.pid ] && kill -0 "$(cat /tmp/n8n.pid)" 2>/dev/null; then
  kill "$(cat /tmp/n8n.pid)" || true
  sleep 1
fi

export N8N_USER_FOLDER=/data
export N8N_PORT=8070
export N8N_HOST=0.0.0.0
export N8N_PROTOCOL=http
export N8N_SECURE_COOKIE=false
export N8N_DIAGNOSTICS_ENABLED=false
export N8N_PERSONALIZATION_ENABLED=false
export NODE_FUNCTION_ALLOW_BUILTIN=net,http,url

nohup node /data/.npm-global/bin/n8n start > /tmp/n8n.log 2>&1 &
echo $! > /tmp/n8n.pid
echo "n8n started: pid=$(cat /tmp/n8n.pid) port=$N8N_PORT user_folder=$N8N_USER_FOLDER"
'
