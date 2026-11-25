import {test} from "node:test";
import assert from "node:assert/strict";
import {preferenceMemory} from "../modules/memory.mjs";
function fixture(){const m=new Map();return {MEMORY_KV:{get:async k=>JSON.parse(m.get(k)||"null"),put:async(k,v,o)=>{assert.equal(o.expirationTtl,2592000);m.set(k,v)},delete:async k=>m.delete(k)}}}
test("requires consent",async()=>assert.rejects(preferenceMemory(fixture(),"a",{action:"save",preferences:{language:"vi"}})));
test("rejects sensitive arbitrary fields",async()=>assert.rejects(preferenceMemory(fixture(),"a",{action:"save",consent:true,preferences:{medical_record:"secret"}})));
test("isolates identities",async()=>{const e=fixture();await preferenceMemory(e,"a",{action:"save",consent:true,preferences:{language:"vi"}});assert.deepEqual(await preferenceMemory(e,"b",{action:"read"}),{preferences:{}});assert.deepEqual(await preferenceMemory(e,"a",{action:"read"}),{preferences:{language:"vi"}});});
test("delete clears memory",async()=>{const e=fixture();await preferenceMemory(e,"a",{action:"save",consent:true,preferences:{language:"vi"}});await preferenceMemory(e,"a",{action:"delete"});assert.deepEqual(await preferenceMemory(e,"a",{action:"read"}),{preferences:{}});});
test("reject missing identity",async()=>assert.rejects(preferenceMemory(fixture(),"",{action:"read"})));
