import type { LangCode, ModuleId } from "./types";

export const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "ar", label: "العربية" },
];

export interface Strings {
  tagline: string;
  placeholder: string;
  send: string;
  newChat: string;
  history: string;
  modules: string;
  noHistory: string;
  deleteChat: string;
  language: string;
  welcomeTitle: string;
  welcomeBody: string;
  tryAsking: string;
  browseModules: string;
  topicsLabel: string;
  copyReport: string;
  copied: string;
  verifiedFacts: string;
  sourceTrustNote: string;
  planVsActual: string;
  strategicAnalysis: string;
  sourcesReliability: string;
  planned: string;
  implemented: string;
  gap: string;
  curatedBase: string;
  liveSearch: string;
  analysisNote: string;
  overall: string;
  high: string;
  medium: string;
  low: string;
  searching: string;
  errorGeneric: string;
  retry: string;
  issuedBy: string;
  dated: string;
  openSource: string;
  untitled: string;
  independence: string;
  saveFailed: string;
  followUps: string;
  noItems: string;
  outOfScope: string;
}

const en: Strings = {
  tagline: "Maritime & trade intelligence",
  placeholder: "Ask about ports, plans, investment…",
  send: "Send",
  newChat: "New chat",
  history: "Conversations",
  modules: "Modules",
  noHistory: "Your conversations will appear here.",
  deleteChat: "Delete conversation",
  language: "Language",
  welcomeTitle: "AI assistant for logistics and business teams",
  welcomeBody:
    "Research Vietnam’s ports and trade, define business partner criteria, and prepare introductions. Check the evidence before acting.",
  tryAsking: "Try asking",
  browseModules: "Intelligence modules",
  topicsLabel: "Representative topics",
  copyReport: "Copy Report",
  copied: "Copied",
  verifiedFacts: "AI summary points to check",
  sourceTrustNote: "AI-suggested links are not independently verified. Check the original documents before relying on these claims.",
  planVsActual: "[Master Plan vs. Actual Status]",
  strategicAnalysis: "[Strategic Analysis]",
  sourcesReliability: "AI-suggested links",
  planned: "Planned (master plan)",
  implemented: "Reported implementation (check)",
  gap: "Gap assessment",
  curatedBase: "Curated base",
  liveSearch: "Live search",
  analysisNote: "PortWay AI's own interpretation, not a verified fact.",
  overall: "Overall reliability",
  high: "High",
  medium: "Medium",
  low: "Low",
  searching: "Checking the curated base and official sources…",
  errorGeneric: "Something went wrong while preparing the answer.",
  retry: "Try again",
  issuedBy: "Issuing body",
  dated: "Date",
  openSource: "Open source",
  untitled: "New conversation",
  independence: "Independent. Master plans are never presented as built projects.",
  saveFailed: "Couldn't save your conversations just now. Retrying…",
  followUps: "Follow-up questions",
  noItems: "Nothing confirmed for this block.",
  outOfScope: "Outside coverage",
};

