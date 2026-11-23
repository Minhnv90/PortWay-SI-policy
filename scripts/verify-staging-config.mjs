import { readFileSync } from "node:fs";
import { strict as assert } from "node:assert";
const prod = readFileSync(new URL("../wrangler.toml", import.meta.url), "utf8");
const stage = readFileSync(new URL("../wrangler.staging.toml", import.meta.url), "utf8");
const value = (s,k) => s.match(new RegExp("^\\s*" + k + "\\s*=\\s*[\"']([^\"']+)[\"']", "m"))?.[1];
const prodName = value(prod, "name"), stageName = value(stage, "name");
assert.ok(prodName && stageName && prodName !== stageName && stageName.endsWith("-staging"), "Worker name must be distinct");
for (const flag of ["PORTWAY_AGENT_ENABLED","PORTWAY_MCP_ENABLED","PORTWAY_MEMORY_WRITE_ENABLED"]) assert.equal(value(stage,flag), "false", flag+" must be disabled");
const binding = stage.match(/^\s*binding\s*=\s*"KNOWLEDGE_DB"\s*$/m);
const id = value(stage,"database_id");
if (binding || id) {
  assert.ok(binding && id, "Staging D1 binding and ID must be configured together");
  assert.match(id, /^[0-9a-f]{8}-[0-9a-f-]{27,}$/i, "Invalid staging D1 database ID");
  const prodId = value(prod,"database_id");
  assert.ok(!prodId || id !== prodId, "Staging D1 ID must differ from production");
}
assert.doesNotMatch(stage, /\[triggers\]/, "Staging cron triggers disabled until approved");
console.log("PASS: staging config has separate Worker, disabled agent writes and no cron.");
console.log(id ? "Staging D1 ID present; account-level isolation still requires manual verification." : "Staging D1 not yet configured.");
