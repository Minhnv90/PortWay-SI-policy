# PortWay SI

PortWay SI is a Vietnamese-first strategic research workspace prototype.

## Current features
- Pi Browser SDK initialization in sandbox mode and Pi username authentication.
- Structured research intake and a copyable analysis worksheet.
- Explicit evidence discipline: verified / under review / inference / rumor.
- Research domains: geopolitics, finance, AI, blockchain/RWA, digital identity, logistics.

## Current limitations
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
