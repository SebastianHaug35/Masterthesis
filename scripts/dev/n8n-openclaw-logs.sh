#!/usr/bin/env bash
set -euo pipefail

CONTAINER="${1:-openclaw-0txg-openclaw-1}"

docker exec "$CONTAINER" sh -lc 'tail -f /tmp/n8n.log'

