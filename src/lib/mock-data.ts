// Shared types, category color map, and currency formatter used across the app.
// The seed transaction/budget/goal data was removed — every user's data now
// comes from Lovable Cloud via FinanceContext.

export type Category =
  | "Food"
  | "Transport"
  | "Rent"
  | "Airtime"
  | "Entertainment"
  | "School"
  | "Personal"
  | "Income";

export const CATEGORIES: Category[] = [
  "Food",
  "Transport",
  "Rent",
  "Airtime",
  "Entertainment",
  "School",
  "Personal",
];

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

// ----- Currency -----------------------------------------------------------
// A single mutable currency code drives every formatZAR call across the app.
// AuthContext sets it from the signed-in user's profile.
let CURRENT_CURRENCY = "ZAR";
let CURRENT_LOCALE = "en-ZA";
const LOCALE_FOR: Record<string, string> = {
  ZAR: "en-ZA",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  NGN: "en-NG",
  KES: "en-KE",
  GHS: "en-GH",
  AUD: "en-AU",
  CAD: "en-CA",
};

export function setAppCurrency(code: string) {
  if (!code) return;
  CURRENT_CURRENCY = code;
  CURRENT_LOCALE = LOCALE_FOR[code] ?? "en-US";
}

export function getAppCurrency() {
  return CURRENT_CURRENCY;
}

// Kept the name "formatZAR" for backwards compatibility with existing pages —
// it now formats in whatever currency the user picked at signup.
export const formatZAR = (n: number) =>
  new Intl.NumberFormat(CURRENT_LOCALE, {
    style: "currency",
    currency: CURRENT_CURRENCY,
    maximumFractionDigits: 0,
  }).format(n);

export const formatZARDecimal = (n: number) =>
  new Intl.NumberFormat(CURRENT_LOCALE, {
    style: "currency",
    currency: CURRENT_CURRENCY,
    minimumFractionDigits: 2,
  }).format(n);

// ----- Data shapes --------------------------------------------------------
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

// Empty seeds — FinanceContext loads the real values from Cloud per user.
export const transactions: Transaction[] = [];
export const budgets: { category: Category; allocated: number; spent: number }[] = [];
export const goals: {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string;
  priority: "High" | "Medium" | "Low";
  monthly: number;
}[] = [];

// Static notifications (UI-only mock — not persisted yet)
export const notifications = [
  { id: "n1", title: "Welcome to Stipend", body: "Add your first transaction to get started.", type: "info" as const, time: "just now", unread: true },
  { id: "n2", title: "Smart tip", body: "Setting a weekly food budget makes spending predictable.", type: "tip" as const, time: "today", unread: true },
];
