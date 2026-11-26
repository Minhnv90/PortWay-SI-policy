"use client"

import { useState } from "react"
import { alternativeMargin, bargeClock, customerDraft, evaluateBarge, scenarios, type Scenario, type SlotCheck } from "@/lib/portway/barge-cutoff-demo"

import { connections, connectionTimes, checkConnection, connectionDraft, type ConnectionCase } from "@/lib/portway/mother-vessel-demo"

import { nextHandoffTask } from "@/lib/portway/shift-handoff-demo"

const outcomes = {
  ahead: "Dự kiến đến trước giờ chốt sà lan",
  late: "Dự kiến đến sau giờ chốt sà lan",
  exact: "Dự kiến đến sát giờ chốt, không có thời gian đệm",
  incomplete: "Thiếu dữ liệu · Chưa tính ETA",
  stale: "Dữ liệu đã có phiên bản thay thế · Chưa tính ETA",
}

export function BargeCutoffDemo() {
  const [sample, setSample] = useState<Scenario>("ready")
  const [approved, setApproved] = useState(false)
  const [slotCheck, setSlotCheck] = useState<SlotCheck>("unverified")
  const [connectionCase, setConnectionCase] = useState<ConnectionCase>("pending")
  const i = scenarios[sample].inputs
  const result = evaluateBarge(i)
  const needsCheck = result.status === "late" || result.status === "exact"
  const alternative = alternativeMargin(i, slotCheck)
  const connection = checkConnection(connectionCase, alternative?.usable === true)
  const handoff = nextHandoffTask({barge: result.status, slot: slotCheck, connection: connection.status, alternativeUsable: alternative?.usable === true})
  const draft = alternative?.usable
    ? `${connectionDraft(connection.status)} Chưa xác nhận booking, lên tàu hay lỡ chuyến.`
    : needsCheck && slotCheck === "unavailable"
      ? "Khung giờ thay thế đang xét không còn chỗ trong tình huống mẫu. Điều phối viên đang rà phương án khác. Chưa xác nhận lỡ chuyến tàu mẹ."
      : customerDraft(result.status)
  function change(next: Scenario) {
    setSample(next)
    setSlotCheck("unverified")
    setConnectionCase("pending")
    setApproved(false)
  }

  function recordCheck(check: SlotCheck) {
    setSlotCheck(check)
    setConnectionCase("pending")
    setApproved(false)
  }

  return (
    <details className="rounded-lg border bg-background px-3">
      <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold">Thử cảnh báo giờ chốt sà lan</summary>
      <div className="space-y-3 pb-3">
        <p className="text-xs text-muted-foreground">Lô Gành Rái 10 container giả lập. Giờ Việt Nam, cùng một ngày mẫu. Không phải lịch cảng hay booking thật.</p>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Tình huống mẫu">
          {(Object.keys(scenarios) as Scenario[]).map((key) => (
            <button key={key} type="button" aria-pressed={key === sample} onClick={() => change(key)} className={`min-h-11 rounded-full border px-2.5 text-xs font-medium ${key === sample ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{scenarios[key].label}</button>
          ))}
        </div>
        <dl className="grid grid-cols-2 gap-2 rounded-lg border p-3 text-xs">
          <div><dt className="text-muted-foreground">Nhà máy sẵn sàng · Nhà máy</dt><dd className="font-semibold">{bargeClock(i.factoryReady)}</dd></div>
          <div><dt className="text-muted-foreground">Container rỗng sẵn sàng · Đội xe</dt><dd className="font-semibold">{bargeClock(i.emptyReady)}</dd></div>
          <div><dt className="text-muted-foreground">Đóng hàng + di chuyển · Điều phối</dt><dd className="font-semibold">{i.load} + {i.drive} phút</dd></div>
          <div><dt className="text-muted-foreground">Giờ chốt nhận · Đơn vị sà lan</dt><dd className="font-semibold">{bargeClock(i.cutoff)}</dd></div>
        </dl>
        <div role="status" className="space-y-1 rounded-lg border bg-muted/60 p-3">
          <p className="text-sm font-semibold">{outcomes[result.status]}</p>
          {result.eta !== null && <p className="text-sm">ETA {bargeClock(result.eta)} · Đệm {result.margin > 0 ? "+" : ""}{result.margin} phút</p>}
        </div>
        {result.status === "stale" && <button type="button" className="min-h-11 rounded-md border px-3 text-sm" onClick={() => change("risk")}>Dùng bản mới</button>}
        {result.status === "incomplete" && <p className="text-sm">Bước tiếp theo: đội điều phối xác minh giờ có container rỗng với đội xe.</p>}
        {needsCheck && <div className="space-y-2 rounded-lg border p-3 text-sm">
          <h4 className="font-semibold">Kiểm tra khung sà lan thay thế</h4>
          <p>Điều phối viên hỏi đơn vị sà lan về giờ chốt mẫu 13:30. Xác nhận có khung không phải giữ chỗ.</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Kết quả xác minh mô phỏng">
            <button type="button" aria-pressed={slotCheck === "confirmed"} className="min-h-11 rounded-md border px-3 aria-pressed:bg-primary aria-pressed:text-primary-foreground" onClick={() => recordCheck("confirmed")}>Có khung thay thế</button>
            <button type="button" aria-pressed={slotCheck === "unavailable"} className="min-h-11 rounded-md border px-3 aria-pressed:bg-primary aria-pressed:text-primary-foreground" onClick={() => recordCheck("unavailable")}>Không còn chỗ</button>
            {slotCheck !== "unverified" && <button type="button" className="min-h-11 rounded-md border px-3" onClick={() => recordCheck("unverified")}>Bỏ xác nhận</button>}
          </div>
          <p aria-live="polite">{alternative
            ? `Khung mẫu ${bargeClock(alternative.cutoff)} · Đệm ${alternative.margin > 0 ? "+" : ""}${alternative.margin} phút. ${alternative.usable ? "Cần xác nhận giữ chỗ và kiểm tra nối chuyến." : "Khung này không còn đủ đệm."}`
            : slotCheck === "unavailable" ? "Không còn chỗ trong khung mẫu. Tìm phương án khác." : "Chưa có xác nhận của đơn vị sà lan."}</p>
        </div>}
        {alternative?.usable && <div className="space-y-2 rounded-lg border p-3 text-sm">
          <h4 className="font-semibold">Kiểm tra nối tàu mẹ</h4>
          <p>Sà lan rời bến mẫu {bargeClock(connectionTimes.departure)}, đi {connectionTimes.transit} phút và dự trù {connectionTimes.transfer} phút bàn giao. Giờ chốt tàu mẹ là mốc riêng, không phải giờ chốt sà lan.</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Kịch bản giờ chốt tàu mẹ">
            {(Object.keys(connections) as ConnectionCase[]).map((key) => <button key={key} type="button"
              className="min-h-11 rounded-md border px-3 text-xs aria-pressed:bg-primary aria-pressed:text-primary-foreground"
              aria-pressed={connectionCase === key} onClick={() => { setConnectionCase(key); setApproved(false) }}>{connections[key].label}</button>)}
          </div>
          <p aria-live="polite" data-testid="connection-result">{connection.handoff === null
            ? "Chưa đủ mốc để kết luận về nối tàu mẹ."
            : `Bàn giao dự kiến ${bargeClock(connection.handoff)} · Giờ chốt ${bargeClock(connection.cutoff)} · Đệm ${connection.margin > 0 ? "+" : ""}${connection.margin} phút. ${connection.status === "tight" ? "Không có thời gian đệm." : connection.status === "late" ? "Cần xem phương án khác." : "Cần hãng tàu xác nhận."}`}</p>
        </div>}
        {draft && <div className="space-y-2 rounded-lg border p-3 text-sm">
          <p className="font-semibold">{approved ? "Bản nháp đã duyệt · Chưa gửi" : "Bản nháp cho khách · Chờ duyệt"}</p>
          <p>{draft}</p>
          {!approved && <button type="button" className="min-h-11 rounded-md bg-primary px-3 text-primary-foreground" onClick={() => setApproved(true)}>Duyệt bản nháp</button>}
        </div>}
        <details className="rounded-lg border bg-muted/30 px-3">
          <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold">Bàn giao ca · Lô mẫu</summary>
          <section aria-label="Phiếu bàn giao ca" className="space-y-2 pb-3 text-sm">
            <p className="text-xs text-muted-foreground">Chỉ trong phiên thử này. Không lưu hoặc chuyển cho ca sau.</p>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2">
              <div><dt className="text-muted-foreground">Giờ đến sà lan</dt><dd>{bargeClock(result.eta)}</dd></div>
              <div><dt className="text-muted-foreground">Giờ chốt sà lan ban đầu</dt><dd>{result.status === "stale" ? "Cần kiểm tra lại" : bargeClock(i.cutoff)}</dd></div>
              <div><dt className="text-muted-foreground">Giờ chốt sà lan thay thế</dt><dd>{bargeClock(alternative?.cutoff ?? null)}</dd></div>
              <div><dt className="text-muted-foreground">Giờ chốt nhận cho tàu mẹ</dt><dd>{bargeClock(connection.cutoff)}</dd></div>
            </dl>
            <p><strong>{handoff.owner}:</strong> {handoff.action}</p>
            <p><strong>Bản nháp cho khách:</strong> {approved && draft ? "Đã duyệt trong phiên · Chưa gửi" : draft ? "Chờ duyệt" : "Chưa đủ mốc để soạn"}</p>
            {approved && draft && <p className="rounded-md border bg-background p-2">{draft}</p>}
          </section>
        </details>
      </div>
    </details>
  )
}
