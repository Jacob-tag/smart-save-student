import { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface StatCardProps {
  label: string;
  value: string;
  change: number;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "warm";
  spark?: { v: number }[];
  children?: ReactNode;
}

const TONE_BG: Record<string, string> = {
  primary: "from-primary/10 to-primary/0 text-primary",
  success: "from-success/15 to-success/0 text-success",
  warning: "from-warning/15 to-warning/0 text-warning",
  warm: "from-[hsl(var(--cat-7))]/15 to-transparent text-[hsl(var(--cat-7))]",
};

const SPARK_STROKE: Record<string, string> = {
  primary: "hsl(var(--primary))",
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  warm: "hsl(var(--cat-7))",
};

export function StatCard({ label, value, change, icon: Icon, tone = "primary", spark }: StatCardProps) {
  const positive = change >= 0;
  const stroke = SPARK_STROKE[tone];
  const data = spark ?? [{ v: 4 }, { v: 7 }, { v: 5 }, { v: 8 }, { v: 6 }, { v: 9 }, { v: 12 }];

  return (
    <div className="card-elevated p-5 relative overflow-hidden group hover:shadow-floating transition-shadow">
      <div className={cn("absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br opacity-60 blur-2xl pointer-events-none", TONE_BG[tone])} />
      <div className="flex items-start justify-between relative">
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
          <div className="mt-2 font-display text-2xl lg:text-3xl font-bold tracking-tight">{value}</div>
        </div>
        <div className={cn("h-10 w-10 rounded-xl grid place-items-center bg-gradient-to-br shrink-0", TONE_BG[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3 relative">
        <span
          className={cn(
            "stat-pill",
            positive ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive",
          )}
        >
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(change).toFixed(1)}%
        </span>
        <div className="h-10 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`spark-${tone}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stroke} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={stroke} strokeWidth={2} fill={`url(#spark-${tone})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
