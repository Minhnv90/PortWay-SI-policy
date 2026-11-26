"use client";

import { Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { Strings } from "@/lib/portway/i18n";
import type { Conversation } from "@/lib/portway/types";
import { cn } from "@/lib/utils";

interface HistorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversations: Conversation[];
  activeId: string | null;
  t: Strings;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HistorySheet({
  open,
  onOpenChange,
  conversations,
  activeId,
  t,
  onSelect,
  onDelete,
}: HistorySheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 max-w-[85vw] gap-0 p-0">
        <SheetHeader className="border-b">
          <SheetTitle>{t.history}</SheetTitle>
        </SheetHeader>
        {conversations.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">{t.noHistory}</p>
        ) : (
          <ul className="flex flex-col overflow-y-auto p-2">
            {conversations.map((conversation) => (
              <li key={conversation.id} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onSelect(conversation.id)}
                  aria-current={conversation.id === activeId ? "true" : undefined}
                  className={cn(
                    "min-w-0 flex-1 rounded-md px-3 py-2.5 text-start text-sm transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring",
                    conversation.id === activeId && "bg-accent font-medium",
                  )}
                >
                  <span className="line-clamp-2">{conversation.title || t.untitled}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(conversation.id)}
                  aria-label={`${t.deleteChat}: ${conversation.title}`}
                  className="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </SheetContent>
    </Sheet>
  );
}
