import {
  MODULE_IDS,
  type Answer,
  type AnswerItem,
  type ModuleId,
  type Reliability,
  type Source,
} from "./types";

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function record(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function reliability(value: unknown): Reliability {
  return value === "high" || value === "medium" || value === "low" ? value : "low";
}

// A well-formed link is not provenance; all model-suggested sources stay unverified.
function safeUrl(value: unknown): string {
  if (typeof value !== "string" || /[\p{Cc}\p{Cf}\\]/u.test(value)) return "";
  const url = value.trim();
  if (url.length > 2048 || !/^https:\/\/[^/]/i.test(url) || /\s|%(?![0-9a-f]{2})/i.test(url)) return "";
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const labels = host.split(".");
    if (parsed.protocol !== "https:" || parsed.username || parsed.password ||
        labels.length < 2 || !/[a-z]/i.test(labels.at(-1) ?? "") ||
        /(?:^|\.)(?:localhost|localhost.localdomain|local|internal|test|invalid)$/.test(host) ||
        labels.some((label) => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))) return "";
    return parsed.href;
  } catch {
    return "";
  }
}

const isSourceId = (id: unknown): id is number =>
  typeof id === "number" && Number.isSafeInteger(id) && id > 0;

export function parseAnswer(raw: string): Answer | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;

  let data: Record<string, unknown>;
  try {
    data = record(JSON.parse(raw.slice(start, end + 1)));
  } catch {
    return null;
  }

  // Refuse ambiguous duplicate IDs, including collisions with a malformed source.
  const candidates = list(data.sources).map(record);
  const counts = new Map<number, number>();
  for (const s of candidates) {
    if (isSourceId(s.id)) counts.set(s.id, (counts.get(s.id) ?? 0) + 1);
  }
  const sources: Source[] = [];
  for (const s of candidates) {
    const title = str(s.title);
    const url = safeUrl(s.url);
    if (!isSourceId(s.id) || counts.get(s.id) !== 1 || !title || !url) continue;
    sources.push({
      id: s.id, title, issuer: str(s.issuer), date: str(s.date), url,
      reliability: "low", origin: "unverified", claim: str(s.claim),
    });
    if (sources.length === 20) break;
  }
  const sourceIds = new Set(sources.map((s) => s.id));

  const ids = (value: unknown): number[] =>
    [...new Set(list(value).filter((n): n is number => isSourceId(n) && sourceIds.has(n)))].slice(0, 6);

  const items = (value: unknown): AnswerItem[] =>
    list(value)
      .map((entry) => {
        const item = record(entry);
        return { text: str(item.text), sources: ids(item.sources) };
      })
      .filter((item) => item.text);

  const modules = list(data.modules).filter((m): m is ModuleId =>
    (MODULE_IDS as readonly unknown[]).includes(m),
  );

  const plan = record(data.masterPlanVsActual);
  const analysis = record(data.strategicAnalysis);
  const overall = record(data.overall);
  const rawScore = typeof overall.score === "number" ? overall.score : 0;
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  return {
    inScope: data.inScope !== false,
    declineMessage: str(data.declineMessage),
    language: str(data.language) || "en",
    modules,
    summary: str(data.summary),
    verifiedFacts: list(data.verifiedFacts)
      .map((entry) => {
        const fact = record(entry);
        return {
          text: str(fact.text),
          origin: "unverified" as const,
          sources: ids(fact.sources),
        };
      })
      .filter((fact) => fact.text),
    masterPlanVsActual: {
      planned: items(plan.planned),
      actual: items(plan.actual),
      gap: str(plan.gap),
    },
    strategicAnalysis: {
      paragraphs: list(analysis.paragraphs).map(str).filter(Boolean),
      caveats: list(analysis.caveats).map(str).filter(Boolean),
    },
    sources,
    overall: {
      score,
      level: overall.level ? reliability(overall.level) : score >= 75 ? "high" : score >= 45 ? "medium" : "low",
      rationale: str(overall.rationale),
    },
    followUps: list(data.followUps).map(str).filter(Boolean).slice(0, 3),
  };
}

// A JSON object can be well-formed yet have no answer a user can read.
export function hasAnswerContent(answer: Answer | null): answer is Answer {
  if (!answer) return false;
  if (!answer.inScope) return Boolean(answer.declineMessage || answer.summary);
  const { masterPlanVsActual: plan, strategicAnalysis: analysis } = answer;
  return Boolean(answer.summary || answer.verifiedFacts.length ||
    plan.planned.length || plan.actual.length || plan.gap ||
    analysis.paragraphs.length || analysis.caveats.length);
}
