import type { ChatFailure as Failure } from "@/lib/portway/chat-request";
import type { LangCode } from "@/lib/portway/types";

const COPY: Record<LangCode, Record<Failure, string>> = {
  vi: { connection: "Không kết nối được. Kiểm tra mạng rồi thử lại.", timeout: "Phản hồi quá lâu. Thử lại sau ít phút.", unavailable: "Dịch vụ chat tạm thời không truy cập được.", unreadable: "Không đọc được câu trả lời. Hãy thử lại.", rejected: "Yêu cầu không được chấp nhận. Kiểm tra câu hỏi rồi gửi lại.", generation: "AI chưa tạo được câu trả lời. Hãy thử lại." },
  en: { connection: "Could not connect. Check your connection and retry.", timeout: "The response took too long. Try again in a moment.", unavailable: "Chat is temporarily unavailable.", unreadable: "The answer could not be read. Try again.", rejected: "The request was rejected. Check the question and send it again.", generation: "AI couldn't generate an answer. Try again." },
  zh: { connection: "无法连接。请检查网络后重试。", timeout: "响应超时。请稍后重试。", unavailable: "聊天服务暂不可用。", unreadable: "无法读取回答。请重试。", rejected: "请求未获接受。请检查问题后重新发送。", generation: "AI 未能生成回答。请重试。" },
  ja: { connection: "接続できません。通信を確認して再試行してください。", timeout: "応答に時間がかかっています。少し待って再試行してください。", unavailable: "チャットは一時的に利用できません。", unreadable: "回答を読み取れませんでした。再試行してください。", rejected: "リクエストが拒否されました。質問を確認して送り直してください。", generation: "AI が回答を作成できませんでした。再試行してください。" },
  ko: { connection: "연결할 수 없습니다. 네트워크를 확인하고 다시 시도하세요.", timeout: "응답 시간이 초과되었습니다. 잠시 후 다시 시도하세요.", unavailable: "채팅 서비스를 일시적으로 사용할 수 없습니다.", unreadable: "답변을 읽을 수 없습니다. 다시 시도하세요.", rejected: "요청이 거부되었습니다. 질문을 확인하고 다시 보내세요.", generation: "AI가 답변을 생성하지 못했습니다. 다시 시도하세요." },
  ar: { connection: "تعذّر الاتصال. تحقّق من الشبكة وأعد المحاولة.", timeout: "استغرقت الإجابة وقتًا طويلًا. حاول لاحقًا.", unavailable: "خدمة الدردشة غير متاحة مؤقتًا.", unreadable: "تعذّرت قراءة الإجابة. أعد المحاولة.", rejected: "رُفض الطلب. راجع السؤال وأرسله مجددًا.", generation: "لم يتمكّن الذكاء الاصطناعي من إنشاء إجابة. أعد المحاولة." },
};

export function ChatFailure({ failure, requestId, lang }: { failure: Failure; requestId?: string; lang: LangCode }) {
  const details = { vi: "Chi tiết", en: "Details", zh: "详情", ja: "詳細", ko: "세부 정보", ar: "التفاصيل" }[lang];
  const refLabel = { vi: "Mã tra cứu", en: "Reference", zh: "参考编号", ja: "参照番号", ko: "참조 번호", ar: "الرقم المرجعي" }[lang];
  return <div><p className="text-destructive">{COPY[lang][failure]}</p><details className="mt-1 text-xs text-muted-foreground"><summary className="cursor-pointer">{details}</summary><code>{failure}</code>{requestId && <p>{refLabel}: <code className="break-all" dir="ltr">{requestId}</code></p>}</details></div>;
}
