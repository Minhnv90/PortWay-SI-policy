import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const worker = readFileSync(new URL("../worker.js", import.meta.url), "utf8");
const staging = readFileSync(new URL("../wrangler.staging.toml", import.meta.url), "utf8");
const instructions = readFileSync(new URL("../CLAUDE.md", import.meta.url), "utf8");

test("existing research and identity routes remain in baseline", () => {
  for (const route of ["/api/research-assist", "/api/pi/verify", "/api/knowledge/search", "/api/admin/knowledge/upsert"]) {
    assert.ok(worker.includes(route), `Missing route: ${route}`);
  }
});
test("knowledge retrieval requires approved records", () => {
  assert.match(worker, /approval_status = 'approved'/);
});
test("staging Worker name is distinct from production", () => {
  assert.match(staging, /^name = "portway-si-policy-staging"$/m);
  assert.doesNotMatch(staging.split("\n").filter(line => !line.trim().startsWith("#")).join("\n"), /^\s*database_id\s*=/m);
});
test("agent runtime flags default disabled", () => {
  for (const name of ["PORTWAY_AGENT_ENABLED", "PORTWAY_MCP_ENABLED", "PORTWAY_MEMORY_WRITE_ENABLED"]) {
    assert.ok(staging.includes(`${name} = "false"`));
  }
});
test("developer instructions prohibit production deploy and remote D1 migration", () => {
  assert.match(instructions, /wrangler deploy/);
  assert.match(instructions, /d1 execute --remote/);
});
