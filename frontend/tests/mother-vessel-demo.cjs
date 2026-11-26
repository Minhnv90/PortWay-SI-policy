const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), ts = require('typescript');
const m = {exports:{}};
const file = fs.readFileSync(path.join(__dirname,'../lib/portway/mother-vessel-demo.ts'),'utf8');
new Function('module','exports',ts.transpileModule(file,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(m,m.exports);
const {checkConnection: check, connectionDraft: draft} = m.exports;
test('mother-vessel cutoff remains independent and includes transfer',()=>{
 assert.deepEqual(check('enough',true),{status:'enough',cutoff:960,handoff:920,margin:40});
 assert.deepEqual(check('tight',true),{status:'tight',cutoff:920,handoff:920,margin:0});
 assert.deepEqual(check('late',true),{status:'late',cutoff:900,handoff:920,margin:-20});
});
test('unverified or unavailable barge and missing mother-vessel data are unknown',()=>{
 for(const [c,slot] of [['enough',false],['pending',true],['missing',true]]) {
  assert.deepEqual(check(c,slot),{status:'unknown',cutoff:null,handoff:null,margin:null});
 }
 assert.match(draft(check('late',true).status),/dự kiến bàn giao sau giờ chốt/);
});
