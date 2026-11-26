"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pi } from "@/lib/pi";
import { detectLanguage } from "@/lib/portway/i18n";
import {
  LANG_CODES,
  makeId,
  type ChatMessage,
  type Conversation,
  type LangCode,
} from "@/lib/portway/types";

const INDEX_KEY = "index";
const MAX_CONVERSATIONS = 8;
const MAX_KEY_CHARS = 56_000;
const TOTAL_BUDGET_CHARS = 100_000;
const WRITE_GAP_MS = 2300;
const DEBOUNCE_MS = 5500;

interface IndexBlob {
  lang?: string;
  items?: { id: string; title: string; updatedAt: number }[];
}

const chatKey = (id: string) => `chat-${id}`;
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function isLang(value: unknown): value is LangCode {
  return typeof value === "string" && (LANG_CODES as readonly string[]).includes(value);
}

function isConversation(value: unknown): value is Conversation {
  if (typeof value !== "object" || value === null) return false;
  const c = value as Partial<Conversation>;
  return typeof c.id === "string" && typeof c.title === "string" && Array.isArray(c.messages);
}

function fitToLimit(conversation: Conversation): Conversation {
  let messages = conversation.messages;
  while (messages.length > 2 && JSON.stringify({ ...conversation, messages }).length > MAX_KEY_CHARS) {
    messages = messages.slice(2);
  }
  return { ...conversation, messages };
}

export function usePortwayStore() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [lang, setLangState] = useState<LangCode>("en");
  const [loaded, setLoaded] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const convRef = useRef<Conversation[]>([]);
  const langRef = useRef<LangCode>("en");
  const dirtyChats = useRef(new Set<string>());
  const deletedChats = useRef(new Set<string>());
  const indexDirty = useRef(false);
  const sizes = useRef(new Map<string, number>());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flushing = useRef(false);
  const failures = useRef(0);

  const flush = useCallback(async () => {
    if (flushing.current) return;
    flushing.current = true;
    try {
      while (deletedChats.current.size > 0) {
        const id = deletedChats.current.values().next().value as string;
        await pi.userState.delete(chatKey(id));
        deletedChats.current.delete(id);
        await sleep(WRITE_GAP_MS);
      }
      while (dirtyChats.current.size > 0) {
        const id = dirtyChats.current.values().next().value as string;
        const conversation = convRef.current.find((c) => c.id === id);
        if (conversation) {
          const stored = fitToLimit(conversation);
          await pi.userState.set(chatKey(id), stored as unknown as Record<string, unknown>);
          sizes.current.set(id, JSON.stringify(stored).length);
          await sleep(WRITE_GAP_MS);
        }
        dirtyChats.current.delete(id);
      }
      if (indexDirty.current) {
        const blob: IndexBlob = {
          lang: langRef.current,
          items: convRef.current.map((c) => ({ id: c.id, title: c.title, updatedAt: c.updatedAt })),
        };
        await pi.userState.set(INDEX_KEY, blob as unknown as Record<string, unknown>);
        indexDirty.current = false;
      }
      failures.current = 0;
      setSaveError(false);
    } catch (error) {
      console.log("[v0] Saving conversations failed:", error);
      failures.current += 1;
      setSaveError(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(flush, Math.min(60_000, 8000 * 2 ** failures.current));
    } finally {
      flushing.current = false;
    }
  }, []);

  const schedule = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, DEBOUNCE_MS);
  }, [flush]);

  const commit = useCallback(
    (next: Conversation[], changedId?: string) => {
      let result = [...next].sort((a, b) => b.updatedAt - a.updatedAt);
      if (changedId) {
        sizes.current.set(
          changedId,
          Math.min(
            MAX_KEY_CHARS,
            JSON.stringify(result.find((c) => c.id === changedId) ?? "").length,
          ),
        );
      }
      const total = () => result.reduce((sum, c) => sum + (sizes.current.get(c.id) ?? 0), 0);
      while (
        result.length > 1 &&
        (result.length > MAX_CONVERSATIONS || total() > TOTAL_BUDGET_CHARS)
      ) {
        const removable = [...result].reverse().find((c) => c.id !== changedId);
        if (!removable) break;
        result = result.filter((c) => c.id !== removable.id);
        deletedChats.current.add(removable.id);
        dirtyChats.current.delete(removable.id);
        sizes.current.delete(removable.id);
        setActiveId((current) => (current === removable.id ? null : current));
      }
      if (changedId) dirtyChats.current.add(changedId);
      indexDirty.current = true;
      convRef.current = result;
      setConversations(result);
      schedule();
    },
    [schedule],
  );

  useEffect(() => {
    let cancelled = false;
    const fallback = detectLanguage();
    langRef.current = fallback;
    setLangState(fallback);

    async function load() {
      try {
        const record = await pi.userState.get(INDEX_KEY);
        const index = (record?.blob ?? {}) as IndexBlob;
        if (isLang(index.lang)) {
          langRef.current = index.lang;
          if (!cancelled) setLangState(index.lang);
        }
        const items = Array.isArray(index.items) ? index.items.slice(0, MAX_CONVERSATIONS) : [];
        const loadedChats = await Promise.all(
          items.map(async (item) => {
            try {
              const chat = await pi.userState.get(chatKey(item.id));
              return isConversation(chat?.blob) ? (chat.blob as Conversation) : null;
            } catch {
              return null;
            }
          }),
        );
        const valid = loadedChats.filter((c): c is Conversation => c !== null);
        valid.forEach((c) => sizes.current.set(c.id, JSON.stringify(c).length));
        convRef.current = valid.sort((a, b) => b.updatedAt - a.updatedAt);
        if (!cancelled) setConversations(convRef.current);
      } catch (error) {
        console.log("[v0] Loading saved conversations failed:", error);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }
    load();

    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const setLang = useCallback(
    (next: LangCode) => {
      langRef.current = next;
      setLangState(next);
      indexDirty.current = true;
      schedule();
    },
    [schedule],
  );

  const addMessage = useCallback(
    (conversationId: string | null, message: ChatMessage): string => {
      const now = Date.now();
      const existing = conversationId
        ? convRef.current.find((c) => c.id === conversationId)
        : undefined;

      if (!existing) {
        const id = makeId();
        const title = message.text.replace(/\s+/g, " ").slice(0, 60);
        const created: Conversation = { id, title, updatedAt: now, messages: [message] };
        setActiveId(id);
        commit([created, ...convRef.current], id);
        return id;
      }

      const updated: Conversation = {
        ...existing,
        updatedAt: now,
        messages: [...existing.messages, message],
      };
      commit(
        convRef.current.map((c) => (c.id === existing.id ? updated : c)),
        existing.id,
      );
      return existing.id;
    },
    [commit],
  );

  const removeConversation = useCallback(
    (id: string) => {
      deletedChats.current.add(id);
      dirtyChats.current.delete(id);
      sizes.current.delete(id);
      setActiveId((current) => (current === id ? null : current));
      commit(convRef.current.filter((c) => c.id !== id));
    },
    [commit],
  );

  const active = conversations.find((c) => c.id === activeId) ?? null;

  return {
    conversations,
    active,
    activeId,
    setActiveId,
    lang,
    setLang,
    loaded,
    saveError,
    addMessage,
    removeConversation,
  };
}
