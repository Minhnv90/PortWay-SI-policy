import { DIGITAL_ECONOMY } from "@/lib/portway/digital-economy";
import type { LangCode } from "@/lib/portway/types";

export function DigitalEconomyHandbook({ lang }: { lang: LangCode }) {
  return (
    <details className="rounded-xl border bg-card px-4">
      <summary className="cursor-pointer py-3 text-sm font-semibold">
        {lang === "vi" ? "Kinh tế số" : "Digital Economy"}
      </summary>
      <div lang="vi" dir="ltr" className="pb-3 text-sm">
        <p className="pb-2 text-xs text-muted-foreground">
          Kiến thức và tình huống mô phỏng; không giao dịch thật
        </p>
        <ul className="divide-y">
          {DIGITAL_ECONOMY.map((section) => (
            <li key={section.id} className="py-1">
              <details>
                <summary className="min-h-10 cursor-pointer py-2 font-medium">{section.title}</summary>
                <div className="space-y-2 pb-3">
                  <ol className="list-decimal space-y-1 ps-5">
                    {section.steps.map((step, index) => <li key={index}>{step}</li>)}
                  </ol>
                  <p className="rounded-md bg-muted px-2 py-1.5 text-sm"><strong>Lưu ý:</strong> {section.caution}</p>
                  {section.sources.length > 0 && (
                    <div>
                      <p className="font-medium">Nguồn gốc</p>
                      <ul className="list-disc space-y-1 ps-5">
                        {section.sources.map(({ label, url }) => (
                          <li key={url}>
                            <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block break-words py-1 text-primary underline">
                              {label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
