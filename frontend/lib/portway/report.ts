import type { Strings } from "./i18n";
import type { Answer, AnswerItem } from "./types";

function refs(ids: number[]): string {
  return ids.length ? ` [${ids.join(", ")}]` : "";
}

const itemLine = (item: AnswerItem) => `- ${item.text}${refs(item.sources)}`;

export function buildReport(answer: Answer, t: Strings): string {
  const lines: string[] = ["PortWay AI", ""];
  if (!answer.inScope) return [...lines, answer.declineMessage || answer.summary].join("\n");

  if (answer.summary) lines.push(answer.summary, "");
  lines.push(t.sourceTrustNote);

  if (answer.verifiedFacts.length > 0) {
    lines.push("", t.verifiedFacts, ...answer.verifiedFacts.map(itemLine));
  }

  const plan = answer.masterPlanVsActual;
  if (plan.planned.length > 0 || plan.actual.length > 0 || plan.gap) {
    lines.push("", t.planVsActual);
    if (plan.planned.length > 0) lines.push(t.planned, ...plan.planned.map(itemLine));
    if (plan.actual.length > 0) lines.push(t.implemented, ...plan.actual.map(itemLine));
    if (plan.gap) lines.push(`${t.gap}: ${plan.gap}`);
  }

  const analysis = answer.strategicAnalysis;
  if (analysis.paragraphs.length > 0 || analysis.caveats.length > 0) {
    lines.push("", t.strategicAnalysis, t.analysisNote);
    for (const paragraph of analysis.paragraphs) lines.push(paragraph);
    for (const caveat of analysis.caveats) lines.push(`- ${caveat}`);
  }

  if (answer.sources.length > 0) {
    lines.push("", t.sourcesReliability);
    for (const source of answer.sources) {
      const parts = [source.title, source.issuer, source.date, source.url];
      lines.push(`[${source.id}] ${parts.filter(Boolean).join(" | ")}`);
    }
  }

  return lines.join("\n");
}