const vi: Strings = {
  tagline: "Thông tin hàng hải & thương mại",
  placeholder: "Hỏi về cảng, quy hoạch, đầu tư…",
  send: "Gửi",
  newChat: "Cuộc trò chuyện mới",
  history: "Cuộc trò chuyện",
  modules: "Mô-đun",
  noHistory: "Các cuộc trò chuyện của bạn sẽ xuất hiện ở đây.",
  deleteChat: "Xóa cuộc trò chuyện",
  language: "Ngôn ngữ",
  welcomeTitle: "Trợ lý AI cho nhân viên doanh nghiệp",
  welcomeBody:
    "Nghiên cứu cảng và thương mại, tìm tiêu chí chọn đối tác và soạn giới thiệu B2B. Kiểm chứng nguồn trước khi quyết định.",
  tryAsking: "Gợi ý câu hỏi",
  browseModules: "Các mô-đun thông tin",
  topicsLabel: "Chủ đề tiêu biểu",
  copyReport: "Sao chép báo cáo",
  copied: "Đã sao chép",
  verifiedFacts: "Điểm AI tổng hợp cần kiểm chứng",
  sourceTrustNote: "Các link do AI gợi ý chưa được xác minh độc lập. Mình nên mở tài liệu gốc trước khi dùng để quyết định.",
  planVsActual: "[Quy hoạch so với hiện trạng]",
  strategicAnalysis: "[Phân tích chiến lược]",
  sourcesReliability: "Link do AI gợi ý",
  planned: "Theo quy hoạch",
  implemented: "Thông tin triển khai (cần kiểm chứng)",
  gap: "Đánh giá khoảng cách",
  curatedBase: "Cơ sở tri thức",
  liveSearch: "Tìm kiếm trực tuyến",
  analysisNote: "Diễn giải của PortWay AI, không phải sự kiện đã xác minh.",
  overall: "Độ tin cậy tổng thể",
  high: "Cao",
  medium: "Trung bình",
  low: "Thấp",
  searching: "Đang kiểm tra cơ sở tri thức và nguồn chính thức…",
  errorGeneric: "Đã xảy ra lỗi khi chuẩn bị câu trả lời.",
  retry: "Thử lại",
  issuedBy: "Cơ quan ban hành",
  dated: "Ngày",
  openSource: "Mở nguồn",
  untitled: "Cuộc trò chuyện mới",
  independence: "Độc lập. Quy hoạch không bao giờ được trình bày như dự án đã xây dựng.",
  saveFailed: "Chưa thể lưu cuộc trò chuyện. Đang thử lại…",
  followUps: "Câu hỏi tiếp theo",
  noItems: "Chưa có nội dung được xác nhận.",
  outOfScope: "Ngoài phạm vi",
};

const zh: Strings = {
  tagline: "海事与贸易情报",
  placeholder: "询问港口、规划、投资…",
  send: "发送",
  newChat: "新对话",
  history: "对话记录",
  modules: "模块",
  noHistory: "您的对话将显示在这里。",
  deleteChat: "删除对话",
  language: "语言",
  welcomeTitle: "越南南部港口与物流走廊的独立情报",
  welcomeBody:
    "Cai Mep – Phu My、Long Son、Can Gio、Go Dau – Binh Duong – An Giang（GBA）港口群与 Ganh Rai 湾。每个回答都区分已核实事实、总体规划和分析。",
  tryAsking: "试着提问",
  browseModules: "情报模块",
  topicsLabel: "代表性主题",
  copyReport: "复制报告",
  copied: "已复制",
  verifiedFacts: "AI 汇总：请核实",
  sourceTrustNote: "AI 推荐的链接未经独立核实。请先查阅原始文件。",
  planVsActual: "[总体规划与实际进展]",
  strategicAnalysis: "[战略分析]",
  sourcesReliability: "AI 建议的链接",
  planned: "规划内容",
  implemented: "实施情况（待核实）",
  gap: "差距评估",
  curatedBase: "精选知识库",
  liveSearch: "实时搜索",
  analysisNote: "PortWay AI 的自身解读，并非已核实事实。",
  overall: "整体可靠性",
  high: "高",
  medium: "中",
  low: "低",
  searching: "正在查阅知识库与官方来源…",
  errorGeneric: "生成回答时出错。",
  retry: "重试",
  issuedBy: "发布机构",
  dated: "日期",
  openSource: "打开来源",
  untitled: "新对话",
  independence: "保持独立。总体规划绝不会被表述为已建成项目。",
  saveFailed: "暂时无法保存对话，正在重试…",
  followUps: "后续问题",
  noItems: "此部分暂无已确认内容。",
  outOfScope: "超出范围",
};

