import type { Answer, LangCode } from "./types";

const endpoint = "https://portway-si-policy.nguyenminh2290.workers.dev/api/research-assist";
const maxBytes = 128 * 1024;
const timeoutMs = 20_000;

export function researchAnswer(summary: string, language: LangCode, caveat: string, researchMode: NonNullable<Answer["researchMode"]>): Answer {
  return {
    researchMode, inScope: true, declineMessage: "", language, modules: [], summary,
    verifiedFacts: [], masterPlanVsActual: { planned: [], actual: [], gap: "" },
    strategicAnalysis: { paragraphs: [], caveats: [caveat] }, sources: [],
    overall: { score: 0, level: "low", rationale: "" }, followUps: [],
  };
}

export function simulateResearch(question: string, language: LangCode) {
  const preview = /\b1[., ]?130\b/.test(question) && /\b1[., ]?020\b/.test(question) && /USD|美元|米ドル|달러|دولار/i.test(question);
  const vi = language === "vi";
  const summary = preview
    ? vi ? "Với báo giá mẫu, B chỉ rẻ hơn nếu tổng phụ phí dưới 110 USD. Đúng 110 USD thì hai bên bằng nhau; trên 110 USD thì A rẻ hơn."
         : "In this sample, B is cheaper only if its total surcharges are below USD 110. At USD 110 the quotes tie; above that, A is cheaper."
    : vi ? "Chế độ mô phỏng chưa trả lời câu hỏi tùy ý. Hãy thử câu mẫu so sánh báo giá."
         : "The simulation does not answer arbitrary questions. Try the sample quotation comparison.";
  return researchAnswer(summary, language, vi ? "Dữ liệu giả lập. Không gọi AI Cloudflare." : "Simulated data. Cloudflare AI was not called.", "simulation");
}

export async function forwardResearch(question: string, language: LangCode, fetcher = fetch) {
  const signal = AbortSignal.timeout(timeoutMs);
  try {
    // Fixed destination. Do not forward identity, token, chat history or files.
    const response = await fetcher(endpoint, {
      method: "POST", redirect: "error", cache: "no-store", signal,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ question }),
    });
    if (response.status === 408 || response.status === 504) return { error: "research_timeout", status: 504 } as const;
    if (!response.ok) return { error: "research_unavailable", status: 503 } as const;
    if (!/^application\/json(?:\s*;|$)/i.test(response.headers.get("content-type") ?? "") || !response.body) {
      return { error: "unreadable_answer", status: 502 } as const;
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let total = 0, raw = "";
    try {
      for (;;) {
        const part = await reader.read();
        if (part.done) break;
        total += part.value.byteLength;
        if (total > maxBytes) {
          void reader.cancel().catch(() => {});
          return { error: "unreadable_answer", status: 502 } as const;
        }
        raw += decoder.decode(part.value, { stream: true });
      }
    } finally { reader.releaseLock(); }
    let data: unknown;
    try { data = JSON.parse(raw + decoder.decode()); } catch { data = null; }
    const answer = data && typeof data === "object" && "answer" in data && typeof data.answer === "string"
      ? data.answer.trim() : "";
    if (!answer || answer.length > 16_000) return { error: "unreadable_answer", status: 502 } as const;
    // Research is upstream analysis, not a verified fact or citation.
    return { answer: researchAnswer(answer, language, language === "vi"
      ? "Phản hồi từ dịch vụ nghiên cứu Cloudflare, chưa được xác minh độc lập."
      : "Cloudflare research response, not independently verified.", "worker") } as const;
  } catch {
    return signal.aborted
      ? { error: "research_timeout", status: 504 } as const
      : { error: "research_unavailable", status: 503 } as const;
  }
}
