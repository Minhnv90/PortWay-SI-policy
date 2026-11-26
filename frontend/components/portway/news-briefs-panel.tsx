import { NEWS_BRIEFS, NEWS_REVIEWED_ON } from "@/lib/portway/news-briefs"
import type { LangCode } from "@/lib/portway/types"

export function NewsBriefsPanel({ lang }: { lang: LangCode }) {
  return <details className="rounded-xl border bg-card px-4">
    <summary className="cursor-pointer py-3 text-sm font-semibold">{lang === "vi" ? "Bản tin kiểm chứng" : "Reviewed news briefs (Vietnamese)"}</summary>
    <div lang="vi" dir="ltr" className="space-y-2 pb-3 text-sm">
      <p className="text-xs text-muted-foreground">Rà nguồn ngày <time dateTime={NEWS_REVIEWED_ON}>23/11/2026</time>. Đây là bản tin theo mốc, không cập nhật trực tiếp.</p>
      {NEWS_BRIEFS.map(item => <article key={item.id} className="space-y-1 rounded-md border p-2.5">
        <p className="text-xs text-muted-foreground"><time dateTime={item.date}>{item.date}</time> · {item.status}</p>
        <h3 className="font-semibold">{item.title}</h3>
        <p>{item.fact}</p>
        <p className="text-xs"><strong>Gợi ý cho PortWay:</strong> {item.implication}</p>
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-xs text-primary underline">{item.source} ↗</a>
      </article>)}
    </div>
  </details>
}
