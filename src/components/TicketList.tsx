import { type Ticket } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Circle, Clock, CheckCircle, AlertCircle } from "lucide-react";

const priorityColor: Record<Ticket["priority"], string> = {
  High: "text-red-600",
  Medium: "text-amber-600",
  Low: "text-slate-400",
};

const priorityDot: Record<Ticket["priority"], string> = {
  High: "bg-red-500",
  Medium: "bg-amber-400",
  Low: "bg-slate-300",
};

const statusConfig: Record<Ticket["status"], { label: string; className: string; icon: React.ReactNode }> = {
  "To Do": {
    label: "To Do",
    className: "bg-slate-100 text-slate-600",
    icon: <Circle className="h-3 w-3" />,
  },
  "In Progress": {
    label: "In Progress",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
    icon: <Clock className="h-3 w-3" />,
  },
  Done: {
    label: "Done",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    icon: <CheckCircle className="h-3 w-3" />,
  },
};

export function TicketList({
  tickets,
  selectedId,
  onSelect,
}: {
  tickets: Ticket[];
  selectedId: string;
  onSelect: (t: Ticket) => void;
}) {
  return (
    <aside className="w-[300px] shrink-0 border-r border-border bg-white flex flex-col">
      {/* Sidebar header */}
      <div className="px-4 py-3.5 border-b border-border bg-[var(--jira-sidebar)]">
        <div className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-0.5">
          Project
        </div>
        <div className="font-bold text-sm text-foreground">Med-Ed Reporting</div>
        <div className="text-[10px] font-mono text-muted-foreground mt-0.5">MED</div>
      </div>

      {/* Section label */}
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-border bg-[var(--jira-sidebar)]">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
          Adhoc Requests
        </span>
        <span className="text-[10px] bg-[var(--uw-purple)] text-white font-bold rounded-full px-1.5 py-0.5">
          {tickets.length}
        </span>
      </div>

      {/* Ticket list */}
      <ul className="flex-1 overflow-y-auto">
        {tickets.map((t) => {
          const isSelected = selectedId === t.id;
          const status = statusConfig[t.status];
          return (
            <li key={t.id}>
              <button
                onClick={() => onSelect(t)}
                className={cn(
                  "w-full text-left px-4 py-3.5 border-b border-border transition-all duration-150 relative",
                  isSelected
                    ? "bg-[var(--uw-purple-light,oklch(0.94_0.04_294))] border-l-[3px] border-l-[var(--uw-purple)]"
                    : "bg-white hover:bg-slate-50 border-l-[3px] border-l-transparent"
                )}
              >
                {/* Ticket ID + status */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className={cn(
                    "text-[10px] font-mono font-semibold",
                    isSelected ? "text-[var(--uw-purple)]" : "text-muted-foreground"
                  )}>
                    {t.id}
                  </span>
                  <span className={cn(
                    "text-[9px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1",
                    status.className
                  )}>
                    {status.icon}
                    {status.label}
                  </span>
                </div>

                {/* Title */}
                <div className={cn(
                  "text-[13px] font-medium leading-snug line-clamp-2 mb-2",
                  isSelected ? "text-[var(--uw-purple)]" : "text-foreground"
                )}>
                  {t.title}
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="truncate max-w-[140px]">{t.reporter}</span>
                  <span className="flex items-center gap-1">
                    <span className={cn("h-1.5 w-1.5 rounded-full inline-block", priorityDot[t.priority])} />
                    <span className={priorityColor[t.priority]}>{t.priority}</span>
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}