"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, History, LayoutGrid, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpeechControls } from "@/components/si-speech-controls";
import { CollaborationTools } from "@/components/si-collaboration-tools";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { appendVoiceDraft, PORTWAY_DRAFT_LIMIT } from "@/lib/portway/voice-draft";
import { requestChat, type ChatFailureResult } from "@/lib/portway/chat-request";
import { ChatFailure } from "./chat-failure";
import { parseAnswer } from "@/lib/portway/normalize";
import { LANGUAGES, STRINGS } from "@/lib/portway/i18n";
import { makeId, type Answer, type ChatMessage, type LangCode } from "@/lib/portway/types";
import { AnswerCard } from "./answer-card";
import { B2BWorkflow } from "./b2b-workflow";
import { BusinessReferences } from "./business-references";
import { HistorySheet } from "./history-sheet";
import { IdentityOnboarding } from "./identity-onboarding";
import { HomeScreen } from "./home-screen";
import { ModulesList } from "./modules-list";
import { PortAvatar } from "./port-avatar";
import { PortOperationsHandbook } from "./port-operations-handbook";
import { ShipmentEvidencePanel } from "./shipment-evidence-panel";
import { NewsBriefsPanel } from "./news-briefs-panel";
import { EmployeeLearningLab } from "./employee-learning-lab";
import { DigitalEconomyHandbook } from "./digital-economy-handbook";
import { PortDispatchDemo } from "./port-dispatch-demo";
import { GanhRaiMap } from "./ganh-rai-map";
import { usePortwayStore } from "./use-portway-store";

type ChatPayload = {
  mode?: "research";
  uiLanguage: LangCode;
  messages: { role: ChatMessage["role"]; content: string }[];
};

const RESEARCH_COPY: Record<LangCode, { label: string; notice: string; useSample: string; example: string }> = {
  vi: {
    label: "Nghiên cứu (thử nghiệm)",
    notice: "Bản thử dùng câu mẫu; nếu bật kết nối thật, chỉ câu này được gửi đến dịch vụ nghiên cứu, không kèm lịch sử hay tệp. Không nhập dữ liệu cá nhân hoặc bí mật.",
    useSample: "Điền câu mẫu",
    example: "So sánh báo giá: A trọn gói 1.130 USD, B cước 1.020 USD chưa có phụ phí. B rẻ hơn khi nào?",
  },
  en: { label: "Research (trial)", notice: "The demo uses sample questions. If live access is enabled, only this question is sent to the research service, without history or files. Do not enter personal or secret information.", useSample: "Fill sample", example: "Compare quotes: A is USD 1,130 all in; B lists USD 1,020 before unquoted surcharges. When is B cheaper?" },
  zh: { label: "研究（试用）", notice: "试用版使用示例问题。若启用实时连接，只发送本条问题，不附带历史或文件。不要输入个人或机密信息。", useSample: "填写示例", example: "比较报价：A 总价为 1130 美元，B 基础运费为 1020 美元，未报价附加费。B 何时更便宜？" },
  ja: { label: "調査（試用）", notice: "試用版では質問例を使います。実接続を有効にした場合も、この質問だけが送信され、履歴やファイルは含まれません。個人情報や機密情報は入力しないでください。", useSample: "質問例を入力", example: "見積もりを比較してください。A は総額 1,130 米ドル、B は追加料金未提示で基本運賃 1,020 米ドルです。B が安いのはどんな場合ですか？" },
  ko: { label: "조사(시험판)", notice: "시험판은 예시 질문을 사용합니다. 실제 연결을 켜면 이 질문만 전송되고 기록이나 파일은 포함되지 않습니다. 개인정보나 기밀을 입력하지 마세요.", useSample: "예시 입력", example: "견적 비교: A는 총 1,130달러이고, B는 추가 요금 미포함 기본 운임이 1,020달러입니다. 언제 B가 더 저렴한가요?" },
  ar: { label: "البحث (تجريبي)", notice: "تستخدم النسخة التجريبية أسئلة نموذجية. إذا فُعّل الاتصال المباشر، يُرسل هذا السؤال وحده دون المحفوظات أو الملفات. لا تُدخل معلومات شخصية أو سرية.", useSample: "أدخل المثال", example: "قارن عرضين: (أ) 1130 دولارًا إجمالًا؛ (ب) 1020 دولارًا قبل الرسوم الإضافية غير المذكورة. متى يكون (ب) أقل كلفة؟" },
};

