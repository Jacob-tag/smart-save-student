import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import {
  transactions as seedTransactions,
  budgets as seedBudgets,
  goals as seedGoals,
  type Transaction,
  type Category,
} from "@/lib/mock-data";

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
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  totalSaved: number;
  totalSavingsTarget: number;
  savingsProgress: number;
  addTransaction: (t: Omit<Transaction, "id" | "status"> & { status?: Transaction["status"] }) => void;
  setBudgetTotal: (total: number) => void;
  addGoal: (g: Omit<Goal, "id" | "saved">) => void;
  contributeToGoal: (id: string, amount: number) => void;
  reset: () => void;
}

const STORAGE_KEY = "stipend.finance.v1";

const FinanceContext = createContext<FinanceState | null>(null);

interface PersistShape {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
}

function load(): PersistShape {
  if (typeof window === "undefined") {
    return { transactions: seedTransactions, budgets: seedBudgets, goals: seedGoals };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { transactions: seedTransactions, budgets: seedBudgets, goals: seedGoals };
    const parsed = JSON.parse(raw) as PersistShape;
    return {
      transactions: parsed.transactions ?? seedTransactions,
      budgets: parsed.budgets ?? seedBudgets,
      goals: parsed.goals ?? seedGoals,
    };
  } catch {
    return { transactions: seedTransactions, budgets: seedBudgets, goals: seedGoals };
  }
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const initial = load();
  const [transactions, setTransactions] = useState<Transaction[]>(initial.transactions);
  const [budgets, setBudgets] = useState<Budget[]>(initial.budgets);
  const [goals, setGoals] = useState<Goal[]>(initial.goals);

  // Persist
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ transactions, budgets, goals } satisfies PersistShape),
    );
  }, [transactions, budgets, goals]);

  // Recompute budget "spent" from transactions for current month-ish (just by category over all txns we have)
  useEffect(() => {
    setBudgets((prev) =>
      prev.map((b) => {
        const spent = transactions
          .filter((t) => t.type === "expense" && t.category === b.category)
          .reduce((s, t) => s + t.amount, 0);
        return { ...b, spent };
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions.length]);

  const totals = useMemo(() => {
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
    const totalSavingsTarget = goals.reduce((s, g) => s + g.target, 0);
    const savingsProgress = totalSavingsTarget > 0 ? Math.round((totalSaved / totalSavingsTarget) * 100) : 0;
    return { totalIncome, totalExpenses, balance, totalSaved, totalSavingsTarget, savingsProgress };
  }, [transactions, goals]);

  const addTransaction = useCallback<FinanceState["addTransaction"]>((t) => {
    const tx: Transaction = {
      id: `t${Date.now()}`,
      status: t.status ?? "Cleared",
      ...t,
    } as Transaction;
    setTransactions((prev) => [tx, ...prev]);
  }, []);

  const setBudgetTotal = useCallback((total: number) => {
    setBudgets((prev) => {
      const currentTotal = prev.reduce((s, b) => s + b.allocated, 0) || 1;
      const ratio = total / currentTotal;
      return prev.map((b) => ({ ...b, allocated: Math.round(b.allocated * ratio) }));
    });
  }, []);

  const addGoal = useCallback<FinanceState["addGoal"]>((g) => {
    setGoals((prev) => [...prev, { ...g, id: `g${Date.now()}`, saved: 0 }]);
  }, []);

  const contributeToGoal = useCallback((id: string, amount: number) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, saved: Math.min(g.target, g.saved + amount) } : g)));
  }, []);

  const reset = useCallback(() => {
    setTransactions(seedTransactions);
    setBudgets(seedBudgets);
    setGoals(seedGoals);
  }, []);

  const value: FinanceState = {
    transactions,
    budgets,
    goals,
    ...totals,
    addTransaction,
    setBudgetTotal,
    addGoal,
    contributeToGoal,
    reset,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within a FinanceProvider");
  return ctx;
}

// Build last-6-months trend from transactions
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
