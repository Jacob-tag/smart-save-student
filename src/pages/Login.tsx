import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, TrendingUp, Wallet } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate("/dashboard");
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (result.error) toast.error("Could not sign in with Google");
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-16">
        <div className="w-full max-w-md animate-fade-in">
          <Logo />
          <div className="mt-10">
            <h1 className="font-display font-bold text-3xl tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Sign in to keep your money on track.</p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.ac.za" className="h-12" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-12" required />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 text-base shadow-glow">
              {loading ? "Signing in…" : "Sign in"}
            </Button>

            <Button type="button" onClick={handleGoogle} variant="outline" className="w-full h-12 gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">Create one</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 relative overflow-hidden gradient-primary text-primary-foreground">
        <div className="absolute inset-0 gradient-hero opacity-60" />
        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          <div className="flex items-center gap-2 text-sm font-semibold opacity-90">
            <ShieldCheck className="h-5 w-5" /> Bank-level security
          </div>
          <div className="space-y-6 max-w-md">
            <h2 className="font-display font-bold text-4xl xl:text-5xl leading-[1.1]">Money clarity, built for student life.</h2>
            <p className="opacity-90 text-lg leading-relaxed">Track every rand, smash savings goals, and never overspend on takeaways again.</p>
            <div className="grid grid-cols-2 gap-3 mt-8">
              {[{ icon: Wallet, label: "Smart budgeting" }, { icon: TrendingUp, label: "Live insights" }, { icon: ShieldCheck, label: "Encrypted data" }, { icon: Wallet, label: "Goal tracking" }].map((f, i) => (
                <div key={i} className="rounded-2xl bg-white/10 backdrop-blur p-4 border border-white/15">
                  <f.icon className="h-5 w-5 mb-2 opacity-90" />
                  <div className="text-sm font-semibold">{f.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs opacity-75">© 2025 Stipend Finance — built for students 🇿🇦</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
