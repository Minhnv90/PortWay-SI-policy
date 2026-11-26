export type HandoffState = {
  barge: "ahead" | "late" | "exact" | "incomplete" | "stale"
  slot: "unverified" | "confirmed" | "unavailable"
  connection: "unknown" | "enough" | "tight" | "late"
  alternativeUsable: boolean
}
export function nextHandoffTask(s: HandoffState) {
  if (s.barge === "stale") return {owner:"Điều phối viên", action:"Đối chiếu bản mới trước khi tính lại giờ đến."}
  if (s.barge === "incomplete") return {owner:"Đội xe", action:"Xác nhận giờ container rỗng sẵn sàng với điều phối."}
  if (s.barge === "ahead") return {owner:"Đơn vị sà lan", action:"Xác nhận tình trạng tiếp nhận lô hàng; giờ dự kiến không thay thế xác nhận."}
  if (s.slot === "unavailable") return {owner:"Điều phối viên", action:"Tìm khung sà lan khác; không báo đã lỡ tàu mẹ."}
  if (s.slot !== "confirmed") return {owner:"Đơn vị sà lan", action:"Xác nhận có khung thay thế hay không."}
  if (!s.alternativeUsable) return {owner:"Điều phối viên", action:"Tìm khung sà lan còn đủ thời gian đệm."}
  if (s.connection === "unknown") return {owner:"Hãng tàu", action:"Xác minh giờ chốt nhận hàng cho tàu mẹ."}
  if (s.connection === "tight" || s.connection === "late") return {owner:"Điều phối viên", action:"Đối chiếu phương án nối chuyến khác với hãng tàu."}
  return {owner:"Điều phối viên", action:"Xác nhận giữ chỗ sà lan và điều kiện nối chuyến với hãng tàu."}
}
