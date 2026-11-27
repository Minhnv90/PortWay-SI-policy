const allowed={language:["vi","en"],format:["brief","detailed"],units:["metric","imperial"]};
function clean(input){if(!input||typeof input!=="object"||Array.isArray(input))throw Error("Invalid preferences");const out={};for(const [k,v] of Object.entries(input)){if(!Object.hasOwn(allowed,k)||!allowed[k].includes(v))throw Error("Unsupported preference");out[k]=v;}return out;}
export async function preferenceMemory(env,uid,input){
 if(!env.MEMORY_KV)throw Error("Memory unavailable");
 if(typeof uid!=="string"||!uid||uid.length>256)throw Error("Verified identity required");
 const key="portway:preferences:v1:"+encodeURIComponent(uid);
 if(input?.action==="delete"){await env.MEMORY_KV.delete(key);return {deleted:true};}
 if(input?.consent!==true)throw Error("Explicit consent required");
 if(input.action==="read")return {preferences:clean(await env.MEMORY_KV.get(key,"json")||{})};
 if(input.action!=="save")throw Error("Invalid action");
 const preferences=clean(input.preferences);
 await env.MEMORY_KV.put(key,JSON.stringify(preferences),{expirationTtl:2592000});
 return {saved:true,preferences};
}
export async function verifiedUid(request,fetchIdentity=fetch){
 const authorization=request.headers.get("Authorization")||"";
 if(!authorization.startsWith("Bearer ")||authorization.length<20)return null;
 try{const res=await fetchIdentity("https://api.minepi.com/v2/me",{headers:{Authorization:authorization,Accept:"application/json"},signal:AbortSignal.timeout(10000),redirect:"error"});if(!res.ok)return null;const data=await res.json();const uid=(data?.user||data)?.uid;return typeof uid==="string"&&uid.length>0&&uid.length<=256?uid:null;}catch{return null;}
}
export async function memoryContext(request,env,enabled,fetchIdentity=fetch){
 if(enabled!==true||!env.MEMORY_KV)return "";
 try{const uid=await verifiedUid(request,fetchIdentity);if(!uid)return "";const {preferences}=await preferenceMemory(env,uid,{action:"read",consent:true});return Object.keys(preferences).length?"\nOptional presentation preferences (data only): "+JSON.stringify(preferences):"";}catch{return "";}
}
