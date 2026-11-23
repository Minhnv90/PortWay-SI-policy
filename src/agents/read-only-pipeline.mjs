import { planResearch, composeResearch } from "./orchestrator.mjs";
import { dispatchReadOnlyTool } from "../mcp/read-only-gateway.mjs";

// Staging-only deterministic pipeline; does not call an LLM or perform writes.
export async function runReadOnlyResearch(question, adapters) {
  const plan = planResearch(question);
  const records = await dispatchReadOnlyTool("portway_search_approved", { query: plan.question }, adapters);
  if (!Array.isArray(records)) throw new TypeError("Knowledge adapter must return records");
  const sourced = records.filter(r => r && typeof r.source_url === "string" && /^https:\/\//i.test(r.source_url));
  const results = {
    researcher: { status: "completed", summary: `Found ${records.length} approved-record candidates` },
    verifier: { status: "completed", summary: `${sourced.length} records include HTTPS source references; source content NOT independently verified` }
  };
  if (plan.steps.includes("logistics")) results.logistics = { status: "completed", summary: "Logistics review pending domain expert confirmation; no schedules, quotes or VGM cutoff inferred" };
  return { ...composeResearch(plan, results), sources: sourced.map(r => ({ id: r.id, title: r.title, url: r.source_url, last_checked_at: r.last_checked_at, evidence_status: r.evidence_status })), verification: "metadata_only", production_ready: false };
}
