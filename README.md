# PortWay SI

PortWay SI is a Vietnamese-first maritime and strategic intelligence workspace. Its flagship research focus is the connected maritime economy around the Gulf of Gành Rái: Cái Mép–Thị Vải/Cái Mép Hạ, Long Sơn–Phú Mỹ, Cần Giờ, and relevant links to Vũng Tàu and the hinterland. Gành Rái is an independent analytical lens, not an approved regional governance plan.

## Current features
- Pi Browser SDK initialization in sandbox mode and Pi username authentication.
- Structured research intake and a copyable analysis worksheet.
- Explicit evidence discipline: verified / under review / inference / rumor.
- Regional research focus: Cái Mép–Thị Vải/Cái Mép Hạ, Long Sơn–Phú Mỹ, Cần Giờ, Vũng Tàu and hinterland connectivity.
- Cross-sector intelligence: ports, shipping, cargo flows, industrial/energy assets, logistics, infrastructure, investment/legal status, blue economy, digital trade and scenario analysis.
- Evidence discipline: distinguish proposal, planning, approval, financing, construction and commercial operation; distinguish design capacity from actual throughput.

## Current limitations
- The regional dossiers and intelligence modules are starter research frameworks, not verified live datasets.
- AI Worker includes optional D1-backed retrieval of approved PortWay knowledge records; configure and migrate D1 before it becomes active.
- The knowledge engine is a keyword-search MVP; it does not crawl the web or automatically verify claims.
- The analysis worksheet is a template, not an AI-generated factual conclusion.
- No investment advice or guaranteed predictions.

## Run locally
Open `index.html` in a browser, or serve this folder with any static HTTP server.

## Deploy with GitHub Pages
1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`, then Save.
4. Wait for the Pages URL shown on that screen.

## Pi Browser
- Pi SDK: `https://sdk.minepi.com/pi-sdk.js`.
- Sandbox mode is enabled for initial testing.
- Register and verify the production domain in the Pi Developer Portal before switching out of sandbox.
- Never put API keys or secrets in browser JavaScript. AI and external data integrations require a secure backend.


## AI API backend (Cloudflare Workers)

The isolated API worker is in `worker.js`; configuration is in `wrangler.toml`.
It exposes `POST /api/research-assist`. It accepts a research question and up to eight user-supplied evidence snippets. It does not crawl the web, authenticate sources, or persist requests.

### Current Cloudflare Workers AI configuration (staging only)

The current Worker calls `env.AI.run(env.AI_MODEL, ...)` using the native Cloudflare Workers AI binding declared as `[ai] binding = "AI"` in `wrangler.toml`. `AI_MODEL` is a non-secret `[vars]` setting. The older `AI_CHAT_COMPLETIONS_URL` and `AI_API_KEY` setup is **not used** by this Worker. Do not create or commit API keys to GitHub. Check model availability and successful runtime inference separately.

### Staging-only configuration and checks

1. Keep `main` and the existing production Worker unchanged. This branch is configuration preparation, **not** a deployment instruction.
2. `[triggers] crons = ["0 */6 * * *"]` schedules every six hours (UTC). The `scheduled()` handler is intentionally a **no-op**: it only logs an invocation; it does not crawl sources, write D1, call AI, or self-train.
3. Create a **new**, isolated Cloudflare D1 database named `portway-si-staging` for staging. Never reuse a production database ID. In this branch's `wrangler.toml`, uncomment the `[[d1_databases]]` block and replace its placeholder with the real new database ID **only after** the staging database exists. The binding must be `KNOWLEDGE_DB` because `worker.js` uses `env.KNOWLEDGE_DB`.
4. Inspect the existing migration SQL before applying it to the **staging database only**. Do not run remote migrations or any write against production.
5. Test with mock AI, synthetic records, rejected origins, malformed JSON, denied admin access and unverified evidence / fabricated shipping schedules. Record evidence and failures before proposing any release.
6. Any future staging deployment must use a separately named Worker, explicitly isolated staging bindings, and a separate approval. Never run a default `wrangler deploy` from this branch against an existing production Worker.

The frontend's Worker URL must also be verified independently. This change does not connect an AI endpoint or prove a live AI response.

## Pi identity verification

The Pi login button sends the Pi SDK access token to this app's Worker at `POST /api/pi/verify`. The Worker validates it with the official Pi Platform API `GET https://api.minepi.com/v2/me` and returns only the verified Pioneer UID and username. The access token is not saved in browser localStorage. Enter the deployed Worker URL in this app's API URL field before signing in. Pi documentation describes the verified UID as an identifier for a Pioneer within an app, so do not assume the UID is identical across two separately registered Pi apps. A true shared account needs a central account-linking service: the user must authenticate in both apps, both tokens must be verified server-side, and the linkage must be stored only after explicit user consent. A persistent shared member database/session, reward ledger, and Pi payment/payout flows still need to be built and configured.

## Knowledge engine

See [`KNOWLEDGE_ENGINE.md`](./KNOWLEDGE_ENGINE.md) for the separate Cloudflare D1 schema, migration, admin ingestion API, approved-record search, and deployment instructions. The D1 binding and `KNOWLEDGE_ADMIN_TOKEN` must be configured before knowledge retrieval or ingestion will work.


## Separate staging Worker configuration

Use `wrangler.staging.toml` for staging only. It has a Worker name distinct from production. The D1 block remains commented until the real staging database ID is available. **Do not deploy yet.** After explicit staging deployment approval, use the explicit `--config wrangler.staging.toml` option and verify the target account, Worker name, routes, bindings and secrets before any deployment.
