# Staging-only D1 setup checklist (no automatic deployment)

## Preconditions
- Owner confirms the Cloudflare account and identifies the existing production Worker and any production D1 database IDs.
- Do not reuse any production D1 ID, API token, namespace or sensitive data.
- Current `wrangler.staging.toml` deliberately omits D1 binding; no database has been created.

## Manual account setup (only after reviewing resource isolation)
1. Cloudflare dashboard → Workers & Pages → D1 SQL Database → Create database.
2. Name: `portway-si-knowledge-staging`; copy its new database UUID. Do not paste tokens into chat or GitHub.
3. Add only the new UUID to `wrangler.staging.toml`:
   ```toml
   [[d1_databases]]
   binding = "KNOWLEDGE_DB"
   database_name = "portway-si-knowledge-staging"
   database_id = "NEW-STAGING-D1-UUID"
   ```
4. Compare UUID with all existing production database IDs before executing anything.
5. Create a **local** D1 schema with `npx wrangler d1 execute portway-si-knowledge-staging --local --file=migrations/0001_knowledge.sql --config wrangler.staging.toml`.
6. Run `node scripts/verify-staging-config.mjs` and `node --test tests/*.test.mjs`.
7. Test with `npx wrangler dev --local --config wrangler.staging.toml` and sample non-sensitive records. A local test is not a Cloudflare deployment.
8. For remote staging migration or staging deployment, obtain a separate explicit approval first; confirm UUID and account again.

## Hard stops
Never run `wrangler deploy` without the exact staging config and explicit approval. Never run `wrangler d1 execute --remote` before separately verifying the staging database. Never modify `wrangler.toml`, the production D1 or Health SI.
