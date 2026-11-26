const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), ts = require('typescript');
const file=fs.readFileSync(path.join(__dirname,'../lib/portway/barge-cutoff-demo.ts'),'utf8');
const moduleStub={exports:{}};
new Function('module','exports',ts.transpileModule(file,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(moduleStub,moduleStub.exports);
const {evaluateBarge: run, scenarios: s, bargeClock: fmt, customerDraft: draft}=moduleStub.exports;
test('ready baseline and changed handoff, positive and negative margins',()=>{
 assert.deepEqual(run(s.ready.inputs),{status:'ahead',eta:660,margin:60});
 assert.deepEqual(run(s.risk.inputs),{status:'late',eta:750,margin:-30});
 assert.equal(run({...s.ready.inputs,factoryReady:570}).eta,750);
});
test('exact cutoff is not early or confirmed accepted',()=>{
 assert.deepEqual(run(s.exact.inputs),{status:'exact',eta:720,margin:0});
 assert.match(draft('exact'), /Chưa xác nhận lỡ chuyến tàu mẹ/);
});
test('missing, stale, or malformed inputs suppress both calculated output and draft',()=>{
 for(const inputs of [s.incomplete.inputs,s.stale.inputs,{...s.ready.inputs,cutoff:-1},{...s.ready.inputs,load:1.5}]){
  const r=run(inputs);assert.equal(r.eta,null);assert.equal(r.margin,null);assert.equal(draft(r.status),null);
 }
});
test('midnight overflow never wraps back to same-day cutoff',()=>{
 const r=run({...s.ready.inputs,emptyReady:1380,cutoff:1410});
 assert.equal(r.margin,-150);assert.equal(fmt(r.eta),'02:00 (+1 ngày)');
});
test('alternative requires confirmation and is computed against the same ETA',()=>{
 const a=moduleStub.exports.alternativeMargin;
 assert.equal(a(s.risk.inputs,'unverified'),null);
 assert.equal(a(s.risk.inputs,'unavailable'),null);
 assert.deepEqual(a(s.risk.inputs,'confirmed'),{cutoff:810,margin:60,usable:true});
 assert.deepEqual(a(s.risk.inputs,'confirmed',750),{cutoff:750,margin:0,usable:false});
 assert.equal(a(s.risk.inputs,'confirmed',720),null);
 for(const sample of [s.ready,s.incomplete,s.stale]) assert.equal(a(sample.inputs,'confirmed'),null);
});
