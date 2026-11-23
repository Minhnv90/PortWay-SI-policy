// Offline approved-only D1/RAG contract checks. Synthetic records, no real database or API.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const source = await readFile(new URL('../worker.js', import.meta.url), 'utf8');
const worker = (await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'))).default;
const approved = {id:'synthetic-approved',title:'Bản ghi giả lập đã duyệt',summary:'Nội dung giả lập',body:'Thông tin thử nghiệm không phải dữ kiện thực.',source_title:'Nguồn thử nghiệm',source_organization:'Đơn vị giả lập',source_url:'https://example.org/synthetic',updated_at:'2026-01-01',last_checked_at:'2026-01-01',geography:'Thử nghiệm',evidence_status:'verified_primary',claim:'Dữ kiện giả lập',counter_evidence:'',unknowns:''};
const draft = {...approved,id:'synthetic-draft',title:'Không được phép xuất hiện',approval_status:'draft'};
const mockDB = {prepare(sql){assert.match(sql,/approval_status = 'approved'/);return {bind(...params){assert.ok(params.length>1);return {async all(){return {results:[approved]};}};}};}};
const origin='https://minhnv90.github.io';
const request=(path,body)=>new Request('https://staging.invalid'+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
const makeEnv=(capture)=>({ALLOWED_ORIGINS:origin,AI_MODEL:'@cf/mock',KNOWLEDGE_DB:mockDB,AI:{async run(_model,input){capture.push(JSON.stringify(input));return {response:'Đây là câu trả lời giả lập.'};}}});
test('D1 search restricts SQL to approved records',async()=>{const env=makeEnv([]);const res=await worker.fetch(request('/api/knowledge/search',{query:'giả lập'}),env,{});assert.equal(res.status,200);const json=await res.json();assert.equal(json.count,1);assert.equal(json.records[0].id,approved.id);});
test('AI receives approved D1 record with provenance',async()=>{const capture=[];const env=makeEnv(capture);const res=await worker.fetch(request('/api/research-assist',{question:'Phân tích vận hành giả lập'}),env,{});assert.equal(res.status,200);const json=await res.json();assert.equal(json.knowledge_count,1);assert.equal(capture.length,1);assert.match(capture[0],/Bản ghi giả lập đã duyệt/);assert.match(capture[0],/example.org\\/synthetic/);});
test('Unconfigured D1 search is unavailable, not silently trusted',async()=>{const env=makeEnv([]);delete env.KNOWLEDGE_DB;const res=await worker.fetch(request('/api/knowledge/search',{query:'test'}),env,{});assert.equal(res.status,503);});
