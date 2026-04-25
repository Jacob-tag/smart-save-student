import { transactions, formatZAR, CATEGORY_COLORS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  limit?: number;
  showHeader?: boolean;
}

export function RecentTransactions({ limit = 7, showHeader = true }: Props) {
  const items = transactions.slice(0, limit);

  return (
    <div className="card-elevated overflow-hidden">
      {showHeader && (
        <div className="flex items-center justify-between p-5 lg:p-6 pb-4">
          <div>
            <h3 className="font-display font-bold text-lg">Recent transactions</h3>
            <p className="text-sm text-muted-foreground">Your latest activity</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-primary">
            <NavLink to="/transactions">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </NavLink>
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-muted-foreground bg-secondary/40">
              <th className="text-left font-semibold px-5 lg:px-6 py-3">Description</th>
              <th className="text-left font-semibold px-3 py-3 hidden sm:table-cell">Category</th>
              <th className="text-left font-semibold px-3 py-3 hidden md:table-cell">Method</th>
              <th className="text-left font-semibold px-3 py-3 hidden lg:table-cell">Date</th>
              <th className="text-left font-semibold px-3 py-3 hidden md:table-cell">Status</th>
              <th className="text-right font-semibold px-5 lg:px-6 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                <td className="px-5 lg:px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-9 w-9 rounded-xl grid place-items-center text-xs font-bold shrink-0"
                      style={{
                        background: `${CATEGORY_COLORS[t.category]}1f`,
                        color: CATEGORY_COLORS[t.category],
                      }}
                    >
                      {t.category[0]}
                    </span>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{t.description}</div>
                      <div className="text-xs text-muted-foreground sm:hidden">{t.category} • {t.date}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5 hidden sm:table-cell">
                  <Badge variant="secondary" className="font-medium">{t.category}</Badge>
                </td>
                <td className="px-3 py-3.5 hidden md:table-cell text-muted-foreground">{t.method}</td>
                <td className="px-3 py-3.5 hidden lg:table-cell text-muted-foreground tabular-nums">{t.date}</td>
                <td className="px-3 py-3.5 hidden md:table-cell">
                  <span
                    className={cn(
                      "stat-pill",
                      t.status === "Cleared" ? "bg-success-soft text-success" : "bg-warning-soft text-warning",
                    )}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-5 lg:px-6 py-3.5 text-right">
                  <span className={cn("font-semibold tabular-nums", t.type === "income" ? "text-success" : "text-foreground")}>
                    {t.type === "income" ? "+" : "−"} {formatZAR(t.amount)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
