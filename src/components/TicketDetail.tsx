import type { Ticket } from "@/data/mockData";
import { Calendar, User, Flag, CircleDot } from "lucide-react";

const priorityStyle: Record<Ticket["priority"], string> = {
  High: "text-red-600 font-semibold",
  Medium: "text-amber-600 font-semibold",
  Low: "text-slate-500",
};

export function TicketDetail({ ticket }: { ticket: Ticket }) {
  return (
    <div className="border-b border-border bg-white px-6 py-4 shadow-sm">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1.5">
        <span className="font-semibold text-[var(--uw-purple)] hover:underline cursor-pointer">MED</span>
        <span>/</span>
        <span className="font-mono text-muted-foreground">{ticket.id}</span>
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-foreground leading-snug">{ticket.title}</h1>

      {/* Description */}
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-3xl">{ticket.description}</p>

      {/* Meta fields */}
      <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-border">
        <Field icon={<User className="h-3.5 w-3.5 text-[var(--uw-purple)]" />} label="Reporter">
          <span className="text-foreground font-medium">{ticket.reporter}</span>
          <span className="text-muted-foreground"> · {ticket.reporterRole}</span>
        </Field>
        <Field icon={<CircleDot className="h-3.5 w-3.5 text-[var(--uw-purple)]" />} label="Status">
          <span className="text-foreground font-medium">{ticket.status}</span>
        </Field>
        <Field icon={<Flag className="h-3.5 w-3.5 text-[var(--uw-purple)]" />} label="Priority">
          <span className={priorityStyle[ticket.priority]}>{ticket.priority}</span>
        </Field>
        <Field icon={<Calendar className="h-3.5 w-3.5 text-[var(--uw-purple)]" />} label="Created">
          <span className="text-foreground">{ticket.created}</span>
        </Field>
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-1">
        {icon} {label}
      </div>
      <div className="text-[13px]">{children}</div>
    </div>
  );
}