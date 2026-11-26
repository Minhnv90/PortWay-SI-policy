import type { Answer } from "./types";

export type ChatFailure = "connection" | "timeout" | "unavailable" | "unreadable" | "rejected" | "generation";
export type ChatFailureResult = { failure: ChatFailure; requestId?: string };
type ChatResult = { answer: Answer } | ChatFailureResult;
const TIMEOUT_MS = 125_000;

export async function requestChat(payload: unknown): Promise<ChatResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const fromStatus: ChatFailure | null = [408, 504].includes(response.status) ? "timeout"
      : [400, 413, 422].includes(response.status) ? "rejected" : null;
    // A gateway or missing route may return HTML. Only known 502 JSON codes
    // from the chat route distinguish generation failure and unreadable output.
    let body: unknown;
    try { body = await response.json(); } catch {
      return { failure: controller.signal.aborted ? "timeout" : fromStatus ?? (response.ok ? "unreadable" : "unavailable") };
    }
    const data = body && typeof body === "object" ? body as { answer?: Answer; error?: unknown; requestId?: unknown } : null;
    const requestId = typeof data?.requestId === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(data.requestId) ? data.requestId : null;
    const failed = (failure: ChatFailure): ChatFailureResult => requestId ? { failure, requestId } : { failure };
    if (fromStatus) return failed(fromStatus);
    if (!response.ok) {
      if (response.status === 502 && data?.error === "generation_failed") return failed("generation");
      if (response.status === 502 && data?.error === "unreadable_answer") return failed("unreadable");
      return failed("unavailable");
    }
    const answer = data?.answer;
    if (!answer || typeof answer.inScope !== "boolean" || typeof answer.summary !== "string" ||
        typeof answer.declineMessage !== "string" || !(answer.summary.trim() || answer.declineMessage.trim())) {
      return failed("unreadable");
    }
    return { answer };
  } catch {
    return { failure: controller.signal.aborted ? "timeout" : "connection" };
  } finally { clearTimeout(timer); }
}
