const {test}=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path'), ts=require('typescript')
function load(file,loader){
 const m={exports:{}}
 const source=fs.readFileSync(path.join(__dirname,'..',file),'utf8')
 new Function('require','module','exports',ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(loader,m,m.exports)
 return m.exports
}
const types=load('lib/portway/types.ts',require)
const normal=load('lib/portway/normalize.ts',()=>types)
const q={json:async()=>({uiLanguage:'vi',messages:[{role:'user',content:'AirLand đã vận hành chưa?'}]})}
function route(queue){
 const calls=[]
 const modules={
  ai:{gateway:{tools:{perplexitySearch:()=>({mock:true})}},generateText:async p=>{
   calls.push(p);const v=queue.shift();if(v instanceof Error)throw v;return {text:v}
  },isStepCount:()=>null},
  zod:require('zod'),
  '@/lib/portway/types':types,
  '@/lib/portway/knowledge':{buildSystemPrompt:({searchAvailable})=>String(searchAvailable)},
  '@/lib/portway/normalize':normal,
  '@/lib/portway/research-demo':{simulateResearch:()=>({research:true})},
  '@/lib/portway/employee-learning':load('lib/portway/employee-learning.ts',require),
  '@/lib/portway/chat-diagnostics':load('lib/portway/chat-diagnostics.ts',require),
  '@/lib/portway/service-proof':load('lib/portway/service-proof.ts',require),
 }
 return {calls,...load('app/api/chat/route.ts',name=>modules[name]??new Proxy({}, {get:()=>()=>''}))}
}
test('empty or failed search retries only once, with no search on retry',async()=>{
 for(const first of ['{}','{"summary":"  "}',new Error('mock search unavailable')]){
  const x=route([first,'{"summary":"Chưa có bằng chứng hoạt động thương mại."}'])
  const res=await x.POST(q)
  assert.equal(res.status,200); assert.match((await res.json()).answer.summary,/Chưa có bằng chứng/)
  assert.deepEqual(x.calls.map(p=>Boolean(p.tools)),[true,false])
  assert.match(x.calls[1].system,/not a live status/)
 }
})
test('valid answer or explicit decline does not retry',async()=>{
 for(const v of ['{"summary":"Có thông báo thử nghiệm."}','{"inScope":false,"declineMessage":"Ngoài phạm vi."}','{"strategicAnalysis":{"paragraphs":["Chưa rõ."]}}']){
  const x=route([v]); assert.equal((await x.POST(q)).status,200); assert.equal(x.calls.length,1)
 }
})
test('both empty or provider fails: 502, never a successful blank card',async()=>{
 for(const [last,error] of [['{"sources":[{"id":1,"title":"Nguồn","url":"https://example.com/"}]}','unreadable_answer'],[new Error('mock transport'), 'generation_failed']]){
  const x=route(['{}',last]);const res=await x.POST(q)
  assert.equal(res.status,502);const b=await res.json();assert.equal(b.error,error);assert.match(b.requestId,/^[0-9a-f-]{36}$/);assert.equal(x.calls.length,2)
 }
})
test('research mode bypasses the normal chat recovery',async()=>{
 const oldMode=process.env.PORTWAY_RESEARCH_LIVE; delete process.env.PORTWAY_RESEARCH_LIVE;
 const x=route([])
 const res=await x.POST({json:async()=>({...await q.json(),mode:'research'})})
 assert.deepEqual(await res.json(),{answer:{research:true}});assert.equal(x.calls.length,0)
 if (oldMode!==undefined) process.env.PORTWAY_RESEARCH_LIVE=oldMode;
})

test('normal chat receives static learning only for a matching question',async()=>{
 for(const [content,match] of [['GXO Apollo đã chạy 1.000 robot?',/apptronik\.com/],['Ai duyệt đổi ca của nhân viên?',/Không coi im lặng/],['Robot nâng hàng trong kho',null],['Đọc ảnh phiếu giao hàng rồi gửi xác nhận',/not OCR.*người phụ trách duyệt/],['Anh kiểm tra phiếu giao hàng dùm',null]]){
  const x=route(['{"summary":"Kiểm tra mẫu."}']);
  const res=await x.POST({json:async()=>({uiLanguage:'vi',messages:[{role:'user',content}]})});
  assert.equal(res.status,200);assert.equal(x.calls.length,1)
  if(match) assert.match(x.calls[0].system,match);
  else assert.doesNotMatch(x.calls[0].system,/PORTWAY LEARNING/)
 }
})

test('authentication, access, payment and rate failures do not resubmit; log only fixed fields',async()=>{
 const save=console.warn, logs=[]; console.warn=(...args)=>logs.push(args)
 try{
  for(const [status,issue] of [[401,'authentication'],[403,'access'],[402,'quota'],[429,'rate_limited']]){
   const x=route([Object.assign(new Error('SECRET-no-print'),{lastError:{statusCode:status,responseBody:'SECRET-body'}})])
   const res=await x.POST(q), body=await res.json()
   assert.equal(res.status,502)
   assert.equal(body.error,'generation_failed')
   assert.deepEqual(logs.pop(),['portway.chat',{requestId:body.requestId,stage:'search',issue}])
   assert.deepEqual(Object.keys(body).sort(),['error','requestId'])
   assert.equal(x.calls.length,1);assert.equal(x.calls[0].maxRetries,0)
  }
 } finally {console.warn=save}
})
test('one server-configured same-gateway text fallback, no new automatic SDK retries',async()=>{
 const old=process.env.PORTWAY_CHAT_FALLBACK_MODEL
 try{
  for(const [setting,expected] of [['anthropic/claude-sonnet-4.6','anthropic/claude-sonnet-4.6'],['unauthorized/provider','anthropic/claude-sonnet-5.5']]){
   process.env.PORTWAY_CHAT_FALLBACK_MODEL=setting
   const x=route([Object.assign(new Error('missing model'),{name:'GatewayModelNotFoundError'}),'{"summary":"Mẫu."}'])
   assert.equal((await x.POST(q)).status,200)
   assert.deepEqual(x.calls.map(a=>[a.model,a.maxRetries,Boolean(a.tools)]),[['anthropic/claude-sonnet-5.5',0,true],[expected,0,false]])
  }
 } finally {if(old===undefined) delete process.env.PORTWAY_CHAT_FALLBACK_MODEL; else process.env.PORTWAY_CHAT_FALLBACK_MODEL=old}
})
test('client accepts only an exact generated-style UUID on error; no raw response details',async()=>{
 const {requestChat}=load('lib/portway/chat-request.ts',require)
 const old=global.fetch
 const requestId='133fdffd-321a-4a6b-86cd-abc7e4c71dbe'
 try{
  global.fetch=async()=>Response.json({error:'generation_failed',requestId,diagnostic:'secret'},{status:502})
  assert.deepEqual(await requestChat({}),{failure:'generation',requestId})
  global.fetch=async()=>Response.json({error:'generation_failed',requestId:'sensitive raw text'},{status:502})
  assert.deepEqual(await requestChat({}),{failure:'generation'})
  global.fetch=async()=>new Response('provider html',{status:504})
  assert.deepEqual(await requestChat({}),{failure:'timeout'})
 }finally{global.fetch=old}
})
