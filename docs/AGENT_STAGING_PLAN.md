# PortWay SI Agent Foundation — staging-only plan

## Confirmed repository baseline (2026-11-23)
- Existing `worker.js`, `index.html`, `wrangler.toml`, D1 migration and knowledge documentation.
- `wrangler.toml` defines Worker `portway-si-policy`, AI binding `AI`, and allowed origins.
- The committed Wrangler configuration has no D1 database binding; do not assume a live D1 database is connected.
- Existing knowledge design is keyword-based, not a vector RAG implementation.
- README describes limitations; deployed state has not been independently verified.

## Phase gates
1. Audit entire Worker and routes; map secrets, CORS, Pi verification, D1 calls, rate limits, admin auth, and any deployment automation.
2. Run syntax/static tests without network or production credentials.
3. Add isolated staging Worker configuration with distinct name, distinct database and test secrets after reviewing real account bindings.
4. Implement read-only memory and RAG behind feature flags. Keep PortWay and Health SI stores strictly separate.
5. Introduce MCP allowlisted read-only tools; reject arbitrary URLs, untrusted instructions and unauthorized tool calls.
6. Add orchestrator, researcher, verifier and logistics roles with traceable source provenance and explicit approval gates.
7. Test prompt injection, malicious tool results, CORS, rate limits, retries, budgets, rollback and data retention.
8. Request separate approval before any production deployment.

## Deployment restrictions
Never deploy production, write to production D1, change main, or run remote migrations in this workstream. Branch commits alone are not staging deployment.

## Architecture
Claude Code / Skills / subagents are development-time helpers. Production-time agent orchestration is a separate API service, not a claim that Claude Code executes within a Cloudflare Worker. D1 can store approved records; semantic retrieval needs an explicitly designed and tested index. MCP tools require allowlists, credentials isolation and human approval for writes.

## Acceptance criteria
- Existing public endpoints and data remain unchanged.
- Staging uses isolated resource IDs and non-production secrets.
- Source claims include citations and approval status.
- Agent actions are logged without leaking sensitive payloads.
- Tests and rollback plan reviewed before merging.
