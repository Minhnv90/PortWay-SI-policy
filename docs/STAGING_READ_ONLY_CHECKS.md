# PortWay SI — read-only D1 verification

The staging UUID is `63a484b4-ab0f-4f9f-a299-78fca28f6755`, supplied by the owner. This is a database identifier, not an API token. It has been added to `wrangler.staging.toml` on the feature branch only.

## What is safe to check
1. GitHub CI: syntax and offline tests; these cannot prove remote D1 connectivity.
2. Local static guard: `node scripts/verify-staging-config.mjs`.
3. Local SQL inspection guide: `node scripts/inspect-staging-schema.mjs`.
4. In Cloudflare Dashboard, open the staging database and run only the read-only SQL below, after verifying the database name and UUID:

```sql
SELECT name FROM sqlite_master WHERE type='table' AND name='portway_knowledge';
PRAGMA table_info(portway_knowledge);
SELECT approval_status, COUNT(*) AS records
FROM portway_knowledge
GROUP BY approval_status;
```

If the table does not exist, stop before running PRAGMA/COUNT; do not create it without explicit migration approval. Avoid exposing private record bodies in screenshots.

## Staging API checks
`/api/status` is a status-only endpoint. It does not establish D1 connectivity or AI generation. `/api/knowledge/search` is an Origin-restricted POST route and requires a staging-allowed Origin; it must be tested only after a staging Worker has been deployed with the correct binding.

## Deployment boundaries
No remote migration, D1 writes, Cloudflare Worker deployment, main branch merge or Health SI changes are authorized by this checklist.
