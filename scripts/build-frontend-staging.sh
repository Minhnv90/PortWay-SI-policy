#!/usr/bin/env bash
set -euo pipefail
echo 'ce6761d95abe44e28bb9bd8d8c6e3490a2ae8adabe59b166e67095a1206c143f  frontend-source.zip' | sha256sum -c -
mkdir -p frontend-opennext
unzip -oq frontend-source.zip -d frontend-opennext
cd frontend-opennext
# Pi authentication fixes are already included in the verified archive.
corepack enable
corepack prepare pnpm@9.15.9 --activate
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit
pnpm add -D -E @opennextjs/cloudflare@1.20.19 wrangler@4.168.0
printf '%s\n' 'import { defineCloudflareConfig } from "@opennextjs/cloudflare";' 'export default defineCloudflareConfig();' > open-next.config.ts
printf '%s\n' '{"name":"portway-si-frontend-staging","main":".open-next/worker.js","compatibility_date":"2026-11-21","compatibility_flags":["nodejs_compat"],"assets":{"directory":".open-next/assets","binding":"ASSETS"}}' > wrangler.jsonc
pnpm exec opennextjs-cloudflare build
test -f .open-next/worker.js
pnpm exec wrangler deploy --dry-run --config wrangler.jsonc
