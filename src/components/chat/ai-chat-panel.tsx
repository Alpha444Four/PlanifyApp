import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Copy,
  Check,
  Plus,
  Send,
  Sparkles,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  clearChatHistory,
  loadChatHistory,
  saveChatHistory,
  type ChatMessage,
} from "@/lib/chat-history";
import { streamCoachReply, getSuggestedPrompts } from "@/services/ai-coach-service";
import type { CoachContext } from "@/services/ai-coach-service";
import { useI18n } from "@/hooks/use-i18n";
import { usePlan } from "@/hooks/use-plan";
import { UpgradePrompt } from "@/components/billing/upgrade-prompt";
import { useToast } from "@/components/ui/toast";
import { useUserDataStore } from "@/store/user-data-store";

function renderMessageText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function AiChatPanel({
  userId,
  userName,
  coachContext,
  onUserMessage,
}: {
  userId: string;
  userName?: string;
  coachContext: CoachContext;
  onUserMessage?: () => void;
}) {
  const { t } = useI18n();
  const { toast } = useToast();
  const { canSendAi, aiRemaining, isPaid } = usePlan();
  const firstName = userName?.split(/\s+/)[0] ?? "there";
  const suggestions = getSuggestedPrompts();
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadChatHistory(userId);
    if (saved.length > 0) {
      setMessages(saved);
      return;
    }
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        text: t("chat.greeting", { name: firstName }),
      },
    ]);
  }, [userId, t, firstName]);

  useEffect(() => {
    if (messages.length > 0) saveChatHistory(userId, messages);
  }, [messages, userId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const newChat = () => {
    clearChatHistory(userId);
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        text: t("chat.greeting", { name: firstName }),
      },
    ]);
    setInput("");
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    if (!canSendAi) {
      toast({
        title: t("plans.aiLimitReached"),
        description: t("plans.aiLimitDesc"),
        variant: "warning",
      });
      return;
    }
    if (!useUserDataStore.getState().recordAiMessage()) {
      toast({
        title: t("plans.aiLimitReached"),
        description: t("plans.aiLimitDesc"),
        variant: "warning",
      });
      return;
    }

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: "user",
      text: trimmed,
    };
    const assistantId = `a_${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: "assistant", text: "" },
    ]);
    setInput("");
    setStreaming(true);
    onUserMessage?.();

    try {
      await streamCoachReply(trimmed, coachContext, (partial) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, text: partial } : m)),
        );
      });
    } finally {
      setStreaming(false);
    }
  };

  const copyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* ignore */
    }
  };

  if (!canSendAi) {
    return (
      <UpgradePrompt
        title={t("plans.aiLimitReached")}
        description={t("plans.aiLimitDesc")}
      />
    );
  }

  return (
    <div className="flex h-[calc(100dvh-10rem)] min-h-[520px] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft dark:glass">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[hsl(var(--brand-beige))] text-primary-foreground shadow-glow">
            <Bot className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold">{t("chat.title")}</p>
            <p className="text-xs text-muted-foreground">{t("chat.subtitle")}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={newChat} disabled={streaming}>
          <Plus className="h-4 w-4" />
          {t("chat.newChat")}
        </Button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex w-full",
                m.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {m.role === "assistant" ? (
                <div className="flex max-w-[92%] gap-3 sm:max-w-[85%]">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/90 to-accent/80 text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div className="group min-w-0 flex-1">
                    <div className="rounded-2xl rounded-tl-md border border-border/80 bg-muted/60 px-4 py-3 text-sm leading-relaxed text-foreground">
                      {m.text ? (
                        renderMessageText(m.text)
                      ) : (
                        <span className="inline-flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="h-2 w-2 rounded-full bg-muted-foreground/50"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                        </span>
                      )}
                    </div>
                    {m.text ? (
                      <button
                        type="button"
                        onClick={() => void copyText(m.id, m.text)}
                        className="focus-ring mt-1.5 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-muted"
                      >
                        {copiedId === m.id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        {t("chat.copy")}
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground shadow-soft">
                  {m.text}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      <div className="border-t border-border bg-background/80 p-4 backdrop-blur-sm sm:p-5">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              disabled={streaming}
              onClick={() => void send(s)}
              className="focus-ring shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-inner"
        >
          <textarea
            ref={textareaRef}
            value={input}
            rows={1}
            disabled={streaming}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            placeholder={t("chat.placeholder")}
            aria-label={t("chat.placeholder")}
            className="focus-ring max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm placeholder:text-muted-foreground"
          />
          <Button
            type={streaming ? "button" : "submit"}
            size="icon"
            variant="gradient"
            className="shrink-0 rounded-xl"
            disabled={!streaming && !input.trim()}
            onClick={streaming ? () => setStreaming(false) : undefined}
            aria-label={streaming ? t("chat.stop") : t("chat.send")}
          >
            {streaming ? <Square className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
        {!isPaid ? (
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            {t("plans.remainingToday", { count: aiRemaining })}
          </p>
        ) : null}
        <p className="mt-1 text-center text-[11px] text-muted-foreground">
          {t("chat.disclaimer")}
        </p>
      </div>
    </div>
  );
}
