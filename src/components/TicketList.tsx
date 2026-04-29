import { MOCK_TICKETS, type Ticket } from "@/data/mockData";
import { cn } from "@/lib/utils";

const priorityColor: Record<Ticket["priority"], string> = {
  High: "text-destructive",
  Medium: "text-[var(--status-warn)]",
  Low: "text-muted-foreground",
};

const statusBadge: Record<Ticket["status"], string> = {
  "To Do": "bg-muted text-muted-foreground",
  "In Progress": "bg-primary/10 text-primary",
  Done: "bg-[oklch(0.92_0.07_155)] text-[var(--status-done)]",
};

export function TicketList({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (t: Ticket) => void;
}) {
  return (
    <aside className="w-[320px] shrink-0 border-r border-border bg-[var(--jira-sidebar)] flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">Project</div>
        <div className="font-semibold text-sm">Med-Ed Reporting (MED)</div>
      </div>
      <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
        Adhoc Reporting Requests · {MOCK_TICKETS.length}
      </div>
      <ul className="flex-1 overflow-y-auto">
        {MOCK_TICKETS.map((t) => (
          <li key={t.id}>
            <button
              onClick={() => onSelect(t)}
              className={cn(
                "w-full text-left px-4 py-3 border-b border-border hover:bg-muted/60 transition",
                selectedId === t.id && "bg-primary/5 border-l-2 border-l-primary"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-muted-foreground">{t.id}</span>
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded", statusBadge[t.status])}>
                  {t.status}
                </span>
              </div>
              <div className="text-sm font-medium mt-1 leading-snug line-clamp-2">{t.title}</div>
              <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground">
                <span>{t.reporter}</span>
                <span className={priorityColor[t.priority]}>● {t.priority}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}