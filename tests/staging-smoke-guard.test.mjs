import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
test("smoke script refuses missing staging URL", () => {
  const r = spawnSync(process.execPath, ["scripts/staging-api-smoke.mjs"], { encoding: "utf8", env: { PATH: process.env.PATH || "" } });
  assert.equal(r.status, 2);
});
test("smoke script refuses production URL before network", () => {
  const r = spawnSync(process.execPath, ["scripts/staging-api-smoke.mjs"], { encoding: "utf8", env: { PATH: process.env.PATH || "", PORTWAY_STAGING_URL: "https://portway-si-policy.workers.dev" } });
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /Refusing non-staging/);
});