const ja: Strings = {
  tagline: "海事・貿易インテリジェンス",
  placeholder: "港湾、計画、投資について質問…",
  send: "送信",
  newChat: "新しいチャット",
  history: "会話履歴",
  modules: "モジュール",
  noHistory: "会話はここに表示されます。",
  deleteChat: "会話を削除",
  language: "言語",
  welcomeTitle: "ベトナム南部の港湾・物流回廊に関する独立した情報",
  welcomeBody:
    "Cai Mep – Phu My、Long Son、Can Gio、Go Dau – Binh Duong – An Giang（GBA）港湾群、Ganh Rai湾。すべての回答で、確認済みの事実、マスタープラン、分析を区別します。",
  tryAsking: "質問の例",
  browseModules: "インテリジェンスモジュール",
  topicsLabel: "代表的なトピック",
  copyReport: "レポートをコピー",
  copied: "コピーしました",
  verifiedFacts: "AIの要点：要確認",
  sourceTrustNote: "AIが示すリンクは独立に確認されていません。原文を確認してください。",
  planVsActual: "[マスタープランと実際の状況]",
  strategicAnalysis: "[戦略分析]",
  sourcesReliability: "AIが示したリンク",
  planned: "計画（マスタープラン）",
  implemented: "実施状況（要確認）",
  gap: "ギャップ評価",
  curatedBase: "厳選ナレッジベース",
  liveSearch: "ライブ検索",
  analysisNote: "PortWay AI自身の解釈であり、確認済みの事実ではありません。",
  overall: "総合信頼性",
  high: "高",
  medium: "中",
  low: "低",
  searching: "ナレッジベースと公的情報源を確認中…",
  errorGeneric: "回答の作成中に問題が発生しました。",
  retry: "再試行",
  issuedBy: "発行機関",
  dated: "日付",
  openSource: "情報源を開く",
  untitled: "新しい会話",
  independence: "独立性を保ちます。マスタープランを完成した事業として示すことはありません。",
  saveFailed: "会話を保存できませんでした。再試行しています…",
  followUps: "関連する質問",
  noItems: "このブロックで確認できた内容はありません。",
  outOfScope: "対象外",
};

const ko: Strings = {
  tagline: "해운 및 무역 인텔리전스",
  placeholder: "항만, 계획, 투자에 대해 질문하세요…",
  send: "보내기",
  newChat: "새 채팅",
  history: "대화 목록",
  modules: "모듈",
  noHistory: "대화가 여기에 표시됩니다.",
  deleteChat: "대화 삭제",
  language: "언어",
  welcomeTitle: "베트남 남부 항만·물류 회랑에 대한 독립 인텔리전스",
  welcomeBody:
    "Cai Mep – Phu My, Long Son, Can Gio, Go Dau – Binh Duong – An Giang(GBA) 항만군, Ganh Rai만. 모든 답변은 검증된 사실, 마스터플랜, 분석을 구분합니다.",
  tryAsking: "이런 질문을 해보세요",
  browseModules: "인텔리전스 모듈",
  topicsLabel: "대표 주제",
  copyReport: "보고서 복사",
  copied: "복사됨",
  verifiedFacts: "AI 요약: 확인 필요",
  sourceTrustNote: "AI가 제시한 링크는 독립적으로 검증되지 않았습니다. 원문을 확인하세요.",
  planVsActual: "[마스터플랜 대 실제 현황]",
  strategicAnalysis: "[전략 분석]",
  sourcesReliability: "AI가 제안한 링크",
  planned: "계획(마스터플랜)",
  implemented: "이행 현황(확인 필요)",
  gap: "격차 평가",
  curatedBase: "선별 지식 기반",
  liveSearch: "실시간 검색",
  analysisNote: "PortWay AI의 자체 해석이며 검증된 사실이 아닙니다.",
  overall: "전체 신뢰도",
  high: "높음",
  medium: "보통",
  low: "낮음",
  searching: "지식 기반과 공식 출처를 확인하는 중…",
  errorGeneric: "답변을 준비하는 중 문제가 발생했습니다.",
  retry: "다시 시도",
  issuedBy: "발행 기관",
  dated: "날짜",
  openSource: "출처 열기",
  untitled: "새 대화",
  independence: "독립적입니다. 마스터플랜을 완공된 사업으로 제시하지 않습니다.",
  saveFailed: "지금은 대화를 저장할 수 없습니다. 다시 시도하는 중…",
  followUps: "후속 질문",
  noItems: "이 블록에서 확인된 내용이 없습니다.",
  outOfScope: "범위 밖",
};

