import { Search, Bell, HelpCircle, Settings, Plus, Database, ChevronDown } from "lucide-react";
import uwLogo from "@/assets/uw-medicine-logo.png";

const NAV_ITEMS = ["Your Work", "Projects", "Filters", "Dashboards"];

export function JiraTopBar({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <header className="flex-shrink-0 border-b border-[oklch(0.27_0.14_294)] bg-[var(--jira-nav)] shadow-sm">
      {/* Main nav row */}
      <div className="flex h-14 items-center justify-between px-5">
        {/* Left: Logo + App name */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src={uwLogo}
              alt="UW Medicine"
              className="h-9 w-9 rounded-sm object-cover ring-2 ring-white/20"
            />
            <div>
              <div className="text-white font-bold text-[15px] leading-tight tracking-tight">
                UW SoM
              </div>
              <div className="text-[oklch(0.72_0.08_78)] text-[10px] font-semibold uppercase tracking-widest leading-tight">
                Data Request Manager
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-white/20 mx-1" />

          {/* Nav links */}
          <nav className="hidden md:flex items-end h-14">
            {NAV_ITEMS.map((item, i) => (
              <button
                key={item}
                className={`
                  px-4 h-14 text-sm font-medium transition-all relative
                  ${i === 0
                    ? "text-white border-b-[3px] border-[var(--uw-gold)]"
                    : "text-white/70 border-b-[3px] border-transparent hover:text-white hover:border-white/30"
                  }
                `}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/50" />
            <input
              placeholder="Search requests…"
              className="h-8 w-52 rounded border border-white/20 bg-white/10 pl-8 pr-3 text-xs text-white placeholder:text-white/40 outline-none focus:border-white/40 focus:bg-white/15 transition"
            />
          </div>

          {/* Create button — UW Gold */}
          <button
            onClick={onCreateClick}
            className="inline-flex items-center gap-1.5 rounded px-3.5 py-1.5 text-xs font-semibold transition-all
              bg-[var(--uw-gold)] text-[oklch(0.16_0.025_265)] hover:brightness-110 active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            New Request
          </button>

          {/* Icon actions */}
          <div className="flex items-center gap-0.5 ml-1">
            <IconBtn><Database className="h-4 w-4" /></IconBtn>
            <IconBtn><Bell className="h-4 w-4" /></IconBtn>
            <IconBtn><HelpCircle className="h-4 w-4" /></IconBtn>
            <IconBtn><Settings className="h-4 w-4" /></IconBtn>
          </div>

          {/* Avatar */}
          <div className="h-8 w-8 rounded-full bg-[var(--uw-gold)] flex items-center justify-center text-[11px] font-bold text-[oklch(0.16_0.025_265)] ml-1">
            DR
          </div>
        </div>
      </div>

      {/* Subtle gold bottom accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[var(--uw-gold)] to-transparent opacity-40" />
    </header>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="p-2 rounded text-white/60 hover:text-white hover:bg-white/10 transition">
      {children}
    </button>
  );
}