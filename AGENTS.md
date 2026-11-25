# 3 AI / 2 SI — standing protocol

ChatGPT coordinates implementation and evidence. Claude independently reviews the exact commit SHA when explicitly activated with the PR link. Dot verifies sources, prepares knowledge drafts and evidence-linked communications. Owner makes final acceptance decision. No Grok.

Preserve app names, URLs, data and independent storage. No main merge, production deployment, secrets in chat, or data deletion. Staging only with owner authorization. Health Web3 education only, no financial products or token rewards for children. PortWay financial/legal/RWA/geopolitical content is informational, not advice. Claude reviews sensitive public claims before publication.

## Acceptance gates
- Staging Worker: portway-si-staging; verify actual deployment SHA and AI, KNOWLEDGE_DB, MEMORY_KV bindings.
- GET /api/status is configuration evidence only.
- Authenticated GET /api/diagnostics/storage and POST /api/diagnostics/kv: verify actual D1 and KV operations; do not expose token.
- Test /api/research-assist with approved knowledge, source attribution, no-result handling, latency and usage; never invent citations.
- Test Pi identity and consent-based Memory, frontend build, mobile/desktop/Pi Browser; Health Teacher and child safety where applicable.
- Record commit SHA, CI link, runtime evidence, remaining failures and independent Claude review. Mock tests are not live tests.

## Claude activation
Review PR #9 at the exact head SHA supplied by ChatGPT. Report blockers, severity, file/line, reproduction, patch proposal and verdict. No merge/deploy. Owner decides acceptance.
