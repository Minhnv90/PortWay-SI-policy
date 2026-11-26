"use client";

import { useId, useState } from "react";
import { DOCUMENT_PRACTICE, EMPLOYEE_CASES, INITIAL_LEARNING, learningTransition, type LearningAction } from "@/lib/portway/employee-learning";

const BUTTON = "min-h-11 rounded-md border px-3 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-45";

export function EmployeeLearningLab() {
  const id = useId();
  const [caseIndex, setCaseIndex] = useState(0);
  const [state, setState] = useState(INITIAL_LEARNING);
  const lesson = EMPLOYEE_CASES[caseIndex];
  const right = state.choice === lesson.correct;
  const { phase } = state;
  const apply = (action: LearningAction) => setState(old => learningTransition(old, action, caseIndex));
  const feedback = state.choice === null ? "" : right ? "Đúng. " + lesson.evidence : "Chưa đạt. " + lesson.evidence;
  const stage = { practice: "", proposed: "Đã đề xuất mẫu; chưa duyệt.", checked: "Đã đối chiếu dữ kiện mẫu; chờ người duyệt.", approved: "Đã duyệt mô phỏng, chỉ dùng lại ở đây.", rejected: "Đã trả lại; không dùng lại bài này." }[phase];
  return (
    <details className="rounded-lg border bg-card px-3" lang="vi">
      <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold">Phòng thực hành AI</summary>
      <div className="space-y-3 pb-3 text-sm leading-snug">
        <p className="text-muted-foreground">Tập kiểm tra đề xuất của AI. Mô phỏng trên máy, không lưu, không huấn luyện AI.</p>
        <details className="rounded-md border px-2">
          <summary className="min-h-11 cursor-pointer py-3 font-medium">Mẫu giao việc AI: trước và sau</summary>
          <div className="space-y-2 pb-2">
            <p><strong>Trước:</strong> {DOCUMENT_PRACTICE.before}</p>
            <p><strong>Sau:</strong> {DOCUMENT_PRACTICE.after}</p>
            <p className="text-muted-foreground">Ví dụ bằng chữ. Mục này không mở camera, đọc ảnh, tải tệp hay gửi xác nhận.</p>
          </div>
        </details>
        <label className="block font-medium" htmlFor={id}>Tình huống</label>
        <select id={id} className="min-h-11 w-full rounded-md border bg-background px-2" value={caseIndex} onChange={e => { setCaseIndex(Number(e.target.value)); setState(INITIAL_LEARNING); }}>
          {EMPLOYEE_CASES.map((item, index) => <option key={item.title} value={index}>{item.title}</option>)}
        </select>
        <p>{lesson.brief}</p>
        <fieldset className="space-y-1" disabled={phase !== "practice"}>
          <legend className="mb-1 font-medium">Chọn cách xử lý</legend>
          {lesson.choices.map((choice, index) => (
            <label className="flex min-h-11 items-center gap-2 rounded-md border p-2" key={choice}>
              <input type="radio" name={id} checked={state.choice === index} onChange={() => apply({ type: "choose", choice: index })} />
              <span>{choice}</span>
            </label>
          ))}
        </fieldset>
        {lesson.source && <a href={lesson.source} target="_blank" rel="noopener noreferrer" className="inline-block py-2 underline">Nguồn: Apptronik/GXO, 12/11/2026</a>}
        <div role="status" className="space-y-1" aria-atomic="true">
          {feedback && <p>{feedback}</p>}
          {stage && <p className="font-medium">{stage}</p>}
          {phase === "approved" && <p className="rounded-md bg-muted p-2">Bài dùng lại: {lesson.takeaway}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {phase === "practice" && <button type="button" className={BUTTON} disabled={state.choice === null} onClick={() => apply({ type: "propose" })}>Đề xuất bài học</button>}
          {phase === "proposed" && <button type="button" className={BUTTON} disabled={!right} onClick={() => apply({ type: "check" })}>Đối chiếu bằng chứng</button>}
          {phase === "checked" && <button type="button" className={BUTTON} onClick={() => apply({ type: "approve" })}>Duyệt mẫu</button>}
          {(phase === "proposed" || phase === "checked") && <button type="button" className={BUTTON} onClick={() => apply({ type: "reject" })}>Trả lại</button>}
          {(phase !== "practice" || state.choice !== null) && <button type="button" className={BUTTON} onClick={() => apply({ type: "reset" })}>Đặt lại</button>}
        </div>
      </div>
    </details>
  );
}
