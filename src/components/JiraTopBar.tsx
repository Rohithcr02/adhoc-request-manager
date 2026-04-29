import { Search, Bell, HelpCircle, Settings, Plus, Sparkles } from "lucide-react";

export function JiraTopBar() {
  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-[var(--jira-nav)] px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">
            U
          </div>
          <span className="font-semibold text-sm tracking-tight">UWSOM Reporting</span>
        </div>
        <nav className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
          <button className="px-2 py-1 rounded hover:bg-muted">Your work</button>
          <button className="px-2 py-1 rounded hover:bg-muted">Projects</button>
          <button className="px-2 py-1 rounded hover:bg-muted">Filters</button>
          <button className="px-2 py-1 rounded hover:bg-muted">Dashboards</button>
        </nav>
        <button className="hidden sm:inline-flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-3.5 w-3.5" /> Create
        </button>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            placeholder="Search"
            className="h-7 w-56 rounded border border-border bg-background pl-7 pr-2 text-xs outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>
        <button className="hidden sm:inline-flex items-center gap-1 rounded bg-accent px-2 py-1 text-xs text-accent-foreground">
          <Sparkles className="h-3.5 w-3.5" /> AI Analyst
        </button>
        <button className="p-1.5 rounded hover:bg-muted"><Bell className="h-4 w-4 text-muted-foreground" /></button>
        <button className="p-1.5 rounded hover:bg-muted"><HelpCircle className="h-4 w-4 text-muted-foreground" /></button>
        <button className="p-1.5 rounded hover:bg-muted"><Settings className="h-4 w-4 text-muted-foreground" /></button>
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-accent" />
      </div>
    </header>
  );
}