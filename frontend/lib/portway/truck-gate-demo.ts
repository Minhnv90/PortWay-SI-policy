export type GateInput = {
  pickup: number | null
  loadingDone: number | null
  driveMinutes: number
  cutoff: number
  atGate: number | null
  yardReceipt: number | null
}

const planned: GateInput = {pickup:420, loadingDone:480, driveMinutes:60, cutoff:600, atGate:null, yardReceipt:null}
export const truckCases = {
  planned: { label:"Trước giờ chốt", input:planned },
  late: { label:"Nguy cơ trễ cổng", input:{...planned, loadingDone:570} },
  atGate: { label:"Tới cổng, chưa hạ bãi", input:{...planned, atGate:545} },
  received: { label:"Bãi xác nhận đã nhận", input:{...planned, atGate:545, yardReceipt:555} },
  missing: { label:"Thiếu mốc lấy rỗng", input:{...planned, pickup:null} },
} as const
export type TruckCase = keyof typeof truckCases

export function gateResult(i: GateInput) {
  const {pickup, loadingDone, driveMinutes, cutoff, atGate, yardReceipt} = i
  const valid = (v: number | null): v is number => v !== null && Number.isInteger(v) && v >= 0 && v < 1440
  if (!valid(pickup) || !valid(loadingDone) || pickup > loadingDone || !valid(driveMinutes) || !valid(cutoff)
    || (atGate !== null && (!valid(atGate) || atGate < loadingDone))
    || (yardReceipt !== null && (!valid(yardReceipt) || atGate === null || yardReceipt < atGate))) {
    return {status:"unknown", eta:null, margin:null} as const
  }
  if (yardReceipt !== null) return {status:"received", eta:null, margin:null} as const
  if (atGate !== null) return {status:"at-gate", eta:null, margin:null} as const
  const eta = loadingDone + driveMinutes
  const margin = cutoff - eta
  return {status: margin > 0 ? "ahead" : margin === 0 ? "tight" : "late", eta, margin} as const
}
