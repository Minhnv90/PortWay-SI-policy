import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
test("staging schema inspection produces read-only statements", () => {
  const output = execFileSync(process.execPath, ["scripts/inspect-staging-schema.mjs"], { encoding: "utf8" });
  assert.match(output, /portway-si-knowledge-staging/);
  assert.match(output, /PRAGMA table_info/);
  assert.doesNotMatch(output, /\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE)\b/i);
});
