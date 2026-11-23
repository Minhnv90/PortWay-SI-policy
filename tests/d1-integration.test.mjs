import test from "node:test";
import assert from "node:assert/strict";
import { createApprovedRetrieval } from "../src/memory/approved-retrieval.mjs";
import { runReadOnlyResearch } from "../src/agents/read-only-pipeline.mjs";

// In-memory adapter exercises the SQL contract without any remote credentials.
const records = [
  { id: "approved-vgm", title: "VGM", claim: "Verified Gross Mass", summary: "Container weight", source_url: "https://example.org/vgm", approval_status: "approved", evidence_status: "corroborated" },
  { id: "draft-vgm", title: "VGM draft", claim: "Draft claim", summary: "Unreviewed", source_url: "https://example.org/draft", approval_status: "draft" }
];
function fakeD1() {
  return { prepare(sql) {
    assert.match(sql, /approval_status = 'approved'/);
    return { bind(...args) {
      return {
        async all() {
          const q = String(args[0]).replaceAll("%", "").replaceAll("\\", "").toLowerCase();
          return { results: records.filter(r => r.approval_status === "approved" && [r.title,r.claim,r.summary].some(s => s.toLowerCase().includes(q))) };
        },
        async first() { return records.find(r => r.id === args[0] && r.approval_status === "approved") || null; }
      };
    } };
  } };
}
test("D1 approved-only adapter excludes draft records end to end", async () => {
  const adapters = createApprovedRetrieval(fakeD1());
  const result = await runReadOnlyResearch("VGM", adapters);
  assert.equal(result.sources.length, 1);
  assert.equal(result.sources[0].id, "approved-vgm");
  assert.equal(result.complete, false);
  assert.equal(result.verification, "metadata_only");
  assert.equal(await adapters.getApprovedById("draft-vgm"), null);
});
test("missing D1 fails closed", () => {
  assert.throws(() => createApprovedRetrieval(null), /required/);
});
