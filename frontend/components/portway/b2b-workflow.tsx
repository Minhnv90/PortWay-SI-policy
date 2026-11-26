"use client";

import { useRef, useState } from "react";
import { B2B_NEEDS, B2B_PROFILES, prepareB2BDraft, resolveB2BNeed, type B2BNeed } from "@/lib/portway/b2b";

const COACH: Record<B2BNeed, [string, string]> = {
  logistics: ["Mình bắt đầu từ chuyến hàng nhé. Bạn đã rõ loại hàng, điểm giao và ngày hàng sẵn chưa?", "Chốt ba mục ấy trước, rồi gửi cùng một yêu cầu cho các hãng để báo giá so được với nhau."],
  sourcing: ["Mình thử hình dung món hàng cần tìm nhé. Bạn đã chốt quy cách, số lượng và ngày cần hàng chưa?", "Nếu chưa, chọn một quy cách mẫu trước. Khi hỏi nhà cung cấp, nhớ hỏi thêm lô tối thiểu và hồ sơ nguồn gốc."],
  technology: ["Mình chọn một việc đang tốn thời gian nhất nhé. Bạn muốn thử với quy trình nào trước?", "Bắt đầu với một nhóm nhỏ và một chỉ số dễ đo, như số phút xử lý mỗi hồ sơ. Chưa cần đổi cả hệ thống."],
};

export function B2BWorkflow() {
  const [need, setNeed] = useState<B2BNeed>("logistics");
  const [draft, setDraft] = useState("");
  const [showNext, setShowNext] = useState(false);
  const [status, setStatus] = useState("");
  const [draftNeed, setDraftNeed] = useState<B2BNeed | null>(null);
  const version = useRef(0);
  const draftRef = useRef<HTMLTextAreaElement>(null);
  const profile = B2B_PROFILES[need];

  function selectNeed(value: string) {
    const next = resolveB2BNeed(value);
    if (!next || next === need) return;
    version.current++;
    setNeed(next);
    setShowNext(false);
    setStatus("");
  }

  function editDraft(value: string) {
    version.current++;
    setDraft(value);
    setStatus("");
    if (!value.trim()) setDraftNeed(null);
  }

  function makeDraft() {
    const nextDraft = prepareB2BDraft(draft, need);
    if (nextDraft === null) {
      setStatus("Bản nháp đang có nội dung. Hãy sửa hoặc xóa bản nháp trước khi tạo mẫu mới.");
      draftRef.current?.focus();
      return;
    }
    version.current++;
    setDraft(nextDraft);
    setDraftNeed(need);
    setStatus("Đã điền mẫu. Kiểm tra và chỉnh tên, nhu cầu trước khi dùng.");
  }

  async function copyDraft() {
    if (!draft.trim()) return;
    const revision = ++version.current;
    try {
      await navigator.clipboard.writeText(draft);
      if (version.current === revision) setStatus("Đã sao chép. Chưa gửi cho ai.");
    } catch {
      if (version.current !== revision) return;
      draftRef.current?.focus();
      draftRef.current?.select();
      setStatus("Không sao chép tự động được. Hãy tự sao chép phần văn bản đã chọn.");
    }
  }

  return (
    <details lang="vi" dir="ltr" className="rounded-xl border bg-card px-4">
      <summary className="cursor-pointer py-3 text-sm font-semibold">Kết nối doanh nghiệp (B2B)</summary>
      <div className="space-y-3 pb-4 text-sm">
        <p>PortWay SI là trợ lý AI cho nhân viên doanh nghiệp. Mục này giúp xác định tiêu chí tìm đối tác và soạn lời giới thiệu bằng mẫu tại chỗ, không tra cứu hay xác minh đối tác thật.</p>
        <label className="grid gap-1 font-medium">
          Nhu cầu của doanh nghiệp
          <select value={need} onChange={(event) => selectNeed(event.target.value)} className="min-h-11 w-full rounded-md border bg-background px-3">
            {B2B_NEEDS.map((key) => <option key={key} value={key}>{B2B_PROFILES[key].label}</option>)}
          </select>
        </label>
        <p>{profile.candidates}</p>
        <div className="space-y-2 rounded-lg border p-3">
          <p>{COACH[need][0]}</p>
          <button type="button" onClick={() => setShowNext(!showNext)} aria-expanded={showNext} className="min-h-11 rounded-md border px-3 font-medium">{showNext ? "Ẩn gợi ý" : "Mình nên làm gì tiếp?"}</button>
          {showNext && <p role="status">{COACH[need][1]}</p>}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <h3 className="font-semibold">Tiêu chí chọn đối tác</h3>
            <ul className="mt-1 list-disc space-y-1 ps-5">{profile.criteria.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div>
            <h3 className="font-semibold">Cần bổ sung</h3>
            <ul className="mt-1 list-disc space-y-1 ps-5">{profile.gaps.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
        <button type="button" onClick={makeDraft} className="min-h-11 rounded-md bg-primary px-3 font-semibold text-primary-foreground">Tạo bản nháp giới thiệu</button>
        <label className="grid gap-1 font-medium">
          Bản nháp có thể chỉnh sửa
          <textarea ref={draftRef} value={draft} onChange={(event) => editDraft(event.target.value)} maxLength={3000} rows={5} placeholder="Không nhập dữ liệu mật. Bản nháp không tự gửi hoặc lưu." className="w-full rounded-md border bg-background p-2 font-normal" />
        </label>
        {draftNeed && draftNeed !== need && <p className="text-muted-foreground">Bản nháp hiện theo nhu cầu: {B2B_PROFILES[draftNeed].label}.</p>}
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={copyDraft} disabled={!draft.trim()} className="min-h-11 rounded-md border px-3 font-medium disabled:opacity-50">Sao chép bản nháp</button>
          <button type="button" onClick={() => editDraft("")} disabled={!draft} className="min-h-11 rounded-md px-3 text-muted-foreground disabled:opacity-50">Xóa nháp</button>
        </div>
        <p role="status" className="text-muted-foreground">{status}</p>
      </div>
    </details>
  );
}
