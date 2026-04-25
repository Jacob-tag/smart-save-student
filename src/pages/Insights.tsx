import { AppShell } from "@/components/layout/AppShell";
import { Sparkles, ScanLine, GraduationCap, CreditCard, Upload, ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { formatZAR } from "@/lib/mock-data";

const tips = [
  { title: "Cut takeaways", body: "Reducing takeaways from 4 to 2 per week could save you R640/month.", save: 640 },
  { title: "Switch your data plan", body: "Your usage fits the R199 monthly bundle — saving R150/month.", save: 150 },
  { title: "Buy used textbooks", body: "Second-hand textbooks for next semester could save up to R900.", save: 900 },
];

const Insights = () => {
  return (
    <AppShell title="Smart Insights" subtitle="AI-powered ways to make your money go further">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* OCR Receipt Scanner */}
        <div className="card-elevated p-6 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center">
              <ScanLine className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg leading-tight">Receipt scanner</h3>
              <p className="text-xs text-muted-foreground">Snap a receipt — we'll log it</p>
            </div>
          </div>

          <label className="block border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <div className="mt-3 font-semibold text-sm">Drop receipt or click to upload</div>
            <div className="text-xs text-muted-foreground mt-1">JPG, PNG or PDF up to 10MB</div>
            <input type="file" className="hidden" accept="image/*,application/pdf" />
          </label>

          <div className="mt-4 text-xs text-muted-foreground">
            Powered by OCR — categorises and logs in seconds.
          </div>
        </div>

        {/* AI Tips */}
        <div className="card-elevated p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-success grid place-items-center">
                <Sparkles className="h-5 w-5 text-success-foreground" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg leading-tight">AI spending suggestions</h3>
                <p className="text-xs text-muted-foreground">Personalised, weekly</p>
              </div>
            </div>
            <span className="stat-pill bg-success-soft text-success">
              Save up to {formatZAR(tips.reduce((s, t) => s + t.save, 0))}/mo
            </span>
          </div>

          <ul className="space-y-3">
            {tips.map((t, i) => (
              <li key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/40 hover:bg-secondary transition-colors">
                <div className="h-9 w-9 rounded-xl bg-card grid place-items-center text-primary shrink-0 shadow-soft">
                  <Lightbulb className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm">{t.title}</div>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.body}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-display font-bold text-success">{formatZAR(t.save)}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Potential</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scholarship planner */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-lg">Scholarship planner</h3>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-success/10 p-5 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">NSFAS allowance</div>
                <div className="font-display font-bold text-2xl">{formatZAR(15000)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Used</div>
                <div className="font-display font-bold text-2xl text-primary">62%</div>
              </div>
            </div>
            <Progress value={62} className="h-2" />
            <div className="text-xs text-muted-foreground mt-2">{formatZAR(5700)} left until next disbursement</div>
          </div>

          <div className="space-y-2.5 text-sm">
            {[
              { label: "Tuition reserve", value: 6000 },
              { label: "Books & supplies", value: 1800 },
              { label: "Living allowance", value: 1500 },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-semibold tabular-nums">{formatZAR(row.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Loan repayment tracker */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-warning/15 text-warning grid place-items-center">
              <CreditCard className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-lg">Loan repayment tracker</h3>
          </div>

          <div className="text-center py-3">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Outstanding balance</div>
            <div className="font-display font-bold text-3xl mt-1">{formatZAR(48500)}</div>
            <div className="text-xs text-success font-semibold mt-0.5">↓ {formatZAR(1200)} this month</div>
          </div>

          <div className="my-4 h-2.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full gradient-primary rounded-full" style={{ width: "35%" }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatZAR(26500)} repaid</span>
            <span>of {formatZAR(75000)}</span>
          </div>

          <form className="mt-5 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="extra" className="text-xs">Add extra payment</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">R</span>
                <Input id="extra" type="number" placeholder="0" className="pl-7 h-10" />
              </div>
            </div>
            <Button className="self-end h-10 gap-1.5">Apply <ArrowRight className="h-4 w-4" /></Button>
          </form>
        </div>
      </section>
    </AppShell>
  );
};

export default Insights;
