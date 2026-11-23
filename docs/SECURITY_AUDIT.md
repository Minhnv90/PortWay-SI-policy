# PortWay SI — preliminary code security audit (2026-11-23)

Scope: read-only review of committed `worker.js`, `wrangler.toml`, `README.md`, knowledge schema and agent foundation. This is NOT a penetration test or production configuration verification.

## Observations requiring follow-up
1. `GET /api/status` returns a wildcard Access-Control-Allow-Origin and discloses basic configuration status. Confirm this is intentionally public; never expose secrets.
2. Other API routes use an exact origin allowlist. A missing Origin is rejected, so direct non-browser clients may receive 403; verify this matches the API contract.
3. `POST /api/admin/knowledge/upsert` checks a single bearer admin token. The caller can submit `approval_status=approved` with reviewer text; there is no independently verified reviewer identity or two-person approval. Require role-bound review and audit logs before exposing contributor workflows.
4. `POST /api/knowledge/search` returns approved record bodies. Classify records for public disclosure before enabling external access.
5. No visible application-level per-user rate limit on `/api/research-assist`; add Cloudflare controls and usage quotas before broad public use.
6. Knowledge search uses LIKE and bounded query terms. This is keyword retrieval, not semantic/vector RAG. Parameter binding is used.
7. `wrangler.toml` has no D1 binding in the committed configuration. The deployed account state remains unknown.
8. User-provided evidence is included in prompts; keep it untrusted, add prompt-injection regression tests, and enforce tool permissions outside the model.
9. Existing CORS allows only specific origins for protected routes; CORS is not authentication. Server-to-server callers need separate authorization.

## Required next tests
- Worker syntax and endpoint contract tests
- Origin allowlist, OPTIONS preflight, admin authorization
- Approved/unapproved record visibility, malformed input
- Pi identity verification failure paths
- AI provider failure, token budgets and retry limits
- Prompt injection and malicious MCP tool outputs
- Staging-only D1 migration, rollback and isolation checks

No production or remote database actions authorized.
