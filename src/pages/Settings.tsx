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
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const [dark, setDark] = useState(false);
  const navigate = useNavigate();
  const { user, profile, refreshProfile, signOut } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [course, setCourse] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setUniversity(profile.university ?? "");
      setCourse(profile.course ?? "");
    }
    if (user) setEmail(user.email ?? "");
  }, [profile, user]);

  const initials = (fullName || email || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, university, course })
        .eq("id", user.id);
      if (error) throw error;
      await refreshProfile();
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err.message ?? "Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setUpdatingPassword(true);
    try {
      // Re-authenticate by signing in with the current password
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (reauthError) {
        toast.error("Current password is incorrect");
        return;
      }
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.message ?? "Could not update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <AppShell title="Profile & Settings" subtitle="Manage your account and preferences">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="card-elevated p-6 lg:col-span-1 text-center relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-24 gradient-primary" />
          <div className="relative">
            <Avatar className="h-24 w-24 mx-auto ring-4 ring-card shadow-elevated">
              <AvatarFallback className="bg-secondary text-2xl font-display font-bold text-primary">{initials}</AvatarFallback>
            </Avatar>
            <div className="mt-4 font-display font-bold text-xl">{fullName || "Your name"}</div>
            <div className="text-sm text-muted-foreground">{email}</div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-left">
              <div className="rounded-xl bg-secondary/60 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">University</div>
                <div className="text-sm font-semibold flex items-center gap-1.5 mt-0.5">
                  <GraduationCap className="h-4 w-4 text-primary" /> {university || "—"}
                </div>
              </div>
              <div className="rounded-xl bg-secondary/60 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Year</div>
                <div className="text-sm font-semibold mt-0.5">{profile?.year_of_study ?? "—"}</div>
              </div>
            </div>

            <Button onClick={handleSignOut} variant="outline" className="mt-5 w-full gap-2 text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>

        {/* Settings */}
        <div className="lg:col-span-2 space-y-6">
          <form className="card-elevated p-6 space-y-4" onSubmit={handleProfileSave}>
            <h3 className="font-display font-bold text-lg">Personal information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fn">Full name</Label>
                <Input id="fn" value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="em">Email</Label>
                <Input id="em" type="email" value={email} disabled className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="uni">University / College</Label>
                <Input id="uni" value={university} onChange={(e) => setUniversity(e.target.value)} className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="course">Course</Label>
                <Input id="course" value={course} onChange={(e) => setCourse(e.target.value)} className="h-11" />
              </div>
            </div>
            <Button type="submit" disabled={savingProfile}>{savingProfile ? "Saving…" : "Save changes"}</Button>
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

          <form className="card-elevated p-6 space-y-4" onSubmit={handlePasswordUpdate}>
            <h3 className="font-display font-bold text-lg">Change password</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <PasswordInput id="cp" label="Current password" className="h-11" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              <PasswordInput id="np" label="New password" className="h-11" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <Button type="submit" variant="outline" disabled={updatingPassword}>{updatingPassword ? "Updating…" : "Update password"}</Button>
          </form>
        </div>
      </div>
    </AppShell>
  );
};

export default Settings;
