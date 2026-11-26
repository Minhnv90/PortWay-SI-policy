export const connections = {
  pending: { label: "Chưa đối chiếu", cutoff: null },
  enough: { label: "Còn thời gian", cutoff: 960 },
  tight: { label: "Sát giờ tàu mẹ", cutoff: 920 },
  late: { label: "Qua giờ chốt", cutoff: 900 },
  missing: { label: "Thiếu giờ chốt", cutoff: null },
} as const
export type ConnectionCase = keyof typeof connections
export const connectionTimes = { departure: 840, transit: 60, transfer: 20 }

export function checkConnection(c: ConnectionCase, bargeSlotUsable: boolean) {
  const cutoff = connections[c].cutoff
  if (!bargeSlotUsable || cutoff === null) return { status: "unknown", cutoff: null, handoff: null, margin: null } as const
  const handoff = connectionTimes.departure + connectionTimes.transit + connectionTimes.transfer
  const margin = cutoff - handoff
  return { status: margin > 0 ? "enough" : margin === 0 ? "tight" : "late", cutoff, handoff, margin } as const
}

export function connectionDraft(status: ReturnType<typeof checkConnection>["status"]) {
  if (status === "unknown") return "Có khung sà lan thay thế trong bài thử. Điều phối viên đang kiểm tra giờ chốt tàu mẹ."
  if (status === "enough") return "Theo mốc mẫu, dự kiến bàn giao trước giờ chốt nhận hàng cho tàu mẹ. Đội điều phối cần xác nhận với hãng tàu."
  if (status === "tight") return "Theo mốc mẫu, giờ bàn giao trùng giờ chốt tàu mẹ. Đội điều phối đang kiểm tra phương án khác."
  return "Theo mốc mẫu, dự kiến bàn giao sau giờ chốt tàu mẹ. Đội điều phối đang xác minh phương án khác."
}
