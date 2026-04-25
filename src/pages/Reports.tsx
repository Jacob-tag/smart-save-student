import { AppShell } from "@/components/layout/AppShell";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { monthlyTrend, formatZAR, summary, budgets, goals } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet, TrendingUp, TrendingDown, Target, PiggyBank } from "lucide-react";
import { toast } from "sonner";

const reportCards = [
  { label: "Expense summary", value: formatZAR(summary.expenses), sub: "−3.1% vs last month", icon: TrendingDown, tone: "warm" },
  { label: "Income summary", value: formatZAR(summary.income), sub: "+8.4% vs last month", icon: TrendingUp, tone: "success" },
  { label: "Budget performance", value: `${Math.round((budgets.reduce((s, b) => s + b.spent, 0) / budgets.reduce((s, b) => s + b.allocated, 0)) * 100)}%`, sub: "of total budget used", icon: Target, tone: "primary" },
  { label: "Savings performance", value: `${Math.round((goals.reduce((s, g) => s + g.saved, 0) / goals.reduce((s, g) => s + g.target, 0)) * 100)}%`, sub: "of all goals reached", icon: PiggyBank, tone: "warning" },
];

const TONE: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  warm: "bg-[hsl(var(--cat-7))]/10 text-[hsl(var(--cat-7))]",
};

const Reports = () => {
  return (
    <AppShell title="Reports & Analytics" subtitle="Insights to help you spend smarter">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportCards.map((c) => (
          <div key={c.label} className="card-elevated p-5">
            <div className={`h-10 w-10 rounded-xl grid place-items-center ${TONE[c.tone]}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.label}</div>
            <div className="font-display font-bold text-2xl mt-1">{c.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{c.sub}</div>
          </div>
        ))}
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-elevated p-5 lg:p-6 lg:col-span-2">
          <h3 className="font-display font-bold text-lg mb-1">Monthly comparison</h3>
          <p className="text-sm text-muted-foreground mb-4">Income vs. expenses by month</p>
          <div className="h-[320px] -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend} barCategoryGap={20}>
                <CartesianGrid strokeDasharray="3 6" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => formatZAR(v)}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="income" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expenses" fill="hsl(var(--cat-7))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-elevated p-6 space-y-3">
          <h3 className="font-display font-bold text-lg">Export</h3>
          <p className="text-sm text-muted-foreground">Download your data anytime</p>

          <Button onClick={() => toast.success("Monthly PDF generated")} className="w-full justify-start gap-3 h-12">
            <FileText className="h-5 w-5" /> Monthly report (PDF)
          </Button>
          <Button onClick={() => toast.success("Annual summary generated")} variant="outline" className="w-full justify-start gap-3 h-12">
            <FileText className="h-5 w-5" /> Annual summary (PDF)
          </Button>
          <Button onClick={() => toast.success("CSV exported")} variant="outline" className="w-full justify-start gap-3 h-12">
            <FileSpreadsheet className="h-5 w-5" /> Export CSV
          </Button>
          <Button onClick={() => toast.success("Tax pack ready")} variant="outline" className="w-full justify-start gap-3 h-12">
            <Download className="h-5 w-5" /> Tax pack
          </Button>
        </div>
      </section>
    </AppShell>
  );
};

export default Reports;
