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

test("preview rejects oversized body even without Content-Length", async () => {
  const req = new Request("https://portway-si-policy-staging.example.com/api/agent/preview", {
    method: "POST", headers: { Origin: "http://localhost:8788", Authorization: "Bearer test-token", "Content-Type": "application/json" },
    body: JSON.stringify({ question: "x".repeat(5000) })
  });
  const response = await worker.fetch(req, { PORTWAY_AGENT_ENABLED: "true", ALLOWED_ORIGINS: "http://localhost:8788", STAGING_PREVIEW_TOKEN: "test-token", KNOWLEDGE_DB: {} }, {});
  assert.equal(response.status, 413);
});
test("preview rejects non-JSON requests", async () => {
  const req = new Request("https://portway-si-policy-staging.example.com/api/agent/preview", {
    method: "POST", headers: { Origin: "http://localhost:8788", Authorization: "Bearer test-token", "Content-Type": "text/plain" },
    body: "VGM"
  });
  const response = await worker.fetch(req, { PORTWAY_AGENT_ENABLED: "true", ALLOWED_ORIGINS: "http://localhost:8788", STAGING_PREVIEW_TOKEN: "test-token", KNOWLEDGE_DB: {} }, {});
  assert.equal(response.status, 415);
});

test("staging blocks admin upsert even with credentials", async () => {
  const req = new Request("https://portway-si-policy-staging.example.com/api/admin/knowledge/upsert", { method:"POST", headers:{Authorization:"Bearer test-token"}, body:"{}" });
  const res = await worker.fetch(req, {KNOWLEDGE_ADMIN_TOKEN:"test-token", KNOWLEDGE_DB:{}}, {});
  assert.equal(res.status,403);
  assert.equal((await res.json()).error,"staging_admin_disabled");
});
test("staging blocks arbitrary write routes", async () => {
  const req = new Request("https://portway-si-policy-staging.example.com/api/status", {method:"PUT",body:"{}"});
  const res = await worker.fetch(req,{}, {});
  assert.equal(res.status,405);
});
