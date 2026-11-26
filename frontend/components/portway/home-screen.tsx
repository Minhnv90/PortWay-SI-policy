"use client";

import { ArrowUpRight } from "lucide-react";
import { CHIPS, type Strings } from "@/lib/portway/i18n";
import { SHOWCASE } from "@/lib/portway/showcase";
import type { LangCode } from "@/lib/portway/types";
import { ModulesList } from "./modules-list";
import { SampleQuoteComparison } from "./sample-quote-comparison";

interface HomeScreenProps {
  lang: LangCode;
  t: Strings;
  onPick: (prompt: string) => void;
  onDraft: (prompt: string) => void;
  disabled: boolean;
}

export function HomeScreen({ lang, t, onPick, onDraft, disabled }: HomeScreenProps) {
  const sample = SHOWCASE[lang];
  const detailLabel = { vi: "Xem chi tiết", en: "Details", zh: "查看详情", ja: "詳細", ko: "자세히", ar: "التفاصيل" }[lang];
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold leading-tight text-balance">{lang === "vi" ? "Hỏi về logistics và doanh nghiệp" : t.welcomeTitle}</h2>
      <SampleQuoteComparison lang={lang} />

      <section aria-labelledby="portway-showcase" className="rounded-xl border bg-card p-4">
        <h3 id="portway-showcase" className="text-base font-semibold">{sample.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{sample.intro}</p>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onDraft(sample.prompt)}
          className="mt-2 min-h-11 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
        >
          {sample.action}
        </button>
        <details className="mt-2">
          <summary className="cursor-pointer py-1 text-xs font-medium text-muted-foreground">{detailLabel}</summary>
          <p className="mt-1 text-sm leading-snug text-muted-foreground">{t.welcomeBody}</p>
        <ol className="mt-2 list-decimal space-y-1 ps-5 text-sm leading-snug">
          {sample.checklist.map((item) => <li key={item}>{item}</li>)}
        </ol>
        </details>
      </section>

      <details className="rounded-lg border px-3">
        <summary className="cursor-pointer py-3 text-sm font-medium">{t.tryAsking}</summary>
        <ul className="flex flex-col gap-2 pb-3">
          {CHIPS[lang].map((chip) => (
            <li key={chip}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onPick(chip)}
                className="flex w-full items-start justify-between gap-3 rounded-lg border bg-card px-3.5 py-3 text-start text-sm leading-snug transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
              >
                <span className="text-pretty">{chip}</span>
                <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground rtl:-scale-x-100" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </details>

      <details className="rounded-lg border px-3">
        <summary className="cursor-pointer py-3 text-sm font-medium">{t.browseModules}</summary>
        <div className="pb-3"><ModulesList lang={lang} t={t} onPick={onPick} disabled={disabled} /></div>
      </details>
    </div>
  );
}
