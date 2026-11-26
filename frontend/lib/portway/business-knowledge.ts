export type BusinessReference = {
  id: string;
  title: string;
  issuer: string;
  url: string;
  checked: string;
  official: string;
  practice: string;
  limit: string;
  example: string;
  terms: string[];
};

export const BUSINESS_REFERENCES: readonly BusinessReference[] = [
  {
    id: "imo-vgm", title: "Khối lượng xác minh của container (VGM)", issuer: "IMO",
    url: "https://www.imo.org/en/ourwork/safety/pages/verification-of-the-gross-mass.aspx",
    checked: "2026-11-22",
    official: "Đối với container đóng hàng thuộc phạm vi SOLAS, shipper phải cung cấp VGM đủ sớm cho đại diện bến và thuyền trưởng hoặc đại diện để lập sơ đồ xếp tàu.",
    practice: "Xác định ai đứng tên shipper, mốc nhận VGM của hãng/bến và bằng chứng đã nộp; đối chiếu riêng với booking và hạn chứng từ.",
    limit: "Có VGM là điều kiện cần, không chứng minh container đã được xếp hoặc chắc chắn lên chuyến.",
    example: "Mình nộp VGM rồi. Cần xem gì để biết container đã lên tàu?",
    terms: ["vgm", "solas", "verified gross mass", "khoi luong xac minh", "can container"],
  },
  {
    id: "icc-incoterms", title: "Incoterms®: giao hàng, rủi ro và chi phí", issuer: "ICC",
    url: "https://library.iccwbo.org/clp/clp-incoterms-qa-2020.htm",
    checked: "2026-11-22",
    official: "Incoterms® phân chia nhiệm vụ, rủi ro và chi phí giữa người mua và người bán khi được đưa vào hợp đồng; không quy định chuyển quyền sở hữu.",
    practice: "Viết rõ quy tắc, địa điểm cụ thể và phiên bản; rà điều khoản sở hữu, thanh toán và xử lý chậm trễ riêng trong hợp đồng.",
    limit: "Không tự xác định giá cước, thuế, quyền sở hữu, luật áp dụng hoặc toàn bộ nghĩa vụ hợp đồng.",
    example: "Báo giá ghi CIF. Mình cần kiểm tra riêng phần quyền sở hữu và phụ phí thế nào?",
    terms: ["incoterms", "fob", "cif", "dap", "ddp", "chuyen quyen so huu", "diem chuyen rui ro"],
  },
  {
    id: "wco-hs", title: "Mã HS quốc tế và phân loại quốc gia", issuer: "WCO",
    url: "https://www.wcoomd.org/en/faq/harmonized_system_faq",
    checked: "2026-11-22",
    official: "HS dùng cấu trúc sáu chữ số ở mức quốc tế. Phân loại cuối cùng cho một nước xuất hoặc nhập khẩu dựa trên biểu tương ứng của nước đó.",
    practice: "Thu mô tả, thành phần, chức năng và tình trạng hàng; đối chiếu mã và biểu áp dụng theo nước, thời điểm, và hỏi hải quan khi còn nghi vấn.",
    limit: "Sáu chữ số không tự chứng minh mã khai báo đầy đủ, thuế suất, xuất xứ ưu đãi hoặc đủ điều kiện nhập khẩu.",
    example: "Mình mới có mã HS sáu số. Cần bổ sung thông tin gì để rà mã tại nước nhập?",
    terms: ["ma hs", "hs code", "bieu thue", "phan loai hang", "tariff classification"],
  },
  {
    id: "vn-registry", title: "Đăng ký doanh nghiệp và quyền đại diện", issuer: "Cổng thông tin quốc gia về đăng ký doanh nghiệp",
    url: "https://dangkykinhdoanh.gov.vn/vn/Pages/Staticpage.aspx?key=dvc",
    checked: "2026-11-22",
    official: "Cổng cung cấp dữ liệu cơ bản như tên, mã, tình trạng hoạt động và tên người đại diện theo pháp luật đã đăng ký.",
    practice: "Đối chiếu đúng pháp nhân, vai trò người làm việc và hồ sơ ủy quyền áp dụng cho giao dịch; xác nhận qua đầu mối độc lập đã biết nếu có thay đổi người thụ hưởng.",
    limit: "Bản ghi không tự chứng minh năng lực, giấy phép chuyên ngành, tài khoản thụ hưởng hay quyền ký một giao dịch cụ thể.",
    example: "Đối tác có đăng ký rồi. Mình kiểm tra người ký hợp đồng bằng giấy tờ nào?",
    terms: ["kyb", "dang ky doanh nghiep", "ma so doanh nghiep", "nguoi dai dien", "quyen ky", "uy quyen", "legal representative", "supplier verification"],
  },
  {
    id: "nist-identity", title: "Xác thực đăng nhập khác với cấp quyền", issuer: "NIST SP 800-63-4",
    url: "https://pages.nist.gov/800-63-4/sp800-63.html",
    checked: "2026-11-22",
    official: "Trong mô hình liên kết định danh của NIST, bên nhận kiểm tra xác nhận định danh và dùng mức bảo đảm cùng các yếu tố khác để ra quyết định cấp quyền.",
    practice: "Tách bốn câu: ai đăng nhập, thuộc pháp nhân nào, được làm việc gì, quyền còn hiệu lực không. Đối chiếu riêng vai trò và hồ sơ phê duyệt; không nhập giấy tờ cá nhân vào chat.",
    limit: "KYC hoặc đăng nhập hợp lệ không tự cấp quyền tổ chức, quyền ký hay phê duyệt giao dịch. NIST là hướng dẫn kỹ thuật, không phải quy định pháp lý mặc nhiên áp dụng cho doanh nghiệp Việt Nam.",
    example: "Nhân viên đã đăng nhập. Mình cần bằng chứng gì trước khi cho duyệt đơn?",
    terms: ["xac thuc", "xac minh danh tinh", "dang nhap", "dinh danh", "phan quyen", "cap quyen", "authorization", "authentication", "quyen ky", "kyc"],
  },
  {
    id: "uncitral-mletr", title: "Vận đơn điện tử và quyền kiểm soát", issuer: "UNCITRAL MLETR (2017)",
    url: "https://uncitral.un.org/en/texts/ecommerce/modellaw/electronic_transferable_records",
    checked: "2026-11-22",
    official: "MLETR mô tả cách dùng phương pháp đáng tin cậy để xác định hồ sơ, duy trì toàn vẹn, thiết lập quyền kiểm soát độc quyền và nhận biết người kiểm soát.",
    practice: "Hỏi nền tảng cách xác định bản ghi có hiệu lực, chuyển quyền kiểm soát và kiểm tra chấp nhận của các bên theo luật áp dụng.",
    limit: "PDF gửi email không tự trở thành vận đơn điện tử chuyển nhượng; luật mẫu không tự có hiệu lực hoặc thay luật nội dung áp dụng.",
    example: "Hãng gửi PDF qua email. Mình cần hỏi gì để biết đó có phải vận đơn điện tử chuyển nhượng được?",
    terms: ["mletr", "ebl", "e bl", "van don dien tu", "electronic bill of lading", "quyen kiem soat van don"],
  },
];

const normal = (value: string) => value.normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/gi, "d")
  .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export function selectBusinessReferences(question: string): BusinessReference[] {
  const q = " " + normal(question) + " ";
  return BUSINESS_REFERENCES.map((ref, order) => ({
    ref, order, score: ref.terms.reduce((sum, term) => sum + (q.includes(" " + term + " ") ? 1 : 0), 0),
  })).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, 3).map(({ ref }) => ref);
}

export function formatBusinessReferenceContext(question: string): string {
  const refs = selectBusinessReferences(question);
  if (!refs.length) return "";
  return "STATIC PRIMARY REFERENCES — background, not live research. Cite these exact URLs as knowledge_base only. 'Bước kiểm tra' is PortWay's practical inference, not a sourced fact or decision. A source about identity does not establish transaction authority; do not infer any company is vetted.\n" +
    refs.map((r) => `- ${r.issuer} | ${r.title} | ${r.url} | checked ${r.checked}\n  Nguồn nêu: ${r.official}\n  Bước kiểm tra: ${r.practice}\n  Giới hạn: ${r.limit}`).join("\n");
}
