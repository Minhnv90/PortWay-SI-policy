// Read-only offline smoke tests. No network, production access, database or real AI.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const workerSource = await readFile(new URL('../worker.js', import.meta.url), 'utf8');
const mod = await import('data:text/javascript;base64,' + Buffer.from(workerSource).toString('base64'));
const worker = mod.default;
const origin = 'https://minhnv90.github.io';
const env = { ALLOWED_ORIGINS: origin, AI_MODEL: '@cf/test/mock', AI: { async run() { return { response: 'Đây là phản hồi giả lập phục vụ kiểm thử.' }; } } };
function req(path, method = 'POST', body, headers = {}) {
  return new Request('https://staging.invalid' + path, { method, headers: { Origin: origin, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...headers }, ...(body === undefined ? {} : { body: typeof body === 'string' ? body : JSON.stringify(body) }) });
}
test('status endpoint is read-only', async () => { const r = await worker.fetch(new Request('https://staging.invalid/api/status'), env, {}); assert.equal(r.status, 200); assert.equal((await r.json()).status, 'online'); });
test('rejects unauthorized origins', async () => { const r = await worker.fetch(req('/api/research-assist', 'POST', {question:'test'}, {Origin:'https://attacker.invalid'}), env, {}); assert.equal(r.status, 403); });
test('preflight for allowed origin', async () => { const r = await worker.fetch(req('/api/research-assist', 'OPTIONS'), env, {}); assert.equal(r.status, 204); });
test('rejects invalid JSON', async () => { const r = await worker.fetch(req('/api/research-assist', 'POST', '{invalid'), env, {}); assert.equal(r.status, 400); });
test('rejects empty question', async () => { const r = await worker.fetch(req('/api/research-assist', 'POST', {question:'',}), env, {}); assert.equal(r.status, 400); });
test('rejects overlong question', async () => { const r = await worker.fetch(req('/api/research-assist', 'POST', {question:'x'.repeat(8001),}), env, {}); assert.equal(r.status, 400); });
test('rejects unauthenticated admin upsert', async () => { const r = await worker.fetch(req('/api/admin/knowledge/upsert', 'POST', {records:[]}), env, {}); assert.equal(r.status, 401); });
test('AI unconfigured returns 503', async () => { const r = await worker.fetch(req('/api/research-assist', 'POST', {question:'Xin chào',}), {...env,AI:undefined}, {}); assert.equal(r.status, 503); });
test('mock AI response only', async () => { const r = await worker.fetch(req('/api/research-assist', 'POST', {question:'Cần xác minh chứng từ xuất khẩu thế nào?',}), env, {}); assert.equal(r.status, 200); const j = await r.json(); assert.match(j.answer, /giả lập/); });
test('scheduled event does not call AI', async () => { let calls=0; const e={...env,AI:{async run(){calls++;throw Error('Unexpected AI call')}}}; await worker.scheduled({cron:'0 */6 * * *'},e,{}); assert.equal(calls,0); });
