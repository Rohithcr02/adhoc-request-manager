import { useState } from "react";
import type { ContextLayer } from "@/data/mockData";
import { ChevronDown, ChevronRight, Database, Table2, BookOpen, RefreshCw, User2 } from "lucide-react";

export function ContextLayerPanel({
  context,
  onChange,
}: {
  context: ContextLayer;
  onChange: (c: ContextLayer) => void;
}) {
  const [openTables, setOpenTables] = useState(true);
  const [openMetrics, setOpenMetrics] = useState(true);
  const [editing, setEditing] = useState(false);

  return (
    <aside className="w-[320px] shrink-0 border-l border-border bg-white flex flex-col overflow-hidden">
      {/* Panel header */}
      <div className="px-4 py-3.5 border-b border-border bg-[var(--jira-sidebar)]">
        <div className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-0.5">
          Context Layer
        </div>
        <div className="flex items-center justify-between">
          <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
            <Database className="h-4 w-4 text-[var(--uw-purple)]" />
            Schema & Definitions
          </div>
          <button
            onClick={() => setEditing((v) => !v)}
            className="text-[10px] px-2 py-1 rounded border border-border hover:bg-muted text-muted-foreground font-medium transition"
          >
            {editing ? "Done" : "Edit"}
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="px-4 py-3 border-b border-border bg-[var(--uw-purple-light,oklch(0.96_0.02_294))/30] space-y-1.5">
        <MetaRow icon={<Database className="h-3 w-3 text-[var(--uw-purple)]" />} label="Database">
          {context.database}
        </MetaRow>
        <MetaRow icon={<User2 className="h-3 w-3 text-[var(--uw-purple)]" />} label="Owner">
          {context.owner}
        </MetaRow>
        <MetaRow icon={<RefreshCw className="h-3 w-3 text-[var(--uw-purple)]" />} label="Refresh">
          <span className="text-emerald-700 font-medium">{context.refreshTime}</span>
        </MetaRow>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Tables section */}
        <Section
          icon={<Table2 className="h-3.5 w-3.5 text-[var(--uw-purple)]" />}
          title={`Tables (${context.tables.length})`}
          open={openTables}
          setOpen={setOpenTables}
        >
          <div className="space-y-2">
            {context.tables.map((t) => (
              <div key={t.name} className="rounded border border-border bg-white overflow-hidden">
                <div className="px-3 py-2 bg-[oklch(0.96_0.02_294)/20] border-b border-border">
                  <div className="font-mono text-xs font-bold text-[var(--uw-purple)]">{t.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{t.description}</div>
                </div>
                <div className="px-3 py-1.5 divide-y divide-border/50">
                  {t.columns.map((c) => (
                    <div key={c.name} className="py-1 text-[11px] flex items-start gap-2">
                      <span className="font-mono font-medium text-foreground min-w-[90px]">{c.name}</span>
                      <span className="text-[oklch(0.34_0.16_294)/70] bg-[oklch(0.96_0.02_294)/30] px-1 rounded text-[9px] font-mono mt-px">{c.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Business Metrics section */}
        <Section
          icon={<BookOpen className="h-3.5 w-3.5 text-[var(--uw-purple)]" />}
          title={`Business Metrics (${context.metrics.length})`}
          open={openMetrics}
          setOpen={setOpenMetrics}
        >
          <div className="space-y-2">
            {context.metrics.map((m, i) => (
              <div key={m.name} className="rounded border border-border bg-white p-2.5">
                {editing ? (
                  <>
                    <input
                      value={m.name}
                      onChange={(e) => {
                        const next = [...context.metrics];
                        next[i] = { ...next[i], name: e.target.value };
                        onChange({ ...context, metrics: next });
                      }}
                      className="w-full rounded border border-border bg-background px-1.5 py-0.5 text-xs font-medium mb-1"
                    />
                    <textarea
                      value={m.definition}
                      rows={2}
                      onChange={(e) => {
                        const next = [...context.metrics];
                        next[i] = { ...next[i], definition: e.target.value };
                        onChange({ ...context, metrics: next });
                      }}
                      className="w-full rounded border border-border bg-background px-1.5 py-1 text-[11px] resize-none"
                    />
                  </>
                ) : (
                  <>
                    <div className="text-xs font-semibold text-[var(--uw-purple)] mb-1">{m.name}</div>
                    <div className="text-[11px] text-muted-foreground leading-snug">{m.definition}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </Section>
      </div>
    </aside>
  );
}

function MetaRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="mt-0.5">{icon}</span>
      <span className="text-muted-foreground w-14 shrink-0 font-medium">{label}</span>
      <span className="text-foreground leading-snug">{children}</span>
    </div>
  );
}

function Section({
  icon, title, open, setOpen, children,
}: {
  icon: React.ReactNode;
  title: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted/40 transition"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        {icon}
        {title}
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}