const ar: Strings = {
  tagline: "استخبارات بحرية وتجارية",
  placeholder: "اسأل عن الموانئ والخطط والاستثمار…",
  send: "إرسال",
  newChat: "محادثة جديدة",
  history: "المحادثات",
  modules: "الوحدات",
  noHistory: "ستظهر محادثاتك هنا.",
  deleteChat: "حذف المحادثة",
  language: "اللغة",
  welcomeTitle: "معلومات مستقلة عن الموانئ والممر اللوجستي في جنوب فيتنام",
  welcomeBody:
    "كاي مِب – فو ماي، لونغ سون، كان جيو، ومجمع موانئ غو داو – بينه دونغ – آن جيانغ (GBA) وخليج غانه راي. تفصل كل إجابة بين الحقائق الموثقة والمخططات العامة والتحليل.",
  tryAsking: "جرّب أن تسأل",
  browseModules: "وحدات المعلومات",
  topicsLabel: "مواضيع نموذجية",
  copyReport: "نسخ التقرير",
  copied: "تم النسخ",
  verifiedFacts: "نقاط من الذكاء الاصطناعي تحتاج إلى التحقق",
  sourceTrustNote: "روابط الذكاء الاصطناعي غير متحقق منها استقلاليًا. راجع المستندات الأصلية قبل الاعتماد عليها.",
  planVsActual: "[المخطط العام مقابل الوضع الفعلي]",
  strategicAnalysis: "[التحليل الاستراتيجي]",
  sourcesReliability: "روابط اقترحها الذكاء الاصطناعي",
  planned: "المخطط (المخطط العام)",
  implemented: "التنفيذ المذكور (يحتاج إلى التحقق)",
  gap: "تقييم الفجوة",
  curatedBase: "القاعدة المنتقاة",
  liveSearch: "بحث مباشر",
  analysisNote: "تفسير PortWay AI نفسه، وليس حقيقة موثقة.",
  overall: "الموثوقية الإجمالية",
  high: "عالية",
  medium: "متوسطة",
  low: "منخفضة",
  searching: "جارٍ فحص القاعدة المنتقاة والمصادر الرسمية…",
  errorGeneric: "حدث خطأ أثناء إعداد الإجابة.",
  retry: "حاول مرة أخرى",
  issuedBy: "الجهة المصدرة",
  dated: "التاريخ",
  openSource: "فتح المصدر",
  untitled: "محادثة جديدة",
  independence: "مستقل. لا تُعرض المخططات العامة أبدًا كمشاريع منفذة.",
  saveFailed: "تعذّر حفظ محادثاتك الآن. جارٍ إعادة المحاولة…",
  followUps: "أسئلة متابعة",
  noItems: "لا يوجد ما تم تأكيده في هذه الكتلة.",
  outOfScope: "خارج النطاق",
};

export const STRINGS: Record<LangCode, Strings> = { en, vi, zh, ja, ko, ar };

