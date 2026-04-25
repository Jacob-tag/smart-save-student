import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  Target,
  BarChart3,
  Bell,
  Settings,
  Sparkles,
} from "lucide-react";

export const NAV_ITEMS = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Income & Expenses", url: "/transactions", icon: ArrowLeftRight, short: "Transactions" },
  { title: "Budget Planner", url: "/budget", icon: PiggyBank, short: "Budget" },
  { title: "Savings Goals", url: "/goals", icon: Target, short: "Goals" },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Smart Insights", url: "/insights", icon: Sparkles },
  { title: "Profile & Settings", url: "/settings", icon: Settings, short: "Settings" },
] as const;

export const PRIMARY_MOBILE_NAV = [
  NAV_ITEMS[0],
  NAV_ITEMS[1],
  NAV_ITEMS[2],
  NAV_ITEMS[3],
  NAV_ITEMS[7],
];
