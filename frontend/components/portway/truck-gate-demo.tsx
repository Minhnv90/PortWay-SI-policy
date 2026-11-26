"use client"

import { useState } from "react"
import { bargeClock } from "@/lib/portway/barge-cutoff-demo"
import { gateResult, truckCases, type TruckCase } from "@/lib/portway/truck-gate-demo"

const summaries = {
  unknown: ["Chưa đủ mốc để đánh giá", "Đội xe xác minh thời điểm lấy rỗng hoặc mốc bị thiếu."],
  ahead: ["Dự kiến tới trước giờ chốt cổng", "Điều phối viên theo dõi tiến độ; dự kiến tới không phải đã hạ bãi."],
  tight: ["Dự kiến tới sát giờ chốt cổng", "Điều phối viên hỏi lại điều kiện tiếp nhận."],
  late: ["Dự kiến tới sau giờ chốt cổng", "Điều phối viên hỏi điểm nhận về khung thay thế. Chưa kết luận lỡ chuyến."],
  "at-gate": ["Đã tới cổng mẫu · Chưa xác nhận hạ bãi", "Đội xe chờ đầu mối bãi xác nhận đã nhận container."],
  received: ["Bãi đã xác nhận nhận container mẫu", "Điều phối viên đối chiếu xác nhận giao nhận. Không đồng nghĩa hàng đã lên tàu."],
}

export function TruckGateDemo() {
  const [sample, setSample] = useState<TruckCase>("planned")
  const i = truckCases[sample].input
  const r = gateResult(i)
  return <details className="rounded-lg border bg-background px-3">
    <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold">Thử xe giao container</summary>
    <div className="space-y-3 pb-3">
      <p className="text-xs text-muted-foreground">Luồng xe xuất hàng mẫu: lấy rỗng → đóng hàng → tới cổng → hạ bãi. Không dùng GPS hay dữ liệu cổng thật.</p>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Tình huống xe mẫu">
        {(Object.keys(truckCases) as TruckCase[]).map(key =>
          <button key={key} type="button" aria-pressed={key === sample} onClick={() => setSample(key)}
            className="min-h-11 rounded-md border px-2.5 text-xs aria-pressed:bg-primary aria-pressed:text-primary-foreground">{truckCases[key].label}</button>)}
      </div>
      <dl className="grid grid-cols-2 gap-2 rounded-lg border p-3 text-xs">
        <div><dt className="text-muted-foreground">Lấy rỗng · Đội xe</dt><dd>{bargeClock(i.pickup)}</dd></div>
        <div><dt className="text-muted-foreground">Đóng xong · Nhà máy</dt><dd>{bargeClock(i.loadingDone)}</dd></div>
        <div><dt className="text-muted-foreground">Giờ chốt cổng mẫu</dt><dd>{bargeClock(i.cutoff)}</dd></div>
        <div><dt className="text-muted-foreground">Tới cổng · Đội xe</dt><dd>{bargeClock(i.atGate)}</dd></div>
        <div><dt className="text-muted-foreground">Xác nhận đã nhận · Bãi</dt><dd>{bargeClock(i.yardReceipt)}</dd></div>
      </dl>
      <div role="status" className="space-y-1 rounded-lg border bg-muted/60 p-3 text-sm">
        <p className="font-semibold">{summaries[r.status][0]}</p>
        {r.eta !== null && <p>Giờ đến dự kiến {bargeClock(r.eta)} · Đệm {r.margin > 0 ? "+" : ""}{r.margin} phút</p>}
        <p>{summaries[r.status][1]}</p>
      </div>
    </div>
  </details>
}