export const CHIPS: Record<LangCode, string[]> = {
  en: [
    "How does the Ganh Rai Bay master plan connect the shipping channel to Can Gio and Cai Mep – Phu My?",
    "What is the planned role and status of Can Gio International Transshipment Port?",
    "What is the current status of the Phu My industrial zone and its ports?",
    "What is the status of the Long Son petrochemical complex and its port?",
  ],
  vi: [
    "Quy hoạch luồng hàng hải Gành Rái kết nối Cần Giờ với Cái Mép – Phú Mỹ như thế nào?",
    "Vai trò và tiến độ của Cảng trung chuyển quốc tế Cần Giờ hiện ra sao?",
    "Hiện trạng khu công nghiệp – cảng Phú Mỹ như thế nào?",
    "Tiến độ tổ hợp hóa dầu và cảng Long Sơn hiện nay ra sao?",
  ],
  zh: [
    "Ganh Rai 湾航道规划如何连接 Can Gio 与 Cai Mep – Phu My？",
    "Can Gio 国际中转港的规划定位与目前进展如何？",
    "Phu My 工业区及其港口目前的状况如何？",
    "Long Son 石化综合体及其港口目前进展如何？",
  ],
  ja: [
    "Ganh Rai湾の航路計画は、Can GioとCai Mep – Phu Myをどのように結びますか？",
    "Can Gio国際トランシップメント港の計画上の役割と現状は？",
    "Phu My工業団地とその港湾の現状はどうなっていますか？",
    "Long Son石油化学コンプレックスと港湾の進捗は？",
  ],
  ko: [
    "Ganh Rai만 항로 계획은 Can Gio와 Cai Mep – Phu My를 어떻게 연결합니까?",
    "Can Gio 국제 환적항의 계획상 역할과 현황은 어떻습니까?",
    "Phu My 산업단지와 항만의 현황은 어떻습니까?",
    "Long Son 석유화학 단지와 항만의 진행 상황은 어떻습니까?",
  ],
  ar: [
    "كيف يربط مخطط الممر الملاحي في خليج غانه راي (Ganh Rai) بين كان جيو (Can Gio) وكاي مِب – فو ماي؟",
    "ما الدور المخطط والوضع الحالي لميناء كان جيو الدولي للمناولة؟",
    "ما الوضع الحالي للمنطقة الصناعية وموانئ فو ماي (Phu My)؟",
    "ما وضع مجمع لونغ سون (Long Son) للبتروكيماويات وميناءه؟",
  ],
};

interface ModuleText {
  name: string;
  description: string;
}

