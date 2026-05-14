import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useFinance } from "@/context/FinanceContext";
import { CATEGORIES, type Category, setAppCurrency } from "@/lib/mock-data";

const CURRENCIES = [
  { code: "ZAR", label: "South African Rand (R)" },
  { code: "USD", label: "US Dollar ($)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "GBP", label: "British Pound (£)" },
  { code: "NGN", label: "Nigerian Naira (₦)" },
  { code: "KES", label: "Kenyan Shilling (KSh)" },
  { code: "GHS", label: "Ghanaian Cedi (₵)" },
];

const DEFAULT_SPLIT: Record<Category, number> = {
  Rent: 35, Food: 25, Transport: 12, School: 10, Entertainment: 8, Airtime: 5, Personal: 5, Income: 0,
};

interface FixedExpense { id: string; name: string; category: Category; amount: number; }
interface IncomeSource { id: string; name: string; type: string; monthly: number; }

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile, loading } = useAuth();
  const { refresh: refreshFinance } = useFinance();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 2
  const [fullName, setFullName] = useState("");
  const [university, setUniversity] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("undergrad-1");
  const [course, setCourse] = useState("");
  const [country, setCountry] = useState("South Africa");
  const [currency, setCurrency] = useState("ZAR");

  // Step 3
  const [startingBalance, setStartingBalance] = useState<number>(0);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [incomeType, setIncomeType] = useState("NSFAS");
  const [payday, setPayday] = useState<number>(25);

  // Step 4
  const [budgetTotal, setBudgetTotal] = useState<number>(0);
  const [split, setSplit] = useState<Record<Category, number>>({ ...DEFAULT_SPLIT });
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([
    { id: "fx1", name: "Rent / residence", category: "Rent", amount: 0 },
  ]);
  const [goalName, setGoalName] = useState("New Laptop");
  const [goalTarget, setGoalTarget] = useState<number>(10000);
  const [goalDeadline, setGoalDeadline] = useState<string>("");
  const [goalPriority, setGoalPriority] = useState<"High" | "Medium" | "Low">("High");
  const [notif, setNotif] = useState({ alerts: true, weekly: true, milestones: true });

  useEffect(() => {
    if (!loading && !user) navigate("/login");
    if (profile) {
      setFullName(profile.full_name ?? "");
      if (profile.onboarded_at) navigate("/dashboard");
    }
  }, [profile, user, loading, navigate]);

  // Auto-derive budget total from income if user hasn't typed one yet
  useEffect(() => {
    if (budgetTotal === 0 && monthlyIncome > 0) setBudgetTotal(Math.round(monthlyIncome * 0.85));
  }, [monthlyIncome, budgetTotal]);

  const splitTotal = Object.values(split).reduce((a, b) => a + b, 0) - split.Income;

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const submit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      // 1. Profile
      setAppCurrency(currency);
      const { error: pErr } = await supabase.from("profiles").update({
        full_name: fullName,
        university,
        year_of_study: yearOfStudy,
        course,
        country,
        currency,
        payday,
        notif_budget_alerts: notif.alerts,
        notif_weekly_summary: notif.weekly,
        notif_goal_milestones: notif.milestones,
        onboarded_at: new Date().toISOString(),
      }).eq("id", user.id);
      if (pErr) throw pErr;

      // 2. Income source
      if (monthlyIncome > 0) {
        await supabase.from("income_sources").insert({
          user_id: user.id, name: incomeType, type: incomeType, monthly_amount: monthlyIncome,
        });
      }

      // 3. Budget rows
      const budgetInserts = CATEGORIES.map((cat) => ({
        user_id: user.id,
        category: cat,
        allocated: Math.round((budgetTotal * (split[cat] || 0)) / 100),
      })).filter((b) => b.allocated > 0);
      if (budgetInserts.length) await supabase.from("budgets_v2").insert(budgetInserts);

      // 4. Fixed expenses → also seed transactions for current month
      const today = new Date().toISOString().slice(0, 10);
      const fxRows = fixedExpenses.filter((f) => f.amount > 0 && f.name.trim());
      if (fxRows.length) {
        await supabase.from("fixed_expenses").insert(
          fxRows.map((f) => ({ user_id: user.id, name: f.name, category: f.category, amount: f.amount, day_of_month: payday })),
        );
      }

      // 5. Seed transactions: opening balance, this month's income, fixed expenses
      const txRows: any[] = [];
      if (startingBalance > 0) {
        txRows.push({ user_id: user.id, date: today, description: "Opening balance", category: "Income", amount: startingBalance, type: "income", method: "EFT", status: "Cleared" });
      }
      if (monthlyIncome > 0) {
        txRows.push({ user_id: user.id, date: today, description: `${incomeType} — this month`, category: "Income", amount: monthlyIncome, type: "income", method: "EFT", status: "Cleared" });
      }
      fxRows.forEach((f) => {
        txRows.push({ user_id: user.id, date: today, description: f.name, category: f.category, amount: f.amount, type: "expense", method: "EFT", status: "Cleared" });
      });
      if (txRows.length) await supabase.from("transactions_v2").insert(txRows);

      // 6. First goal
      if (goalName.trim() && goalTarget > 0) {
        const months = goalDeadline
          ? Math.max(1, Math.ceil((new Date(goalDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)))
          : 12;
        await supabase.from("goals_v2").insert({
          user_id: user.id, name: goalName, target: goalTarget,
          deadline: goalDeadline || null, priority: goalPriority,
          monthly: Math.round(goalTarget / months),
        });
      }

      await refreshProfile();
      await refreshFinance();
      toast.success("You're all set!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background gradient-hero py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Logo />
          <div className="text-sm text-muted-foreground">Step {step} of 4</div>
        </div>

        {/* Progress */}
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-8">
          <div className="h-full gradient-primary transition-all" style={{ width: `${(step / 4) * 100}%` }} />
        </div>

        <div className="card-elevated p-6 lg:p-8 animate-fade-in">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display font-bold text-2xl">Welcome to Stipend 👋</h2>
                <p className="text-muted-foreground text-sm mt-1">Let's get your dashboard personalised in a few quick steps.</p>
              </div>
              <ul className="space-y-3 text-sm">
                {[
                  "Tell us about you and pick your currency",
                  "Add your starting balance and income",
                  "Set a budget split, fixed costs, and your first savings goal",
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-bold">{i + 1}</span>
                    <span className="text-muted-foreground pt-0.5">{t}</span>
                  </li>
                ))}
              </ul>
              <Button onClick={next} className="w-full h-11 mt-2">Get started <ChevronRight className="h-4 w-4 ml-1" /></Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display font-bold text-xl">About you</h2>
              <div className="space-y-1.5">
                <Label>Full name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Thando Mokoena" className="h-11" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>University / school</Label>
                  <Input value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="UCT" className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label>Year of study</Label>
                  <Select value={yearOfStudy} onValueChange={setYearOfStudy}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="highschool">High school</SelectItem>
                      <SelectItem value="undergrad-1">1st year</SelectItem>
                      <SelectItem value="undergrad-2">2nd year</SelectItem>
                      <SelectItem value="undergrad-3">3rd year</SelectItem>
                      <SelectItem value="undergrad-4">4th year</SelectItem>
                      <SelectItem value="postgrad">Postgraduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Course / field of study (optional)</Label>
                <Input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Computer Science" className="h-11" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Country</Label>
                  <Input value={country} onChange={(e) => setCountry(e.target.value)} className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-display font-bold text-xl">Your money basics</h2>
              <p className="text-sm text-muted-foreground -mt-2">We'll seed your dashboard with this so it isn't empty.</p>

              <div className="space-y-1.5">
                <Label>Current balance</Label>
                <Input type="number" min="0" value={startingBalance || ""} onChange={(e) => setStartingBalance(parseFloat(e.target.value) || 0)} placeholder="0" className="h-11 font-semibold" />
                <p className="text-xs text-muted-foreground">How much cash do you have on hand right now?</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Main income source</Label>
                  <Select value={incomeType} onValueChange={setIncomeType}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NSFAS">NSFAS</SelectItem>
                      <SelectItem value="Bursary">Bursary</SelectItem>
                      <SelectItem value="Parents">Parents / family</SelectItem>
                      <SelectItem value="Part-time job">Part-time job</SelectItem>
                      <SelectItem value="Side hustle">Side hustle</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Monthly amount</Label>
                  <Input type="number" min="0" value={monthlyIncome || ""} onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)} placeholder="0" className="h-11 font-semibold" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Payday (day of the month)</Label>
                <Input type="number" min="1" max="31" value={payday} onChange={(e) => setPayday(parseInt(e.target.value) || 1)} className="h-11 w-32" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h2 className="font-display font-bold text-xl">Budget, fixed costs & first goal</h2>

              <div className="space-y-1.5">
                <Label>Monthly budget total</Label>
                <Input type="number" min="0" value={budgetTotal || ""} onChange={(e) => setBudgetTotal(parseFloat(e.target.value) || 0)} className="h-11 font-semibold" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Category split</Label>
                  <span className={`text-xs font-semibold ${splitTotal === 100 ? "text-success" : "text-warning"}`}>{splitTotal}% allocated</span>
                </div>
                {CATEGORIES.map((cat) => (
                  <div key={cat} className="flex items-center gap-3">
                    <div className="w-24 text-sm">{cat}</div>
                    <Slider value={[split[cat]]} onValueChange={(v) => setSplit({ ...split, [cat]: v[0] })} max={100} step={1} className="flex-1" />
                    <div className="w-12 text-right text-sm font-semibold tabular-nums">{split[cat]}%</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <Label>Fixed monthly expenses</Label>
                  <Button type="button" size="sm" variant="outline" onClick={() => setFixedExpenses([...fixedExpenses, { id: `fx${Date.now()}`, name: "", category: "Personal", amount: 0 }])}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add
                  </Button>
                </div>
                {fixedExpenses.map((fx, i) => (
                  <div key={fx.id} className="grid grid-cols-[1fr_120px_100px_auto] gap-2">
                    <Input placeholder="Name (e.g. Netflix)" value={fx.name} onChange={(e) => { const c = [...fixedExpenses]; c[i].name = e.target.value; setFixedExpenses(c); }} className="h-10" />
                    <Select value={fx.category} onValueChange={(v) => { const c = [...fixedExpenses]; c[i].category = v as Category; setFixedExpenses(c); }}>
                      <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                    <Input type="number" min="0" placeholder="0" value={fx.amount || ""} onChange={(e) => { const c = [...fixedExpenses]; c[i].amount = parseFloat(e.target.value) || 0; setFixedExpenses(c); }} className="h-10" />
                    <Button type="button" size="icon" variant="ghost" onClick={() => setFixedExpenses(fixedExpenses.filter((_, idx) => idx !== i))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2 border-t border-border">
                <Label>Your first savings goal</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Goal name" value={goalName} onChange={(e) => setGoalName(e.target.value)} className="h-10" />
                  <Input type="number" min="0" placeholder="Target amount" value={goalTarget || ""} onChange={(e) => setGoalTarget(parseFloat(e.target.value) || 0)} className="h-10" />
                  <Input type="date" value={goalDeadline} onChange={(e) => setGoalDeadline(e.target.value)} className="h-10" />
                  <Select value={goalPriority} onValueChange={(v) => setGoalPriority(v as any)}>
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High priority</SelectItem>
                      <SelectItem value="Medium">Medium priority</SelectItem>
                      <SelectItem value="Low">Low priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-border">
                <Label>Notifications</Label>
                {[
                  { k: "alerts", label: "Budget alerts when you're close to overspending" },
                  { k: "weekly", label: "Weekly summary email" },
                  { k: "milestones", label: "Goal milestone celebrations" },
                ].map((n) => (
                  <div key={n.k} className="flex items-center justify-between">
                    <span className="text-sm">{n.label}</span>
                    <Switch checked={notif[n.k as keyof typeof notif]} onCheckedChange={(v) => setNotif({ ...notif, [n.k]: v })} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step > 1 && (
            <div className="mt-8 flex gap-3">
              <Button type="button" variant="outline" onClick={back} className="flex-1 h-11">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              {step < 4 ? (
                <Button type="button" onClick={next} className="flex-1 h-11">
                  Continue <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button type="button" onClick={submit} disabled={submitting} className="flex-1 h-11">
                  {submitting ? "Setting up…" : (<>Finish <Check className="h-4 w-4 ml-1" /></>)}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
