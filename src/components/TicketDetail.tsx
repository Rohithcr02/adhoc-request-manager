import type { Ticket } from "@/data/mockData";
import { Calendar, User, Flag, CircleDot } from "lucide-react";

export function TicketDetail({ ticket }: { ticket: Ticket }) {
  return (
    <div className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-mono">MED</span>
        <span>/</span>
        <span className="font-mono">{ticket.id}</span>
      </div>
      <h1 className="text-xl font-semibold mt-1 leading-tight">{ticket.title}</h1>
      <p className="text-sm text-muted-foreground mt-2 max-w-3xl">{ticket.description}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
        <Field icon={<User className="h-3.5 w-3.5" />} label="Reporter" value={`${ticket.reporter} · ${ticket.reporterRole}`} />
        <Field icon={<CircleDot className="h-3.5 w-3.5" />} label="Status" value={ticket.status} />
        <Field icon={<Flag className="h-3.5 w-3.5" />} label="Priority" value={ticket.priority} />
        <Field icon={<Calendar className="h-3.5 w-3.5" />} label="Created" value={ticket.created} />
      </div>
    </div>
  );
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-muted-foreground uppercase tracking-wide text-[10px]">
        {icon} {label}
      </div>
      <div className="text-foreground mt-1">{value}</div>
    </div>
  );
}