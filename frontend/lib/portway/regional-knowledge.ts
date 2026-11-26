type PrimarySource = { label: string; url: string };
type RegionalReference = {
  id: string; title: string; checked: string; official: string; practice: string; limit: string;
  example: string; aliases: readonly string[]; sources: readonly PrimarySource[];
};

const hdnd = {
  label: "HĐND TP.HCM · tình hình ngày 20/11/2026",
  url: "https://hdnd.hochiminhcity.gov.vn/tin-tuc/tin-tong-hop/cum-sieu-cang-cai-mep-thi-vai-can-gio-hut-cac-tap-doan-hang-tau-the-gioi",
};

export const REGIONAL_REFERENCES: readonly RegionalReference[] = [
  {
    id: "cai-mep-ssit", title: "Cái Mép–Thị Vải · SSIT và tuyến ZEPHYR", checked: "22/11/2026",
    official: "SSIT công bố dịch vụ MSC ZEPHYR tháng 11/2026. Vòng cảng công bố có King Abdullah và Jeddah; không liệt kê Jebel Ali trong chính vòng cảng đó.",
    practice: "Hỏi hãng tàu hoặc đại lý về đúng cặp cảng, ngày tàu, khả năng có chỗ và tổng phụ phí. Nếu đi Jebel Ali, hỏi phương án khác hoặc trung chuyển.",
    limit: "Vòng cảng công bố không xác nhận chuyến cụ thể, chỗ, giá hoặc booking; cũng không chứng minh mọi phương án đi Jebel Ali đều không có.",
    example: "ZEPHYR có ghé Jebel Ali không, và tôi cần hỏi hãng tàu những gì?",
    aliases: ["cai mep", "thi vai", "ssit", "zephyr"],
    sources: [
      { label: "SSIT · thông báo dịch vụ ZEPHYR", url: "https://www.ssit.com.vn/tin-tuc/ssit-don-tuyen-dich-vu-zephyr-mo-rong-ket-noi-truc-tiep-viet-nam-trung-dong-news-187.html" },
      { label: "SSIT · mạng dịch vụ và vòng cảng", url: "https://ssit.com.vn/procedures/service-network.html" },
    ],
  },
  {
    id: "cai-mep-ftz", title: "Cái Mép Hạ · phân biệt bến hiện hữu và dự án", checked: "22/11/2026",
    official: "Quyết định 4560/QĐ-UBND ngày 23/07/2026 tách phân khu 1 (bến container hiện hữu), 2 (dự án Cái Mép Hạ), và 3 (dự án Cái Mép Hạ hạ lưu). Quyết định 3999/QĐ-UBND ngày 30/06/2026 về thuê đất, giao khu vực biển giai đoạn 1 được Sở NN&MT dẫn lại; Geleximco công bố lễ khởi công phân khu 2 ngày 01/07/2026. HĐND ghi nhận phân khu 3 đã được chấp thuận đầu tư/nhà đầu tư. Gemalink hiện hữu và phần mở rộng giai đoạn 2 của cảng này không phải hai dự án mới đó.",
    practice: "Xác định tên đầy đủ và đơn vị vận hành; nếu hỏi đặt chỗ, xác minh bến đang khai thác với hãng tàu.",
    limit: "Không suy ra ngày khai thác, booking hay phần trăm thi công từ khởi công, phê duyệt hoặc vị trí địa lý hạ lưu.",
    example: "Gemalink hiện hữu có phải dự án Cái Mép Hạ hạ lưu không?",
    aliases: ["cai mep ha", "4560", "gemalink", "geleximco", "tan phuoc", "tan hai"],
    sources: [
      { label: "Báo Chính phủ · Quyết định 4560 và các phân khu", url: "https://xaydungchinhsach.chinhphu.vn/thanh-lap-khu-thuong-mai-tu-do-thanh-pho-ho-chi-minh-119260727152941057.htm" },
      { label: "Sở NN&MT TP.HCM · dẫn Quyết định 3999 ngày 30/06", url: "https://sonnmt.hochiminhcity.gov.vn/article?item=ca7ec5e2577d4155ac73e0dfa261054b" },
      { label: "Geleximco · lễ khởi công Cái Mép Hạ", url: "https://geleximco.vn/sieu-cang-cai-mep-ha-hon-50-000-ty-chinh-thuc-khoi-cong-don-tau-container-lon-nhat-the-gioi/" },
      { label: "Gemadept · giai đoạn 2 của Gemalink", url: "https://www.gemadept.com.vn/en/groundbreaking-for-gemalink-deep-sea-port-phase-2-elevating-the-status-of-an-international-trade-gateway/" },
      hdnd,
    ],
  },
  {
    id: "long-son", title: "Long Sơn · hóa dầu và bến chuyên dụng", checked: "22/11/2026",
    official: "Thông cáo LSP đăng 17/11/2026, ghi địa điểm và ngày 13/11/2026. Tổ hợp đang dừng để bảo dưỡng/nâng cấp, mục tiêu vận hành lại quý II/2027. Chạy thử, tăng công suất và kiểm tra tích hợp ethane dự kiến hoàn tất cuối quý III/2027, là mốc khác. ITPC ngày 19/11/2026 giới thiệu Bến cảng tổng hợp Long Sơn như một cơ hội đầu tư riêng, không phải bến chuyên dụng của LSP.",
    practice: "Tách luồng nguyên liệu hydrocarbon qua bến chuyên dụng khỏi hỏi giá logistics cho hạt nhựa thành phẩm. Kiểm tra đơn vị tiếp nhận, loại hàng và thời điểm có thể phục vụ.",
    limit: "Hai mốc là kế hoạch, không phải xác nhận đã vận hành lại; bến chuyên dụng không phải lựa chọn đặt container công cộng. Xúc tiến đầu tư bến tổng hợp không chứng minh đang khai thác.",
    example: "Có thể đặt container ở bến nguyên liệu LSP không?",
    aliases: ["long son", "hoa dau", "lsp", "lspe", "ethane", "etan", "cracker"],
    sources: [
      { label: "Long Son Petrochemicals · cập nhật tháng 11/2026", url: "https://www.lsp.com/vi/lsp-day-nhanh-du-an-tich-hop-khi-ethane-va-chuong-trinh-bao-duong-tong-the-xanh-nham-chuan-bi-khoi-dong-san-xuat-trong-quy-ii-2027/" },
      { label: "Long Son Petrochemicals · công năng bến chuyên dụng", url: "https://www.lsp.com/en/facilities-of-complex/" },
      { label: "ITPC · cơ hội đầu tư bến tổng hợp ngày 19/11", url: "https://itpc.hochiminhcity.gov.vn/-/hoi-nghi-xuc-tien-au-tu-thanh-pho-ho-chi-minh-singapore-nam-20-1" },
    ],
  },
  {
    id: "can-gio", title: "Cần Giờ · dự án cảng trung chuyển", checked: "22/11/2026",
    official: "Quyết định 148/QĐ-TTg ngày 16/01/2025 duyệt chủ trương. Quyết định 2155/QĐ-UBND ngày 11/04/2026 chấp thuận nhà đầu tư; lễ trao quyết định ngày 29/04/2026. Bài hiển thị ngày 20/11/2026 trên cổng HĐND nêu đang chuẩn bị thủ tục khởi công; bài trên trang VIMC nêu mục tiêu phấn đấu năm 2027, không phải ngày đã chốt.",
    practice: "Theo dõi thủ tục và mốc dự án. Nếu cần gửi hàng hiện tại, hỏi hãng tàu về bến đang hoạt động phù hợp.",
    limit: "Lễ trao quyết định không phải lễ khởi công; không xác nhận bến hoạt động, booking hay tiến độ thi công. Không suy ra từ các công trình lân cận.",
    example: "Cảng trung chuyển Cần Giờ đã nhận đặt chỗ chưa?",
    aliases: ["can gio", "2155", "148 qd ttg", "til", "cang trung chuyen quoc te"],
    sources: [
      { label: "Cổng Chính phủ · Quyết định 148/QĐ-TTg", url: "https://vanban.chinhphu.vn/?classid=2&docid=212495&pageid=27160" },
      { label: "VIMC · dẫn Quyết định 2155/QĐ-UBND", url: "https://vimc.co/kien-nghi-nang-cap-luong-hang-hai-phuc-vu-du-an-cang-trung-chuyen-quoc-te-can-gio/" },
      { label: "Cảng Sài Gòn · lễ trao quyết định", url: "https://saigonport.vn/trao-quyet-dinh-chap-nhan-nha-dau-tu-sieu-cang-can-gio-khang-dinh-vi-the-logistics-viet-nam/" },
      hdnd,
    ],
  },
];

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, " ").trim();
}

export function matchRegionalReferences(query: string) {
  const text = " " + normalize(query) + " ";
  if (text.includes(" ganh rai ")) return REGIONAL_REFERENCES;
  return REGIONAL_REFERENCES.filter(ref => ref.aliases.some(alias => text.includes(" " + alias + " ")));
}

export function formatRegionalReferenceContext(query: string): string {
  const matches = matchRegionalReferences(query);
  if (!matches.length) return "";
  return [
    "CURATED REGIONAL REFERENCE SNAPSHOTS. These are not live search or shipment evidence. Preserve status/event date separately from publication/check date. A failure to open a link is not a contradiction. Present URLs as saved reference pointers, never as independently retrieved. Do not infer operation, booking, or price.",
    ...matches.map(ref => [
      ref.title + " (checked " + ref.checked + "): " + ref.official,
      "Practical next step: " + ref.practice,
      "Limits: " + ref.limit,
      ...ref.sources.map(item => item.label + ": " + item.url),
    ].join("\n")),
  ].join("\n\n");
}
