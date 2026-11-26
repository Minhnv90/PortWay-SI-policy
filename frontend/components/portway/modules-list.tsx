"use client";

import {
  Anchor,
  Cpu,
  Handshake,
  Landmark,
  Scale,
  TrendingUp,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MODULE_TEXT, getModuleTopics, type Strings } from "@/lib/portway/i18n";
import { MODULE_IDS, type LangCode, type ModuleId } from "@/lib/portway/types";

const ICONS: Record<ModuleId, LucideIcon> = {
  port: Anchor,
  logistics: Truck,
  investment: Landmark,
  legal: Scale,
  market: TrendingUp,
  connector: Handshake,
  digital: Cpu,
};

interface ModulesListProps {
  lang: LangCode;
  t: Strings;
  onPick: (prompt: string) => void;
  disabled?: boolean;
}

export function ModulesList({ lang, t, onPick, disabled }: ModulesListProps) {
  return (
    <Accordion type="single" collapsible className="overflow-hidden rounded-lg border bg-card">
      {MODULE_IDS.map((id) => {
        const Icon = ICONS[id];
        const text = MODULE_TEXT[id][lang];
        return (
          <AccordionItem key={id} value={id} className="px-3.5 last:border-b-0">
            <AccordionTrigger className="gap-3 py-3.5 hover:no-underline">
              <span className="flex min-w-0 flex-1 items-center gap-3 text-start">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-semibold">{text.name}</span>
                  <span className="text-sm font-normal text-muted-foreground">{text.description}</span>
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t.topicsLabel}
              </p>
              <ul className="flex flex-col gap-1.5">
                {getModuleTopics(id, lang).map((topic) => (
                  <li key={topic}>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => onPick(topic)}
                      className="w-full rounded-md bg-muted px-3 py-2.5 text-start text-sm leading-snug transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
                    >
                      {topic}
                    </button>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
