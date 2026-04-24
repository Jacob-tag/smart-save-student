import { Bell, Search, Plus } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NavLink } from "@/components/NavLink";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex items-center gap-3 px-4 lg:px-8 py-3.5">
        <div className="lg:hidden">
          <Logo collapsed />
        </div>

        <div className="hidden lg:block min-w-0 flex-1">
          <h1 className="font-display font-bold text-xl tracking-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>

        <div className="hidden md:flex relative ml-auto w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions, goals…"
            className="pl-9 h-10 bg-secondary/60 border-transparent focus-visible:bg-card"
          />
        </div>

        <Button asChild size="sm" className="h-10 px-3 lg:px-4 gap-1.5 shadow-soft">
          <NavLink to="/transactions">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </NavLink>
        </Button>

        <Button variant="ghost" size="icon" className="relative h-10 w-10" aria-label="Notifications" asChild>
          <NavLink to="/notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
          </NavLink>
        </Button>

        <Avatar className="h-9 w-9 lg:hidden">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">TM</AvatarFallback>
        </Avatar>
      </div>

      <div className="lg:hidden px-4 pb-3">
        <h1 className="font-display font-bold text-2xl tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </header>
  );
}
