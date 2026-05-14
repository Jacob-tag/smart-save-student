import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { BudgetStatus } from "@/components/dashboard/BudgetStatus";
import { GoalsPreview } from "@/components/dashboard/GoalsPreview";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { ArrowDownCircle, ArrowUpCircle, PiggyBank, Wallet } from "lucide-react";
import { formatZAR } from "@/lib/mock-data";
import { useFinance, useMonthlyTrend } from "@/context/FinanceContext";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { totalIncome, totalExpenses, balance, savingsProgress } = useFinance();
  const { profile, user } = useAuth();
  const firstName = (profile?.full_name || user?.email?.split("@")[0] || "there").split(" ")[0];
  const trend = useMonthlyTrend();

  // Compose tiny sparklines from the trend
  const incomeSpark = trend.map((m) => ({ v: m.income }));
  const expenseSpark = trend.map((m) => ({ v: m.expenses }));
  const balanceSpark = trend.map((m) => ({ v: Math.max(0, m.income - m.expenses) }));
  const savingsSpark = trend.map((_, i) => ({ v: i + 1 }));

  return (
    <AppShell title="Welcome back, Thando 👋" subtitle="Here's how your money is doing this month">
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total income"
          value={formatZAR(totalIncome)}
          change={8.4}
          icon={ArrowDownCircle}
          tone="success"
          spark={incomeSpark.length ? incomeSpark : [{ v: 1 }, { v: 2 }]}
        />
        <StatCard
          label="Total expenses"
          value={formatZAR(totalExpenses)}
          change={-3.1}
          icon={ArrowUpCircle}
          tone="warm"
          spark={expenseSpark.length ? expenseSpark : [{ v: 1 }, { v: 2 }]}
        />
        <StatCard
          label="Remaining balance"
          value={formatZAR(balance)}
          change={12.7}
          icon={Wallet}
          tone="primary"
          spark={balanceSpark.length ? balanceSpark : [{ v: 1 }, { v: 2 }]}
        />
        <StatCard
          label="Savings progress"
          value={`${savingsProgress}%`}
          change={5.2}
          icon={PiggyBank}
          tone="warning"
          spark={savingsSpark}
        />
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><SpendingChart /></div>
        <div><CategoryChart /></div>
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3"><BudgetStatus /></div>
        <div className="lg:col-span-2"><GoalsPreview /></div>
      </section>

      <section className="mt-6">
        <RecentTransactions />
      </section>
    </AppShell>
  );
};

export default Dashboard;
