import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Sparkles, CheckCircle2, AlertTriangle, RotateCcw } from "lucide-react";
import type { Ticket, ContextLayer } from "@/data/mockData";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyst`;

export function AnalystChat({
  ticket,
  context,
}: {
  ticket: Ticket;
  context: ContextLayer;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset chat when switching tickets
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `👋 I'm your AI Data Analyst for **${ticket.id}**. I'll follow our strict 8-step workflow: parse → detect ambiguity → intent → SQL → validation → your verification → final report.\n\nWhen ready, paste the stakeholder request below or just ask me to start with the ticket description.`,
      },
    ]);
    setError(null);
  }, [ticket.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, ticket, context }),
      });
      if (res.status === 429) throw new Error("Rate limit reached. Please wait and retry.");
      if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Settings → Workspace → Usage.");
      if (!res.ok || !res.body) throw new Error("Analyst service unavailable.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantSoFar = "";
      let started = false;
      let done = false;

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        textBuffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, nl);
          textBuffer = textBuffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              assistantSoFar += delta;
              if (!started) {
                started = true;
                setMessages((p) => [...p, { role: "assistant", content: assistantSoFar }]);
              } else {
                setMessages((p) => p.map((m, i) => (i === p.length - 1 ? { ...m, content: assistantSoFar } : m)));
              }
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const last = messages[messages.length - 1];
  const awaitingApproval = last?.role === "assistant" && /AWAITING_APPROVAL/.test(last.content);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      <div className="px-6 py-2 border-b border-border flex items-center justify-between bg-card">
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium">AI Data Analyst</span>
          <span className="text-xs text-muted-foreground">· strict workflow · context-aware</span>
        </div>
        <button
          onClick={() => setMessages((m) => m.slice(0, 1))}
          className="text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-muted text-muted-foreground"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((m, i) => (
          <Bubble key={i} msg={m} />
        ))}
        {loading && (
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" /> Analyst is thinking…
          </div>
        )}
        {error && (
          <div className="text-xs text-destructive flex items-center gap-1.5 bg-destructive/10 rounded px-3 py-2">
            <AlertTriangle className="h-3.5 w-3.5" /> {error}
          </div>
        )}
      </div>

      {awaitingApproval && (
        <div className="px-6 py-3 border-t border-border bg-primary/5 flex items-center justify-between">
          <div className="text-sm flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Analyst is awaiting your verification before generating the final report.
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => send("Please revise. Let me clarify: ")}
              className="text-xs px-3 py-1.5 rounded border border-border hover:bg-muted"
            >
              Revise
            </button>
            <button
              onClick={() => send("Approved. Please generate the final report following STEP 8 format.")}
              className="text-xs px-3 py-1.5 rounded bg-primary text-primary-foreground hover:opacity-90 font-medium"
            >
              Approve & Generate Report
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="border-t border-border p-3 bg-card"
      >
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
            }}
            placeholder="Ask the analyst… e.g. 'Use the ticket description and start with Step 1.'"
            rows={2}
            className="flex-1 resize-none rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="h-9 px-3 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 flex items-center gap-1"
          >
            <Send className="h-3.5 w-3.5" /> Send
          </button>
        </div>
        <div className="mt-1.5 text-[10px] text-muted-foreground">
          Shift+Enter for newline · Enter to send
        </div>
      </form>
    </div>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          "max-w-[85%] rounded-lg px-4 py-2.5 text-sm " +
          (isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card border border-border text-foreground")
        }
      >
        {isUser ? (
          <div className="whitespace-pre-wrap">{msg.content}</div>
        ) : (
          <div className="prose prose-sm max-w-none prose-pre:bg-muted prose-pre:text-foreground prose-pre:text-xs prose-code:text-xs prose-headings:mt-3 prose-headings:mb-1 prose-p:my-1 prose-ul:my-1 prose-li:my-0">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}