const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const source = path.join(__dirname, '../lib/portway/research-demo.ts');
const { outputText } = ts.transpileModule(fs.readFileSync(source, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
const mod = { exports: {} };
new Function('module', 'exports', outputText)(mod, mod.exports);
const { simulateResearch, forwardResearch } = mod.exports;

test('demo returns the correct sample with explicit simulation provenance and no verification', () => {
  const answer = simulateResearch('A trọn gói 1.130 USD, B cước 1.020 USD', 'vi');
  assert.match(answer.summary, /dưới 110 USD/);
  assert.equal(answer.researchMode, 'simulation');
  assert.deepEqual(answer.sources, []);
  assert.match(answer.strategicAnalysis.caveats[0], /Không gọi/);
  assert.match(simulateResearch('giá Pi', 'vi').summary, /chưa trả lời/);
});

test('live adapter sends only the current question to its fixed endpoint and does not endorse citations', async () => {
  const result = await forwardResearch('câu hỏi', 'vi', async (url, request) => {
    assert.equal(url, 'https://portway-si-policy.nguyenminh2290.workers.dev/api/research-assist');
    assert.deepEqual(JSON.parse(request.body), { question: 'câu hỏi' });
    assert.equal(request.redirect, 'error');
    assert.equal(request.credentials, undefined);
    assert.equal(request.headers.Authorization, undefined);
    return Response.json({ answer: 'Kết quả test', sources: [ { url: 'https://fixture.invalid/' } ] });
  });
  assert.equal(result.answer.summary, 'Kết quả test');
  assert.equal(result.answer.researchMode, 'worker');
  assert.deepEqual(result.answer.verifiedFacts, []);
  assert.deepEqual(result.answer.sources, []);
  assert.match(result.answer.strategicAnalysis.caveats[0], /chưa được xác minh/);
});

test('fails cleanly on timeout, missing or oversized payload without a fallback', async () => {
  for (const [factory, code, status] of [
    [() => new Response('', {status: 504}), 'research_timeout', 504],
    [() => new Response('', {status: 500}), 'research_unavailable', 503],
    [() => new Response('<html>'), 'unreadable_answer', 502],
    [() => Response.json({answer: ' '}), 'unreadable_answer', 502],
    [() => Response.json({answer: 'x'.repeat(140_000)}), 'unreadable_answer', 502],
    [() => {throw new Error('mock network failure');}, 'research_unavailable', 503],
  ]) {
    let calls = 0;
    const result = await forwardResearch('x', 'vi', async () => { calls++; return factory(); });
    assert.deepEqual(result, {error: code, status});
    assert.equal(calls, 1);
  }
});
