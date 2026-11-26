const {test}=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path'), ts=require('typescript')
const m={exports:{}}
new Function('module','exports',ts.transpileModule(fs.readFileSync(path.join(__dirname,'../lib/portway/shipment-evidence.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(m,m.exports)
const {formatShipmentEvidenceContext:f,SHIPMENT_EVIDENCE:cards}=m.exports
test('selects matching evidence distinctions without flooding other answers',()=>{
 assert.match(f('Báo giá và đặt chỗ có khác booking không?'),/Báo giá ≠ đặt chỗ/)
 assert.match(f('Có phiếu EIR là đã hạ bãi chưa?'),/không tự chứng minh/)
 assert.match(f('Sà lan đến rồi, hàng đã lên tàu mẹ chưa?'),/mốc sà lan không thay/)
 assert.equal(f('Hai báo giá khác nhau 70 USD'), '')
 assert.equal(f('Cho tôi xem thời tiết Long Sơn'), '')
})
test('covers multiple claims without treating documentation as shipment proof',()=>{
 const out=f('Booking, EIR và hàng đã lên tàu mẹ?')
 for(const card of cards){assert.equal(new URL(card.url).protocol,'https:');assert.ok(out.includes(card.url))}
 assert.match(out,/not proof for the user's shipment/)
 assert.match(out,/Never mark missing as failed/)
})
