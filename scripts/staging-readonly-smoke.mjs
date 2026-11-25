// Read-only staging smoke test. Node 20+. No secrets printed.
const base = new URL(process.env.STAGING_URL || "https://portway-si-staging.nguyenminh2290.workers.dev");
if (base.protocol !== "https:" || base.hostname !== "portway-si-staging.nguyenminh2290.workers.dev") throw new Error("Unexpected staging host");
async function check(path, options, expected) {
  const response = await fetch(new URL(path, base), {...options, redirect:"error", signal:AbortSignal.timeout(20000)});
  if (response.status !== expected) throw new Error(path + ": unexpected HTTP " + response.status);
  console.log(path + ": HTTP " + response.status);
  return response;
}
await check("/api/status", {}, 200);
await check("/api/diagnostics/storage", {}, 401);
await check("/api/pi/verify", {method:"POST"}, 401);
const knowledge = await check("/api/knowledge/search", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:"kiến thức thương mại sức khỏe"})}, 200);
const result = await knowledge.json();
if (!Array.isArray(result.records) || result.records.some(r => r.approval_status !== "approved" || !String(r.source_url || "").startsWith("https://") || !String(r.body || "").trim())) throw new Error("RAG evidence policy failed");
console.log("RAG evidence policy checked; records: " + result.records.length);
const token = process.env.MCP_READ_TOKEN;
if (token) {
  const response = await check("/api/diagnostics/storage", {headers:{Authorization:"Bearer "+token}}, 200);
  const data = await response.json();
  if (data.checks?.d1 !== "ok" || data.checks?.kv !== "read_ok") throw new Error("Storage checks failed");
  console.log("D1 and KV read verified");
} else console.log("Authenticated storage test skipped: MCP_READ_TOKEN not supplied");
console.log("No write, AI generation, or production test performed.");
