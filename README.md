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
- No live news feed, AI model, backend, database, or automatic fact-checking is connected yet.
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

### Deploy
1. Install Node.js LTS and run `npm install -g wrangler`.
2. Run `npx wrangler login` from this repository folder.
3. Replace the placeholder origin in `wrangler.toml` with the exact deployed PortWay SI Pages origin.
4. Set secrets (use your chosen OpenAI-compatible chat-completions endpoint and model):
   - `npx wrangler secret put AI_CHAT_COMPLETIONS_URL`
   - `npx wrangler secret put AI_API_KEY`
   - `npx wrangler secret put AI_MODEL`
5. Deploy with `npx wrangler deploy`.

The frontend prototype is not yet wired to this API. After deployment, configure the frontend to call your Worker URL. Do not put provider keys in frontend code or GitHub.


## Pi identity verification

The Pi login button sends the Pi SDK access token to this app's Worker at `POST /api/pi/verify`. The Worker validates it with the official Pi Platform API `GET https://api.minepi.com/v2/me` and returns only the verified Pioneer UID and username. The access token is not saved in browser localStorage. Enter the deployed Worker URL in this app's API URL field before signing in. Pi documentation describes the verified UID as an identifier for a Pioneer within an app, so do not assume the UID is identical across two separately registered Pi apps. A true shared account needs a central account-linking service: the user must authenticate in both apps, both tokens must be verified server-side, and the linkage must be stored only after explicit user consent. A persistent shared member database/session, reward ledger, and Pi payment/payout flows still need to be built and configured.