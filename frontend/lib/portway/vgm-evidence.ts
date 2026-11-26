export const VGM_SOURCES = [
 {label:"IMO · Yêu cầu VGM theo SOLAS", url:"https://www.imo.org/en/ourwork/safety/pages/verification-of-the-gross-mass.aspx"},
 {label:"Maersk · Hướng dẫn hàng xuất Việt Nam", url:"https://www.maersk.com/local-information/asia-pacific/vietnam/export"},
] as const

export const VGM_GUIDANCE = "VGM là khối lượng toàn bộ container đã đóng hàng được xác minh. Với chuyến thuộc phạm vi SOLAS, VGM phải tới đúng bên đủ sớm để lên sơ đồ xếp tàu; có VGM không bảo đảm container được xếp. Đối chiếu riêng giờ chốt VGM, giờ chốt bãi (CY), và bản ghi xếp tàu thực tế. Kiểm tra đúng container, booking/chuyến, múi giờ và bản cập nhật mới nhất. Không dùng một mốc giờ chung cho mọi cảng hay hãng."

export function vgmSample(sent: number | null, cutoff: number, acceptedYard: boolean) {
  const vgm = sent === null ? "unknown" : sent < cutoff ? "before" : sent === cutoff ? "at-cutoff" : "after"
  return {vgm, yard: acceptedYard ? "received" : "unknown", loaded:"unknown"} as const
}

export function formatVgmEvidenceContext(question:string) {
 const q=question.normalize("NFD").replace(/\p{M}/gu,"").replace(/đ/gi,"d").toLowerCase().replace(/[^a-z0-9]+/g," ")
 if(!/\b(vgm|solas|cy cut off|cy cutoff|gio chot bai|verified gross mass)\b/.test(q)) return ""
 return `PORTWAY VGM (background only): ${VGM_GUIDANCE} Thời điểm gửi không chứng minh bên nhận đã ghi nhận. Thiếu mốc: chưa xác minh, không kết luận đã lỡ tàu. Bằng giờ chốt: hỏi đơn vị áp dụng, không tự coi đạt. Nguồn tham khảo: ${VGM_SOURCES.map(s=>s.url).join(" | ")}`
}
