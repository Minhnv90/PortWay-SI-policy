import { SAMPLE_QUOTE_GAP_USD, SAMPLE_QUOTES } from "@/lib/portway/sample-quote-comparison";
import type { LangCode } from "@/lib/portway/types";

const labels = {
  vi: ["So hai báo giá mẫu", "giao kho", "giao cảng"],
  en: ["Compare two sample quotes", "to warehouse", "to port"],
  zh: ["比较两份示例报价", "送到仓库", "送到港口"],
  ja: ["見積もり例を比較", "倉庫まで", "港まで"],
  ko: ["샘플 견적 두 개 비교", "창고까지", "항구까지"],
  ar: ["قارن عرضي أسعار تجريبيين", "إلى المستودع", "إلى الميناء"],
} as const;

export function SampleQuoteComparison({ lang }: { lang: LangCode }) {
  const [title, warehouse, port] = labels[lang];
  const vi = lang === "vi";
  const amount = (value: number) => `${value.toLocaleString(vi ? "vi-VN" : "en-US")} USD`;
  const gap = amount(SAMPLE_QUOTE_GAP_USD);
  return (
    <details className="rounded-lg border bg-card px-3">
      <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-ring">{title}</summary>
      <div className="space-y-2 pb-3 text-sm leading-snug" lang={vi ? "vi" : "en"} dir="ltr">
        <p className="text-xs text-muted-foreground">{vi ? "Ví dụ giả định, không phải báo giá thực." : "Fictional example, not a real quote."}</p>
        <dl className="grid grid-cols-2 gap-2">
          <div className="min-w-0 rounded-md border p-2" lang={lang}><dt>A · {warehouse}</dt><dd className="font-semibold">{amount(SAMPLE_QUOTES.warehouse.amountUsd)}</dd></div>
          <div className="min-w-0 rounded-md border p-2" lang={lang}><dt>B · {port}</dt><dd className="font-semibold">{amount(SAMPLE_QUOTES.port.amountUsd)}</dd></div>
        </dl>
        <p>{vi ? "Chưa cùng phạm vi. Cần biết tổng phí còn thiếu để B giao tới cùng kho." : "Different scope. Ask for all extra charges to deliver B to the same warehouse."}</p>
        <p>{vi ? <>Mốc hòa giá: <strong>{gap}</strong>. Phí thêm thấp hơn thì B rẻ hơn; bằng thì hòa; cao hơn thì A rẻ hơn, nếu các điều kiện khác giống nhau.</> : <>Break-even: <strong>{gap}</strong>. If all other terms match, B is cheaper below that amount, tied at it, and A is cheaper above it.</>}</p>
        <p className="rounded-md bg-muted p-2">
          <strong>{vi ? "Hỏi đối tác: " : "Ask the partner: "}</strong>
          {vi ? "Bên anh/chị báo giúp tổng phí thêm từ cảng đến cùng kho, đã gồm vận chuyển, nâng hạ, phụ phí và thuế chưa? Khoản nào chưa bao gồm?" : "What is the total extra cost from port to the same warehouse, including trucking, handling, surcharges and taxes? What is excluded?"}
        </p>
      </div>
    </details>
  );
}
