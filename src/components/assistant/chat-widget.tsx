"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  citations?: { title: string; href: string }[];
}

const SUGGESTIONS = [
  "Is solar eligible?",
  "Show me transport criteria",
  "What documents do I need to certify?",
  "Difference between resilience and mitigation?",
];

export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Ask me anything about the Climate Bonds Taxonomy — eligibility, criteria, certification steps, or where to find a document. I answer from the indexed knowledge base and always cite my sources.",
    },
  ]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-ai-assistant", onOpen);
    return () => window.removeEventListener("open-ai-assistant", onOpen);
  }, []);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function ask(question: string) {
    if (!question.trim() || loading) return;
    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.answer, citations: data.citations }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong reaching the assistant. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 z-30 size-14 rounded-full shadow-lg lg:hidden"
        aria-label="Ask AI Assistant"
      >
        <Sparkles className="size-5" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full max-w-md flex-col p-0">
          <SheetHeader className="border-b border-border p-5">
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" /> Taxonomy Assistant
            </SheetTitle>
            <p className="text-xs text-muted-foreground">Grounded in the indexed Climate Bonds knowledge base.</p>
          </SheetHeader>
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5 scrollbar-thin">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-2.5", m.role === "user" && "flex-row-reverse")}>
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full",
                    m.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-secondary"
                  )}
                >
                  {m.role === "assistant" ? <Bot className="size-3.5" /> : <User className="size-3.5" />}
                </div>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm",
                    m.role === "assistant" ? "bg-secondary" : "bg-primary text-primary-foreground"
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 border-t border-border/60 pt-2">
                      {m.citations.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={() => setOpen(false)}
                          className="rounded-full bg-background px-2 py-0.5 text-[11px] font-medium text-primary hover:underline"
                        >
                          {c.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Bot className="size-3.5 animate-pulse" /> Thinking…
              </div>
            )}
          </div>
          {messages.length < 2 && (
            <div className="flex flex-wrap gap-1.5 border-t border-border p-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="rounded-full border border-border px-3 py-1 text-xs hover:bg-secondary"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about eligibility, criteria, certification…"
              className="h-10 flex-1 rounded-full border border-input bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="submit" size="icon" disabled={loading} aria-label="Send">
              <Send className="size-4" />
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
