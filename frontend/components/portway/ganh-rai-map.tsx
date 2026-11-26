"use client"

import { useState } from "react"
import { BargeCutoffDemo } from "./barge-cutoff-demo"
import { TruckGateDemo } from "./truck-gate-demo"
import { ContainerChainDemo } from "./container-chain-demo"
import { bayNodes, nodesFor, type MapLayer } from "@/lib/portway/ganh-rai-map"

const layers: MapLayer[] = ["Tất cả", "Hiện trạng", "Dự án", "Góc nhìn"]

export function GanhRaiMap() {
  const [layer, setLayer] = useState<MapLayer>("Tất cả")
  const [selection, setSelection] = useState<string>(bayNodes[0].id)
  const visible = nodesFor(layer)
  const active = visible.find((node) => node.id === selection) ?? visible[0]

  return (
    <details className="rounded-lg border bg-card px-3">
      <summary className="min-h-11 cursor-pointer py-3 font-semibold">Bản đồ Gành Rái <span className="text-xs font-normal text-muted-foreground">· Bản thử</span></summary>
      <section className="space-y-3 pb-3" aria-label="Bản đồ Gành Rái">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Lớp thông tin">
          {layers.map((name) => (
            <button key={name} type="button" aria-pressed={layer === name} onClick={() => {
              setLayer(name)
              const next = nodesFor(name)
              if (!next.some((node) => node.id === selection)) setSelection(next[0]?.id ?? bayNodes[0].id)
            }} className={`min-h-11 rounded-full border px-3 text-xs font-medium ${layer === name ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}>{name}</button>
          ))}
        </div>

        <div className="relative isolate h-56 overflow-hidden rounded-xl border border-sky-800 bg-[#071b30] sm:h-64">
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 600 300" preserveAspectRatio="none">
            <defs>
              <pattern id="ganh-rai-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M30 0H0V30" fill="none" stroke="#315873" strokeWidth="1" opacity=".55"/>
              </pattern>
            </defs>
            <path fill="url(#ganh-rai-grid)" d="M0 0H600V300H0Z" />
            <path d="M0 0 H292 L273 43 294 75 260 98 252 131 221 154 209 193 180 212 177 251 130 274 0 291 Z M600 0 H411 L385 35 378 74 350 106 338 150 366 170 391 143 412 150 438 183 476 184 492 208 535 223 600 245 Z" fill="#123e4a" stroke="#3e7f86" strokeWidth="2"/>
            <path d="M484 79 L512 92 526 115 522 150 495 174 469 143 467 120Z" fill="#184b51" stroke="#3e7f86" strokeWidth="2" />
            <path d="M328 30C350 96 310 145 299 191S303 270 264 300" stroke="#67a8bb" strokeWidth="2" strokeDasharray="5 8" fill="none" opacity=".5"/>
          </svg>
          <span aria-hidden="true" className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-wide text-sky-200">Vịnh Gành Rái</span>
          <span aria-hidden="true" className="absolute right-3 top-2 text-xs text-sky-100">↑ Bắc</span>
          {visible.map((node) => (
            <button key={node.id} type="button" aria-label={node.label} aria-pressed={active?.id === node.id}
              title={node.label} onClick={() => setSelection(node.id)} style={{left: `${node.x}%`, top: `${node.y}%`}}
              className={`absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-offset-1 focus-visible:outline-2 focus-visible:outline-white ${active?.id === node.id ? "bg-white/15" : "hover:bg-white/10"}`}>
              <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-slate-950 ${active?.id === node.id ? "ring-2 ring-white ring-offset-2 ring-offset-[#071b30]" : ""} ${node.kind === "Hiện trạng" ? "bg-teal-300" : "bg-amber-300"}`}>{bayNodes.indexOf(node) + 1}</span>
            </button>
          ))}
          {layer === "Góc nhìn" && <div className="absolute inset-0 grid place-items-center"><p className="rounded-full border border-violet-400/60 bg-slate-950/90 px-4 py-2 text-sm font-semibold text-violet-200">Giả thuyết liên kết vùng</p></div>}
        </div>
        <p className="text-xs text-muted-foreground">Sơ đồ minh họa, không theo tỷ lệ. Không dùng để dẫn luồng hay điều độ tàu.</p>

        {visible.length > 0 && (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Chọn điểm trên sơ đồ">
            {visible.map((node) => (
              <button key={node.id} type="button" aria-pressed={active?.id === node.id} onClick={() => setSelection(node.id)}
                className={`min-h-11 rounded-md border px-2.5 text-xs ${active?.id === node.id ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}>
                <span aria-hidden="true" className="mr-1 opacity-70">{bayNodes.indexOf(node) + 1}.</span>{node.label}
              </button>
            ))}
          </div>
        )}

        {active && <article className="space-y-1.5 rounded-lg border bg-background p-3" aria-live="polite">
          <h3 className="font-semibold">{active.label}</h3>
          <p className="text-xs font-medium text-muted-foreground">{active.status} · Mốc nguồn {active.date}</p>
          <p className="text-sm">{active.detail}</p>
          <a className="inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4" href={active.url} target="_blank" rel="noreferrer">{active.source} ↗</a>
        </article>}

        {active?.id === "cai-mep-thi-vai" && <BargeCutoffDemo />}
        {active?.id === "cai-mep-thi-vai" && <TruckGateDemo />}
        {active?.id === "cai-mep-thi-vai" && <ContainerChainDemo />}
        {layer === "Góc nhìn" && <article className="space-y-1.5 rounded-lg border border-violet-400/40 bg-background p-3">
          <h3 className="font-semibold">Cảng và hậu phương có thể bổ trợ nhau thế nào?</h3>
          <p className="text-sm">PortWay đặt giả thuyết: phối hợp gom hàng, kết nối sà lan và dịch vụ hậu phương có thể tạo lợi thế chung. Cần đối chiếu với dòng hàng, chi phí, năng lực kết nối và tác động môi trường.</p>
          <p className="text-xs text-muted-foreground">Gành Rái GBA là góc nhìn nghiên cứu của PortWay, không phải quy hoạch chính thức hay dự báo định lượng.</p>
        </article>}
      </section>
    </details>
  )
}
