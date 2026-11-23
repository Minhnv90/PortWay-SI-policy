import test from "node:test";
import assert from "node:assert/strict";
import worker from "../staging-worker.mjs";

const request = () => new Request("https://portway-si-policy-staging.example.com/api/agent/preview", { method: "POST", headers: { Origin: "http://localhost:8788", Authorization: "Bearer test-token", "Content-Type": "application/json" }, body: JSON.stringify({ question: "VGM" }) });
test("preview is disabled by default", async () => {
  const response = await worker.fetch(request(), { ALLOWED_ORIGINS: "http://localhost:8788" }, {});
  assert.equal(response.status, 404);
});
test("preview rejects missing token", async () => {
  const response = await worker.fetch(request(), { PORTWAY_AGENT_ENABLED: "true", ALLOWED_ORIGINS: "http://localhost:8788" }, {});
  assert.equal(response.status, 401);
});
test("preview refuses non-allowlisted Origin", async () => {
  const response = await worker.fetch(request(), { PORTWAY_AGENT_ENABLED: "true", ALLOWED_ORIGINS: "https://other.example", STAGING_PREVIEW_TOKEN: "test-token" }, {});
  assert.equal(response.status, 403);
});
test("preview fails closed without D1", async () => {
  const response = await worker.fetch(request(), { PORTWAY_AGENT_ENABLED: "true", ALLOWED_ORIGINS: "http://localhost:8788", STAGING_PREVIEW_TOKEN: "test-token" }, {});
  assert.equal(response.status, 503);
});
