#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLOUDFLARED="${CLOUDFLARED:-/tmp/cloudflared}"
WRANGLER_PORT="${WRANGLER_PORT:-8787}"
TUNNEL_LOG="/tmp/meli-hub-tunnel.log"
URL_FILE="/tmp/meli-hub-public-url.txt"
TMUX_CONF="${TMUX_CONF:--f /exec-daemon/tmux.portal.conf}"

cd "$ROOT"

if [[ ! -x "$CLOUDFLARED" ]]; then
  curl -sL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o "$CLOUDFLARED"
  chmod +x "$CLOUDFLARED"
fi

npm install --silent
npm run db:migrate

if ! tmux $TMUX_CONF has-session -t meli-dev-server 2>/dev/null; then
  tmux $TMUX_CONF new-session -d -s meli-dev-server -c "$ROOT"
  tmux $TMUX_CONF send-keys -t meli-dev-server:0.0 "npx wrangler dev --ip 0.0.0.0 --port $WRANGLER_PORT" C-m
fi

sleep 5

tmux $TMUX_CONF has-session -t meli-tunnel 2>/dev/null && tmux $TMUX_CONF kill-session -t meli-tunnel || true
: > "$TUNNEL_LOG"
tmux $TMUX_CONF new-session -d -s meli-tunnel -c "$ROOT"
tmux $TMUX_CONF send-keys -t meli-tunnel:0.0 "$CLOUDFLARED tunnel --url http://127.0.0.1:$WRANGLER_PORT 2>&1 | tee $TUNNEL_LOG" C-m

echo "Esperando URL pública del túnel..."
PUBLIC_URL=""
for _ in $(seq 1 45); do
  PUBLIC_URL="$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$TUNNEL_LOG" 2>/dev/null | head -1 || true)"
  if [[ -n "$PUBLIC_URL" ]]; then
    break
  fi
  sleep 1
done

if [[ -z "$PUBLIC_URL" ]]; then
  echo "No se obtuvo URL del túnel. Ver: $TUNNEL_LOG" >&2
  exit 1
fi

echo "$PUBLIC_URL" > "$URL_FILE"

# Actualizar redirect URI en .dev.vars
REDIRECT_URI="${PUBLIC_URL}/oauth/meli/callback"
if grep -q '^MELI_REDIRECT_URI=' .dev.vars; then
  sed -i "s|^MELI_REDIRECT_URI=.*|MELI_REDIRECT_URI=${REDIRECT_URI}|" .dev.vars
else
  echo "MELI_REDIRECT_URI=${REDIRECT_URI}" >> .dev.vars
fi

# Reiniciar wrangler para cargar .dev.vars actualizado
if tmux $TMUX_CONF has-session -t meli-dev-server 2>/dev/null; then
  tmux $TMUX_CONF send-keys -t meli-dev-server:0.0 C-c
  sleep 2
  tmux $TMUX_CONF send-keys -t meli-dev-server:0.0 "npx wrangler dev --ip 0.0.0.0 --port $WRANGLER_PORT" C-m
  sleep 5
fi

# Persistir doc de entorno
cat > "$ROOT/DEV-ENV.md" <<DOCEOF
# Entorno de desarrollo — Agente

## URLs activas ($(date -u +%Y-%m-%d))

| Servicio | URL |
|----------|-----|
| Local | http://127.0.0.1:$WRANGLER_PORT |
| Panel | http://127.0.0.1:$WRANGLER_PORT/admin |
| Público (túnel) | $PUBLIC_URL |
| OAuth callback | $REDIRECT_URI |
| Webhook ML | ${PUBLIC_URL}/webhooks/meli |
| Health | ${PUBLIC_URL}/health |

Tmux: \`meli-dev-server\` | \`meli-tunnel\`
DOCEOF

cat <<EOF

Meli Hub CL — entorno agente listo
==================================
Local:    http://127.0.0.1:$WRANGLER_PORT
Panel:    http://127.0.0.1:$WRANGLER_PORT/admin
Público:  $PUBLIC_URL
OAuth CB: $REDIRECT_URI
Webhook:  ${PUBLIC_URL}/webhooks/meli
Health:   ${PUBLIC_URL}/health

Tmux: meli-dev-server | meli-tunnel
Logs túnel: $TUNNEL_LOG

Configura en ML devcenter la Redirect URI y Webhook con las URLs públicas.
EOF
