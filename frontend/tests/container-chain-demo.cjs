const {test}=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path'), ts=require('typescript')
const m={exports:{}}
new Function('module','exports',ts.transpileModule(fs.readFileSync(path.join(__dirname,'../lib/portway/container-chain-demo.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(m,m.exports)
const {reduceChain:r,chainSteps:steps,initialChain:s,chainStatus}=m.exports
const c=(s,step)=>r(s,{type:'confirm',step})
test('only the explicit next confirmation advances; replay and leapfrog do not',()=>{
 let v=s
 for(let i=0;i<steps.length;i++){
  for(const [j,{id}] of steps.entries())if(i!==j)assert.equal(c(v,id),v)
  v=c(v,steps[i].id)
  assert.equal(v.completed,i+1)
 }
 assert.equal(c(v,'mother'),v)
 assert.equal(r(v,{type:'reset'}),s)
})
test('yard evidence cannot be bypassed by gate arrival, holder or release',()=>{
 const gate=c(c(c(s,'empty'),'loaded'),'gate')
 assert.match(chainStatus(gate),/Chưa xác nhận bãi/)
 const held=r(gate,{type:'hold'})
 for(const {id} of steps) assert.equal(c(held,id),held)
 const reviewed=r(held,{type:'review'})
 assert.deepEqual(reviewed,gate)
 assert.equal(c(reviewed,'barge'),reviewed)
 assert.equal(c(reviewed,'yard').completed,4)
})
test('malformed or unknown confirmation is inert, including after the last step',()=>{
 let state=s
 for(let i=0;i<=steps.length;i++) {
  for(const bad of [{type:'confirm'},{type:'confirm',step:null},{type:'confirm',step:'not-a-step'},{type:'unknown'}]){
   assert.equal(r(state,bad),state)
  }
  if(i<steps.length) state=c(state,steps[i].id)
 }
 assert.match(chainStatus(state),/Hoàn tất/)
 assert.equal(state.completed,6)
})
