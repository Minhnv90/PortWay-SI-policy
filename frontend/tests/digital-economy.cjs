const {test}=require('node:test');
const a=require('node:assert/strict');
const fs=require('node:fs'), path=require('node:path'), ts=require('typescript');
const mod={exports:{}};
const out=ts.transpileModule(fs.readFileSync(path.join(__dirname,'../lib/portway/digital-economy.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}});
new Function('module','exports',out.outputText)(mod,mod.exports);
const {DIGITAL_ECONOMY:tracks,selectDigitalEconomy:select,formatDigitalEconomyContext:format}=mod.exports;
test('eight topics with steps, cautions and official HTTPS references',()=>{
 a.equal(tracks.length,8);
 a.equal(new Set(tracks.map(g=>g.id)).size,8);
 for(const t of tracks){a.ok(t.steps.length>=3&&t.caution&&t.sources.length>=2);for(const x of t.sources)a.equal(new URL(x.url).protocol,'https:');}
});
test('questions route to the right topics without flooding unrelated chat',()=>{
 for(const [q,id] of [['KYB và quyền ký','identity'],['Vận đơn điện tử eBL','records'],['Edge IoT','events'],['Thanh toán số và đối soát','payment'],['Tài trợ thương mại bằng biên nhận kho','finance'],['AI token và chi phí AI','ai'],['Nhật ký kiểm toán blockchain','ledger'],['Demo kinh tế số cảng về kho','pilot']])a.equal(select(q)[0]?.id,id,q);
 a.equal(format('Tôi làm bánh'), '');
 a.ok(select('eBL và KYB, thanh toán số, tài trợ thương mại và AI token').length<=3);
});
test('never present fictional examples as actual permissions or payments',()=>{
 const f=format('Thanh toán số Testnet');
 a.match(f,/fictional/);
 a.match(f,/Do not claim live integrations/);
 a.match(f,/Không gửi tiền/);
 a.match(format('Tài trợ thương mại'),/không tạo ra quyền sở hữu/);
});
