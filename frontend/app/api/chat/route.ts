import { CHAT_PRIMARY_MODEL, chatFallbackModel, classifyGatewayIssue, sameAccountRetryIsBlocked } from "@/lib/portway/chat-diagnostics";
import { formatEmployeeLearningContext } from "@/lib/portway/employee-learning";
import { gateway, generateText, isStepCount } from "ai";
import { z } from "zod";
import { formatBusinessReferenceContext } from "@/lib/portway/business-knowledge";
import { formatRegionalReferenceContext } from "@/lib/portway/regional-knowledge";
import { formatInventoryReferenceContext } from "@/lib/portway/inventory-knowledge";
import { buildSystemPrompt } from "@/lib/portway/knowledge";
import { hasAnswerContent, parseAnswer } from "@/lib/portway/normalize";
import { forwardResearch, simulateResearch } from "@/lib/portway/research-demo";
import { formatQuoteContext } from "@/lib/portway/quote-knowledge";
import { formatPortOperationsContext } from "@/lib/portway/port-operations";
import { formatDigitalEconomyContext } from "@/lib/portway/digital-economy";
import { formatShipmentEvidenceContext } from "@/lib/portway/shipment-evidence";
import { formatServiceProofContext } from "@/lib/portway/service-proof";
import { formatVgmEvidenceContext } from "@/lib/portway/vgm-evidence";
import { LANG_CODES } from "@/lib/portway/types";

export const maxDuration = 120;


const bodySchema = z.object({
  uiLanguage: z.enum(LANG_CODES),
  mode: z.enum(["research"]).optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(3000),
      }),
    )
    .min(1)
    .max(12),
});

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  const fail = (error: string, status: number) => Response.json({ error, requestId }, { status, headers: { "Cache-Control": "no-store" } });
  const log = (stage: "search" | "text", issue: string) => console.warn("portway.chat", { requestId, stage, issue });
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success || parsed.data.messages.at(-1)?.role !== "user") {
    return fail("invalid_request", 400);
  }

  const { messages, uiLanguage, mode } = parsed.data;
  if (mode === "research") {
    if (messages.length !== 1 || !messages[0]?.content.trim()) {
      return fail("invalid_request", 400);
    }
    const question = messages[0].content.trim();
    // Default to simulation. Operators may enable the live adapter
    // only on a private, access-controlled test deployment.
    if (process.env.PORTWAY_RESEARCH_LIVE !== "private-test") {
      return Response.json({ answer: simulateResearch(question, uiLanguage) });
    }
    const result = await forwardResearch(question, uiLanguage);
    return "error" in result
      ? fail(result.error ?? "research_unavailable", result.status ?? 503)
      : Response.json({ answer: result.answer });
  }
  // Explicit staging opt-in; preserve the original gateway path otherwise.
  if (process.env.PORTWAY_WORKER_URL) {
    try {
      const url = new URL(process.env.PORTWAY_WORKER_URL);
      if (url.protocol !== "https:" || url.hostname !== "portway-si-policy-staging.nguyenminh2290.workers.dev") return fail("generation_failed", 502);
      const response = await fetch(new URL("/api/chat", url), {method:"POST",headers:{"Content-Type":"application/json",Origin:"https://portwaysix5564.pinet.com"},body:JSON.stringify({question:messages.at(-1)?.content}),signal:AbortSignal.timeout(45000)});
      const data = await response.json();
      if (!response.ok || typeof data.answer !== "string" || !data.answer.trim()) return fail("generation_failed",502);
      const answer = parseAnswer(JSON.stringify({inScope:true,language:uiLanguage,summary:data.answer,overall:{score:0,level:"low",rationale:"Worker response; independently unverified"}}));
      return answer && hasAnswerContent(answer) ? Response.json({answer}) : fail("unreadable_answer",502);
    } catch { return fail("generation_failed",502); }
  }
  const today = new Date().toISOString().slice(0, 10);

  const latestQuestion = messages.at(-1)?.content ?? "";
  const businessReferences = formatBusinessReferenceContext(latestQuestion);
  const regionalReferences = formatRegionalReferenceContext(latestQuestion);
  const inventoryReferences = formatInventoryReferenceContext(latestQuestion);

  async function ask(searchAvailable: boolean) {
    const system = [buildSystemPrompt({ uiLanguage, searchAvailable, today }), regionalReferences, businessReferences, inventoryReferences, formatQuoteContext(latestQuestion), formatPortOperationsContext(latestQuestion), formatDigitalEconomyContext(latestQuestion), formatShipmentEvidenceContext(latestQuestion), formatServiceProofContext(latestQuestion), formatVgmEvidenceContext(latestQuestion), formatEmployeeLearningContext(latestQuestion)].filter(Boolean).join("\n\n");
    if (searchAvailable) {
      return generateText({
        model: CHAT_PRIMARY_MODEL,
        maxRetries: 0,
        system,
        messages,
        tools: { perplexity_search: gateway.tools.perplexitySearch({ maxResults: 8 }) },
        stopWhen: isStepCount(6),
      });
    }
    return generateText({ model: chatFallbackModel(process.env.PORTWAY_CHAT_FALLBACK_MODEL), maxRetries: 0, system, messages });
  }

  try {
    const withSearch = parseAnswer((await ask(true)).text);
    if (hasAnswerContent(withSearch)) return Response.json({ answer: withSearch });
    log("search", "unreadable");
  } catch (error) {
    const issue = classifyGatewayIssue(error);
    log("search", issue);
    // A gateway/account block is not fixed by sending the same prompt again.
    if (sameAccountRetryIsBlocked(issue)) return fail("generation_failed", 502);
  }

  try {
    const withoutSearch = parseAnswer((await ask(false)).text);
    if (!hasAnswerContent(withoutSearch)) {
      log("text", "unreadable");
      return fail("unreadable_answer", 502);
    }
    return Response.json({ answer: withoutSearch });
  } catch (error) {
    log("text", classifyGatewayIssue(error));
    return fail("generation_failed", 502);
  }
}
