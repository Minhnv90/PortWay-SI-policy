import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker.js';
const env={ALLOWED_ORIGINS:'https://example.com',AI_MODEL:'mock',AI:{run:async()=>({response:'Test answer'})}};
const req=(path,body,headers={})=>new Request('https://worker.example'+path,{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://example.com',...headers},body});
test('missing Pi token rejected',async()=>assert.equal((await worker.fetch(req('/api/pi/verify','{}'),env,{})).status,401));
test('invalid research body rejected',async()=>{for(const body of ['null','[]','{','{}'])assert.equal((await worker.fetch(req('/api/research-assist',body),env,{})).status,400)});
test('AI response and provider error',async()=>{const r=await worker.fetch(req('/api/research-assist',JSON.stringify({question:'Test logistics'})),env,{});assert.equal(r.status,200);assert.equal((await r.json()).answer,'Test answer');const bad={...env,AI:{run:async()=>{throw Error('mock failure')}}};assert.equal((await worker.fetch(req('/api/research-assist',JSON.stringify({question:'Test logistics'})),bad,{})).status,502)});
test('untrusted origin rejected',async()=>assert.equal((await worker.fetch(req('/api/pi/verify','{}',{Origin:'https://evil.example'}),env,{})).status,403));

test('knowledge search rejects malformed JSON objects',async()=>{for(const body of ['null','[]','{','{}']){const request=new Request('https://worker.example/api/knowledge/search',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://example.com'},body});const response=await worker.fetch(request,{ALLOWED_ORIGINS:'https://example.com',KNOWLEDGE_DB:{}},{});assert.equal(response.status,400);}});

test('RAG uses bound parameters and approved HTTPS nonempty source filters',async()=>{let sql,params;const record={title:'Test logistics',approval_status:'approved',source_url:'https://example.com/source',body:'Synthetic evidence'};const db={prepare:s=>{sql=s;return {bind:(...p)=>{params=p;return {all:async()=>({results:[record]})}}}}};const response=await worker.fetch(req('/api/knowledge/search',JSON.stringify({query:'logistics'})),{...env,KNOWLEDGE_DB:db},{});assert.equal(response.status,200);assert.equal((await response.json()).count,1);assert.match(sql,/approval_status = 'approved'/);assert.match(sql,/source_url LIKE 'https:\/\/%'/);assert.match(sql,/trim\(body\) <> ''/);assert.ok(params.includes('%logistics%'));assert.ok(!sql.includes('logistics'));});
