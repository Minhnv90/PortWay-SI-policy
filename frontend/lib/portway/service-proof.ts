export const SERVICE_PROOF = {
  title: "Giới thiệu ≠ đã vận hành",
  steps: [
    "Giới thiệu: có menu hoặc trang dịch vụ. Chưa chứng minh có chỗ để đặt.",
    "Xác nhận vai trò: tìm công bố của cơ quan hoặc đối tác nêu tên, vai trò và phạm vi.",
    "Vận hành thật: kiểm tra ngày bắt đầu, loại dịch vụ, địa bàn và bằng chứng đang hoạt động. Thử nghiệm không đồng nghĩa mở thương mại.",
  ],
  caseNote: "Mốc 18/11/2026: RTA công bố chứng nhận bến Dubai Marina, nêu Joby là đơn vị dự kiến vận hành và thương mại còn phụ thuộc phê duyệt vận hành. AirLand có mục Flying taxi; chưa có bằng chứng hai nguồn này xác nhận AirLand tham gia tuyến, bán vé taxi bay hay xử lý thanh toán qua SidraChain.",
  refs: [
    {label:"RTA Dubai · Công bố ngày 18/11/2026", url:"https://www.rta.ae/wps/portal/rta/ae/home/news-and-media/all-news/NewsDetails/completion-of-the-dubai-marina-vertiport-with-a-gcaa-certification"},
    {label:"AirLand · Trang giới thiệu dịch vụ", url:"https://www.airlandglobal.com/"},
  ],
} as const

export function formatServiceProofContext(question: string) {
  const q = question.normalize("NFD").replace(/\p{M}/gu,"").replace(/đ/gi,"d").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()
  const air = /\b(airland|joby|taxi bay|flying taxi|air taxi|evtol)\b/.test(q)
  const proof = /\b(da van hanh thuong mai|da khai thac thuong mai|co quyen van hanh|doi tac chinh thuc|co hop tac chinh thuc|da mo ban ve|co phai doi tac|commercial operation|official partner)\b/.test(q)
  if (!air && !proof) return ""
  const guidance = "PORTWAY SERVICE PROOF — distinguish product listing, officially documented role and commercial operation. Match the same provider, route, scope and date. A facility certificate or a pilot is not permission to carry paying passengers, and a menu is not confirmed availability. Say when evidence is missing; don't infer a licence, partnership, live sale or payment. Use few words."
  return air ? [guidance, SERVICE_PROOF.caseNote, ...SERVICE_PROOF.refs.map(x=>x.url), "This is a dated reference, not a live status. Verify more recent developments if asked."].join("\n") : guidance
}
