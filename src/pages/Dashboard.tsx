import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { BudgetStatus } from "@/components/dashboard/BudgetStatus";
import { GoalsPreview } from "@/components/dashboard/GoalsPreview";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { ArrowDownCircle, ArrowUpCircle, PiggyBank, Wallet } from "lucide-react";
import { summary, formatZAR } from "@/lib/mock-data";

const Dashboard = () => {
  return (
    <AppShell title="Welcome back, Thando 👋" subtitle="Here's how your money is doing this month">
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total income"
          value={formatZAR(summary.income)}
          change={summary.incomeChange}
          icon={ArrowDownCircle}
          tone="success"
          spark={[{ v: 4 }, { v: 6 }, { v: 5 }, { v: 8 }, { v: 7 }, { v: 10 }, { v: 12 }]}
        />
        <StatCard
          label="Total expenses"
          value={formatZAR(summary.expenses)}
          change={summary.expensesChange}
          icon={ArrowUpCircle}
          tone="warm"
          spark={[{ v: 9 }, { v: 7 }, { v: 8 }, { v: 6 }, { v: 7 }, { v: 5 }, { v: 6 }]}
        />
        <StatCard
          label="Remaining balance"
          value={formatZAR(summary.balance)}
          change={summary.balanceChange}
          icon={Wallet}
          tone="primary"
          spark={[{ v: 3 }, { v: 4 }, { v: 6 }, { v: 5 }, { v: 7 }, { v: 8 }, { v: 11 }]}
        />
        <StatCard
          label="Savings progress"
          value={`${summary.savingsProgress}%`}
          change={summary.savingsChange}
          icon={PiggyBank}
          tone="warning"
          spark={[{ v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }, { v: 9 }]}
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
