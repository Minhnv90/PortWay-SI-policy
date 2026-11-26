import type { LangCode } from "./types";

type Showcase = { title: string; intro: string; checklist: [string, string, string]; action: string; prompt: string };

export const SHOWCASE: Record<LangCode, Showcase> = {
  vi: {
    title: "Thử ngay: Cái Mép → Jebel Ali",
    intro: "Lô hàng giả định. Không xác nhận tuyến, lịch tàu hay cước.",
    checklist: ["Chốt loại hàng và khoảng ngày gửi.", "Hỏi điểm giao và phụ phí.", "Đối chiếu chứng từ xuất khẩu."],
    action: "Điền câu hỏi mẫu",
    prompt: "Ví dụ giả định: gửi một container khô từ Cái Mép đến Jebel Ali. Cho tôi 3 việc cần kiểm tra trước khi hỏi báo giá: thông tin hàng và ngày gửi, điểm giao và phụ phí, chứng từ. Không đoán lịch tàu hay cước.",
  },
  en: {
    title: "Try it: Cái Mép → Jebel Ali",
    intro: "Fictional shipment. No route, schedule or rate is confirmed.",
    checklist: ["Confirm cargo and a shipping window.", "Ask about delivery and surcharges.", "Check the export documents."],
    action: "Use sample question",
    prompt: "Fictional dry container from Cái Mép to Jebel Ali. Give me three checks before requesting a quote: cargo and timing, delivery and surcharges, export documents. Do not guess schedules or rates.",
  },
  zh: {
    title: "试试看：Cái Mép → Jebel Ali",
    intro: "虚构货运案例。不确认航线、船期或运价。",
    checklist: ["确认货物和预计出运时间。", "询问交货地点和附加费。", "核对出口单证。"],
    action: "填写示例问题",
    prompt: "虚构案例：从 Cái Mép 运一个干货集装箱到 Jebel Ali。列出询价前需核对的三件事：货物和时间、交货和附加费、出口单证。不要猜测船期或运价。",
  },
  ja: {
    title: "試す：Cái Mép → Jebel Ali",
    intro: "架空の貨物です。航路・船便・運賃は未確認です。",
    checklist: ["貨物と出荷時期を確認。", "引渡場所と追加料金を確認。", "輸出書類を照合。"],
    action: "質問例を入力",
    prompt: "Cái Mép から Jebel Ali へドライコンテナを送る架空の例です。見積もり前に貨物と時期、引渡しと追加料金、輸出書類の確認事項を3つ示してください。船便や運賃は推測しないでください。",
  },
  ko: {
    title: "체험하기: Cái Mép → Jebel Ali",
    intro: "가상의 화물입니다. 항로, 운항 일정, 운임은 확인되지 않았습니다.",
    checklist: ["화물과 발송 시기를 확인합니다.", "인도 장소와 추가 요금을 묻습니다.", "수출 서류를 대조합니다."],
    action: "예시 질문 입력",
    prompt: "Cái Mép에서 Jebel Ali로 드라이 컨테이너를 보내는 가상 사례입니다. 견적 전에 확인할 세 가지: 화물과 일정, 인도와 추가 요금, 수출 서류를 정리해 주세요. 운항 일정이나 운임은 추측하지 마세요.",
  },
  ar: {
    title: "جرّب: Cái Mép → Jebel Ali",
    intro: "شحنة افتراضية. لا تأكيد للمسار أو الجدول أو السعر.",
    checklist: ["حدّد نوع البضاعة وموعد الشحن التقريبي.", "اسأل عن نقطة التسليم والرسوم الإضافية.", "راجع مستندات التصدير."],
    action: "استخدم السؤال النموذجي",
    prompt: "مثال افتراضي: حاوية جافة من Cái Mép إلى Jebel Ali. ما الخطوات الثلاث قبل طلب عرض سعر: البضاعة والتوقيت، والتسليم والرسوم الإضافية، ومستندات التصدير؟ لا تخمّن الجدول أو السعر.",
  },
};
