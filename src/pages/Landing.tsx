import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  CheckCircle2,
} from "lucide-react";

const features = [
  { icon: Wallet, title: "Track every rand", desc: "Log income, expenses, and balances in seconds. Built for the way students actually spend." },
  { icon: BarChart3, title: "Beautiful insights", desc: "See exactly where your money goes with live charts, trends, and category breakdowns." },
  { icon: Target, title: "Crush your goals", desc: "Set savings goals — laptop, vacation, emergency fund — and watch them progress." },
  { icon: PiggyBank, title: "Smart budgets", desc: "Allocate per category and get warned before you blow your budget. No more end-of-month panic." },
  { icon: Sparkles, title: "AI suggestions", desc: "Get weekly tips tailored to your spending patterns and student lifestyle." },
  { icon: ShieldCheck, title: "Private by design", desc: "Your data stays yours — encrypted, never sold, never shared." },
];

const stats = [
  { value: "20K+", label: "Students saving" },
  { value: "R12M", label: "Tracked monthly" },
  { value: "4.9★", label: "Average rating" },
  { value: "62%", label: "Avg. savings boost" },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/"><Logo /></Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="h-10">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="h-10 shadow-soft">
              <Link to="/register">Sign up free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-16 lg:pt-24 pb-20 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Built for students, by students
              </span>
              <h1 className="mt-5 font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05]">
                Money clarity,<br />
                <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  built for student life.
                </span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground max-w-lg leading-relaxed">
                Stipend helps you track expenses, plan budgets, and hit savings goals — all in one beautifully simple app. No spreadsheets. No stress.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="h-12 px-6 text-base shadow-glow">
                  <Link to="/register">
                    Get started free <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
                  <Link to="/login">I already have an account</Link>
                </Button>
              </div>

              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {["Free forever", "No credit card", "Setup in 60 seconds"].map((f) => (
                  <li key={f} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-success" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Hero card mock */}
            <div className="relative animate-scale-in">
              <div className="absolute -inset-6 gradient-primary opacity-20 blur-3xl rounded-[3rem]" />
              <div className="relative card-elevated p-6 lg:p-7 shadow-floating">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available balance</div>
                    <div className="font-display font-extrabold text-3xl lg:text-4xl mt-1 tabular-nums">R 5,180</div>
                  </div>
                  <span className="stat-pill bg-success-soft text-success">
                    <TrendingUp className="h-3 w-3" /> 12.7%
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Income</div>
                    <div className="font-display font-bold text-lg mt-1 text-success tabular-nums">+R 14,500</div>
                  </div>
                  <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Expenses</div>
                    <div className="font-display font-bold text-lg mt-1 tabular-nums">−R 9,320</div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-medium">Savings goal · New laptop</span>
                    <span className="font-semibold tabular-nums">37%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full gradient-success rounded-full" style={{ width: "37%" }} />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-3">
                  <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center shrink-0">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="text-xs leading-snug">
                    <span className="font-semibold">Smart tip:</span>{" "}
                    <span className="text-muted-foreground">Skip 2 takeaways this week to save R320.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display font-extrabold text-3xl lg:text-4xl tracking-tight">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-28 bg-secondary/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Features</span>
            <h2 className="mt-3 font-display font-bold text-3xl lg:text-4xl tracking-tight">
              Everything you need to take control of your money.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Designed for students juggling NSFAS, side gigs, rent, and the occasional treat.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="card-elevated p-6 hover:shadow-floating transition-shadow">
                <div className="h-11 w-11 rounded-xl gradient-primary grid place-items-center shadow-soft">
                  <f.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="mt-4 font-display font-bold text-lg">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">How it works</span>
            <h2 className="mt-3 font-display font-bold text-3xl lg:text-4xl tracking-tight">
              Three steps to financial peace of mind.
            </h2>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { n: "01", t: "Create your account", d: "Sign up free in under a minute. No card, no commitment." },
              { n: "02", t: "Add income & expenses", d: "Log your allowance, salary, and every expense. Watch your balance update live." },
              { n: "03", t: "Set goals & save", d: "Create savings goals and let Stipend guide you to hit them every month." },
            ].map((s) => (
              <div key={s.n} className="relative card-elevated p-7">
                <div className="font-display font-extrabold text-5xl text-primary/15">{s.n}</div>
                <h3 className="mt-2 font-display font-bold text-xl">{s.t}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing-ish CTA */}
      <section id="pricing" className="py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl gradient-primary text-primary-foreground p-10 lg:p-14 shadow-floating">
            <div className="absolute inset-0 gradient-hero opacity-50" />
            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="font-display font-extrabold text-3xl lg:text-4xl tracking-tight leading-tight">
                  Start saving smarter today.
                </h2>
                <p className="mt-3 opacity-90 text-lg">
                  Join thousands of students mastering their money with Stipend. Free forever, no strings attached.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:justify-end gap-3">
                <Button asChild size="lg" variant="secondary" className="h-12 px-6 text-base">
                  <Link to="/register">
                    Create free account <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base bg-transparent border-white/40 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
                  <Link to="/login">Log in</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
          </div>
          <div className="text-sm text-muted-foreground">© 2025 Stipend Finance — built for students 🇿🇦</div>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
