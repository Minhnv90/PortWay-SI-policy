export const chainSteps = [
  {id:"empty", label:"Đã lấy rỗng", owner:"Đội xe", proof:"Phiếu lấy rỗng mẫu", time:"07:00"},
  {id:"loaded", label:"Đã đóng hàng", owner:"Nhà máy", proof:"Biên bản đóng hàng mẫu", time:"08:00"},
  {id:"gate", label:"Xe đã tới cổng", owner:"Đội xe", proof:"Ghi nhận đến cổng mẫu", time:"09:05"},
  {id:"yard", label:"Bãi đã nhận", owner:"Đầu mối bãi", proof:"Xác nhận hạ bãi mẫu", time:"09:15"},
  {id:"barge", label:"Sà lan đã nhận", owner:"Đơn vị sà lan", proof:"Xác nhận nhận hàng mẫu", time:"13:00"},
  {id:"mother", label:"Tàu mẹ đã nhận", owner:"Đầu mối khai thác tàu mẹ", proof:"Bản ghi xếp tàu mẫu", time:"17:00"},
] as const
export type ChainStep = (typeof chainSteps)[number]["id"]
export type ChainState = { completed: number; yardHold: boolean }
export type ChainAction = {type:"confirm"; step:ChainStep} | {type:"hold" | "review" | "reset"}
export const initialChain: ChainState = {completed:0, yardHold:false}

export function reduceChain(s: ChainState, a: ChainAction): ChainState {
  if (a.type === "reset") return initialChain
  if (a.type === "hold") return s.completed === 3 && !s.yardHold ? {...s,yardHold:true} : s
  if (a.type === "review") return s.completed === 3 && s.yardHold ? {...s,yardHold:false} : s
  const expected = chainSteps[s.completed]
  if (a.type !== "confirm" || s.yardHold || !expected || expected.id !== a.step) return s
  return {...s,completed:s.completed+1}
}

export function chainStatus(s: ChainState) {
  if (s.yardHold) return "Đang vướng: xe đã tới cổng, chưa có xác nhận hạ bãi."
  if (s.completed === chainSteps.length) return "Hoàn tất chuỗi chứng từ mẫu."
  if (s.completed === 3) return "Xe đã tới cổng. Chưa xác nhận bãi đã nhận container."
  return s.completed === 0 ? "Chưa có mốc được xác nhận." : `Đã ghi nhận: ${chainSteps[s.completed-1].label}.`
}
