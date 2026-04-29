import { Shield, Database, Clock, Table2, Hash, User, Columns3, CheckCircle2 } from "lucide-react";
import type { ContextLayer } from "@/data/mockData";

type Msg = { role: "user" | "assistant"; content: string };

function extractTablesFromSQL(sql: string): string[] {
  const matches = new Set<string>();
  (sql.match(/FROM\s+(\w+)/gi) || []).forEach((m) => matches.add(m.split(/\s+/)[1].toLowerCase()));
  (sql.match(/JOIN\s+(\w+)/gi) || []).forEach((m) => matches.add(m.split(/\s+/)[1].toLowerCase()));
  return Array.from(matches);
}

function extractColumnsFromSQL(sql: string): string[] {
  const selectMatch = sql.match(/SELECT\s+([\s\S]+?)\s+FROM/i);
  if (!selectMatch) return [];
  const part = selectMatch[1].trim();
  if (part === "*") return ["*"];
  return part
    .split(",")
    .map((col) => {
      const as = col.match(/AS\s+(\w+)\s*$/i);
      if (as) return as[1].trim();
      const dot = col.match(/\.(\w+)\s*$/);
      if (dot) return dot[1].trim();
      return col.trim().split(/\s+/).pop() ?? col.trim();
    })
    .filter(Boolean)
    .slice(0, 6);
}

function extractSQL(messages: Msg[]): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role !== "assistant") continue;
    const m = messages[i].content.match(/```sql\s*([\s\S]*?)```/i);
    if (m) return m[1].trim();
  }
  return null;
}

function extractRowCount(messages: Msg[]): number | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role !== "assistant") continue;
    const m = messages[i].content.match(/```results\s*([\s\S]*?)```/i);
    if (m) {
      try {
        const p = JSON.parse(m[1].trim());
        return p.rows?.length ?? null;
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function DataTrustCard({ messages, context }: { messages: Msg[]; context: ContextLayer }) {
  const sql = extractSQL(messages);
  const tables = sql ? extractTablesFromSQL(sql) : [];
  const columns = sql ? extractColumnsFromSQL(sql) : [];
  const rowCount = extractRowCount(messages);
  const generatedAt = new Date().toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="mx-6 my-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-emerald-500/20 flex items-center gap-2 bg-emerald-500/10">
        <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          Data Trust Summary
        </span>
        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-3 w-3" />
          Analyst-verified · Human-approved
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-y divide-border/40">
        <TrustCell icon={<Database className="h-3.5 w-3.5" />} label="Database" value={context.database} />
        <TrustCell icon={<Clock className="h-3.5 w-3.5" />} label="Last Refresh" value={context.refreshTime} />
        <TrustCell icon={<User className="h-3.5 w-3.5" />} label="Data Owner" value={context.owner} />
        <TrustCell
          icon={<Table2 className="h-3.5 w-3.5" />}
          label="Tables Used"
          value={tables.length ? tables.join(", ") : "—"}
          mono
        />
        <TrustCell
          icon={<Columns3 className="h-3.5 w-3.5" />}
          label="Key Columns"
          value={columns.length ? columns.join(", ") : "—"}
          mono
        />
        <TrustCell
          icon={<Hash className="h-3.5 w-3.5" />}
          label="Result Rows"
          value={rowCount !== null ? `${rowCount} rows` : "—"}
        />
      </div>

      <div className="px-4 py-1.5 bg-muted/20 text-[10px] text-muted-foreground flex justify-between">
        <span>Report generated: {generatedAt}</span>
        <span>SQL reviewed & approved by analyst before execution</span>
      </div>
    </div>
  );
}

function TrustCell({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="px-3 py-2.5 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
        {icon} {label}
      </div>
      <div className={`text-xs text-foreground font-medium leading-snug ${mono ? "font-mono" : ""}`}>
        {value}
      </div>
    </div>
  );
}