export const MODULE_TEXT: Record<ModuleId, Record<LangCode, ModuleText>> = {
  port: {
    en: { name: "Port Intelligence", description: "Terminals, berths and shipping lines." },
    vi: { name: "Thông tin cảng", description: "Bến cảng, cầu tàu và hãng tàu." },
    zh: { name: "港口情报", description: "码头、泊位与班轮公司。" },
    ja: { name: "港湾インテリジェンス", description: "ターミナル、バース、船会社。" },
    ko: { name: "항만 인텔리전스", description: "터미널, 선석, 선사." },
    ar: { name: "معلومات الموانئ", description: "المحطات والأرصفة وخطوط الشحن." },
  },
  logistics: {
    en: { name: "Logistics Intelligence", description: "Transport, warehousing and supply chains." },
    vi: { name: "Thông tin logistics", description: "Vận tải, kho bãi và chuỗi cung ứng." },
    zh: { name: "物流情报", description: "运输、仓储与供应链。" },
    ja: { name: "ロジスティクス", description: "輸送、倉庫、サプライチェーン。" },
    ko: { name: "물류 인텔리전스", description: "운송, 창고, 공급망." },
    ar: { name: "معلومات الخدمات اللوجستية", description: "النقل والتخزين وسلاسل الإمداد." },
  },
  investment: {
    en: { name: "Investment Intelligence", description: "Projects, capital and investors." },
    vi: { name: "Thông tin đầu tư", description: "Dự án, vốn và nhà đầu tư." },
    zh: { name: "投资情报", description: "项目、资金与投资者。" },
    ja: { name: "投資インテリジェンス", description: "プロジェクト、資本、投資家。" },
    ko: { name: "투자 인텔리전스", description: "프로젝트, 자본, 투자자." },
    ar: { name: "معلومات الاستثمار", description: "المشاريع ورؤوس الأموال والمستثمرون." },
  },
  legal: {
    en: { name: "Legal Intelligence", description: "Master plans, government decisions and regulations." },
    vi: { name: "Thông tin pháp lý", description: "Quy hoạch, quyết định của Chính phủ và quy định." },
    zh: { name: "法律情报", description: "总体规划、政府决定与法规。" },
    ja: { name: "法務インテリジェンス", description: "マスタープラン、政府決定、規制。" },
    ko: { name: "법률 인텔리전스", description: "마스터플랜, 정부 결정, 규정." },
    ar: { name: "المعلومات القانونية", description: "المخططات العامة والقرارات الحكومية واللوائح." },
  },
  market: {
    en: { name: "Market Intelligence", description: "Cargo flows and competitors." },
    vi: { name: "Thông tin thị trường", description: "Luồng hàng hóa và đối thủ cạnh tranh." },
    zh: { name: "市场情报", description: "货流与竞争对手。" },
    ja: { name: "市場インテリジェンス", description: "貨物フローと競合。" },
    ko: { name: "시장 인텔리전스", description: "화물 흐름과 경쟁사." },
    ar: { name: "معلومات السوق", description: "تدفقات البضائع والمنافسون." },
  },
  connector: {
    en: { name: "Business Connector", description: "Partners, clients and B2B opportunities." },
    vi: { name: "Kết nối doanh nghiệp", description: "Đối tác, khách hàng và cơ hội B2B." },
    zh: { name: "商务对接", description: "合作伙伴、客户与 B2B 机会。" },
    ja: { name: "ビジネスコネクター", description: "パートナー、顧客、B2B機会。" },
    ko: { name: "비즈니스 커넥터", description: "파트너, 고객, B2B 기회." },
    ar: { name: "ربط الأعمال", description: "الشركاء والعملاء وفرص التعامل بين الشركات." },
  },
  digital: {
    en: { name: "Digital Transformation", description: "AI and trade digitization." },
    vi: { name: "Chuyển đổi số", description: "AI và số hóa thương mại." },
    zh: { name: "数字化转型", description: "人工智能与贸易数字化。" },
    ja: { name: "デジタルトランスフォーメーション", description: "AIと貿易のデジタル化。" },
    ko: { name: "디지털 전환", description: "AI와 무역 디지털화." },
    ar: { name: "التحول الرقمي", description: "الذكاء الاصطناعي ورقمنة التجارة." },
  },
};

const MODULE_TOPICS_EN: Record<ModuleId, string[]> = {
  port: [
    "Which terminals operate in the Cai Mep – Phu My port cluster and what are their berth and draft capabilities?",
    "What is planned for the Long Son port area serving the petrochemical complex?",
    "How is Can Gio International Transshipment Port planned to relate to the existing Cai Mep terminals?",
  ],
  logistics: [
    "How is the Ganh Rai Bay shipping channel planned to connect Can Gio, Cai Mep – Phu My and Long Son?",
    "What road, rail and inland-waterway links are planned between the Go Dau – Binh Duong – An Giang (GBA) cluster and Cai Mep – Phu My?",
    "How do cargoes from the Phu My industrial zone reach the ports?",
  ],
  investment: [
    "What investment projects have been announced for Can Gio International Transshipment Port?",
    "What is the investment status of the Long Son petrochemical complex and its port?",
    "Who are the confirmed investors in the Phu My industrial zone and port terminals?",
  ],
  legal: [
    "What do Decision 1922/QD-BXD, Decision 4560/QD-UBND and Decision 148/QD-TTg cover?",
    "Which master plans govern the Ganh Rai Bay shipping channel and the Cai Mep – Phu My port cluster?",
    "What legal steps are required before Can Gio port construction can start?",
  ],
  market: [
    "How much container cargo moves through Cai Mep – Phu My compared with Cat Lai?",
    "How could Can Gio transshipment compete with Singapore and Port Klang?",
    "What cargo flows do the Long Son petrochemical complex and Phu My industrial zone generate?",
  ],
  connector: [
    "Which types of companies partner with terminal operators in Cai Mep – Phu My?",
    "What B2B opportunities exist around the Long Son complex and the Phu My industrial zone?",
    "How can a logistics company enter the Cai Mep – Phu My and GBA corridor market?",
  ],
  digital: [
    "What port community and customs digitization initiatives affect Cai Mep – Phu My?",
    "How is AI being used in port operations along this corridor?",
    "What smart-port features are planned for Can Gio International Transshipment Port?",
  ],
};

