export type DispatchRole = "leader" | "staff" | "customer"
export type DispatchStage = "draft" | "reviewed" | "assigned" | "blocked" | "completed"
export type DispatchState = { role: DispatchRole; stage: DispatchStage }
export type DispatchAction =
  | { type: "role"; role: DispatchRole }
  | { type: "review" | "assign" | "report-blocker" | "resolve-blocker" | "complete" | "reset" }

export const initialDispatchDemo: DispatchState = { role: "leader", stage: "draft" }

export function reduceDispatchDemo(state: DispatchState, action: DispatchAction): DispatchState {
  switch (action.type) {
    case "role":
      return (["leader", "staff", "customer"] as const).includes(action.role)
        ? { ...state, role: action.role }
        : state
    case "reset":
      return initialDispatchDemo
    case "review":
      return state.role === "leader" && state.stage === "draft" ? { ...state, stage: "reviewed" } : state
    case "assign":
      return state.role === "leader" && state.stage === "reviewed" ? { ...state, stage: "assigned" } : state
    case "report-blocker":
      return state.role === "staff" && state.stage === "assigned" ? { ...state, stage: "blocked" } : state
    case "resolve-blocker":
      return state.role === "staff" && state.stage === "blocked" ? { ...state, stage: "assigned" } : state
    case "complete":
      return state.role === "staff" && state.stage === "assigned" ? { ...state, stage: "completed" } : state
    default:
      return state
  }
}

export function publicDispatchProgress(state: DispatchState): { stage: "preparing" | "processing" | "waiting" | "completed"; label: string; message: string } {
  switch (state.stage) {
    case "draft":
    case "reviewed":
      return { stage: "preparing", label: "Đang chuẩn bị", message: "Hồ sơ lô mẫu đang được chuẩn bị." }
    case "assigned":
      return { stage: "processing", label: "Đang xử lý", message: "Lô mẫu đang được xử lý." }
    case "blocked":
      return { stage: "waiting", label: "Chờ cập nhật", message: "Cảng đang kiểm tra thông tin. Chưa có thời điểm hoàn tất." }
    case "completed":
      return { stage: "completed", label: "Hoàn tất bước tại cổng", message: "Bước kiểm tra tại cổng của lô mẫu đã hoàn tất. Đây không phải xác nhận giao hàng." }
  }
}
