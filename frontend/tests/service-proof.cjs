const {test}=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path'), ts=require('typescript')
const m={exports:{}}
new Function('module','exports',ts.transpileModule(fs.readFileSync(path.join(__dirname,'../lib/portway/service-proof.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(m,m.exports)
const {formatServiceProofContext:f,SERVICE_PROOF:card}=m.exports
test('AirLand example separates a dated RTA announcement from a website claim',()=>{
 const text=f('AirLand có chạy taxi bay không?')
 assert.match(text,/18\/11\/2026/)
 assert.match(text,/Joby là đơn vị dự kiến vận hành/)
 assert.match(text,/chưa có bằng chứng/)
 assert.match(text,/not a live status/)
 for(const r of card.refs) assert.ok(text.includes(r.url))
})
test('partner and commercial-operation prompts get the rule without irrelevant examples',()=>{
 for(const q of ['Họ là đối tác chính thức không?','Bến đã khai thác thương mại chưa?']){
  assert.match(f(q),/officially documented role/)
  assert.doesNotMatch(f(q),/AirLand|Dubai/)
 }
 for(const q of ['So báo giá A và B','Học kinh tế số','Thời tiết Dubai']) assert.equal(f(q),'')
})