const MODULE_TOPICS_VI: Record<ModuleId, string[]> = {
  port: [
    "Cụm cảng Cái Mép – Phú Mỹ có những bến nào và năng lực cầu bến, độ sâu luồng ra sao?",
    "Quy hoạch khu bến Long Sơn phục vụ tổ hợp hóa dầu như thế nào?",
    "Cảng trung chuyển quốc tế Cần Giờ được quy hoạch liên hệ thế nào với các bến Cái Mép hiện hữu?",
  ],
  logistics: [
    "Quy hoạch luồng hàng hải Gành Rái kết nối Cần Giờ, Cái Mép – Phú Mỹ và Long Sơn như thế nào?",
    "Những tuyến đường bộ, đường sắt, đường thủy nội địa nào được quy hoạch nối cụm GBA (Gò Dầu – Bình Dương – An Giang) với Cái Mép – Phú Mỹ?",
    "Hàng hóa từ khu công nghiệp Phú Mỹ được vận chuyển ra cảng như thế nào?",
  ],
  investment: [
    "Những dự án đầu tư nào đã được công bố cho Cảng trung chuyển quốc tế Cần Giờ?",
    "Tình hình đầu tư tổ hợp hóa dầu và cảng Long Sơn hiện nay ra sao?",
    "Ai là các nhà đầu tư đã được xác nhận tại khu công nghiệp Phú Mỹ và các bến cảng?",
  ],
  legal: [
    "Quyết định 1922/QĐ-BXD, 4560/QĐ-UBND và 148/QĐ-TTg quy định những nội dung gì?",
    "Những quy hoạch nào điều chỉnh luồng hàng hải Gành Rái và cụm cảng Cái Mép – Phú Mỹ?",
    "Cần hoàn tất những thủ tục pháp lý nào trước khi xây dựng cảng Cần Giờ?",
  ],
  market: [
    "Sản lượng container qua Cái Mép – Phú Mỹ so với Cát Lái như thế nào?",
    "Cảng trung chuyển Cần Giờ có thể cạnh tranh với Singapore và Port Klang ra sao?",
    "Tổ hợp hóa dầu Long Sơn và khu công nghiệp Phú Mỹ tạo ra những dòng hàng nào?",
  ],
  connector: [
    "Những loại hình doanh nghiệp nào hợp tác với các nhà khai thác bến tại Cái Mép – Phú Mỹ?",
    "Có những cơ hội B2B nào quanh tổ hợp Long Sơn và khu công nghiệp Phú Mỹ?",
    "Doanh nghiệp logistics có thể gia nhập thị trường hành lang Cái Mép – Phú Mỹ và GBA như thế nào?",
  ],
  digital: [
    "Những sáng kiến cảng số và hải quan điện tử nào tác động đến Cái Mép – Phú Mỹ?",
    "AI đang được ứng dụng trong vận hành cảng dọc hành lang này như thế nào?",
    "Cảng trung chuyển quốc tế Cần Giờ dự kiến có những tính năng cảng thông minh nào?",
  ],
};

export function getModuleTopics(id: ModuleId, lang: LangCode): string[] {
  return lang === "vi" ? MODULE_TOPICS_VI[id] : MODULE_TOPICS_EN[id];
}

export function detectLanguage(): LangCode {
  if (typeof navigator === "undefined") return "en";
  const code = navigator.language.slice(0, 2).toLowerCase();
  const match = LANGUAGES.find((l) => l.code === code);
  return match ? match.code : "en";
}
