"use client";

import { useId, useState } from "react";

const paths = {
  personal: {
    title: "Cá nhân · KYC",
    steps: [
      "Xác định tài khoản cá nhân cần xác minh.",
      "Ở quy trình thật, xác minh danh tính qua kênh chính thức được yêu cầu.",
      "Kiểm tra trạng thái tại kênh đó. KYC cá nhân không chứng minh quyền đại diện doanh nghiệp.",
    ],
  },
  business: {
    title: "Doanh nghiệp · KYB",
    steps: [
      "Kiểm tra pháp nhân và tình trạng đăng ký qua nguồn chính thức.",
      "Xác minh người đại diện hoặc người được ủy quyền cho đúng phạm vi công việc.",
      "Người phụ trách kiểm tra pháp nhân và thẩm quyền trước khi quyết định. Không dựa vào KYC cá nhân để kết luận KYB.",
    ],
  },
} as const;

export function IdentityOnboarding() {
  const id = useId();
  const [path, setPath] = useState<keyof typeof paths>("personal");
  const [ran, setRan] = useState(false);
  return (
    <details lang="vi" dir="ltr" className="rounded-xl border bg-card px-4">
      <summary className="cursor-pointer py-3 text-sm font-semibold">Đăng ký cá nhân hoặc doanh nghiệp · Mô phỏng</summary>
      <div className="space-y-3 pb-4 text-sm">
        <p>Đây chỉ là bản mô phỏng, không tạo tài khoản hay xác minh thật. Không nhập số giấy tờ, mã doanh nghiệp hoặc tải hồ sơ lên.</p>
        <fieldset className="grid gap-1 sm:grid-cols-2">
          <legend className="mb-1 font-medium">Chọn quy trình để thử</legend>
          {(Object.keys(paths) as (keyof typeof paths)[]).map(value => (
            <label key={value} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-2">
              <input type="radio" name={id} checked={path === value} onChange={() => { setPath(value); setRan(false); }} />
              {paths[value].title}
            </label>
          ))}
        </fieldset>
        <ol className="list-decimal space-y-1 ps-5">
          {paths[path].steps.map(step => <li key={step}>{step}</li>)}
        </ol>
        <button type="button" onClick={() => setRan(true)} className="min-h-11 rounded-lg border px-3 font-medium">Chạy thử quy trình</button>
        <p role="status" aria-live="polite" className={ran ? "rounded-lg border bg-muted p-2 font-medium" : "sr-only"}>
          {ran ? "Chưa xác minh · mô phỏng" : ""}
        </p>
      </div>
    </details>
  );
}
