import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CATEGORY_COLORS, categorySpend, formatZAR } from "@/lib/mock-data";

export function CategoryChart() {
  const total = categorySpend.reduce((s, c) => s + c.value, 0);

  return (
    <div className="card-elevated p-5 lg:p-6 h-full">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-display font-bold text-lg">Where it goes</h3>
          <p className="text-sm text-muted-foreground">Spending by category</p>
        </div>
      </div>

      <div className="relative h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categorySpend}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={2}
              stroke="hsl(var(--card))"
              strokeWidth={3}
            >
              {categorySpend.map((c) => (
                <Cell key={c.name} fill={CATEGORY_COLORS[c.name]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12,
                fontSize: 12,
              }}
              formatter={(v: number) => formatZAR(v)}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Total</div>
            <div className="font-display font-bold text-xl">{formatZAR(total)}</div>
          </div>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {categorySpend.map((c) => (
          <li key={c.name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: CATEGORY_COLORS[c.name] }} />
            <span className="text-muted-foreground truncate">{c.name}</span>
            <span className="ml-auto font-semibold tabular-nums">{Math.round((c.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
