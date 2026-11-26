const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const m={exports:{}};
const src=fs.readFileSync(path.join(__dirname,'../lib/portway/port-operations.ts'),'utf8');
new Function('module','exports',ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(m,m.exports);
const {PORT_OPERATIONS,selectPortOperations,formatPortOperationsContext}=m.exports;
test('all 14 topics have steps, a caution and HTTPS sources',()=>{
 assert.equal(PORT_OPERATIONS.length,14);assert.equal(new Set(PORT_OPERATIONS.map(x=>x.id)).size,14);
 for(const g of PORT_OPERATIONS){assert.ok(g.steps.length>=3);assert.ok(g.caution.length>15);assert.ok(g.sources.length>=2);for(const source of g.sources){assert.equal(new URL(source.url).protocol,'https:');}}
});
test('topic routing keeps questions focused',()=>{
 for(const [q,key] of [['Hoa tiêu và tàu lai làm gì?','pilot'],['Manifest tàu đến khai ở đâu?','arrival'],['Lấy hàng nhập cần eDO không?','import'],['Tại Cái Mép – Thị Vải, so Cần Giờ','regional'],['VGM và cut off hàng xuất','export'],['KPI khi chuyển chuyến','exceptions'],['Hàng lạnh và hàng nguy hiểm','special']]) assert.equal(selectPortOperations(q)[0]?.id,key,q);
 assert.equal(selectPortOperations('Làm bánh bằng bột mì').length,0);
 assert.ok(selectPortOperations('Hoa tiêu Cái Mép có phụ phí, xếp dỡ qua ePort').length<=4);
});
test('does not use handbook as clearance or live proof',()=> {
 const t=formatPortOperationsContext('Cảng vụ, hoa tiêu, thông quan');
 assert.match(t,/Never claim cleared/);assert.match(t,/background checklist/);assert.match(t,/enc\.vinamarine/);
 assert.match(t,/trách nhiệm chỉ huy/);
});
