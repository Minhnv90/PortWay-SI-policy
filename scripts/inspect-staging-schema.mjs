// Read-only inspection against an explicit, user-provided staging D1 database.
// This script generates SQL for manual review; it does NOT connect to Cloudflare.
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
const stage = readFileSync(new URL("../wrangler.staging.toml", import.meta.url), "utf8");
const prod = readFileSync(new URL("../wrangler.toml", import.meta.url), "utf8");
const id = stage.match(/^database_id\s*=\s*"([^"]+)"/m)?.[1];
const name = stage.match(/^database_name\s*=\s*"([^"]+)"/m)?.[1];
assert.equal(name, "portway-si-knowledge-staging");
assert.match(id || "", /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i);
assert.ok(!prod.includes(id), "Staging D1 UUID appears in production config");
const queries = [
  "SELECT name FROM sqlite_master WHERE type='table' AND name='portway_knowledge';",
  "PRAGMA table_info(portway_knowledge);",
  "SELECT approval_status, COUNT(*) AS records FROM portway_knowledge GROUP BY approval_status;"
];
console.log("Verified staging config: " + name + " / " + id);
console.log("Read-only SQL (run ONLY after checking Cloudflare account and database):\n" + queries.join("\n"));
