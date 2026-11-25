# Staging deployment
Owner approved staging only. Do not merge main or deploy production.
Check wrangler.staging.toml points to the dedicated staging Worker and the owner-confirmed KV and D1 IDs. Verify the D1 schema before applying any migration; never reset or overwrite data.
From this branch, run node --test tests/p0-*.test.mjs, then npx wrangler deploy --dry-run --config wrangler.staging.toml.
After confirming the target and authenticating locally with Cloudflare, run npx wrangler deploy --config wrangler.staging.toml.
Use the URL returned by Wrangler for smoke tests. Check /api/status, approved-origin AI chat, RAG approved sources, authenticated Memory save/read/delete with synthetic preferences, MCP read-only and denied unauthorized access. Use test Pi accounts only. Never paste credentials in issues or logs.
Do not promote to production until frontend integration and owner acceptance.
