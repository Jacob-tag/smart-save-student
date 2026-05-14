import { NavLink } from "@/components/NavLink";
import { Logo } from "@/components/Logo";
import { NAV_ITEMS } from "@/lib/nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export function Sidebar() {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const name = profile?.full_name || user?.email?.split("@")[0] || "Student";
  const initials = name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "S";
  const subtitle = [profile?.university, profile?.year_of_study].filter(Boolean).join(" • ") || "Welcome";
  const handleSignOut = async () => { await signOut(); navigate("/"); };

  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="px-6 py-6">
        <Logo />
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === "/"}
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            activeClassName="!bg-sidebar-accent !text-sidebar-accent-foreground shadow-soft"
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            <span className="truncate">{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="m-3 rounded-2xl border border-sidebar-border bg-gradient-to-br from-primary/5 to-success/5 p-4">
        <div className="text-xs font-semibold text-primary">Pro tip</div>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          Set a weekly food budget to keep spending predictable.
        </p>
      </div>

      <div className="flex items-center gap-3 border-t border-sidebar-border p-4">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{name}</div>
          <div className="truncate text-xs text-muted-foreground">{subtitle}</div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Sign out" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}
