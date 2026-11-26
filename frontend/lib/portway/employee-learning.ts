const GXO_SOURCE = "https://apptronik.com/news-collection/gxo-and-apptronik-expand-partnership-to-scale-humanoid-deployment";

export const DOCUMENT_PRACTICE = {
  before: "Xem ảnh phiếu giao hàng và gửi xác nhận.",
  after: "Việc: soạn bản nháp xác nhận. Bối cảnh: bản chép phiếu giao hàng mẫu ghi giờ 15:40; số container bị mờ. Đầu ra: bảng hai dòng gồm trường, giá trị, tình trạng. Kiểm chứng: chỉ dùng chữ đọc rõ; chỗ mờ ghi ‘Chưa xác minh’, hỏi lại người giữ phiếu. Không gửi; chờ người phụ trách duyệt.",
} as const;

export const EMPLOYEE_CASES = [
  {
    title: "Báo giá thiếu phí",
    brief: "Giả định: A 1.130 USD giao kho, B 1.100 USD giao cảng; chưa có phí từ cảng đến kho. AI chọn B vì giá niêm yết thấp hơn. Bạn làm gì?",
    choices: ["Chọn B, tiết kiệm 30 USD.", "Hỏi tổng phí còn thiếu để so cùng điểm giao.", "Cộng mặc định 30 USD cho B."],
    correct: 1,
    evidence: "Hai báo giá khác điểm giao; 30 USD chỉ là mốc hòa giá, không phải phí thực tế.",
    takeaway: "So cùng phạm vi và liệt kê các khoản chưa rõ trước khi đề xuất nhà cung cấp.",
    source: null,
  },
  {
    title: "Từ thử nghiệm đến mở rộng",
    brief: "Theo thông cáo 12/11/2026, GXO và Apptronik đã thử Apollo lấy hàng nhỏ và ký thư ý định mở rộng. Mục tiêu tối đa 1.000 robot phụ thuộc kết quả. Bạn báo cáo thế nào?",
    choices: ["Ghi rõ thử nghiệm đã diễn ra, còn 1.000 là mục tiêu có điều kiện.", "Ghi 1.000 robot đã vận hành.", "Ghi chưa có thử nghiệm nào."],
    correct: 0,
    evidence: "Thông cáo nêu thử nghiệm trước đó, thư ý định và điều kiện về năng suất, an toàn, vận hành; không xác nhận đã triển khai 1.000 robot.",
    takeaway: "Tách thử nghiệm, kế hoạch có điều kiện, triển khai xác nhận và quy mô đã đo; ghi rõ ngày và nguồn.",
    source: GXO_SOURCE,
  },
  {
    title: "Phân quyền duyệt",
    brief: "Giả định: AI soạn đổi ca để xử lý lô hàng gấp. Quản lý chưa phản hồi, một nhân viên chưa xác nhận. Bước nào phù hợp?",
    choices: ["Cho AI tự áp dụng và gửi lịch.", "Coi im lặng là đồng ý.", "Giữ bản nháp, xác nhận người liên quan và xin người có quyền duyệt."],
    correct: 2,
    evidence: "Chưa có xác nhận của người liên quan và người có quyền; bản nháp không phải quyết định.",
    takeaway: "AI có thể soạn phương án. Con người cân nhắc tác động, lắng nghe nhân viên và chịu trách nhiệm phê duyệt.",
    source: null,
  },
  {
    title: "Đọc chứng từ mờ và soạn nháp",
    brief: "Giả định: phiếu giao hàng đọc rõ 15:40, nhưng số container bị mờ. Nhân viên muốn AI soạn xác nhận. Bạn giao việc thế nào?",
    choices: ["Đoán mã theo lô gần nhất rồi gửi.", "Chép 15:40, đánh dấu mã chưa xác minh, xin bản rõ; chỉ soạn nháp.", "Dùng giờ 15:40 để kết luận đã giao đúng container."],
    correct: 1,
    evidence: "15:40 là nội dung đọc được; riêng số container chưa có bằng chứng. Bản nháp không phải xác nhận giao hàng.",
    takeaway: "Nêu việc, bối cảnh, đầu ra và điều cần kiểm chứng; ghi rõ phần mờ, yêu cầu bản rõ và chờ người phụ trách duyệt.",
    source: null,
  },
] as const;

export type LearningPhase = "practice" | "proposed" | "checked" | "approved" | "rejected";
export type LearningState = { phase: LearningPhase; choice: number | null };
export const INITIAL_LEARNING: LearningState = { phase: "practice", choice: null };
export type LearningAction = { type: "choose"; choice: number } | { type: "propose" | "check" | "approve" | "reject" | "reset" };
export function learningTransition(state: LearningState, action: LearningAction, caseIndex: number): LearningState {
  const lesson = EMPLOYEE_CASES[caseIndex];
  if (action.type === "reset") return INITIAL_LEARNING;
  if (!lesson) return state;
  if (action.type === "choose" && state.phase === "practice" && Number.isInteger(action.choice) && action.choice >= 0 && action.choice < lesson.choices.length) return { ...state, choice: action.choice };
  if (action.type === "propose" && state.phase === "practice" && state.choice !== null) return { ...state, phase: "proposed" };
  if (action.type === "check" && state.phase === "proposed" && state.choice === lesson.correct) return { ...state, phase: "checked" };
  if (action.type === "approve" && state.phase === "checked" && state.choice === lesson.correct) return { ...state, phase: "approved" };
  if (action.type === "reject" && (state.phase === "proposed" || state.phase === "checked")) return { ...state, phase: "rejected" };
  return state;
}

// Source-controlled guidance only. The browser simulation never writes to this.
export function formatEmployeeLearningContext(question: string) {
  const q = question.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, " ");
  if (/\b(anh chup|anh phieu giao hang|anh chung tu|anh van don|doc anh|anh nay|photo|image|ocr|ban chup)\b/.test(q) && /\b(chung tu|phieu giao hang|van don|bill of lading|delivery note|container)\b/.test(q)) return "PORTWAY LEARNING (text-only chat, not OCR): Không tuyên bố thấy ảnh, mở camera hay đọc tệp. Xin bản chép đã ẩn dữ liệu nhạy cảm hoặc gợi ý cách tự đối chiếu bản rõ. Chỉ dùng dữ kiện từ bản chép; chỗ mờ hoặc thiếu ghi chưa xác minh và không suy đoán. Có thể soạn bản nháp; người phụ trách duyệt trước khi gửi hoặc hành động.";
  if (/\b(gxo|apptronik)\b/.test(q) && /\b(apollo|robot|1000|1 000)\b/.test(q)) return `PORTWAY LEARNING (curated historical background only, not a current count): Theo thông cáo Apptronik/GXO ngày 12/11/2026, Apollo đã thử lấy hàng nhỏ; thư ý định mở rộng thử nghiệm không phải xác nhận đã vận hành 1.000 robot. Mục tiêu tối đa 1.000 phụ thuộc hiệu suất, an toàn và vận hành; đợt đầu ở Bắc Mỹ nhắm cuối năm 2027. Source: ${GXO_SOURCE}`;
  if (/\b(doi ca|lich lam viec)\b/.test(q) && /\b(nhan vien|quan ly|phe duyet)\b/.test(q)) return "PORTWAY LEARNING (workflow reminder, not law): Tách đề xuất AI khỏi quyết định. Giữ bản nháp; nghe người bị ảnh hưởng và xin người có thẩm quyền duyệt trước khi áp dụng. Không coi im lặng là chấp thuận, không tuyên bố đã gửi hoặc thực hiện.";
  return "";
}
