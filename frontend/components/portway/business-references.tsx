import { BUSINESS_REFERENCES } from "@/lib/portway/business-knowledge";

import { REGIONAL_REFERENCES } from "@/lib/portway/regional-knowledge";

export function BusinessReferences() {
  return (
    <details lang="vi" dir="ltr" className="rounded-xl border bg-card px-4">
      <summary className="cursor-pointer py-3 text-sm font-semibold">Cẩm nang kiểm chứng logistics và B2B</summary>
      <p className="pb-3 text-xs text-muted-foreground">Nguồn gốc lưu sẵn. Bước kiểm tra là gợi ý của PortWay, không phải xác minh trực tiếp một lô hàng hoặc đối tác.</p>
      <details className="border-y py-2">
        <summary className="cursor-pointer py-1 text-sm font-semibold">Hồ sơ vùng Gành Rái · Cái Mép, Long Sơn, Cần Giờ</summary>
        <ul className="divide-y text-sm">
          {REGIONAL_REFERENCES.map(ref => (
            <li key={ref.id} className="py-2">
              <details>
                <summary className="cursor-pointer font-medium">{ref.title}</summary>
                <div className="space-y-1 py-2">
                  <p className="text-xs text-muted-foreground">Đối chiếu {ref.checked} · Nguồn lưu sẵn, không phải tra cứu trực tiếp.</p>
                  <p><b>Nguồn nêu:</b> {ref.official}</p>
                  <p><b>Bước kiểm tra:</b> {ref.practice}</p>
                  <p><b>Không kết luận:</b> {ref.limit}</p>
                  <p className="text-muted-foreground"><b>Thử hỏi:</b> {ref.example}</p>
                  {ref.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" className="block break-words py-1 text-primary underline">{source.label}</a>)}
                </div>
              </details>
            </li>
          ))}
        </ul>
      </details>
      <ul className="divide-y pb-2 text-sm">
        {BUSINESS_REFERENCES.map((ref) => (
          <li key={ref.id} className="py-2">
            <details>
              <summary className="cursor-pointer py-1 font-medium">{ref.title}</summary>
              <div className="space-y-1 py-2">
                <p><b>Nguồn nêu:</b> {ref.official}</p>
                <p><b>Bước kiểm tra:</b> {ref.practice}</p>
                <p><b>Không kết luận:</b> {ref.limit}</p>
                <p className="text-muted-foreground"><b>Thử hỏi:</b> {ref.example}</p>
                <a href={ref.url} target="_blank" rel="noopener noreferrer" className="inline-block break-words py-2 text-primary underline">{ref.issuer} · đối chiếu {ref.checked}</a>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </details>
  );
}
