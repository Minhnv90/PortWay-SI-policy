"use client"

import { useReducer } from "react"
import {
  initialDispatchDemo,
  publicDispatchProgress,
  reduceDispatchDemo,
  type DispatchRole,
  type DispatchStage,
} from "@/lib/portway/port-dispatch-demo"

const roles: { value: DispatchRole; label: string }[] = [
  { value: "leader", label: "Lãnh đạo" },
  { value: "staff", label: "Nhân viên" },
  { value: "customer", label: "Khách hàng" },
]
const internalSteps: Record<DispatchStage, string> = {
  draft: "Container mẫu đã quá hạn kiểm tra tại cổng. Đề xuất giao Tổ cổng mẫu đối chiếu chứng từ và thông tin vào cổng.",
  reviewed: "Đã duyệt bản nháp, chờ lãnh đạo xác nhận giao việc.",
  assigned: "Đã giao cho Tổ cổng mẫu kiểm tra chứng từ.",
  blocked: "Vướng mắc nội bộ: chứng từ mẫu chưa đủ mục tham chiếu.",
  completed: "Tổ cổng mẫu đã hoàn tất bước kiểm tra.",
}
const actionClass = "min-h-11 rounded-lg border border-border px-3 py-2 text-left font-medium hover:bg-muted focus-visible:outline focus-visible:outline-2"

export function PortDispatchDemo() {
  const [state, dispatch] = useReducer(reduceDispatchDemo, initialDispatchDemo)
  const progress = publicDispatchProgress(state)
  const { role, stage } = state

  return (
    <details className="rounded-xl border border-border bg-card p-3">
      <summary className="min-h-10 cursor-pointer py-2 font-semibold">Điều hành cảng</summary>
      <div className="space-y-3 text-sm">
        <p className="text-muted-foreground">Mô phỏng với lô hàng giả định. Bản nháp soạn sẵn; không gửi dữ liệu hay kết nối cảng thật.</p>
        <label className="block font-medium">
          Chọn vai trò mô phỏng
          <select className="mt-1 block min-h-11 w-full rounded-lg border border-border bg-background px-2 sm:w-auto" value={role} onChange={(event) => {
            const value = event.target.value
            if (value === "leader" || value === "staff" || value === "customer") dispatch({ type: "role", role: value })
          }}>
            {roles.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <div className="space-y-1 rounded-lg border border-border p-3" role="status" aria-live="polite">
          <p className="font-semibold">Lô mẫu PW-DEMO-01</p>
          {role === "customer" ? (
            <>
              <div className="font-medium">{progress.label}</div>
              <p>{progress.message}</p>
            </>
          ) : <p>{internalSteps[stage]}</p>}
        </div>
        {role === "leader" && stage === "draft" && <button type="button" className={actionClass} onClick={() => dispatch({ type: "review" })}>Duyệt bản nháp</button>}
        {role === "leader" && stage === "reviewed" && <button type="button" className={actionClass} onClick={() => dispatch({ type: "assign" })}>Xác nhận giao việc</button>}
        {role === "staff" && (stage === "draft" || stage === "reviewed") && <p className="text-muted-foreground">Chờ lãnh đạo giao việc.</p>}
        {role === "staff" && stage === "assigned" && (
          <div className="flex flex-wrap gap-2">
            <button type="button" className={actionClass} onClick={() => dispatch({ type: "report-blocker" })}>Báo vướng mắc mẫu</button>
            <button type="button" className={actionClass} onClick={() => dispatch({ type: "complete" })}>Hoàn tất kiểm tra</button>
          </div>
        )}
        {role === "staff" && stage === "blocked" && <button type="button" className={actionClass} onClick={() => dispatch({ type: "resolve-blocker" })}>Xác nhận đã xử lý vướng mắc</button>}
        <div><button type="button" className="min-h-11 rounded underline underline-offset-2" onClick={() => dispatch({ type: "reset" })}>Đặt lại mô phỏng</button></div>
      </div>
    </details>
  )
}
