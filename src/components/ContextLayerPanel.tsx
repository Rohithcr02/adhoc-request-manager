import { useState } from "react";
import type { ContextLayer } from "@/data/mockData";
import { ChevronDown, ChevronRight, Database, Table2, BookOpen } from "lucide-react";

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
    <aside className="w-[340px] shrink-0 border-l border-border bg-[var(--jira-sidebar)] flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Context Layer</div>
          <div className="text-sm font-semibold flex items-center gap-1.5"><Database className="h-3.5 w-3.5" /> Schema & Definitions</div>
        </div>
        <button
          onClick={() => setEditing((v) => !v)}
          className="text-[11px] px-2 py-1 rounded border border-border hover:bg-muted"
        >
          {editing ? "Done" : "Edit"}
        </button>
      </div>

      <div className="px-4 py-3 border-b border-border text-xs space-y-1">
        <Row label="Database">{context.database}</Row>
        <Row label="Owner">{context.owner}</Row>
        <Row label="Refresh">{context.refreshTime}</Row>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Section
          icon={<Table2 className="h-3.5 w-3.5" />}
          title={`Tables (${context.tables.length})`}
          open={openTables}
          setOpen={setOpenTables}
        >
          <div className="space-y-3">
            {context.tables.map((t) => (
              <div key={t.name} className="rounded border border-border bg-background p-2">
                <div className="font-mono text-xs font-semibold text-primary">{t.name}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{t.description}</div>
                <div className="mt-1.5 space-y-0.5">
                  {t.columns.map((c) => (
                    <div key={c.name} className="text-[11px] flex gap-2">
                      <span className="font-mono text-foreground">{c.name}</span>
                      <span className="text-muted-foreground">{c.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          icon={<BookOpen className="h-3.5 w-3.5" />}
          title={`Business Metrics (${context.metrics.length})`}
          open={openMetrics}
          setOpen={setOpenMetrics}
        >
          <div className="space-y-2">
            {context.metrics.map((m, i) => (
              <div key={m.name} className="text-xs">
                {editing ? (
                  <>
                    <input
                      value={m.name}
                      onChange={(e) => {
                        const next = [...context.metrics];
                        next[i] = { ...next[i], name: e.target.value };
                        onChange({ ...context, metrics: next });
                      }}
                      className="w-full rounded border border-border bg-background px-1.5 py-0.5 text-xs font-medium"
                    />
                    <textarea
                      value={m.definition}
                      rows={2}
                      onChange={(e) => {
                        const next = [...context.metrics];
                        next[i] = { ...next[i], definition: e.target.value };
                        onChange({ ...context, metrics: next });
                      }}
                      className="mt-1 w-full rounded border border-border bg-background px-1.5 py-1 text-[11px]"
                    />
                  </>
                ) : (
                  <>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-muted-foreground text-[11px]">{m.definition}</div>
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

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground w-16 shrink-0">{label}</span>
      <span className="text-foreground">{children}</span>
    </div>
  );
}

function Section({
  icon,
  title,
  open,
  setOpen,
  children,
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
        className="w-full flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-muted/50"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        {icon} {title}
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}