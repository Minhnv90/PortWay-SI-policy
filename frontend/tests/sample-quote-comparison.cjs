const {test}=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), ts=require('typescript')
const m={exports:{}}
new Function('module','exports',ts.transpileModule(fs.readFileSync(require('node:path').join(__dirname,'../lib/portway/sample-quote-comparison.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(m,m.exports)
test('Sample quotes have different delivery scopes; 30 USD is the same-scope break-even, not a known fee',()=>{
  const {SAMPLE_QUOTES:q,SAMPLE_QUOTE_GAP_USD:gap}=m.exports
  assert.deepEqual(q,{warehouse:{amountUsd:1130,endpoint:'warehouse'},port:{amountUsd:1100,endpoint:'port'}})
  assert.equal(gap,30)
  assert.ok(q.port.amountUsd + 29 < q.warehouse.amountUsd)
  assert.equal(q.port.amountUsd + gap,q.warehouse.amountUsd)
  assert.ok(q.port.amountUsd + 31 > q.warehouse.amountUsd)
})
