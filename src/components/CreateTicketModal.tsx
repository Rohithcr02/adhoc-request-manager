import { useState } from "react";
import { X, Plus, FileText } from "lucide-react";
import type { Ticket } from "@/data/mockData";

const ROLES = [
  "Associate Dean, Academic Affairs",
  "Clerkship Coordinator",
  "Clerkship Director",
  "Thread Director",
  "Block Director",
  "College Head",
  "Educational Quality Improvement",
  "Regional Dean",
  "BIME Analyst",
  "Other",
];

export function CreateTicketModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (ticket: Ticket) => void;
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    reporter: "",
    reporterRole: "",
    priority: "Medium" as Ticket["priority"],
  });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `MED-${Math.floor(Math.random() * 900 + 100)}`;
    onSubmit({
      id,
      title: form.title,
      description: form.description,
      reporter: form.reporter || "Anonymous",
      reporterRole: form.reporterRole || "Staff",
      priority: form.priority,
      status: "To Do",
      created: new Date().toISOString().split("T")[0],
    });
    setForm({ title: "", description: "", reporter: "", reporterRole: "", priority: "Medium" });
    onClose();
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-[580px] bg-background rounded-lg border border-border shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <FileText className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-semibold text-sm">Create Reporting Ticket</div>
              <div className="text-[10px] text-muted-foreground">Med-Ed Reporting (MED)</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Summary / Title <span className="text-destructive">*</span>
            </label>
            <input
              required
              value={form.title}
              onChange={set("title")}
              placeholder="e.g. NBME shelf scores by clerkship and WWAMI site"
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={form.description}
              onChange={set("description")}
              placeholder="Describe the data request in detail. Include the metric you need, time period, any filters, and who will use this data..."
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40 resize-none"
            />
            <div className="text-[10px] text-muted-foreground mt-1">
              Tip: The more detail you provide, the more accurate the AI-generated SQL will be.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Reporter Name</label>
              <input
                value={form.reporter}
                onChange={set("reporter")}
                placeholder="Dr. Jane Smith"
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Role</label>
              <select
                value={form.reporterRole}
                onChange={set("reporterRole")}
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40"
              >
                <option value="">Select role…</option>
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Priority</label>
            <div className="flex gap-2">
              {(["High", "Medium", "Low"] as Ticket["priority"][]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, priority: p }))}
                  className={`flex-1 py-1.5 text-xs rounded border transition-all ${
                    form.priority === p
                      ? p === "High"
                        ? "bg-destructive/10 border-destructive text-destructive font-medium"
                        : p === "Medium"
                        ? "bg-primary/10 border-primary text-primary font-medium"
                        : "bg-muted border-border text-muted-foreground font-medium"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {p === "High" ? "🔴" : p === "Medium" ? "🟡" : "🟢"} {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded border border-border hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded bg-primary text-primary-foreground font-medium hover:opacity-90 flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Create & Analyze
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
