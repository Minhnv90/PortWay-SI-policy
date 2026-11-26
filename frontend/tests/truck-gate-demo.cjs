const {test}=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path'), ts=require('typescript')
const m={exports:{}}
new Function('module','exports',ts.transpileModule(fs.readFileSync(path.join(__dirname,'../lib/portway/truck-gate-demo.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(m,m.exports)
const {gateResult:r,truckCases:c}=m.exports
test('planned, late, and exact are forecasts, not yard receipt',()=>{
 assert.deepEqual(r(c.planned.input),{status:'ahead',eta:540,margin:60})
 assert.deepEqual(r(c.late.input),{status:'late',eta:630,margin:-30})
 assert.equal(r({...c.planned.input,cutoff:540}).status,'tight')
})
test('arrived at gate is distinct from verified yard receipt',()=>{
 assert.deepEqual(r(c.atGate.input),{status:'at-gate',eta:null,margin:null})
 assert.deepEqual(r(c.received.input),{status:'received',eta:null,margin:null})
})
test('no estimate if pickup is missing or factual time sequence is inconsistent',()=>{
 for(const item of [c.missing.input,{...c.received.input,atGate:null},{...c.received.input,yardReceipt:535},{...c.planned.input,driveMinutes:-3}]){
  assert.deepEqual(r(item),{status:'unknown',eta:null,margin:null})
 }
})
