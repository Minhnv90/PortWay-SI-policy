const {test}=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path'), ts=require('typescript')
const m={exports:{}}
new Function('module','exports',ts.transpileModule(fs.readFileSync(path.join(__dirname,'../lib/portway/vgm-evidence.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(m,m.exports)
const {vgmSample:f,formatVgmEvidenceContext:c}=m.exports
test('yard receipt and VGM timing never mark container loaded',()=>{
 for(const yard of [true,false]) for(const [sent,vgm] of [[599,'before'],[600,'at-cutoff'],[605,'after'],[null,'unknown']]){
  assert.deepEqual(f(sent,600,yard),{vgm,yard:yard?'received':'unknown',loaded:'unknown'})
 }
})
test('targeted VGM context handles boundary, source and missing information',()=>{
 assert.match(c('VGM bằng giờ chốt bãi thì sao?'),/không tự coi đạt/)
 assert.match(c('Thiếu VGM là đã lỡ tàu chưa?'),/không kết luận đã lỡ tàu/)
 assert.match(c('CY cut-off thế nào?'),/imo\.org/)
 assert.equal(c('Tóm tắt báo giá A và B'),'')
})
