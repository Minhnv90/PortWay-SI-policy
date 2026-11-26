import { PORT_OPERATIONS } from "@/lib/portway/port-operations";
import type { LangCode } from "@/lib/portway/types";

export function PortOperationsHandbook({ lang }: { lang: LangCode }) {
  return (
    <details className="rounded-xl border bg-card px-4">
      <summary className="cursor-pointer py-3 text-sm font-semibold">
        {lang === "vi" ? "Sổ tay vận hành cảng biển Việt Nam" : "Vietnam Port Operations Handbook"}
      </summary>
      <div lang="vi" dir="ltr" className="pb-3 text-sm">
        <p className="pb-2 text-xs text-muted-foreground">
          Tài liệu tham khảo, không phải chỉ dẫn điều động tàu hay xác nhận thủ tục cho chuyến cụ thể. Đối chiếu quy định và thông báo đang áp dụng với đơn vị có thẩm quyền, hãng tàu và đúng bến.
        </p>
        <ul className="divide-y">
          {PORT_OPERATIONS.map((section) => (
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
