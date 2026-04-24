import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { monthlyTrend } from "@/lib/mock-data";
import { formatZAR } from "@/lib/mock-data";

export function SpendingChart() {
  return (
    <div className="card-elevated p-5 lg:p-6 h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-lg">Cash flow</h3>
          <p className="text-sm text-muted-foreground">Income vs. expenses, last 6 months</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" /> Income
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--cat-7))]" /> Expenses
          </span>
        </div>
      </div>

      <div className="h-[280px] -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="g-income" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="g-expense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--cat-7))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--cat-7))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12,
                boxShadow: "var(--shadow-md)",
                fontSize: 12,
              }}
              formatter={(value: number) => formatZAR(value)}
            />
            <Area type="monotone" dataKey="income" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#g-income)" />
            <Area type="monotone" dataKey="expenses" stroke="hsl(var(--cat-7))" strokeWidth={2.5} fill="url(#g-expense)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
