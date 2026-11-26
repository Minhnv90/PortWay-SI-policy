"use client";

import { useState, type ReactNode } from "react";
import {
  ArrowLeftRight,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Library,
  Lightbulb,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MODULE_TEXT, type Strings } from "@/lib/portway/i18n";
import { buildReport } from "@/lib/portway/report";
import type { Answer, LangCode } from "@/lib/portway/types";
import { cn } from "@/lib/utils";

interface AnswerCardProps {
  answer: Answer;
  lang: LangCode;
  t: Strings;
}

function SourceRefs({ ids }: { ids: number[] }) {
  if (ids.length === 0) return null;
  return (
    <span className="ms-1 whitespace-nowrap text-xs font-medium text-muted-foreground">
      {ids.map((id) => `[${id}]`).join(" ")}
    </span>
  );
}

function Block({
  label,
  icon,
  tone,
  children,
}: {
  label: string;
  icon: ReactNode;
  tone: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <h3 className={cn("flex items-center gap-2 px-3.5 py-2.5 text-sm font-semibold", tone)}>
        {icon}
        <span>{label}</span>
      </h3>
      <div className="flex flex-col gap-3 p-3.5 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

export function AnswerCard({ answer, lang, t }: AnswerCardProps) {
  const [copied, setCopied] = useState(false);
  const rtl = answer.language === "ar";

  async function copyReport() {
    const text = buildReport(answer, t);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (answer.researchMode === "simulation" || answer.researchMode === "worker") {
    const simulation = answer.researchMode === "simulation";
    return (
      <article className="rounded-lg border bg-card p-3.5 text-sm leading-relaxed">
        <Badge variant="secondary" className="mb-2">
          {lang === "vi" ? (simulation ? "Mô phỏng" : "Nghiên cứu") : (simulation ? "Simulation" : "Research")}
        </Badge>
        <p className="whitespace-pre-wrap break-words">{answer.summary}</p>
        {answer.strategicAnalysis.caveats[0] && (
          <p className="mt-2 text-xs text-muted-foreground">{answer.strategicAnalysis.caveats[0]}</p>
        )}
      </article>
    );
  }

  if (!answer.inScope) {
    return (
      <article dir={rtl ? "rtl" : "ltr"} className="rounded-lg border bg-card p-3.5 text-sm leading-relaxed">
        <Badge variant="secondary" className="mb-2">
          {t.outOfScope}
        </Badge>
        <p>{answer.declineMessage || answer.summary}</p>
      </article>
    );
  }

  const { masterPlanVsActual: plan, strategicAnalysis: analysis } = answer;

  return (
    <article dir={rtl ? "rtl" : "ltr"} className="flex flex-col gap-3">
      {answer.modules.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {answer.modules.map((id) => (
            <Badge key={id} variant="secondary" className="font-medium">
              {MODULE_TEXT[id][lang].name}
            </Badge>
          ))}
        </div>
      )}

      {answer.summary && <p className="text-base font-medium leading-relaxed text-pretty">{answer.summary}</p>}
      <p className="text-xs text-muted-foreground">{t.sourceTrustNote}</p>

      {answer.verifiedFacts.length > 0 && (
        <Block
          label={t.verifiedFacts}
          tone="bg-secondary text-secondary-foreground"
          icon={<Library className="size-4" aria-hidden="true" />}
        >
          <ul className="flex flex-col gap-3">
            {answer.verifiedFacts.map((fact, i) => (
              <li key={i}>
                {fact.text}
                <SourceRefs ids={fact.sources} />
              </li>
            ))}
          </ul>
        </Block>
      )}

      {(plan.planned.length > 0 || plan.actual.length > 0 || plan.gap) && (
        <Block
          label={t.planVsActual}
          tone="bg-plan-soft text-plan"
          icon={<ArrowLeftRight className="size-4" aria-hidden="true" />}
        >
          {(plan.planned.length > 0 || plan.actual.length > 0) && (
            <div className={cn("grid gap-3", plan.planned.length > 0 && plan.actual.length > 0 && "sm:grid-cols-2")}>
              {[
                { label: t.planned, items: plan.planned, color: "text-plan" },
                { label: t.implemented, items: plan.actual, color: "text-muted-foreground" },
              ].filter(({ items }) => items.length > 0).map(({ label, items, color }) => (
                <div key={label} className="flex flex-col gap-1.5 rounded-md bg-muted p-3">
                  <h4 className={cn("text-xs font-semibold uppercase tracking-wide", color)}>{label}</h4>
                  <ul className="flex flex-col gap-2">
                    {items.map((item, i) => (
                      <li key={i}>
                        {item.text}
                        <SourceRefs ids={item.sources} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {plan.gap && <p><span className="font-semibold">{t.gap}: </span>{plan.gap}</p>}
        </Block>
      )}

      {(analysis.paragraphs.length > 0 || analysis.caveats.length > 0) && (
        <Block
          label={t.strategicAnalysis}
          tone="bg-analysis-soft text-primary"
          icon={<Lightbulb className="size-4" aria-hidden="true" />}
        >
          <p className="text-xs italic text-muted-foreground">{t.analysisNote}</p>
          {analysis.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
          {analysis.caveats.length > 0 && (
            <ul className="flex list-disc flex-col gap-1.5 ps-5 text-muted-foreground">
              {analysis.caveats.map((caveat, i) => <li key={i}>{caveat}</li>)}
            </ul>
          )}
        </Block>
      )}

      {answer.sources.length > 0 && (
        <Block
          label={t.sourcesReliability}
          tone="bg-secondary text-secondary-foreground"
          icon={<Library className="size-4" aria-hidden="true" />}
        >
            <ul className="flex flex-col divide-y rounded-md border">
              {answer.sources.map((source) => (
                <li key={source.id}>
                  <Collapsible>
                    <CollapsibleTrigger className="group flex w-full items-center gap-2 px-3 py-2.5 text-start">
                      <span className="shrink-0 text-xs font-semibold text-muted-foreground">[{source.id}]</span>
                      <span className="min-w-0 flex-1 truncate">{source.title}</span>
                      <ChevronDown
                        className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
                        aria-hidden="true"
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="flex flex-col gap-1.5 bg-muted/60 px-3 py-2.5 text-sm">
                      <p className="font-medium text-pretty">{source.title}</p>
                      {source.issuer && (
                        <p>
                          <span className="text-muted-foreground">{t.issuedBy}: </span>
                          {source.issuer}
                        </p>
                      )}
                      {source.date && (
                        <p>
                          <span className="text-muted-foreground">{t.dated}: </span>
                          {source.date}
                        </p>
                      )}
                      {source.claim && <p className="text-muted-foreground">{source.claim}</p>}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {source.url && (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary underline underline-offset-2"
                          >
                            {t.openSource}
                            <ExternalLink className="size-3.5" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </li>
              ))}
            </ul>
        </Block>
      )}

      <div>
        <Button variant="outline" size="sm" onClick={copyReport} aria-live="polite">
          {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          {copied ? t.copied : t.copyReport}
        </Button>
      </div>
    </article>
  );
}
