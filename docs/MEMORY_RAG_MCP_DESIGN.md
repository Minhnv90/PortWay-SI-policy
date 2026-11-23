# PortWay SI Memory/RAG staging design

## Scope and separation
PortWay SI memory is an approved-document index, NOT personal conversational memory. Health SI medical data, journals, credentials and embeddings are never imported. The only existing table is `portway_knowledge`; its approved records are the canonical source.

## Retrieval path (read only)
1. Receive a bounded user question.
2. Select approved records from PortWay D1, using bound SQL parameters.
3. Return source metadata, last_checked_at and evidence_status.
4. Verifier checks the claim scope; metadata presence alone does not verify the underlying document.
5. Logistics specialist highlights VGM, ports, vessel schedules, contract and legal ambiguities.
6. Orchestrator combines statuses without approving or publishing new records.

## Planned semantic RAG
- Introduce an isolated staging vector index ONLY after confirming a dedicated staging D1 and index namespace.
- Each chunk references a canonical `portway_knowledge.id`, version, source URL and approval state.
- Filter approval and audience permissions in D1 before returning any semantic matches.
- Re-check record status after vector lookup to avoid stale or revoked approvals.
- Store hashes and retention metadata, not secret prompts or personal health data.
- Default to keyword search until evaluation demonstrates semantic retrieval improves quality.

## MCP gateway contract
`src/mcp/read-only-gateway.mjs` is a validated tool dispatcher and descriptor list, not a network-exposed MCP protocol server. Supported operations: search approved records and fetch approved record by ID. No writes, arbitrary URL fetches, secrets or filesystem access. Protocol transport and authentication must be designed and tested before exposing a remote MCP endpoint.

## Current limitations
`src/agents/read-only-pipeline.mjs` is a deterministic dry-run pipeline. It does not execute a language model, crawl the web, independently fact-check sources or write memory. Claude Code subagents are developer helpers and not automatically deployed runtime agents.

## Staging verification checklist
- Separate Cloudflare account/environment binding and unique Worker name.
- New staging-only D1 database with its own ID; verify no production DB binding.
- Apply existing schema to staging only after explicit ID review.
- Run offline GitHub CI and local integration tests.
- Confirm API behavior, auth, CORS, quotas, prompt injection handling, logging and rollback.
- Only then request authorization to deploy staging. Production requires separate approval.
