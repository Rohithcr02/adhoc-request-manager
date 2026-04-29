import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const STEPS = [
  { id: 1, label: "Parse" },
  { id: 2, label: "Resolve" },
  { id: 3, label: "Intent" },
  { id: 4, label: "Enrich" },
  { id: 5, label: "Prompt" },
  { id: 6, label: "SQL" },
  { id: 7, label: "Verify" },
  { id: 8, label: "Report" },
];

export function detectCurrentStep(messages: Msg[]): number {
  const all = messages
    .filter((m) => m.role === "assistant")
    .map((m) => m.content)
    .join("\n");

  if (/```results/.test(all)) return 8;
  if (/AWAITING_APPROVAL/.test(all)) return 7;
  if (/```sql/i.test(all)) return 6;
  if (/```prompt/.test(all)) return 5;
  if (/STEP 4|context enrichment/i.test(all)) return 4;
  if (/```json[\s\S]*?"metric"/i.test(all)) return 3;
  if (/ASSUMPTION:|clarif/i.test(all) && messages.length > 2) return 2;
  if (messages.length > 1) return 1;
  return 0;
}

export function WorkflowStepper({ messages }: { messages: Msg[] }) {
  const current = detectCurrentStep(messages);

  return (
    <div className="px-6 py-3 border-b border-border bg-card/50">
      <div className="flex items-start w-full">
        {STEPS.map((step, idx) => {
          const done = current > step.id;
          const active = current === step.id;
          return (
            <div key={step.id} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300",
                    done && "bg-primary text-primary-foreground",
                    active && "bg-primary/20 text-primary ring-2 ring-primary ring-offset-1 ring-offset-card animate-pulse",
                    !done && !active && "bg-muted text-muted-foreground"
                  )}
                >
                  {done ? <Check className="h-3 w-3" /> : step.id}
                </div>
                <span
                  className={cn(
                    "text-[9px] mt-1 font-medium",
                    active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-[2px] flex-1 mb-3 mx-1 transition-all duration-500",
                    current > step.id ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
