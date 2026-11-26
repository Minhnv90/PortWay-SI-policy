# SI handover

- Production: main (do not modify or deploy from this review).
- Canonical staging branch: `staging/si-handover`.
- Review branch: `review/pi-auth-race-20261126`, PR #11 into staging only.
- Canonical frontend source: frontend/; retain existing ZIP as backup, not a second build source.
- CI: retain build, OpenNext, regression and packaging checks. Packaging is not deployment.
- Cloudflare: inventory frontend and backend staging Workers separately; confirm active commit, bindings, routes and rollback before changing dashboard settings. Do not delete Workers, databases, KV or secrets.
- Release gate: all CI green, live Pi authentication and AI/RAG checks, verify ZIP import compatibility. Review ZIP is not a production release.


## Mandatory human-centered AI acceptance gates

Design → patch → test → acceptance → next item. Record evidence and mark unverified controls PENDING. Never equate mocked CI with live acceptance.

- Data ownership: document user access, export and deletion controls; verify authorization and isolation.
- Privacy by design: minimize collection, retention and logs; protect health, children and business-confidential data.
- Consent first: explicit opt-in for optional memory and separate authorization for training or secondary use.
- Copyright: record provenance and usage permissions; do not ingest unauthorized protected material.
- RAG transparency: approved sources, citations, uncertainty and prompt-injection tests.
- Memory control: test consent, read, update, deletion, retention and cross-user isolation.
- AI governance: least privilege, read-only MCP, abuse prevention, failure handling and audit evidence.

For each critical patch run regression 100 times plus distinct negative cases; verify staging integrations before release. Real Pi login is the final integration gate, not bypassed. Preserve production, secrets and existing data. These are requirements, not claims of implemented or certified controls.
