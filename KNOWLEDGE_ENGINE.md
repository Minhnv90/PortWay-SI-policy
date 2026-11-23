# PortWay SI Knowledge Engine (D1 MVP)

This repository now includes an independent Cloudflare D1 schema and Worker endpoints for PortWay's Gành Rái maritime/economic intelligence records. This is a keyword-search MVP, not a vector database, live web crawler, or automatic fact-checker.

## Data boundary
- Use a dedicated D1 database for PortWay SI only.
- Do not connect to or query Health SI databases, embeddings, user journals, or private health records.
- Only approved research records are retrieved by the AI.
- User-submitted evidence remains unverified until reviewed.
- Keep source provenance, status, counter-evidence, unknowns and last-checked date with each record.

## Create and migrate the STAGING database

**Do not run against production.** First authenticate to your own Cloudflare account locally; never paste a token into GitHub or chat. From the `staging-config` checkout:

```bash
# Already completed in Cloudflare; do not recreate this database.
# Verify the existing D1 database and its ID in the Cloudflare dashboard.
```

The staging database has already been created in Cloudflare. The `KNOWLEDGE_DB` binding is configured in `wrangler.staging.toml` for the separate `portway-si-staging` Worker. Do not create it again. Before running any remote operation, confirm that the ID is for the newly created **staging** database. The migration SQL is in `migrations/0001_knowledge.sql`.

```bash
# Only after confirming the isolated staging database ID and approval:
npx wrangler d1 execute portway-si-staging --remote --file=./migrations/0001_knowledge.sql
```

Create a separate staging `KNOWLEDGE_ADMIN_TOKEN` secret if an admin write endpoint is tested. No token or patient data should be committed to GitHub. The staging Worker must have a **different name** and separate D1 from production. Do not run bare `wrangler deploy` from this repository until a distinct staging configuration and explicit deployment approval are in place.

## API

### Admin upsert
`POST /api/admin/knowledge/upsert`
Header: `Authorization: Bearer YOUR_ADMIN_TOKEN`

Example body:

```json
{
  "record": {
    "id": "cai-mep-terminal-example-001",
    "title": "Example terminal or project record",
    "category": "port_terminal",
    "geography": "Cai Mep-Thi Vai",
    "entities": "Example legal entity; terminal operator",
    "claim": "A narrowly defined claim that can be checked.",
    "summary": "Short summary with clear scope.",
    "body": "Detailed notes that distinguish sourced facts from analysis.",
    "source_title": "Original document title",
    "source_organization": "Issuing authority or company",
    "source_url": "https://example.org/primary-document",
    "source_type": "primary_official",
    "published_at": "2026-01-01",
    "effective_at": "",
    "retrieved_at": "2026-01-02",
    "last_checked_at": "2026-01-02",
    "legal_status": "unknown",
    "project_stage": "unknown",
    "designed_capacity": "",
    "actual_throughput": "",
    "evidence_status": "unknown",
    "confidence_rationale": "Not yet reviewed.",
    "counter_evidence": "",
    "unknowns": "Confirm primary source and legal status.",
    "reviewer": "",
    "approval_status": "needs_review",
    "review_due_at": "2026-04-01",
    "tags": "cai-mep,port"
  }
}
```
The example is a schema template only, not a factual assertion about an actual project. Set `approved` only after a reviewer validates source, geography, legal stage, units, dates, and counter-evidence.

### Search approved records
`POST /api/knowledge/search`
Body: `{"query":"Cai Mep throughput"}`
Only `approval_status=approved` records are returned.

The AI research endpoint automatically retrieves up to six matching approved records and returns source metadata in `knowledge_sources`. The Worker does not crawl websites or independently validate user-provided links.

## Current limitations
- D1 keyword matching is a starter retrieval method, not semantic/vector search.
- No public admin dashboard, bulk importer, source crawler, reviewer workflow UI, or scheduled freshness monitor exists yet.
- No record is trustworthy merely because it is stored. Keep the evidence status and review date visible.
- Add rate limiting, admin audit logs, role-based review, source snapshotting and change history before public production.


## Staging setup (2026-11-23)

The `staging-config` branch prepares an isolated D1 database named `portway-si-staging`. Do not use the older production-oriented `wrangler d1 create ...-knowledge`, `--remote`, or bare `wrangler deploy` instructions above for staging. The dedicated staging D1 database is already selected in `wrangler.staging.toml` and the staging Worker uses the separate name `portway-si-staging`. The SQL in `migrations/0001_knowledge.sql` is a schema only and must be applied exclusively to the new staging database after verification.

The Worker now uses the native Cloudflare Workers AI binding `env.AI.run(env.AI_MODEL, ...)`; it does **not** read `AI_CHAT_COMPLETIONS_URL` or `AI_API_KEY`. The model is set via `[vars].AI_MODEL` in `wrangler.toml`. Keep `KNOWLEDGE_ADMIN_TOKEN` secret and separate for staging. The admin HTML page is public; API writes still require server-side authentication. Do not paste secrets into GitHub or this chat.

Cron is declared every 6 hours (UTC) but the handler is a deliberate no-op until source collection, review, deduplication and logging are implemented and approved. No autonomous knowledge ingestion or live medical verification exists yet.

**Deployment safety:** This branch is not deployed. Use a separate staging Worker name, domain and D1 database before any test deployment; do not point production routes at staging. Running a deployment or applying remote migrations requires separate approval.
