import productionWorker from "./worker.js";
import { createApprovedRetrieval } from "./src/memory/approved-retrieval.mjs";
import { runReadOnlyResearch } from "./src/agents/read-only-pipeline.mjs";

// Staging-only preview. Default disabled, never accepts writes or remote MCP calls.
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/agent/preview") return productionWorker.fetch(request, env, ctx);
    const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
    if (env.PORTWAY_AGENT_ENABLED !== "true") return json({ error: "agent_preview_disabled" }, 404);
    if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
    const origin = request.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGINS || "").split(",").map(x => x.trim());
    if (!origin || !allowed.includes(origin)) return json({ error: "origin_not_allowed" }, 403);
    if (!env.STAGING_PREVIEW_TOKEN || request.headers.get("Authorization") !== "Bearer " + env.STAGING_PREVIEW_TOKEN) return json({ error: "unauthorized" }, 401);
    if (!env.KNOWLEDGE_DB) return json({ error: "staging_d1_unavailable" }, 503);
    const contentType = request.headers.get("content-type") || "";
    if (!/^application\/json(?:\s*;|\s*$)/i.test(contentType)) return json({ error: "unsupported_media_type" }, 415);
    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (!Number.isFinite(declaredLength) || declaredLength > 4096) return json({ error: "payload_too_large" }, 413);
    let input;
    try {
      const raw = await request.text();
      if (new TextEncoder().encode(raw).length > 4096) return json({ error: "payload_too_large" }, 413);
      input = JSON.parse(raw);
    } catch { return json({ error: "invalid_json" }, 400); }
    if (!input || typeof input.question !== "string" || !input.question.trim() || input.question.length > 1000) return json({ error: "invalid_question" }, 400);
    try {
      const result = await runReadOnlyResearch(input.question, createApprovedRetrieval(env.KNOWLEDGE_DB));
      return json(result);
    } catch {
      return json({ error: "preview_failed" }, 500);
    }
  }
};
