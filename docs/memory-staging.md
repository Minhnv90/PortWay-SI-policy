# portway SI Memory staging
Create a dedicated Cloudflare KV namespace named portway-si-memory-staging. Bind it as MEMORY_KV to the staging Worker only. Never reuse the other SI namespace or production storage. Record the actual namespace ID in the staging configuration; do not invent IDs.
Set MCP_READ_TOKEN as a separate secret through Cloudflare, never in Git.
Acceptance: use synthetic data and authorized test Pi accounts. Save with consent, read, verify other account cannot read, delete, verify no memory after deletion. Check opt-in AI context, RAG approved vs draft, MCP authentication and read-only tool, mobile/desktop/Pi Browser. Do not deploy or merge without owner approval.
KV is eventually consistent; verify deletion propagation before acceptance. No medical records or raw access tokens in KV.
