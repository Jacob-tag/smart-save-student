import { AppShell } from "@/components/layout/AppShell";
import { budgets, formatZAR, CATEGORY_COLORS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const Budget = () => {
  const total = budgets.reduce((s, b) => s + b.allocated, 0);
  const spent = budgets.reduce((s, b) => s + b.spent, 0);
  const remaining = total - spent;
  const pct = Math.round((spent / total) * 100);

  return (
    <AppShell title="Budget Planner" subtitle="Plan, allocate, and stay on track">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly setup */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card-elevated p-6 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full gradient-primary opacity-20 blur-3xl" />
            <div className="relative">
              <div className="text-xs font-semibold text-primary uppercase tracking-wider">Monthly budget</div>
              <div className="mt-2 font-display font-bold text-4xl tracking-tight">{formatZAR(total)}</div>
              <div className="mt-1 text-sm text-muted-foreground">June 2025</div>

              <div className="mt-5 h-2.5 rounded-full bg-secondary overflow-hidden">
                <div className={cn("h-full gradient-primary rounded-full")} style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{formatZAR(spent)} spent</span>
                <span className={cn(remaining < 0 && "text-destructive font-semibold")}>
                  {formatZAR(Math.abs(remaining))} {remaining < 0 ? "over" : "left"}
                </span>
              </div>
            </div>
          </div>

          <form
            className="card-elevated p-6 space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <h3 className="font-display font-bold text-lg">Set monthly budget</h3>
            <div className="space-y-1.5">
              <Label htmlFor="total">Total amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">R</span>
                <Input id="total" type="number" defaultValue={total} className="pl-7 h-11 font-semibold" />
              </div>
            </div>
            <Button type="submit" className="w-full h-11">Update budget</Button>
          </form>

          <div className="rounded-2xl p-5 border border-primary/20 bg-gradient-to-br from-primary/5 to-success/5">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center shrink-0">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <div className="font-semibold text-sm">Smart suggestion</div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  You're consistently 18% over on Transport. Try increasing it by R200 and trimming Entertainment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">Category allocation</h3>
            <Button size="sm" variant="outline" className="gap-1.5">
              <Plus className="h-4 w-4" /> New category
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {budgets.map((b) => {
              const p = Math.round((b.spent / b.allocated) * 100);
              const over = p > 100;
              const warn = p >= 85 && !over;
              const remaining = b.allocated - b.spent;

              return (
                <div key={b.category} className="card-elevated p-5 hover:shadow-floating transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-10 w-10 rounded-xl grid place-items-center font-bold"
                        style={{ background: `${CATEGORY_COLORS[b.category]}1f`, color: CATEGORY_COLORS[b.category] }}
                      >
                        {b.category[0]}
                      </span>
                      <div>
                        <div className="font-semibold">{b.category}</div>
                        <div className="text-xs text-muted-foreground">{p}% used</div>
                      </div>
                    </div>
                    {over && (
                      <span className="stat-pill bg-destructive-soft text-destructive">
                        <AlertTriangle className="h-3 w-3" /> Over
                      </span>
                    )}
                    {warn && (
                      <span className="stat-pill bg-warning-soft text-warning">
                        <AlertTriangle className="h-3 w-3" /> Watch
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center my-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Allocated</div>
                      <div className="font-semibold tabular-nums text-sm">{formatZAR(b.allocated)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Spent</div>
                      <div className="font-semibold tabular-nums text-sm">{formatZAR(b.spent)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Left</div>
                      <div className={cn("font-semibold tabular-nums text-sm", remaining < 0 && "text-destructive")}>
                        {formatZAR(Math.abs(remaining))}
                      </div>
                    </div>
                  </div>

                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        over ? "bg-destructive" : warn ? "bg-warning" : "bg-success",
                      )}
                      style={{ width: `${Math.min(p, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Budget;
