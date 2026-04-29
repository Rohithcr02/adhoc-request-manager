import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { JiraTopBar } from "@/components/JiraTopBar";
import { TicketList } from "@/components/TicketList";
import { TicketDetail } from "@/components/TicketDetail";
import { AnalystChat } from "@/components/AnalystChat";
import { ContextLayerPanel } from "@/components/ContextLayerPanel";
import { CreateTicketModal } from "@/components/CreateTicketModal";
import { MOCK_TICKETS, DEFAULT_CONTEXT, type Ticket, type ContextLayer } from "@/data/mockData";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [selected, setSelected] = useState<Ticket>(MOCK_TICKETS[0]);
  const [context, setContext] = useState<ContextLayer>(DEFAULT_CONTEXT);
  const [createOpen, setCreateOpen] = useState(false);

  const handleCreateTicket = (ticket: Ticket) => {
    setTickets((prev) => [ticket, ...prev]);
    setSelected(ticket);
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <JiraTopBar onCreateClick={() => setCreateOpen(true)} />
      <div className="flex-1 flex min-h-0">
        <TicketList tickets={tickets} selectedId={selected.id} onSelect={setSelected} />
        <main className="flex-1 flex flex-col min-w-0">
          <TicketDetail ticket={selected} />
          <AnalystChat ticket={selected} context={context} />
        </main>
        <ContextLayerPanel context={context} onChange={setContext} />
      </div>
      <CreateTicketModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateTicket}
      />
    </div>
  );
}
