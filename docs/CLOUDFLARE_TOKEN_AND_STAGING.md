# Cloudflare staging — owner-only steps

## Token handling
The owner creates any Cloudflare API token in Cloudflare Dashboard → My Profile → API Tokens, using least privilege and scoping to the correct account. Do not paste the token into GitHub source, chat, screenshots, documentation or a public repository. Do not grant broad account administration or production resource write access.

A Cloudflare API token for managing Workers is **not** an AI provider API key. This PortWay Worker currently uses a Cloudflare Workers AI binding named `AI`; its committed configuration does not require a third-party `AI_API_KEY` for that binding.

## Safe order
1. Confirm `portway-si-knowledge-staging` exists and identify its D1 UUID in the Cloudflare dashboard.
2. Confirm that UUID differs from every production D1 database UUID. Do not post sensitive credentials.
3. Only on the feature branch, configure `[[d1_databases]]` with `binding = "KNOWLEDGE_DB"`, `database_name = "portway-si-knowledge-staging"`, and the staging-only `database_id`.
4. Run `node scripts/verify-staging-config.mjs` and `node --test tests/*.test.mjs`.
5. Test D1 schema locally first, using `--local` and the explicit staging config.
6. Request separate authorization before remote staging migration and Worker deployment. Never omit `--config wrangler.staging.toml` for staging commands.
7. After staging deployment, run `PORTWAY_STAGING_URL=https://portway-si-policy-staging.YOUR-SUBDOMAIN.workers.dev node scripts/staging-api-smoke.mjs`. This performs a read-only status request; it does not test D1 or AI generation.

## Important limitations
A D1 UUID alone does not prove account-level isolation. The current staging config has no D1 binding. No remote Cloudflare changes are made by adding these instructions or smoke tests.
