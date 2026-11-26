const {test}=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path'), ts=require('typescript')
const m={exports:{}}
new Function('module','exports',ts.transpileModule(fs.readFileSync(path.join(__dirname,'../lib/portway/shift-handoff-demo.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(m,m.exports)
const f=m.exports.nextHandoffTask, base={barge:'late',slot:'confirmed',alternativeUsable:true,connection:'unknown'}
test('handoff prioritizes missing or superseded data over downstream sample state',()=>{
 assert.equal(f({...base,barge:'incomplete',connection:'enough'}).owner,'Đội xe')
 assert.match(f({...base,barge:'stale',connection:'enough'}).action,/bản mới/)
})
test('handoff names the next responsible party without assuming an actual reservation',()=>{
 assert.equal(f(base).owner,'Hãng tàu')
 assert.equal(f({...base,slot:'unverified'}).owner,'Đơn vị sà lan')
 assert.match(f({...base,slot:'unavailable'}).action,/Tìm khung/)
 assert.match(f({...base,connection:'late'}).action,/phương án/)
 assert.match(f({...base,connection:'enough'}).action,/Xác nhận giữ chỗ/)
})
