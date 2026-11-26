"use client";
import { useId, useState } from "react";
import { SpeechControls } from "@/components/si-speech-controls";

const template="Chào anh/chị, bên tôi đang chuẩn bị một lô hàng từ Cái Mép đến Jebel Ali. Anh/chị có thể cho biết cần cung cấp thông tin gì để nhận báo giá, báo giá gồm những phụ phí nào và có hiệu lực đến khi nào không? Cảm ơn anh/chị.";
const cases=[
 {label:"Lấy báo giá vận chuyển", turns:[
   ["Doanh nghiệp","Bên mình có một lô hàng từ Cái Mép đi Jebel Ali. Cần gửi gì để hãng vận chuyển báo giá?"],
   ["PortWay SI","Chuẩn bị cảng đi, cảng đến, loại hàng, số container và ngày hàng sẵn sàng. Hỏi rõ cước, phụ phí và thời hạn báo giá."],
   ["Bước tiếp theo","Soạn yêu cầu báo giá rồi tự gửi cho các đối tác phù hợp. Chưa đặt chỗ."]
 ]},
 {label:"So sánh nhà cung cấp", turns:[
   ["Doanh nghiệp","Hai nhà cung cấp chào giá khác nhau. So thêm gì để chọn?"],
   ["PortWay SI","So tổng chi phí về kho, thời gian giao, số lượng tối thiểu và điều kiện đổi trả. Kiểm tra thông tin pháp nhân và yêu cầu mẫu nếu phù hợp."],
   ["Bước tiếp theo","Lập bảng so sánh cùng tiêu chí và xin xác nhận bằng văn bản trước khi chốt."]
 ]}
] as const;
export function CollaborationTools(){
 const id=useId();
 const [tab,setTab]=useState<"draft"|"dialog"|null>(null);
 const [draft,setDraft]=useState(""),[notice,setNotice]=useState(""),[scenario,setScenario]=useState(0),[visible,setVisible]=useState(0);
 const show=(next:"draft"|"dialog")=>{setTab(next===tab?null:next);setNotice("");};
 const copy=async()=>{try{await navigator.clipboard.writeText(draft);setNotice("Đã sao chép. Bạn tự chọn nơi gửi.");}catch{setNotice("Chưa sao chép được. Hãy chọn văn bản và sao chép thủ công.");}};
 return <details className="rounded-xl border border-border bg-card p-3" onToggle={e=>{if(!e.currentTarget.open){setTab(null);setVisible(0);setDraft("");setNotice("");}}}>
   <summary className="cursor-pointer py-2 text-sm font-semibold">Soạn tin và đối thoại mẫu</summary>
   <div className="mt-2 flex flex-wrap gap-2">
    <button type="button" aria-pressed={tab==="draft"} onClick={()=>show("draft")} className="min-h-11 rounded-lg border px-3 text-sm">Soạn tin</button>
    <button type="button" aria-pressed={tab==="dialog"} onClick={()=>show("dialog")} className="min-h-11 rounded-lg border px-3 text-sm">Đối thoại công việc (mẫu)</button>
   </div>
   {tab==="draft"&&<div className="mt-3 space-y-2">
    <p className="text-sm text-muted-foreground">Mẫu chỉnh được, không lưu sau khi thoát và không tự gửi. Không nhập thông tin riêng tư.</p>
    {!draft&&<button type="button" onClick={()=>{setDraft(template);setNotice("");}} className="min-h-11 rounded-lg border px-3 text-sm">Điền tin mẫu</button>}
    <label htmlFor={id+"draft"} className="block text-sm font-medium">Tin nháp</label>
    <textarea id={id+"draft"} rows={4} maxLength={800} value={draft} onChange={e=>{setDraft(e.target.value);setNotice("");}} className="w-full rounded-lg border bg-background p-2 text-sm"/>
    <button type="button" disabled={!draft.trim()} onClick={copy} className="min-h-11 rounded-lg border px-3 text-sm disabled:opacity-50">Sao chép tin</button>
    {notice&&<p role="status" className="text-sm">{notice}</p>}
   </div>}
   {tab==="dialog"&&<div className="mt-3 space-y-2">
    <p className="text-sm text-muted-foreground">Hội thoại mẫu giữa doanh nghiệp và PortWay SI. Không kết nối hay gửi tin cho đối tác.</p>
    <label htmlFor={id+"topic"} className="block text-sm font-medium">Chọn tình huống</label>
    <select id={id+"topic"} className="max-w-full rounded-lg border bg-background p-2 text-sm" value={scenario} onChange={e=>{setScenario(Number(e.target.value));setVisible(0);}}>
     {cases.map((item,i)=><option value={i} key={item.label}>{item.label}</option>)}
    </select>
    <ol className="space-y-2" aria-live="polite">
     {cases[scenario].turns.slice(0,visible).map(([name,line])=><li key={name} className="rounded-lg bg-muted p-2 text-sm"><strong>{name}:</strong> {line}<SpeechControls allowMic={false} speechText={line} voiceStyle="portway"/></li>)}
    </ol>
    {visible<3&&<button type="button" onClick={()=>setVisible(v=>Math.min(3,v+1))} className="min-h-11 rounded-lg border px-3 text-sm">{!visible?"Bắt đầu":"Lượt tiếp theo"}</button>}
    {!!visible&&<button type="button" onClick={()=>setVisible(0)} className="ml-2 min-h-11 px-2 text-sm underline">Bắt đầu lại</button>}
   </div>}
 </details>;
}
