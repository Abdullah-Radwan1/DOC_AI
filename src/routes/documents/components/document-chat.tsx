import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Trash2, Loader2, User, Sparkles } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChatResponseRenderer } from "./chat-response-renderer";

interface DocumentChatProps {
  documentId: string;
  /** Pass the latest completed analysis request ID for richer context. */
  analysisRequestId?: string;
  className?: string;
}

const SUGGESTED_PROMPTS = [
  "What are the main obligations of each party?",
  "When does this contract expire?",
  "Are there any non-compliance risks I should know about?",
  "Summarize the payment terms.",
  "What happens if either party terminates early?",
];

export function DocumentChat({
  documentId,
  analysisRequestId,
  className,
}: DocumentChatProps) {
  const { messages, isLoading, error, sendMessage, clearChat } = useChat({
    documentId,
    analysisRequestId,
  });

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput("");
    await sendMessage(text);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-xl border border-border bg-card overflow-hidden",
        className,
      )}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-primary-foreground">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">DUCKY AI</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ask anything about this document
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={clearChat}
            title="Clear chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {/* ── Message area ─────────────────────────────────────────────────── */}
      <ScrollArea className="flex-1 px-4 py-4">
        {isEmpty ? (
          <EmptyState onPromptClick={(p) => sendMessage(p)} />
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <MessageBubble key={i} role={msg.role} content={msg.content} />
              ))}

              {isLoading && <TypingIndicator key="typing" />}

              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2"
                >
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      {/* ── Input ────────────────────────────────────────────────────────── */}
      <div className="border-t border-border p-3">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about this document…"
            rows={1}
            className="resize-none min-h-[40px] max-h-[120px] text-sm leading-relaxed py-2.5 overflow-y-auto"
            style={{ height: "auto" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
            }}
            disabled={isLoading}
          />
          <Button
            id="chat-send-btn"
            size="icon"
            className="h-10 w-10 shrink-0"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 px-0.5">
          Press <kbd className="font-mono">Enter</kbd> to send ·{" "}
          <kbd className="font-mono">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function EmptyState({
  onPromptClick,
}: {
  onPromptClick: (p: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 pt-4"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/8 border border-border">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <p className="text-sm font-medium">Ask DUCKY AI anything</p>
        <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
          I can explain clauses, list obligations, highlight risks, and answer
          questions using the document and its analysis.
        </p>
      </div>

      <div className="w-full space-y-1.5">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-1">
          Suggested questions
        </p>
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onPromptClick(prompt)}
            className="w-full text-left text-xs px-3 py-2.5 rounded-lg border border-border
                       bg-muted/30 hover:bg-muted hover:border-foreground/15
                       transition-colors duration-150 leading-snug"
          >
            {prompt}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function MessageBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex items-start gap-2.5", isUser && "flex-row-reverse")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full border",
          isUser
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-muted border-border text-muted-foreground",
        )}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5" />
        ) : (
          <Bot className="w-3.5 h-3.5" />
        )}
      </div>

      {/* Bubble — user bubbles capped at 85%; assistant bubbles fill available width */}
      <div
        className={cn(
          "rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "max-w-[85%] bg-primary text-primary-foreground rounded-tr-sm"
            : "flex-1 min-w-0 bg-muted text-foreground rounded-tl-sm border border-border",
        )}
      >
        {isUser ? (
          <PlainTextContent content={content} />
        ) : (
          <ChatResponseRenderer content={content} />
        )}
      </div>
    </motion.div>
  );
}

/**
 * Renders a user message (or any plain-text string) with newline preservation.
 */
function PlainTextContent({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <span className="whitespace-pre-wrap break-words">
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </span>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-start gap-2.5"
    >
      <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-muted border border-border text-muted-foreground">
        <Bot className="w-3.5 h-3.5" />
      </div>
      <div className="bg-muted border border-border rounded-xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
