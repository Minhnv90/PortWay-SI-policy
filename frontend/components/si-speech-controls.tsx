"use client";
import { useEffect, useRef, useState } from "react";

type Recognition = {
  lang:string; processLocally:boolean; continuous:boolean; interimResults:boolean;
  onresult: ((event:{results:ArrayLike<{0:{transcript:string};isFinal:boolean}>})=>void)|null;
  onerror:(()=>void)|null; onend:(()=>void)|null; start:()=>void; abort:()=>void;
};
type Constructor = {new():Recognition; available?:(options:{langs:string[];processLocally:boolean;quality:string})=>Promise<string>};
type Props = {onTranscript?:(text:string)=>void; speechText?:string; language?:string; readingLanguage?:string; allowMic?:boolean; voiceStyle?:"portway"|"health"};
let releasePreviousReading: (()=>void)|null=null;
export function SpeechControls({onTranscript,speechText,language="vi-VN",readingLanguage=language,allowMic=true,voiceStyle="portway"}:Props){
 const [listening,setListening]=useState(false), [reading,setReading]=useState(false), [notice,setNotice]=useState("");
 const epoch=useRef(0);
 const recognition=useRef<Recognition|null>(null), spoken=useRef<SpeechSynthesisUtterance|null>(null);
 const callback=useRef(onTranscript); callback.current=onTranscript;
 const stopMic=()=>{
  epoch.current++;
  const active=recognition.current; recognition.current=null;
  if(active){active.onresult=active.onend=active.onerror=null; try{active.abort();}catch{}}
 };
 const release=useRef<(()=>void)|null>(null);
 const stopAudio=()=>{
  if(releasePreviousReading===release.current)releasePreviousReading=null;
  if(spoken.current){spoken.current.onend=spoken.current.onerror=null; spoken.current=null; window.speechSynthesis?.cancel();}
 };
 useEffect(()=>()=>{stopMic();stopAudio();},[]);
 useEffect(()=>{if(!allowMic){stopMic();setListening(false);}},[allowMic]);
 useEffect(()=>{stopAudio();setReading(false);},[speechText,readingLanguage]);
 const dictate=async()=>{
  if(!allowMic||!callback.current) return;
  if(listening){stopMic();setListening(false);setNotice("Đã tắt mic.");return;}
  const id=++epoch.current;
  stopAudio();setReading(false);setListening(true);setNotice("Đang kiểm tra nhận giọng nói trên thiết bị…");
  const unavailable=()=>{if(epoch.current===id){stopMic();setListening(false);setNotice("Thiết bị chưa hỗ trợ nhập giọng nói tại chỗ. Minh vẫn có thể gõ.");}};
  try{
   const engine=(window as Window & {SpeechRecognition?:Constructor}).SpeechRecognition;
   if(!engine?.available) return unavailable();
   const status=await engine.available({langs:[language],processLocally:true,quality:"dictation"});
   if(epoch.current!==id) return;
   if(status!=="available") return unavailable();
   const active=new engine();
   if(!("processLocally" in active)) return unavailable();
   recognition.current=active;active.processLocally=true;active.lang=language;active.continuous=false;active.interimResults=false;
   active.onresult=(event)=>{
    if(epoch.current!==id)return;
    const result=Array.from(event.results).find(r=>r.isFinal)?.[0]?.transcript?.trim().slice(0,500);
    if(result){stopMic();setListening(false);callback.current?.(result);setNotice("Đã nhận lời nói. Xem lại trước khi gửi.");}
   };
   active.onerror=unavailable;
   active.onend=()=>{if(epoch.current===id){stopMic();setListening(false);setNotice("Đã tắt mic. Có thể gõ nếu chưa nhận được lời nói.");}};
   active.start();
   if(epoch.current===id)setNotice("Mic đang bật. Chỉ thử bằng nội dung không riêng tư.");
  }catch{unavailable();}
 };
 const read=()=>{
  if(reading){stopAudio();setReading(false);setNotice("Đã dừng đọc.");return;}
  stopMic();setListening(false);
  if(!speechText?.trim())return;
  const synth=window.speechSynthesis;
  const base=readingLanguage.toLowerCase().split("-")[0];
  const voices=synth?.getVoices().filter(v=>v.localService===true&&v.lang.toLowerCase().split("-")[0]===base)??[];
  if(!synth||!window.SpeechSynthesisUtterance||!voices.length){setNotice("Chưa có giọng đọc trên thiết bị cho ngôn ngữ này. Bạn vẫn xem được nội dung chữ.");return;}
  releasePreviousReading?.();
  const line=new SpeechSynthesisUtterance(speechText.trim().slice(0,1000));
  line.voice=voices[voiceStyle==="health"&&voices.length>1?1:0];line.lang=line.voice.lang;line.rate=voiceStyle==="health"?0.88:0.98;
  const finish=()=>{if(spoken.current===line){spoken.current=null;if(releasePreviousReading===release.current)releasePreviousReading=null;setReading(false);}};
  line.onend=finish;line.onerror=()=>{finish();setNotice("Không phát được giọng đọc trên thiết bị này.");};
  release.current=()=>{stopAudio();setReading(false);};releasePreviousReading=release.current;
  spoken.current=line;setReading(true);setNotice("");
  try{synth.speak(line);}catch{finish();setNotice("Không phát được giọng đọc trên thiết bị này.");}
 };
 return <div className="flex flex-wrap items-center gap-2">
  {allowMic&&onTranscript&&<button type="button" aria-pressed={listening} onClick={dictate} className="min-h-11 rounded-lg border px-3 text-sm">{listening?"Tắt mic":"🎙 Nói để nhập"}</button>}
  {speechText&&<button type="button" aria-pressed={reading} onClick={read} className="min-h-11 rounded-lg border px-3 text-sm">{reading?"Dừng đọc":"🔊 Nghe đọc"}</button>}
  {notice&&<span role="status" className="text-xs text-muted-foreground">{notice}</span>}
 </div>;
}
