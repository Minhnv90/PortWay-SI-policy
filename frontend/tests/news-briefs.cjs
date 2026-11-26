const {test}=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path'), ts=require('typescript')
const m={exports:{}}
new Function('module','exports',ts.transpileModule(fs.readFileSync(path.join(__dirname,'../lib/portway/news-briefs.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(m,m.exports)
const {NEWS_BRIEFS,NEWS_REVIEWED_ON}=m.exports
test('reviewed news has unique ids, dated sources and exact primary-source HTTPS hosts',()=>{
 assert.equal(new Set(NEWS_BRIEFS.map(x=>x.id)).size,3)
 assert.match(NEWS_REVIEWED_ON,/^\d{4}-\d{2}-\d{2}$/)
 const hosts={ 'iea-power':'www.iea.org','wb-ffi':'www.worldbank.org','cmit-empty':'www.cmit.com.vn' }
 for(const x of NEWS_BRIEFS) {
  const u=new URL(x.url)
  assert.equal(u.protocol,'https:')
  assert.equal(u.host,hosts[x.id])
  assert.ok(!u.username&&!u.password)
  assert.match(x.date,/^\d{4}-\d{2}(-\d{2})?$/)
  assert.ok(x.date<=NEWS_REVIEWED_ON && x.fact && x.implication && x.status)
 }
})
test('briefs keep projections, funding and authorisation separate from operational facts',()=>{
 assert.match(NEWS_BRIEFS[0].status,/dự báo/)
 assert.match(NEWS_BRIEFS[0].implication,/Không suy ra cước tàu/)
 assert.match(NEWS_BRIEFS[1].implication,/Chưa xác nhận tài trợ/)
 assert.match(NEWS_BRIEFS[2].implication,/không xác nhận quyền đổi lịch/)
})
