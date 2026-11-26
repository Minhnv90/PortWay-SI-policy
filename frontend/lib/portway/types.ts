export const LANG_CODES = ["en", "vi", "zh", "ja", "ko", "ar"] as const;
export type LangCode = (typeof LANG_CODES)[number];

export const MODULE_IDS = [
  "port",
  "logistics",
  "investment",
  "legal",
  "market",
  "connector",
  "digital",
] as const;
export type ModuleId = (typeof MODULE_IDS)[number];

export type Reliability = "high" | "medium" | "low";
export type FactOrigin = "knowledge_base" | "live_search" | "unverified";

export interface AnswerItem {
  text: string;
  sources: number[];
}

export interface Fact extends AnswerItem {
  origin: FactOrigin;
}

export interface Source {
  id: number;
  title: string;
  issuer: string;
  date: string;
  url: string;
  reliability: Reliability;
  origin: FactOrigin;
  claim: string;
}

export interface Answer {
  researchMode?: "simulation" | "worker";
  inScope: boolean;
  declineMessage: string;
  language: string;
  modules: ModuleId[];
  summary: string;
  verifiedFacts: Fact[];
  masterPlanVsActual: {
    planned: AnswerItem[];
    actual: AnswerItem[];
    gap: string;
  };
  strategicAnalysis: {
    paragraphs: string[];
    caveats: string[];
  };
  sources: Source[];
  overall: {
    score: number;
    level: Reliability;
    rationale: string;
  };
  followUps: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  answerJson?: string;
  researchTurn?: boolean;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
}

export function makeId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
  ).toLowerCase();
}
