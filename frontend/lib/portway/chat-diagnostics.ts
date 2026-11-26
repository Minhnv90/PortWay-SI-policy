// Server-side: classify only known SDK identifiers and numeric status codes.
// Never log the error object, message, stack, URL, response body, or headers.
export type GatewayIssue = "authentication" | "access" | "quota" | "rate_limited" | "timeout" | "model_unavailable" | "network" | "provider" | "unknown";
export function classifyGatewayIssue(error: unknown): GatewayIssue {
  let current = error;
  for (let depth = 0; depth < 4 && current && typeof current === "object"; depth++) {
    const e = current as Record<string, unknown>;
    const status = e.statusCode ?? e.status;
    if (e.name === "GatewayAuthenticationError" || status === 401) return "authentication";
    if (e.name === "GatewayForbiddenError" || e.name === "GatewayAccessPolicyDeniedError" || status === 403) return "access";
    if (status === 402) return "quota";
    if (e.name === "GatewayRateLimitError" || status === 429) return "rate_limited";
    if (e.name === "GatewayTimeoutError" || e.name === "AbortError" || e.name === "TimeoutError" || status === 408 || status === 504) return "timeout";
    if (e.name === "GatewayModelNotFoundError") return "model_unavailable";
    if (typeof e.code === "string" && ["ECONNRESET", "ECONNREFUSED", "ENOTFOUND", "EAI_AGAIN", "UND_ERR_CONNECT_TIMEOUT"].includes(e.code)) return "network";
    if (typeof status === "number" && status >= 500 && status < 600) return "provider";
    current = e.lastError ?? e.cause;
  }
  return "unknown";
}

export const CHAT_PRIMARY_MODEL = "anthropic/claude-sonnet-5.5";
export function chatFallbackModel(config: string | undefined) {
  return config === "anthropic/claude-sonnet-4.6" || config === "anthropic/claude-sonnet-5" ? config : CHAT_PRIMARY_MODEL;
}

export function sameAccountRetryIsBlocked(issue: GatewayIssue) {
  return issue === "authentication" || issue === "access" || issue === "quota" || issue === "rate_limited";
}
