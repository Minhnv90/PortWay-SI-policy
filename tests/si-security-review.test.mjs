import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker.js';
const env={ALLOWED_ORIGINS:'https://example.com',AI_MODEL:'mock',AI:{run:async()=>({response:'Test answer'})}};
const req=(path,body,headers={})=>new Request('https://worker.example'+path,{method:'POST',headers:{'Content-Type':'application/json',...headers},body});
test('missing Pi token rejected',async()=>assert.equal((await worker.fetch(req('/api/pi/verify','{}'),env,{})).status,401));
test('invalid research body rejected',async()=>{for(const body of ['null','[]','{','{}'])assert.equal((await worker.fetch(req('/api/research-assist',body),env,{})).status,400)});
test('AI response and provider error',async()=>{const r=await worker.fetch(req('/api/research-assist',JSON.stringify({question:'Test logistics'})),env,{});assert.equal(r.status,200);assert.equal((await r.json()).answer,'Test answer');const bad={...env,AI:{run:async()=>{throw Error('mock failure')}}};assert.equal((await worker.fetch(req('/api/research-assist',JSON.stringify({question:'Test logistics'})),bad,{})).status,502)});
test('untrusted origin rejected',async()=>assert.equal((await worker.fetch(req('/api/pi/verify','{}',{Origin:'https://evil.example'}),env,{})).status,403));
