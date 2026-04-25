import { Target, ChevronRight } from "lucide-react";
import { goals, formatZAR } from "@/lib/mock-data";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";

export function GoalsPreview() {
  return (
    <div className="card-elevated p-5 lg:p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-display font-bold text-lg">Savings goals</h3>
          <p className="text-sm text-muted-foreground">Track your progress</p>
        </div>
        <Button asChild variant="ghost" size="sm" className="text-primary">
          <NavLink to="/goals">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </NavLink>
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {goals.slice(0, 4).map((g) => {
          const pct = Math.round((g.saved / g.target) * 100);
          return (
            <div
              key={g.id}
              className="rounded-2xl border border-border bg-gradient-to-br from-secondary/40 to-transparent p-4 hover:shadow-elevated transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center shadow-soft shrink-0">
                  <Target className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{g.name}</div>
                  <div className="text-xs text-muted-foreground">{g.priority} priority</div>
                </div>
                <div className="text-right">
                  <div className="font-display font-bold tabular-nums">{pct}%</div>
                </div>
              </div>

              <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full gradient-success rounded-full" style={{ width: `${pct}%` }} />
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground tabular-nums">
                <span>{formatZAR(g.saved)} saved</span>
                <span>of {formatZAR(g.target)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
