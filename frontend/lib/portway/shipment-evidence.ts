export const SHIPMENT_EVIDENCE = [
  {id:"booking", title:"Báo giá ≠ đặt chỗ", check:"Đối chiếu mã đặt chỗ, đơn vị xác nhận và bản cập nhật mới nhất. Báo giá hoặc yêu cầu đã gửi chưa chứng minh đặt chỗ được chấp nhận.", ask:"Hãng tàu hoặc đơn vị nhận đặt chỗ", source:"Maersk · Xác nhận đặt chỗ", url:"https://www.maersk.com/support/faqs/2025/09/05/how-do-i-get-a-booking-confirmation",
    match:/\b(booking|dat cho|xac nhan dat dich vu|booking confirmation|bao gia va dat)\b/},
  {id:"yard", title:"Tới cổng ≠ hạ bãi", check:"Đối chiếu số container, bến, loại giao nhận, thời điểm và trạng thái do cảng ghi nhận. Có số phiếu EIR không tự chứng minh sự kiện hạ bãi đã xảy ra.", ask:"Đầu mối giao nhận của đúng bến", source:"CMIT · Quy trình thủ tục cổng 2026", url:"https://www.cmit.com.vn/UploadFiles/TinyUpload/Files/procedure/CMIT%20-%20Quy%20trinh%20thu%20tuc%20cong%20cang%202026.pdf",
    match:/\b(eir|ha bai|toi cong|qua cong|nhan cont(?:ainer)?|gate in|yard receipt)\b/},
  {id:"load", title:"Dự kiến ≠ đã xếp tàu", check:"Tách kế hoạch, ước tính và sự kiện thực tế. Chỉ ghi đã xếp khi bản ghi thực tế khớp container, chuyến và địa điểm; mốc sà lan không thay mốc tàu mẹ.", ask:"Hãng tàu hoặc đơn vị khai thác chuyến", source:"DCSA · Track & Trace", url:"https://dcsa.org/standards/track-and-trace",
    match:/\b(da len tau|xep tau|len tau|tau me|hang da len|loaded on vessel|track and trace|dau vet lo hang)\b/},
] as const

function normalize(s: string) {
  return s.normalize("NFD").replace(/\p{M}/gu,"").replace(/đ/gi,"d").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()
}

export function formatShipmentEvidenceContext(question: string) {
  const q = normalize(question)
  const hits = SHIPMENT_EVIDENCE.filter(item => item.match.test(q))
  if (!hits.length) return ""
  return ["PORTWAY SHIPMENT EVIDENCE — background guidance only, not proof for the user's shipment. For a status question, lead with what the supplied evidence confirms, then what is missing and who can confirm it. Keep it brief unless asked for detail. Do not invent IDs, records, timestamps or integrations; match evidence to the same shipment. Never mark missing as failed by default.",
    ...hits.map(item => `- ${item.title}: ${item.check} Hỏi: ${item.ask}. Background only: ${item.url}`)].join("\n")
}
