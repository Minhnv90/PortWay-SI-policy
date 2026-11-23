import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
test("staging guard accepts isolated default configuration", () => {
  const output = execFileSync(process.execPath, ["scripts/verify-staging-config.mjs"], { encoding: "utf8" });
  assert.match(output, /PASS: staging config/);
  assert.match(output, /not yet configured/);
});
