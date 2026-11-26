#!/usr/bin/env bash
set -euo pipefail
echo '0f1c2efc99f5a72ce919992a804e19042c100581827f431de57ea28a97433a49  frontend-source.zip' | sha256sum -c -
mkdir -p frontend-opennext
unzip -oq frontend-source.zip -d frontend-opennext
cd frontend-opennext
python3 - <<'PY'
from pathlib import Path
p=Path('contexts/pi-auth-context.tsx')
s=p.read_text()
helper='''
function authDeadline<T>(promise: Promise<T>, stage: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Authentication failed: " + stage + " timed out. Open in Pi Browser and retry.")), 20000);
    promise.then(value => { clearTimeout(timer); resolve(value); }, error => { clearTimeout(timer); reject(error); });
  });
}
'''
assert 'const loadPiSDK' in s
s=s.replace('const loadPiSDK',helper+'\nconst loadPiSDK',1)
pairs=[('await loadPiSDK();','await authDeadline(loadPiSDK(), "SDK");'),('await loadSDKLite();','await authDeadline(loadSDKLite(), "SDKLite");'),('await window.Pi.init({','await authDeadline(window.Pi.init({'),('sandbox: PI_NETWORK_CONFIG.SANDBOX,\n      });','sandbox: PI_NETWORK_CONFIG.SANDBOX,\n      }), "Pi init");'),('await window.SDKLite.init();','await authDeadline(window.SDKLite.init(), "SDKLite init");'),('await pi.auth.login();','await authDeadline(pi.auth.login(), "Pi login");'),('await sdkLite.login();','await authDeadline(sdkLite.login(), "SDKLite login");')]
for a,b in pairs:
 assert s.count(a)==1, a
 s=s.replace(a,b,1)
p.write_text(s)
PY
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
