import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const source=(await readFile(new URL("../worker.js",import.meta.url),"utf8"));
const worker=(await import("data:text/javascript;base64,"+Buffer.from(source).toString("base64"))).default;
test("Pi verification contract",async()=>{
 const original=globalThis.fetch;
 try{
 for(const [origin,token,mode,status,callsExpected] of [
 ["https://other.test","Bearer fake-test-token-123","ok",403,0],
 ["https://example.test","","ok",401,0],
 ["https://example.test","Bearer fake-test-token-123","denied",401,1],
 ["https://example.test","Bearer fake-test-token-123","invalid",502,1],
 ["https://example.test","Bearer fake-test-token-123","ok",200,1],
 ["https://example.test","Bearer fake-test-token-123","error",502,1]
 ]){
 let calls=0;
 globalThis.fetch=async(url,opts)=>{calls++;assert.equal(url,"https://api.minepi.com/v2/me");assert.equal(opts.headers.Authorization,token);if(mode==="error")throw Error("fake");return Response.json(mode==="invalid"?{}:{uid:"fake-uid",username:"fake-user"},{status:mode==="denied"?401:200});};
 const res=await worker.fetch(new Request("https://worker.test/api/pi/verify",{method:"POST",headers:{Origin:origin,Authorization:token}}),{ALLOWED_ORIGINS:"https://example.test"});
 assert.equal(res.status,status);assert.equal(calls,callsExpected);
 if(status===200){const data=await res.json();assert.equal(data.verified,true);assert.equal(data.user.uid,"fake-uid");assert.equal(JSON.stringify(data).includes(token),false);}
 }
 }finally{globalThis.fetch=original;}
});
