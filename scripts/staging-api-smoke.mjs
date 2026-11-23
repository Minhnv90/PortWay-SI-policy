// Run only against an explicitly supplied staging URL; never use production.
const base = process.env.PORTWAY_STAGING_URL;
if (!base) {
  console.error("Set PORTWAY_STAGING_URL to your verified staging workers.dev URL.");
  process.exit(2);
}
const url = new URL(base);
if (url.protocol !== "https:" || !/^[a-z0-9-]+\.workers\.dev$/i.test(url.hostname) || !url.hostname.includes("staging")) {
  throw new Error("Refusing non-staging Cloudflare URL");
}
if (url.pathname !== "/" || url.search || url.hash) throw new Error("Base URL must not include path, query or fragment");
const response = await fetch(new URL("/api/status", url), { signal: AbortSignal.timeout(10000), redirect: "error" });
if (!response.ok) throw new Error("Staging status HTTP " + response.status);
const data = await response.json();
if (data.service !== "PortWay SI" || data.status !== "online") throw new Error("Unexpected service response");
console.log(JSON.stringify({ target: url.origin, service: data.service, status: data.status, ai_configured: data.ai_configured, note: "Health and production not tested; AI completion not tested." }, null, 2));
