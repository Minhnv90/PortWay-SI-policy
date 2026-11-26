"use client"

import { useReducer } from "react"
import { chainStatus, chainSteps, initialChain, reduceChain } from "@/lib/portway/container-chain-demo"

export function ContainerChainDemo() {
  const [state, dispatch] = useReducer(reduceChain, initialChain)
  const active = chainSteps[state.completed]
  return <details className="rounded-lg border bg-background px-3">
    <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold">Theo dõi một lô container</summary>
    <section className="space-y-3 pb-3" aria-label="Lô container mẫu">
      <p className="text-xs text-muted-foreground">Lô mẫu PWS-001 · Cùng một container qua các chặng. Dữ liệu và xác nhận đều giả lập, không có GPS hay kết nối cảng.</p>
      <div role="status" className="rounded-lg border bg-muted/60 p-3 text-sm">
        <p className="font-semibold">{state.completed}/{chainSteps.length} mốc · {chainStatus(state)}</p>
        {active && <p className="mt-1">Việc tiếp theo: {active.owner} đối chiếu {active.proof.toLowerCase()}.</p>}
      </div>
      <ol className="space-y-2">
        {chainSteps.map((step,index)=>{
          const done=index<state.completed
          const available=index===state.completed&&!state.yardHold
          return <li key={step.id} className="rounded-lg border p-2.5" aria-current={index===state.completed?"step":undefined}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button type="button" disabled={!available} onClick={()=>dispatch({type:"confirm",step:step.id})}
                className="min-h-11 rounded-md border px-3 text-xs font-semibold enabled:bg-primary enabled:text-primary-foreground disabled:opacity-60">{step.label}</button>
              <span className="text-xs text-muted-foreground">{done?step.time:index===state.completed?(state.yardHold?"Thiếu xác nhận":"Chờ xác nhận"):"Chưa tới bước"}</span>
            </div>
            {done&&<p className="mt-1 text-xs text-muted-foreground">{step.owner} · {step.proof}</p>}
          </li>
        })}
      </ol>
      <div className="flex flex-wrap gap-2">
        {state.completed===3 && !state.yardHold && <button type="button" className="min-h-11 rounded-md border px-3 text-xs" onClick={()=>dispatch({type:"hold"})}>Thiếu xác nhận của bãi</button>}
        {state.yardHold && <button type="button" className="min-h-11 rounded-md border px-3 text-xs" onClick={()=>dispatch({type:"review"})}>Gỡ vướng để kiểm lại</button>}
        <button type="button" className="min-h-11 rounded-md border px-3 text-xs" onClick={()=>dispatch({type:"reset"})}>Đặt lại lô mẫu</button>
      </div>
      <p className="text-xs text-muted-foreground">Chỉ trong phiên thử. Không lưu, gửi tin, đặt chỗ hay xác nhận lô thật.</p>
    </section>
  </details>
}
