import { AlertTriangle } from "lucide-react";
import { formatZAR, CATEGORY_COLORS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useFinance } from "@/context/FinanceContext";

export function BudgetStatus() {
  const { budgets } = useFinance();
  return (
    <div className="card-elevated p-5 lg:p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-display font-bold text-lg">Budget status</h3>
          <p className="text-sm text-muted-foreground">June 2025</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Total budget</div>
          <div className="font-display font-bold text-lg">{formatZAR(budgets.reduce((s, b) => s + b.allocated, 0))}</div>
        </div>
      </div>

      <ul className="space-y-4">
        {budgets.map((b) => {
          const pct = Math.round((b.spent / b.allocated) * 100);
          const over = pct > 100;
          const warn = pct >= 85 && !over;
          return (
            <li key={b.category}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <div className="flex items-center gap-2 font-medium">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: CATEGORY_COLORS[b.category] }} />
                  {b.category}
                  {over && (
                    <span className="stat-pill bg-destructive-soft text-destructive">
                      <AlertTriangle className="h-3 w-3" /> Over budget
                    </span>
                  )}
                  {warn && (
                    <span className="stat-pill bg-warning-soft text-warning">
                      <AlertTriangle className="h-3 w-3" /> Almost full
                    </span>
                  )}
                </div>
                <div className="tabular-nums text-muted-foreground">
                  <span className={cn("font-semibold", over ? "text-destructive" : "text-foreground")}>
                    {formatZAR(b.spent)}
                  </span>{" "}
                  / {formatZAR(b.allocated)}
                </div>
              </div>
              <div className="relative h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    over ? "bg-destructive" : warn ? "bg-warning" : "bg-success",
                  )}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">{pct}% used</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
