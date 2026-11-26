const {test}=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path'), ts=require('typescript')
const m={exports:{}}
new Function('module','exports',ts.transpileModule(fs.readFileSync(path.join(__dirname,'../lib/portway/employee-learning.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(m,m.exports)
const {DOCUMENT_PRACTICE:prompt,EMPLOYEE_CASES:cases,INITIAL_LEARNING:init,learningTransition:f,formatEmployeeLearningContext:format}=m.exports
test('each correct lesson requires proposal, evidence check and reviewer before reuse',()=>{
  for(const [i,lesson] of cases.entries()){
    const stage=(s,type)=>f(s,{type},i)
    for(const type of ['propose','check','approve','reject']) assert.equal(stage(init,type),init)
    assert.equal(f(init,{type:'choose',choice:99},i),init)
    const picked=f(init,{type:'choose',choice:lesson.correct},i)
    assert.equal(stage(picked,'approve'),picked)
    const proposed=stage(picked,'propose')
    assert.equal(proposed.phase,'proposed')
    assert.equal(stage(proposed,'approve'),proposed)
    const checked=stage(proposed,'check')
    assert.equal(checked.phase,'checked')
    assert.equal(stage(checked,'reject').phase,'rejected')
    assert.equal(stage(checked,'approve').phase,'approved')
    assert.equal(stage(stage(checked,'approve'),'reset'),init)
  }
})
test('wrong or rejected lessons cannot proceed, and cannot write to static chat background',()=>{
  for(const [i,lesson] of cases.entries()){
    const wrong=f(init,{type:'choose',choice:(lesson.correct+1)%3},i)
    const proposed=f(wrong,{type:'propose'},i)
    assert.equal(f(proposed,{type:'check'},i),proposed)
    const rejected=f(proposed,{type:'reject'},i)
    assert.equal(rejected.phase,'rejected')
    assert.equal(f(rejected,{type:'approve'},i),rejected)
    assert.equal(f(rejected,{type:'reset'},i),init)
  }
})
test('only matched normal-chat topics add fixed background with no echoed prompt',()=>{
  const gxo=format('GXO da van hanh 1.000 robot Apollo chua? FLAG_99')
  assert.match(gxo,/thư ý định/);assert.match(gxo,/apptronik\.com/)
  assert.doesNotMatch(gxo,/FLAG_99/)
  assert.match(format('Ai phê duyệt đổi ca cho nhân viên?'),/Không coi im lặng/)
  for(const q of ['GXO','robot trong kho','chốt giá báo giá','đổi ca','nhân viên','địa chỉ cảng'])assert.equal(format(q),'')
})

test('document exercise gives a complete prompt and never substitutes a guess or chooses auto-send',()=>{
 assert.equal(cases.length,4)
 assert.match(prompt.before,/gửi xác nhận/)
 for(const part of ['Việc:','Bối cảnh:','Đầu ra:','Kiểm chứng:','Chưa xác minh','Không gửi']) assert.ok(prompt.after.includes(part))
 const lesson=cases[3]
 assert.match(lesson.choices[lesson.correct],/15:40.*chưa xác minh.*chỉ soạn nháp/)
 const guidance=format('Doc anh phieu giao hang, ma container mo, gui luon')
 for(const part of ['not OCR','ẩn dữ liệu nhạy cảm','không suy đoán','người phụ trách duyệt']) assert.ok(guidance.includes(part))
 for(const question of ['Anh cho hỏi phiếu giao hàng cần gì?', 'Ảnh phong cảnh','Cước container']) assert.equal(format(question),'')
})
