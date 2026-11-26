const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'), path=require('node:path'), ts=require('typescript');
const m={exports:{}};
const source=fs.readFileSync(path.join(__dirname,'../lib/portway/port-dispatch-demo.ts'),'utf8');
const {outputText}=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}});
new Function('module','exports',outputText)(m,m.exports);
const {initialDispatchDemo:start,reduceDispatchDemo:step,publicDispatchProgress:visible}=m.exports;
const act=(s,type)=>step(s,{type});
const role=(s,role)=>step(s,{type:'role',role});
const assigned=()=>act(act(start,'review'),'assign');
test('requires leader review before assignment; repeated assignment is inert',()=>{
 assert.deepEqual(act(start,'assign'), start);
 const seen=act(start,'review');
 assert.notDeepEqual(seen,start);
 const s=act(seen,'assign');
 assert.notDeepEqual(s,seen);
 assert.deepEqual(act(s,'assign'),s);
});
test('staff can report and resolve a blocker then complete the task',()=>{
 const original=role(assigned(),'staff');
 const blocked=act(original,'report-blocker');
 assert.notDeepEqual(blocked,original);
 assert.deepEqual(act(blocked,'complete'),blocked);
 const resolved=act(blocked,'resolve-blocker');
 assert.notDeepEqual(resolved,blocked);
 const done=act(resolved,'complete');
 assert.notDeepEqual(visible(done),visible(original));
 assert.deepEqual(act(done,'report-blocker'),done);
});
test('demo customer cannot mutate an assignment or see internal fields',()=>{
 const s=role(act(role(assigned(),'staff'),'report-blocker'),'customer');
 for(const type of ['review','assign','report-blocker','resolve-blocker','complete'])assert.deepEqual(act(s,type),s);
 const view=visible(s);
 for(const key of Object.keys(view))assert.ok(['stage','label','message'].includes(key), key);
 assert.doesNotMatch(JSON.stringify(view),/nhật ký|ghi chú nội bộ|người phụ trách/i);
});
test('reset clears prior work; a fresh run produces the same public result',()=>{
 const s=act(role(assigned(),'staff'),'complete');
 const fresh=act(s,'reset');
 assert.deepEqual(visible(fresh),visible(start));
 assert.deepEqual(visible(act(role(assigned(),'staff'),'complete')),visible(s));
});