function parseStoredAnswer(json: string | undefined): Answer | null {
  if (!json) return null;
  const answer = parseAnswer(json);
  if (!answer) return null;
  // Only persisted API envelopes may carry this provenance; ordinary model
  // output still goes through parseAnswer, which never trusts the field.
  try {
    const mode = JSON.parse(json)?.researchMode;
    if (mode === "simulation" || mode === "worker") answer.researchMode = mode;
  } catch { /* keep normalized standard answer */ }
  return answer;
}

export function ChatApp() {
  const store = usePortwayStore();
  const { lang, active, conversations } = store;
  const t = STRINGS[lang];
  const researchCopy = RESEARCH_COPY[lang];
  const toolsLabel = { vi: "Công cụ khác", en: "More tools", zh: "更多工具", ja: "その他のツール", ko: "추가 도구", ar: "أدوات أخرى" }[lang];

  const [input, setInput] = useState("");
  const [researchMode, setResearchMode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<ChatFailureResult | null>(null);
  const failureScope = useRef(0);
  const inFlight = useRef<{ id: string | null; deleted: boolean } | null>(null);
  const failedRequest = useRef<{ conversationId: string | null; payload: ChatPayload } | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);
  const speechContext = useRef(0);
  const [speechRevision, setSpeechRevision] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = useMemo(() => active?.messages ?? [], [active]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, busy, failure]);

  function clearFailure() {
    failureScope.current++;
    failedRequest.current = null;
    setFailure(null);
  }

  async function ask(conversationId: string | null, payload: ChatPayload) {
    setBusy(true);
    clearFailure();
    const scope = failureScope.current;
    const pending = { id: conversationId, deleted: false };
    inFlight.current = pending;
    try {
      const result = await requestChat(payload);
      if (pending.deleted) return;
      if ("failure" in result) {
        if (scope !== failureScope.current) return;
        failedRequest.current = { conversationId, payload };
        setFailure(result);
        return;
      }
      const data = result;
      store.addMessage(conversationId, {
        id: makeId(),
        role: "assistant",
        text: data.answer.summary || data.answer.declineMessage,
        answerJson: JSON.stringify(data.answer),
        createdAt: Date.now(),
        ...(payload.mode === "research" ? { researchTurn: true } : {}),
      });
    } finally {
      if (inFlight.current === pending) inFlight.current = null;
      setBusy(false);
    }
  }

  function invalidateSpeech() {
    speechContext.current++;
    setSpeechRevision(speechContext.current);
  }

  function send(raw: string) {
    const text = raw.trim();
    if (!text || busy) return;
    invalidateSpeech();
    setInput("");
    setModulesOpen(false);
    const userMessage: ChatMessage = { id: makeId(), role: "user", text, createdAt: Date.now(), ...(researchMode ? { researchTurn: true } : {}) };
    const history = [...messages, userMessage];
    const conversationId = store.addMessage(active?.id ?? null, userMessage);
    const payload: ChatPayload = researchMode
      ? { mode: "research", uiLanguage: lang, messages: [{ role: "user", content: text.slice(0, 3000) }] }
      : { uiLanguage: lang, messages: history.filter((m) => !m.researchTurn).slice(-8).map((m) => ({ role: m.role, content: m.text.slice(0, 3000) })) };
    void ask(conversationId, payload);
  }

  function draftShowcase(prompt: string) {
    setInput((draft) => draft.trim() ? draft : prompt);
    inputRef.current?.focus();
  }

  function retry() {
    const attempt = failedRequest.current;
    if (!failure || busy || !attempt || attempt.conversationId !== (active?.id ?? null)) return;
    invalidateSpeech();
    void ask(attempt.conversationId, attempt.payload);
  }

  function startNewChat() {
    if (busy) return;
    invalidateSpeech();
    store.setActiveId(null);
    setResearchMode(false);
    clearFailure();
    setInput("");
  }

  const lastMessage = messages.at(-1);
  const latestAssistant = !busy && lastMessage?.role === "assistant" ? lastMessage : null;
  const latestAnswer = parseStoredAnswer(latestAssistant?.answerJson);
  const speechText = latestAnswer?.summary || latestAnswer?.declineMessage || latestAssistant?.text;
  const followUps = latestAnswer?.followUps ?? [];

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="shrink-0 bg-primary text-primary-foreground">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-1.5 px-3 py-2.5">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            onClick={() => setHistoryOpen(true)}
            aria-label={t.history}
          >
            <History className="size-5" aria-hidden="true" />
          </Button>
          <div className="flex min-w-0 flex-1 items-center gap-2 px-1">
            <PortAvatar />
            <div className="flex min-w-0 flex-col leading-tight">
              <div className="flex min-w-0 items-center gap-1.5">
                <h1 className="truncate text-base font-semibold">PortWay AI <span className="text-[10px] font-normal text-primary-foreground/80">v16</span></h1>
              </div>
              <p className="hidden truncate text-xs text-primary-foreground/70 sm:block">{t.tagline}</p>
            </div>
          </div>
          <Select value={lang} onValueChange={(value) => store.setLang(value as LangCode)}>
            <SelectTrigger
              aria-label={t.language}
              className="h-9 w-auto gap-1.5 border-primary-foreground/25 bg-transparent text-primary-foreground [&_svg]:text-primary-foreground/70"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            onClick={() => setModulesOpen(true)}
            aria-label={t.modules}
          >
            <LayoutGrid className="size-5" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            onClick={startNewChat}
            disabled={busy}
            aria-label={t.newChat}
          >
            <Plus className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </header>

      {store.saveError && (
        <p role="status" className="shrink-0 bg-plan-soft px-4 py-1.5 text-center text-xs text-plan">
          {t.saveFailed}
        </p>
      )}

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-4 sm:gap-5 sm:py-5">
          {!store.loaded ? (
            <div className="flex justify-center py-16">
              <Spinner className="size-6 text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <HomeScreen lang={lang} t={t} onPick={send} onDraft={draftShowcase} disabled={busy} />
          ) : (
            messages.map((message) => {
              if (message.role === "user") {
                return (
                  <div key={message.id} className="flex justify-end">
                    <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-ee-sm bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
                      {message.text}
                    </p>
                  </div>
                );
              }
              const answer = parseStoredAnswer(message.answerJson);
              return answer ? (
                <AnswerCard key={message.id} answer={answer} lang={lang} t={t} />
              ) : (
                <p key={message.id} className="rounded-lg border bg-card p-3.5 text-sm leading-relaxed">
                  {message.text}
                </p>
              );
            })
          )}

          {busy && (
            <div role="status" className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Spinner className="size-4" />
              {t.searching}
            </div>
          )}

          {failure && !busy && (
            <div role="alert" className="flex flex-col items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3.5 text-sm">
              <ChatFailure failure={failure.failure} requestId={failure.requestId} lang={lang} />
              <Button size="sm" variant="outline" onClick={retry}>
                {t.retry}
              </Button>
            </div>
          )}

          {followUps.length > 0 && (
            <section aria-label={t.followUps} className="flex flex-col gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.followUps}</h2>
              <ul className="flex flex-wrap gap-2">
                {followUps.map((question) => (
                  <li key={question}>
                    <button
                      type="button"
                      onClick={() => send(question)}
                      className="rounded-full border bg-card px-3.5 py-2 text-start text-sm leading-snug transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      {question}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {store.loaded && (
            <details className="rounded-lg border bg-card px-3">
              <summary className="cursor-pointer py-3 text-sm font-medium">{toolsLabel}</summary>
              <div className="space-y-2 pb-3">
                <IdentityOnboarding />
                <B2BWorkflow />
                <BusinessReferences />
                <PortOperationsHandbook lang={lang} />
                <ShipmentEvidencePanel lang={lang} />
                <NewsBriefsPanel lang={lang} />
                {lang === "vi" && <EmployeeLearningLab />}
                <DigitalEconomyHandbook lang={lang} />
                <PortDispatchDemo />
                <GanhRaiMap />
                <CollaborationTools />
              </div>
            </details>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      <footer className="shrink-0 border-t bg-card pb-[env(safe-area-inset-bottom)]">
        <form
          className="mx-auto flex w-full max-w-3xl items-end gap-2 px-3 py-3"
          onSubmit={(event) => {
            event.preventDefault();
            send(input);
          }}
        >
          <label htmlFor="portway-input" className="sr-only">
            {t.placeholder}
          </label>
          <Textarea
            id="portway-input"
            ref={inputRef}
            value={input}
            rows={1}
            maxLength={PORTWAY_DRAFT_LIMIT}
            placeholder={t.placeholder}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing &&
                event.keyCode !== 229
              ) {
                event.preventDefault();
                send(input);
              }
            }}
            className="max-h-32 min-h-11 resize-none bg-background"
          />
          <Button type="submit" size="icon" className="size-11 shrink-0" disabled={busy || !input.trim()} aria-label={t.send}>
            <ArrowUp className="size-5 rtl:rotate-0" aria-hidden="true" />
          </Button>
        </form>
        <div className="mx-auto w-full max-w-3xl px-3 pb-1">
          <label className="inline-flex min-h-9 cursor-pointer items-center gap-2 text-xs font-medium">
            <input
              id="portway-research-mode"
              type="checkbox"
              checked={researchMode}
              disabled={busy || !store.loaded}
              aria-describedby={researchMode ? "portway-research-notice" : undefined}
              onChange={(event) => { clearFailure(); setResearchMode(event.target.checked); }}
              className="size-4 accent-primary"
            />
            {researchCopy.label}
          </label>
          {researchMode && (
            <div className="pb-1">
              <p id="portway-research-notice" role="status" className="text-xs text-muted-foreground">{researchCopy.notice}</p>
              <button type="button" onClick={() => draftShowcase(researchCopy.example)} disabled={busy || !!input.trim()} className="min-h-9 text-xs font-medium text-primary underline disabled:opacity-50">
                {researchCopy.useSample}
              </button>
            </div>
          )}
        </div>
        <div className="mx-auto w-full max-w-3xl px-3 pb-2">
          <SpeechControls
            key={speechRevision}
            allowMic={store.loaded && !busy}
            language="vi-VN"
            readingLanguage={{ vi: "vi-VN", en: "en-US", zh: "zh-CN", ja: "ja-JP", ko: "ko-KR", ar: "ar" }[lang]}
            speechText={speechText}
            onTranscript={(transcript) => {
              if (busy || speechRevision !== speechContext.current) return;
              setInput((draft) => appendVoiceDraft(draft, transcript));
            }}
          />
        </div>
        <p className="px-4 pb-2 text-center text-xs text-muted-foreground">{t.independence}</p>
      </footer>

      <HistorySheet
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        conversations={conversations}
        activeId={store.activeId}
        t={t}
        onSelect={(id) => {
          invalidateSpeech();
          setResearchMode(false);
          store.setActiveId(id);
          clearFailure();
          setHistoryOpen(false);
        }}
        onDelete={(id) => {
          if (inFlight.current?.id === id) inFlight.current.deleted = true;
          if (id === store.activeId) {
            setResearchMode(false);
            invalidateSpeech();
            clearFailure();
          }
          store.removeConversation(id);
        }}
      />

      <Sheet open={modulesOpen} onOpenChange={setModulesOpen}>
        <SheetContent side="right" className="w-96 max-w-[92vw] gap-0 overflow-y-auto p-0">
          <SheetHeader className="border-b">
            <SheetTitle>{t.browseModules}</SheetTitle>
          </SheetHeader>
          <div className="p-3">
            <ModulesList lang={lang} t={t} onPick={send} disabled={busy} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
