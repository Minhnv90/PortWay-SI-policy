const { test }=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const source=fs.readFileSync(path.join(__dirname,'../lib/portway/quote-knowledge.ts'),'utf8');
const mod={exports:{}};
new Function('module','exports',ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(mod,mod.exports);
const {formatQuoteContext}=mod.exports;
test('quoted chassis of comparison, blank surcharge and tie',()=>{
 const t=formatQuoteContext('Báo giá A trọn gói 1130 USD, B 1020 chưa có phụ phí');
 assert.match(t,/cùng điểm đi\/đến/);assert.match(t,/bỏ trống là 0/);assert.match(t,/bằng ngưỡng là hòa/);
});
test('door-to-port needs same final delivery and no double counting',()=>{
 const t=formatQuoteContext('A giao tận kho, B giao tới cảng.');
 assert.match(t,/điểm giao cuối/);assert.match(t,/đếm hai lần/);
});
test('primary sources limited to their own claims and matching topics',()=>{
 const t=formatQuoteContext('Báo giá có ghi CIF, free time bao nhiêu?');
 assert.match(t,/không mặc định là điểm chuyển rủi ro/);assert.match(t,/library.iccwbo.org/);assert.match(t,/maersk.com.+vietnam\/import/);
 assert.match(t,/not proof for this shipment/);
 assert.equal(formatQuoteContext('Hôm nay gia đình ăn gì?'),'');
 assert.doesNotMatch(formatQuoteContext('Thu phí AI'),/maersk/);
});
