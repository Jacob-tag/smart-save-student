import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { Category, Transaction } from "@/lib/mock-data";

export interface Budget {
  category: Category;
  allocated: number;
  spent: number;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string;
  priority: "High" | "Medium" | "Low";
  monthly: number;
}

interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  loading: boolean;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  totalSaved: number;
  totalSavingsTarget: number;
  savingsProgress: number;
  addTransaction: (t: Omit<Transaction, "id" | "status"> & { status?: Transaction["status"] }) => Promise<void>;
  setBudgetTotal: (total: number) => Promise<void>;
  addGoal: (g: Omit<Goal, "id" | "saved">) => Promise<void>;
  contributeToGoal: (id: string, amount: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const FinanceContext = createContext<FinanceState | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetRows, setBudgetRows] = useState<{ id: string; category: Category; allocated: number }[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setTransactions([]); setBudgetRows([]); setGoals([]);
      return;
    }
    setLoading(true);
    const [tx, bg, gl] = await Promise.all([
      supabase.from("transactions_v2").select("*").order("date", { ascending: false }),
      supabase.from("budgets_v2").select("*"),
      supabase.from("goals_v2").select("*").order("created_at", { ascending: true }),
    ]);
    if (tx.data) {
      setTransactions(tx.data.map((r: any) => ({
        id: r.id,
        date: r.date,
        description: r.description,
        category: r.category as Category,
        amount: Number(r.amount),
        type: r.type,
        method: r.method,
        status: r.status,
      })));
    }
    if (bg.data) setBudgetRows(bg.data.map((r: any) => ({ id: r.id, category: r.category as Category, allocated: Number(r.allocated) })));
    if (gl.data) {
      setGoals(gl.data.map((r: any) => ({
        id: r.id,
        name: r.name,
        target: Number(r.target),
        saved: Number(r.saved),
        deadline: r.deadline ?? "",
        priority: r.priority,
        monthly: Number(r.monthly),
      })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  // Compute spent per category from transactions
  const budgets: Budget[] = useMemo(() => {
    return budgetRows.map((b) => {
      const spent = transactions
        .filter((t) => t.type === "expense" && t.category === b.category)
        .reduce((s, t) => s + t.amount, 0);
      return { category: b.category, allocated: b.allocated, spent };
    });
  }, [budgetRows, transactions]);

  const totals = useMemo(() => {
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
    const totalSavingsTarget = goals.reduce((s, g) => s + g.target, 0);
    const savingsProgress = totalSavingsTarget > 0 ? Math.round((totalSaved / totalSavingsTarget) * 100) : 0;
    return { totalIncome, totalExpenses, balance, totalSaved, totalSavingsTarget, savingsProgress };
  }, [transactions, goals]);

  const addTransaction: FinanceState["addTransaction"] = async (t) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("transactions_v2")
      .insert({
        user_id: user.id,
        date: t.date,
        description: t.description,
        category: t.category,
        amount: t.amount,
        type: t.type,
        method: t.method,
        status: t.status ?? "Cleared",
      })
      .select()
      .single();
    if (!error && data) {
      setTransactions((prev) => [{
        id: data.id,
        date: data.date,
        description: data.description,
        category: data.category as Category,
        amount: Number(data.amount),
        type: data.type,
        method: data.method,
        status: data.status,
      }, ...prev]);
    }
  };

  const setBudgetTotal: FinanceState["setBudgetTotal"] = async (total) => {
    if (!user || budgetRows.length === 0) return;
    const currentTotal = budgetRows.reduce((s, b) => s + b.allocated, 0) || 1;
    const ratio = total / currentTotal;
    const updates = budgetRows.map((b) => ({ ...b, allocated: Math.round(b.allocated * ratio) }));
    setBudgetRows(updates);
    await Promise.all(
      updates.map((b) =>
        supabase.from("budgets_v2").update({ allocated: b.allocated }).eq("id", b.id),
      ),
    );
  };

  const addGoal: FinanceState["addGoal"] = async (g) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("goals_v2")
      .insert({
        user_id: user.id,
        name: g.name,
        target: g.target,
        deadline: g.deadline || null,
        priority: g.priority,
        monthly: g.monthly,
      })
      .select()
      .single();
    if (!error && data) {
      setGoals((prev) => [...prev, {
        id: data.id, name: data.name, target: Number(data.target), saved: Number(data.saved),
        deadline: data.deadline ?? "", priority: data.priority, monthly: Number(data.monthly),
      }]);
    }
  };

  const contributeToGoal: FinanceState["contributeToGoal"] = async (id, amount) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal || !user) return;
    const newSaved = Math.min(goal.target, goal.saved + amount);
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, saved: newSaved } : g)));
    await supabase.from("goals_v2").update({ saved: newSaved }).eq("id", id);
  };

  return (
    <FinanceContext.Provider
      value={{ transactions, budgets, goals, loading, ...totals, addTransaction, setBudgetTotal, addGoal, contributeToGoal, refresh }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within a FinanceProvider");
  return ctx;
}

export function useMonthlyTrend() {
  const { transactions } = useFinance();
  return useMemo(() => {
    const now = new Date();
    const months: { key: string; label: string; income: number; expenses: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months.push({ key, label: d.toLocaleString("en", { month: "short" }), income: 0, expenses: 0 });
    }
    const byKey = new Map(months.map((m) => [m.key, m]));
    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const bucket = byKey.get(key);
      if (!bucket) return;
      if (t.type === "income") bucket.income += t.amount;
      else bucket.expenses += t.amount;
    });
    return months.map(({ label, income, expenses }) => ({ month: label, income, expenses }));
  }, [transactions]);
}

export function useCategorySpend() {
  const { transactions } = useFinance();
  return useMemo(() => {
    const map = new Map<Category, number>();
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + t.amount));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [transactions]);
}
