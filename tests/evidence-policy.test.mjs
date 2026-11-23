import test from "node:test";
import assert from "node:assert/strict";
import { assessEvidence } from "../src/agents/evidence-policy.mjs";
test("HTTPS link is not independent verification", () => {
  const result = assessEvidence({ id: "x", source_url: "https://example.org", evidence_status: "verified_primary" });
  assert.equal(result.source_link_present, true);
  assert.equal(result.independent_verification_completed, false);
  assert.equal(result.requires_reviewer, true);
});
test("unknown statuses fail to unknown", () => {
  assert.equal(assessEvidence({ evidence_status: "trusted_by_ai" }).evidence_status, "unknown");
});
