export type BargeInputs = {
  factoryReady: number | null
  emptyReady: number | null
  load: number | null
  drive: number | null
  cutoff: number | null
  revision: "current" | "superseded"
}

const planned: BargeInputs = { factoryReady: 480, emptyReady: 480, load: 120, drive: 60, cutoff: 720, revision: "current" }
export const scenarios = {
  ready: { label: "Đủ thời gian", inputs: planned },
  risk: { label: "Nguy cơ trễ", inputs: { ...planned, emptyReady: 570 } },
  incomplete: { label: "Thiếu mốc", inputs: { ...planned, emptyReady: null } },
  exact: { label: "Sát giờ", inputs: { ...planned, emptyReady: 540 } },
  stale: { label: "Dữ liệu cũ", inputs: { ...planned, revision: "superseded" as const } },
} as const
export type Scenario = keyof typeof scenarios

export function evaluateBarge(i: BargeInputs) {
  if (i.revision !== "current") return { status: "stale", eta: null, margin: null } as const
  const {factoryReady, emptyReady, load, drive, cutoff} = i
  const valid = (n: number | null): n is number => n !== null && Number.isInteger(n) && n >= 0 && n < 1440
  if (!valid(factoryReady) || !valid(emptyReady) || !valid(load) || !valid(drive) || !valid(cutoff)) {
    return { status: "incomplete", eta: null, margin: null } as const
  }
  const eta = Math.max(factoryReady, emptyReady) + load + drive
  const margin = cutoff - eta
  return {status: margin < 0 ? "late" : margin === 0 ? "exact" : "ahead", eta, margin} as const
}

export function bargeClock(m: number | null) {
  if (m === null) return "Chưa có"
  const day = Math.floor(m / 1440)
  return `${String(Math.floor(m % 1440 / 60)).padStart(2,"0")}:${String(m % 60).padStart(2,"0")}${day ? ` (+${day} ngày)` : ""}`
}

export function customerDraft(status: ReturnType<typeof evaluateBarge>["status"]) {
  if (status === "late" || status === "exact") return "Kết nối sà lan có rủi ro. Đội điều phối đang xác minh với đơn vị sà lan. Chưa xác nhận lỡ chuyến tàu mẹ."
  if (status === "ahead") return "Theo mốc mẫu hiện có, lô hàng dự kiến đến trước giờ chốt sà lan. Chưa xác nhận đã tiếp nhận."
  return null
}

export const alternativeSampleCutoff = 810 // 13:30 Vietnam time, synthetic
export type SlotCheck = "unverified" | "confirmed" | "unavailable"
export function alternativeMargin(i: BargeInputs, check: SlotCheck, cutoff = alternativeSampleCutoff) {
  const original = evaluateBarge(i)
  if (check !== "confirmed" || (original.status !== "late" && original.status !== "exact")) return null
  if (!Number.isInteger(cutoff) || cutoff >= 1440 || i.cutoff === null || cutoff <= i.cutoff) return null
  const margin = cutoff - original.eta
  return {cutoff, margin, usable: margin > 0}
}
