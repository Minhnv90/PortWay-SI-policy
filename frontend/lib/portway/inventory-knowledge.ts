const CARDS = [
  {
    "id": "pw-inventory-01",
    "title": "GTIN và số sê-ri",
    "text": "GTIN nhận diện mặt hàng thương mại. Cùng một GTIN có thể xuất hiện trên nhiều đơn vị sản phẩm; đừng loại trùng GTIN để đếm số lượng. Khi cần nhận diện từng đơn vị, cần mã riêng phù hợp, chẳng hạn GTIN kèm số sê-ri.",
    "sources": [
      "https://ref.gs1.org/guidelines/epcis-cbv/"
    ],
    "kind": "tham_khao_gs1"
  },
  {
    "id": "pw-inventory-02",
    "title": "Đơn vị logistics và SSCC",
    "text": "SSCC nhận diện từng đơn vị logistics, ví dụ một pallet đã đóng hàng. Đếm pallet không phải là đếm số thùng bên trong.",
    "sources": [
      "https://support.gs1.org/support/solutions/articles/43000734289-what-is-a-logistics-unit-and-how-is-it-identified-"
    ],
    "kind": "tham_khao_gs1"
  },
  {
    "id": "pw-inventory-03",
    "title": "Sự kiện EPCIS",
    "text": "GS1 EPCIS mô tả sự kiện truy xuất. Khi ghi nhận, ưu tiên biết vật gì, lúc nào, ở đâu, trong bước nghiệp vụ nào và ghi bằng cách nào. Đây là định hướng dữ liệu, chưa phải tuyên bố PortWay hỗ trợ EPCIS.",
    "sources": [
      "https://ref.gs1.org/guidelines/epcis-cbv/"
    ],
    "kind": "tham_khao_gs1"
  },
  {
    "id": "pw-inventory-04",
    "title": "Đối chiếu lượt quét",
    "text": "Tách danh sách dự kiến, quan sát thực tế và kết quả xác nhận. Kiểm tra xem hai bộ dữ liệu có cùng khu vực, thời điểm, đơn vị đếm và lượt kiểm kê không. Quét lặp một nhãn không đồng nghĩa có hàng dư; không đọc được mã không đồng nghĩa hàng bị mất.",
    "sources": [],
    "kind": "quy_tac_demo_portway"
  },
  {
    "id": "pw-inventory-05",
    "title": "Con người duyệt",
    "text": "Chỉ đề xuất việc kiểm tra lại. Người phụ trách duyệt trước khi đổi số tồn. Không có dữ liệu quét thì báo “chưa có dữ liệu quét”, không kết luận thiếu hàng hay kiểm kê đạt. Không tự gửi dữ liệu, tạo giao dịch hay điều khiển robot.",
    "sources": [],
    "kind": "quy_tac_demo_portway"
  },
  {
    "id": "pw-inventory-06",
    "title": "Giờ xảy ra và giờ ghi nhận",
    "text": "Thời điểm sự kiện khác thời điểm ghi nhận vào kho dữ liệu (EPCIS eventTime và recordTime). Luôn ghi rõ múi giờ và mốc chốt. Quan sát đến muộn nhưng xảy ra trước mốc chốt cần được xem lại trong báo cáo; quan sát xảy ra sau mốc chốt không tự động thay đổi báo cáo tại mốc cũ.",
    "sources": [
      "https://ref.gs1.org/guidelines/epcis-cbv/"
    ],
    "kind": "tham_khao_gs1"
  },
  {
    "id": "pw-inventory-07",
    "title": "Điểm đọc và vị trí đích",
    "text": "Điểm đọc (readPoint) khác vị trí nghiệp vụ (businessLocation). Quét ở cửa hoặc hành lang chỉ chứng minh mã đã được đọc tại đó; không tự coi hàng đã nhập kho tại vị trí đích. Đối chiếu lệnh chuyển, thời điểm, và xác nhận nhận hàng theo quy trình của doanh nghiệp.",
    "sources": [
      "https://ref.gs1.org/guidelines/epcis-cbv/"
    ],
    "kind": "tham_khao_gs1"
  },
  {
    "id": "pw-inventory-08",
    "title": "Quản lý bản đính chính",
    "text": "Giữ báo cáo gốc và ghi chú bản đính chính: thay đổi gì, vì sao, dựa vào bản ghi nào. Thiếu bằng chứng thì nói rõ. Đừng tự điều chỉnh tồn hoặc xác nhận vị trí đích.",
    "sources": [],
    "kind": "quy_tac_demo_portway"
  }
] as const;

const TOPICS = [
  /\b(gtin|so se ri|serial)\b/,
  /\b(sscc|pallet|don vi logistics)\b/,
  /\b(epcis|truy xuat|su kien)\b/,
  /\b(doi chieu|quet|kiem dem)\b/,
  /\b(duyet|xac nhan|ton kho)\b/,
  /\b(eventtime|recordtime|moc chot|mui gio|den muon|gio ghi nhan|thoi diem)\b/,
  /\b(readpoint|businesslocation|diem doc|vi tri dich|lenh chuyen)\b/,
  /\b(dinh chinh|ban goc|sua bao cao|bao cao ban dau)\b/,
];
const INVENTORY = /\b(kiem ke|kiem dem hang|kiem dem kho|ton kho|doi chieu kho|quet kho|quet pallet|quet ma hang|warehouse inventory|stock count|cycle count|inventory reconciliation|gtin|sscc|epcis|readpoint|businesslocation|eventtime|recordtime)\b/;

export function formatInventoryReferenceContext(query: string): string {
  const text = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, " ");
  const timedPilotScan = /\bmoc chot\b/.test(text) && /\bluot quet\b/.test(text) && (/\bp[0-9]{2}\b/.test(text) || /\b(day|hang hoa|kho)\b/.test(text));
  if (!INVENTORY.test(text) && !timedPilotScan) return "";
  // The conservative reconciliation and human-review rules always apply. A broad
  // request receives the complete small pack; narrow questions receive matching cards.
  const relevant = TOPICS.flatMap((topic, i) => (i !== 3 && i !== 4 && topic.test(text)) ? [i] : []);
  const included = relevant.length ? CARDS.filter((_card, i) => i === 3 || i === 4 || relevant.includes(i)) : CARDS;
  const pointers = Array.from(new Set(included.flatMap((card) => [...card.sources])));
  return [
    "PORTWAY INVENTORY REFERENCE (local curated knowledge; not live scan results). Only for warehouse inventory and logistics questions. Explain the next human check; do not imply ERP/WMS, camera, robot, EPCIS implementation, or write access. Do not request identifiers or actual warehouse records for the pilot. No live lookup needed for fixture arithmetic or supplied observations. Distinguish standards from PortWay demo guidance.",
    ...included.map(card => `[${card.kind === "tham_khao_gs1" ? "Tham khảo GS1" : "Quy tắc demo PortWay"}] ${card.title}: ${card.text}`),
    ...pointers.map(url => `Saved GS1 reference; not independently retrieved in this answer: ${url}`),
  ].join("\n");
}
