import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GraduationCap, Lock, LogOut, Mail, Moon } from "lucide-react";
import { PasswordInput } from "@/components/PasswordInput";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Settings = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <AppShell title="Profile & Settings" subtitle="Manage your account and preferences">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="card-elevated p-6 lg:col-span-1 text-center relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-24 gradient-primary" />
          <div className="relative">
            <Avatar className="h-24 w-24 mx-auto ring-4 ring-card shadow-elevated">
              <AvatarFallback className="bg-secondary text-2xl font-display font-bold text-primary">TM</AvatarFallback>
            </Avatar>
            <div className="mt-4 font-display font-bold text-xl">Thando Mokoena</div>
            <div className="text-sm text-muted-foreground">thando.m@myuct.ac.za</div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-left">
              <div className="rounded-xl bg-secondary/60 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">University</div>
                <div className="text-sm font-semibold flex items-center gap-1.5 mt-0.5">
                  <GraduationCap className="h-4 w-4 text-primary" /> UCT
                </div>
              </div>
              <div className="rounded-xl bg-secondary/60 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Year</div>
                <div className="text-sm font-semibold mt-0.5">3rd year</div>
              </div>
            </div>

            <Button variant="outline" className="mt-5 w-full gap-2 text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>

        {/* Settings */}
        <div className="lg:col-span-2 space-y-6">
          <form className="card-elevated p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Profile updated"); }}>
            <h3 className="font-display font-bold text-lg">Personal information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fn">Full name</Label>
                <Input id="fn" defaultValue="Thando Mokoena" className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="em">Email</Label>
                <Input id="em" type="email" defaultValue="thando.m@myuct.ac.za" className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="uni">University / College</Label>
                <Input id="uni" defaultValue="University of Cape Town" className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="course">Course</Label>
                <Input id="course" defaultValue="BSc Computer Science" className="h-11" />
              </div>
            </div>
            <Button type="submit">Save changes</Button>
          </form>

          <div className="card-elevated p-6">
            <h3 className="font-display font-bold text-lg mb-4">Preferences</h3>
            <ul className="divide-y divide-border">
              {[
                { icon: Mail, title: "Email alerts", desc: "Weekly summary & important alerts", state: true },
                { icon: Moon, title: "Dark mode", desc: "Easier on the eyes at night", controlled: true },
                { icon: Lock, title: "Two-factor authentication", desc: "Add an extra security layer", state: false },
              ].map((p, i) => (
                <li key={i} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="h-10 w-10 rounded-xl bg-secondary grid place-items-center text-primary">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{p.desc}</div>
                  </div>
                  {p.controlled
                    ? <Switch checked={dark} onCheckedChange={setDark} />
                    : <Switch defaultChecked={p.state} />}
                </li>
              ))}
            </ul>
          </div>

          <form className="card-elevated p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Password updated"); }}>
            <h3 className="font-display font-bold text-lg">Change password</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <PasswordInput id="cp" label="Current password" className="h-11" />
              <PasswordInput id="np" label="New password" className="h-11" />
            </div>
            <Button type="submit" variant="outline">Update password</Button>
          </form>
        </div>
      </div>
    </AppShell>
  );
};

export default Settings;
