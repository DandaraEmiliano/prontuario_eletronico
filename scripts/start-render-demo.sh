#!/usr/bin/env bash
set -eu

db_path="$(mktemp -d /tmp/prontuario.XXXXXX)"
socket_path="$db_path/mongodb.sock"
export MONGODB_URI="mongodb://${socket_path//\//%2F}/prontuario_render_demo"
mongod --bind_ip "$socket_path" \
  --dbpath "$db_path" \
  --wiredTigerCacheSizeGB 0.25 \
  --slowOpSampleRate 0 \
  --quiet &
mongo_pid=$!

node --max-old-space-size=128 dist/server.js &
app_pid=$!

stop() {
  kill -TERM "$app_pid" "$mongo_pid" 2>/dev/null || true
  wait "$app_pid" "$mongo_pid" || true
}

trap 'stop; exit 0' TERM INT
status=0
wait -n "$app_pid" "$mongo_pid" || status=$?
stop
exit "$status"
