import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { formatZAR } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFinance, type Goal } from "@/context/FinanceContext";
import { toast } from "sonner";

function GoalCard({ g, onContribute }: { g: Goal; onContribute: (id: string) => void }) {
  const pct = g.target > 0 ? Math.round((g.saved / g.target) * 100) : 0;
  const remaining = Math.max(0, g.target - g.saved);
  const monthsLeft = Math.max(1, Math.ceil(remaining / Math.max(1, g.monthly)));
  const deadline = new Date(g.deadline);
  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const tone =
    g.priority === "High" ? "from-primary to-primary-glow" :
    g.priority === "Medium" ? "from-[hsl(var(--cat-2))] to-[hsl(var(--cat-6))]" :
    "from-[hsl(var(--cat-7))] to-[hsl(var(--cat-4))]";

  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="card-elevated p-6 hover:shadow-floating transition-shadow group">
      <div className="flex items-start gap-5">
        <div className="relative shrink-0">
          <svg width="110" height="110" viewBox="0 0 110 110">
            <defs>
              <linearGradient id={`grad-${g.id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--success))" />
              </linearGradient>
            </defs>
            <circle cx="55" cy="55" r={radius} stroke="hsl(var(--secondary))" strokeWidth="9" fill="none" />
            <circle
              cx="55" cy="55" r={radius}
              stroke={`url(#grad-${g.id})`}
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 55 55)"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="font-display font-bold text-xl">{pct}%</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Saved</div>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-display font-bold text-lg leading-tight">{g.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {daysLeft > 0 ? `${daysLeft} days left` : "Past deadline"}
              </div>
            </div>
            <span className={cn("stat-pill text-white bg-gradient-to-r", tone)}>
              {g.priority}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Saved</div>
              <div className="font-semibold tabular-nums">{formatZAR(g.saved)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Target</div>
              <div className="font-semibold tabular-nums">{formatZAR(g.target)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Remaining</div>
              <div className="font-semibold tabular-nums">{formatZAR(remaining)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Est. completion</div>
              <div className="font-semibold tabular-nums">{monthsLeft} mo</div>
            </div>
          </div>

          <Button size="sm" variant="outline" className="mt-4 gap-1.5" onClick={() => onContribute(g.id)}>
            <Plus className="h-3.5 w-3.5" /> Add contribution
          </Button>
        </div>
      </div>
    </div>
  );
}

const Goals = () => {
  const { goals, addGoal, contributeToGoal } = useFinance();

  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<Goal["priority"]>("High");
  const [monthly, setMonthly] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const t = parseFloat(target);
    const m = parseFloat(monthly);
    if (!name.trim()) return toast.error("Goal needs a name");
    if (!t || t <= 0) return toast.error("Enter a target amount");
    if (!deadline) return toast.error("Pick a deadline");
    addGoal({ name: name.trim().slice(0, 60), target: t, deadline, priority, monthly: m || 0 });
    toast.success("Goal created", { description: `${name} · ${formatZAR(t)}` });
    setName(""); setTarget(""); setDeadline(""); setMonthly(""); setPriority("High");
  };

  const handleContribute = (id: string) => {
    const raw = window.prompt("How much would you like to add?");
    if (!raw) return;
    const amt = parseFloat(raw);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");
    contributeToGoal(id, amt);
    toast.success("Contribution added", { description: `+ ${formatZAR(amt)}` });
  };

  return (
    <AppShell title="Savings Goals" subtitle="Build the future, one rand at a time">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form className="card-elevated p-6 lg:col-span-1 space-y-4 h-fit lg:sticky lg:top-24" onSubmit={handleCreate}>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg">Create a goal</h3>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="gname">Goal name</Label>
            <Input id="gname" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Study abroad" maxLength={60} className="h-11" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="gtarget">Target amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">R</span>
              <Input id="gtarget" type="number" min="0" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="0" className="pl-7 h-11 font-semibold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="gdate">Deadline</Label>
              <Input id="gdate" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Goal["priority"])}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="gmonthly">Monthly contribution</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">R</span>
              <Input id="gmonthly" type="number" min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="0" className="pl-7 h-11" />
            </div>
          </div>

          <Button type="submit" className="w-full h-11">Create goal</Button>
        </form>

        <div className="lg:col-span-2 grid grid-cols-1 xl:grid-cols-2 gap-4">
          {goals.map((g) => <GoalCard key={g.id} g={g} onContribute={handleContribute} />)}
          {goals.length === 0 && (
            <div className="card-elevated p-10 text-center text-muted-foreground xl:col-span-2">
              No goals yet. Create your first one to get started.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default Goals;
