// Pure, read-only orchestration. No network, model invocation or external writes.
export const ROLES = Object.freeze(["researcher", "verifier", "logistics"]);
export function planResearch(question) {
  if (typeof question !== "string" || !question.trim() || question.length > 8000) throw new TypeError("Invalid research question");
  const logistics = /(vgm|solas|container|incoterms|shipper|shipping|logistics|port|terminal|vessel|cang|cảng|tàu|vận đơn|hải quan)/i.test(question);
  return Object.freeze({
    question: question.trim(),
    steps: logistics ? ["researcher", "verifier", "logistics"] : ["researcher", "verifier"],
    mode: "read_only",
    requires_human_approval_for_writes: true
  });
}
export function composeResearch(plan, results) {
  if (!plan || !Array.isArray(plan.steps) || !results || typeof results !== "object") throw new TypeError("Invalid inputs");
  const steps = plan.steps.map(role => {
    const item = results[role];
    return { role, status: item?.status === "completed" ? "completed" : "pending", summary: typeof item?.summary === "string" ? item.summary.slice(0, 4000) : "" };
  });
  return { question: plan.question, steps, complete: steps.every(step => step.status === "completed"), mode: "read_only" };
}
