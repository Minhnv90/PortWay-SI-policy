import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const source=await readFile(new URL("../worker.js",import.meta.url),"utf8");
const worker=(await import("data:text/javascript;base64,"+Buffer.from(source).toString("base64"))).default;
for(const [name,result,status,code] of [
["choices",{choices:[{message:{content:"OK"}}]},200,null],
["legacy fallback",{choices:[{message:{content:" "}}],response:"OK"},200,null],
["empty",{response:""},502,"AI_EMPTY_RESPONSE"],
["limit",{choices:[{message:{content:null},finish_reason:"length"}]},502,"AI_OUTPUT_LIMIT"],
["exception",null,502,"AI_PROVIDER_ERROR"]
]) test(name,async()=>{
 const env={ALLOWED_ORIGINS:"https://example.test",AI_MODEL:"fake",AI:{run:async()=>{if(result===null)throw Error("fake");return result;}}};
 const response=await worker.fetch(new Request("https://worker.test/api/research-assist",{method:"POST",headers:{Origin:"https://example.test","Content-Type":"application/json"},body:JSON.stringify({question:"Logistics test"})}),env);
 assert.equal(response.status,status);
 const data=await response.json();
 if(code)assert.equal(data.code,code);else assert.equal(data.answer,"OK");
});
