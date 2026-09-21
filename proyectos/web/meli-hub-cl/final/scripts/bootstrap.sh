#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATE="$ROOT/../setup/credentials.env.template"

cd "$ROOT"

echo "→ npm install"
npm install

echo "→ D1 local migrate"
npm run db:migrate

if [[ ! -f .dev.vars ]]; then
  if [[ -f "$TEMPLATE" ]]; then
    cp "$TEMPLATE" .dev.vars
    echo "→ Creado .dev.vars desde template"
    echo "  Edita .dev.vars: MELI_CLIENT_SECRET y MELI_REDIRECT_URI"
  else
    cp .dev.vars.example .dev.vars 2>/dev/null || true
    echo "→ Creado .dev.vars desde .dev.vars.example"
  fi
else
  echo "→ .dev.vars ya existe (no sobrescrito)"
fi

cat <<EOF

Bootstrap v1 listo.
Siguiente paso:
  1. Editar .dev.vars (secret ML + redirect URI)
  2. ./scripts/dev-env.sh
  3. Abrir /admin y conectar Mercado Libre

Ver: ../docs/SETUP-v1.md
EOF
