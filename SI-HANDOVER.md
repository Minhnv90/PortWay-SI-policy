# SI handover

- Production: main (do not modify or deploy from this review).
- Canonical staging branch: `staging/si-handover`.
- Review branch: `review/pi-auth-race-20261126`, PR #11 into staging only.
- Canonical frontend source: frontend/; retain existing ZIP as backup, not a second build source.
- CI: retain build, OpenNext, regression and packaging checks. Packaging is not deployment.
- Cloudflare: inventory frontend and backend staging Workers separately; confirm active commit, bindings, routes and rollback before changing dashboard settings. Do not delete Workers, databases, KV or secrets.
- Release gate: all CI green, live Pi authentication and AI/RAG checks, verify ZIP import compatibility. Review ZIP is not a production release.
