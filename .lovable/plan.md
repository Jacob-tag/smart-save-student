## Goal

Replace the dummy dashboard with real per-user data by adding authentication (Lovable Cloud) and a richer signup/onboarding flow whose inputs seed the dashboard, budget, goals, and transactions.

## What we'll collect at signup

Signup becomes a 4-step wizard. Step 1 is the actual account creation; steps 2–4 are onboarding that writes to the user's profile and seeds their financial data.

**Step 1 — Account**
- Full name, email, password, confirm password
- Google sign-in button (alternative to email/password)

**Step 2 — Profile basics** (drives greeting, sidebar avatar, locale)
- University / school
- Year of study (1st–postgrad)
- Course / field of study (optional)
- Country
- Currency (ZAR, USD, EUR, GBP, NGN, KES, GHS, …) — replaces the hardcoded ZAR formatting everywhere

**Step 3 — Money basics** (seeds balance + monthly trend)
- Current balance (starting cash on hand)
- Income source(s): NSFAS / bursary / parents / part-time job / other — multi-select
- Expected monthly income amount
- Income payday (day of month) — used later for predictions

**Step 4 — Budget, fixed costs, first goal** (seeds Budget, Transactions, Goals pages)
- Monthly budget total + % split across Food / Transport / Rent / Airtime / Entertainment / School / Personal (sensible defaults the user can tweak with sliders)
- Fixed monthly expenses: rent, data/airtime, subscriptions (name + amount, repeatable rows)
- One initial savings goal: name, target amount, deadline, priority

**Notification preferences** (small toggle group at the bottom of step 4)
- Budget alerts, weekly summary email, goal milestones

## Data model (Lovable Cloud)

```text
profiles (1:1 with auth.users)
  id, full_name, university, year_of_study, course, country,
  currency, payday, notif_budget_alerts, notif_weekly_summary,
  notif_goal_milestones, onboarded_at

income_sources       user_id, name, type, monthly_amount
fixed_expenses       user_id, name, category, amount, day_of_month
budgets              user_id, category, allocated, period
goals                user_id, name, target, saved, deadline, priority, monthly
transactions         user_id, date, description, category, amount, type, method, status
```

All tables get RLS: `user_id = auth.uid()` for select/insert/update/delete. A trigger on `auth.users` auto-creates the `profiles` row on signup.

## App-level changes

- **Auth context** (`AuthContext.tsx`): wraps app, exposes `user`, `session`, `signIn`, `signUp`, `signInWithGoogle`, `signOut`. Sets up `onAuthStateChange` before `getSession`.
- **Protected routes**: `/dashboard`, `/transactions`, `/budget`, `/goals`, `/reports`, `/notifications`, `/insights`, `/settings` redirect to `/login` if no session.
- **Onboarding gate**: after signup, route to `/onboarding` (the 3-step wizard). On finish, write to all tables and redirect to `/dashboard`. Existing users with `onboarded_at = null` also get sent there once.
- **FinanceContext** is rewritten to read from Lovable Cloud (per-user) instead of localStorage seed data. All mutations (`addTransaction`, `addGoal`, `contributeToGoal`, `setBudgetTotal`) become Cloud writes. Hooks `useMonthlyTrend` and `useCategorySpend` keep their shape so existing chart components don't change.
- **Currency**: replace `formatZAR` with `formatMoney(n, currency)` driven by the profile. Update every usage.
- **Sidebar**: replace hardcoded "Thando Mokoena / UCT • 3rd Year" with profile data + initials avatar; wire the logout button to `signOut()`.
- **Dashboard greeting**: "Welcome back, {first name}".
- **Login / Register pages**: wire to real auth, add Google button, surface errors via toast, redirect through onboarding when needed.
- **Settings**: add a "Profile" section that lets the user edit the same fields they entered at onboarding.

## Empty-state behavior

Per your choice ("Pre-filled from onboarding"):
- Starting balance becomes a single seed transaction of type `income` labelled "Opening balance" dated today.
- Monthly income becomes a recurring income hint shown in trend projections; the first month's income is seeded so charts aren't empty.
- Fixed expenses are inserted as transactions for the current month + saved as recurring rules so future months auto-populate.
- Budget split rows go straight into `budgets`.
- The first goal goes into `goals`.

Result: the moment a new user lands on `/dashboard` it already shows their balance, a populated category pie, a budget-status bar, and a goal ring — no dummy data.

## Implementation order

1. Enable Lovable Cloud + create tables, RLS policies, and the profile-creation trigger.
2. Build `AuthContext` + protected route wrapper + Google sign-in.
3. Rewrite `Login` and `Register` to use real auth.
4. Build `/onboarding` wizard (3 steps, progress bar, validated with zod).
5. Rewrite `FinanceContext` to read/write Cloud per user; replace `formatZAR` with `formatMoney`.
6. Wire sidebar profile + logout, dashboard greeting, settings profile editor.
7. Remove `mock-data.ts` seed exports (keep only the type definitions and category color map).

## Open items for later (not in this plan)

- Email verification customization
- Password reset page
- Receipt OCR storage bucket
- AI-powered insights using the user's real transactions
