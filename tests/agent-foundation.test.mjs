import test from "node:test";
import assert from "node:assert/strict";
import { planResearch, composeResearch } from "../src/agents/orchestrator.mjs";
import { READ_ONLY_TOOLS, dispatchReadOnlyTool } from "../src/mcp/read-only-gateway.mjs";
import { createApprovedRetrieval } from "../src/memory/approved-retrieval.mjs";

test("logistics research is routed to specialist", () => {
  assert.deepEqual(planResearch("Kiểm tra VGM container").steps, ["researcher", "verifier", "logistics"]);
  assert.deepEqual(planResearch("Phân tích kinh tế").steps, ["researcher", "verifier"]);
});
test("orchestrator never marks missing agents completed", () => {
  const plan = planResearch("VGM container");
  assert.equal(composeResearch(plan, { researcher: { status: "completed" } }).complete, false);
});
test("MCP dispatcher rejects non-allowlisted writes", async () => {
  await assert.rejects(dispatchReadOnlyTool("delete_database", {}, {}), /allowlisted/);
  assert.equal(READ_ONLY_TOOLS.length, 2);
});
test("MCP dispatcher validates arguments", async () => {
  await assert.rejects(dispatchReadOnlyTool("portway_get_source", { id: "../secret" }, {}), /Invalid id/);
  await assert.rejects(dispatchReadOnlyTool("portway_search_approved", { query: "test", admin: true }, {}), /Invalid query/);
});
test("MCP dispatcher calls only approved adapter", async () => {
  const value = await dispatchReadOnlyTool("portway_search_approved", { query: " VGM " }, { searchApproved: async q => [q] });
  assert.deepEqual(value, ["VGM"]);
});
test("D1 retrieval binds parameters and requires approved records", async () => {
  let sql = "", binds = [];
  const db = { prepare(s) { sql = s; return { bind(...a) { binds = a; return { all: async () => ({ results: [{ id: "ok" }] }), first: async () => ({ id: "ok" }) }; } }; } };
  const adapter = createApprovedRetrieval(db);
  assert.deepEqual(await adapter.searchApproved("VGM"), [{ id: "ok" }]);
  assert.match(sql, /approval_status = 'approved'/);
  assert.equal(binds.length, 3);
  assert.deepEqual(await adapter.getApprovedById("record-1"), { id: "ok" });
  assert.match(sql, /approval_status = 'approved'/);
  assert.deepEqual(binds, ["record-1"]);
});
