import { SHIPMENT_EVIDENCE } from "@/lib/portway/shipment-evidence"
import { SERVICE_PROOF } from "@/lib/portway/service-proof"
import { VGM_GUIDANCE, VGM_SOURCES } from "@/lib/portway/vgm-evidence"
import type { LangCode } from "@/lib/portway/types"

export function ShipmentEvidencePanel({lang}: {lang:LangCode}) {
  return <details className="rounded-xl border bg-card px-4">
    <summary className="cursor-pointer py-3 text-sm font-semibold">{lang==="vi"?"Chứng từ lô hàng":"Shipment evidence"}</summary>
    <div lang="vi" dir="ltr" className="space-y-2 pb-3 text-sm">
      <p className="text-xs text-muted-foreground">Tra nhanh: đã xác nhận gì, thiếu gì, hỏi ai.</p>
      {SHIPMENT_EVIDENCE.map(item => <article key={item.id} className="space-y-1 rounded-md border p-2.5">
        <h3 className="font-semibold">{item.title}</h3>
        <p>{item.check}</p>
        <p className="text-xs"><strong>Hỏi:</strong> {item.ask}</p>
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-xs text-primary underline">{item.source} ↗</a>
      </article>)}
      <details className="rounded-md border px-2.5">
        <summary className="min-h-11 cursor-pointer py-3 font-semibold">{SERVICE_PROOF.title}</summary>
        <div className="space-y-2 pb-3">
          <ol className="list-decimal space-y-1 ps-5">{SERVICE_PROOF.steps.map(text => <li key={text}>{text}</li>)}</ol>
          <p>{SERVICE_PROOF.caseNote}</p>
          <div className="flex flex-wrap gap-x-3">
            {SERVICE_PROOF.refs.map(ref => <a key={ref.url} className="inline-flex min-h-11 items-center text-xs text-primary underline" href={ref.url} rel="noopener noreferrer" target="_blank">{ref.label} ↗</a>)}
          </div>
        </div>
      </details>
      <details className="rounded-md border px-2.5">
        <summary className="min-h-11 cursor-pointer py-3 font-semibold">VGM, giờ chốt bãi và xếp tàu</summary>
        <div className="space-y-2 pb-3">
          <p>{VGM_GUIDANCE}</p>
          <p className="text-xs text-muted-foreground">Ví dụ giả lập: bãi nhận lúc 11:55, giờ chốt bãi 12:00. VGM gửi lúc 10:05 nhưng giờ chốt VGM là 10:00. Hạ bãi đúng giờ không xóa mốc VGM gửi muộn; vẫn phải hỏi hãng/bến và chưa kết luận lỡ tàu.</p>
          <div className="flex flex-wrap gap-x-3">
            {VGM_SOURCES.map(ref => <a key={ref.url} className="inline-flex min-h-11 items-center text-xs text-primary underline" href={ref.url} rel="noopener noreferrer" target="_blank">{ref.label} ↗</a>)}
          </div>
        </div>
      </details>
    </div>
  </details>
}
