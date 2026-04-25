export const formatZAR = (n: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(n);

export const formatZARDecimal = (n: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(n);

export type Category =
  | "Food"
  | "Transport"
  | "Rent"
  | "Airtime"
  | "Entertainment"
  | "School"
  | "Personal"
  | "Income";

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: "hsl(var(--cat-1))",
  Transport: "hsl(var(--cat-2))",
  Rent: "hsl(var(--cat-3))",
  Airtime: "hsl(var(--cat-4))",
  Entertainment: "hsl(var(--cat-5))",
  School: "hsl(var(--cat-6))",
  Personal: "hsl(var(--cat-7))",
  Income: "hsl(var(--success))",
};

export const summary = {
  income: 14500,
  expenses: 9320,
  balance: 5180,
  savingsProgress: 62,
  incomeChange: 8.4,
  expensesChange: -3.1,
  balanceChange: 12.7,
  savingsChange: 5.2,
};

export const monthlyTrend = [
  { month: "Jan", income: 12000, expenses: 8800 },
  { month: "Feb", income: 12500, expenses: 9100 },
  { month: "Mar", income: 13000, expenses: 8600 },
  { month: "Apr", income: 13800, expenses: 9400 },
  { month: "May", income: 14200, expenses: 9000 },
  { month: "Jun", income: 14500, expenses: 9320 },
];

export const categorySpend: { name: Category; value: number }[] = [
  { name: "Food", value: 2850 },
  { name: "Transport", value: 1420 },
  { name: "Rent", value: 3200 },
  { name: "Airtime", value: 480 },
  { name: "Entertainment", value: 620 },
  { name: "School", value: 540 },
  { name: "Personal", value: 210 },
];

export const budgets = [
  { category: "Food" as Category, allocated: 3000, spent: 2850 },
  { category: "Transport" as Category, allocated: 1200, spent: 1420 },
  { category: "Rent" as Category, allocated: 3200, spent: 3200 },
  { category: "School" as Category, allocated: 800, spent: 540 },
  { category: "Entertainment" as Category, allocated: 700, spent: 620 },
  { category: "Personal" as Category, allocated: 500, spent: 210 },
];

export const goals = [
  {
    id: "g1",
    name: "New Laptop",
    target: 12000,
    saved: 4500,
    deadline: "2025-12-15",
    priority: "High" as const,
    monthly: 950,
  },
  {
    id: "g2",
    name: "Vacation Fund",
    target: 8000,
    saved: 2100,
    deadline: "2026-04-10",
    priority: "Medium" as const,
    monthly: 500,
  },
  {
    id: "g3",
    name: "Emergency Fund",
    target: 5000,
    saved: 3850,
    deadline: "2025-09-30",
    priority: "High" as const,
    monthly: 400,
  },
  {
    id: "g4",
    name: "New Phone",
    target: 9500,
    saved: 1200,
    deadline: "2026-02-01",
    priority: "Low" as const,
    monthly: 700,
  },
];

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: Category;
  amount: number;
  type: "income" | "expense";
  method: "Card" | "Cash" | "EFT" | "App";
  status: "Cleared" | "Pending";
}

export const transactions: Transaction[] = [
  { id: "t1", date: "2025-06-22", description: "Woolworths groceries", category: "Food", amount: 412, type: "expense", method: "Card", status: "Cleared" },
  { id: "t2", date: "2025-06-22", description: "NSFAS allowance", category: "Income", amount: 5800, type: "income", method: "EFT", status: "Cleared" },
  { id: "t3", date: "2025-06-21", description: "Uber to campus", category: "Transport", amount: 86, type: "expense", method: "App", status: "Cleared" },
  { id: "t4", date: "2025-06-20", description: "MTN airtime top-up", category: "Airtime", amount: 100, type: "expense", method: "App", status: "Cleared" },
  { id: "t5", date: "2025-06-19", description: "Netflix subscription", category: "Entertainment", amount: 159, type: "expense", method: "Card", status: "Cleared" },
  { id: "t6", date: "2025-06-18", description: "Textbook — Calculus II", category: "School", amount: 540, type: "expense", method: "EFT", status: "Cleared" },
  { id: "t7", date: "2025-06-17", description: "Tutoring side gig", category: "Income", amount: 1200, type: "income", method: "EFT", status: "Cleared" },
  { id: "t8", date: "2025-06-16", description: "Res rent — June", category: "Rent", amount: 3200, type: "expense", method: "EFT", status: "Cleared" },
  { id: "t9", date: "2025-06-15", description: "Coffee with friends", category: "Food", amount: 78, type: "expense", method: "Card", status: "Cleared" },
  { id: "t10", date: "2025-06-14", description: "Gym membership", category: "Personal", amount: 210, type: "expense", method: "Card", status: "Pending" },
];

export const notifications = [
  { id: "n1", title: "Food budget exceeded", body: "You've spent 95% of your June food budget.", type: "warning" as const, time: "2h ago", unread: true },
  { id: "n2", title: "Savings milestone reached", body: "Emergency Fund hit 77% of target — keep going!", type: "success" as const, time: "1d ago", unread: true },
  { id: "n3", title: "Monthly report ready", body: "Your June 2025 financial summary is available.", type: "info" as const, time: "2d ago", unread: false },
  { id: "n4", title: "Rent payment reminder", body: "Res rent of R3,200 due in 3 days.", type: "info" as const, time: "3d ago", unread: false },
  { id: "n5", title: "Smart tip", body: "Cutting takeaways twice/week could save you R640/mo.", type: "tip" as const, time: "5d ago", unread: false },
];
