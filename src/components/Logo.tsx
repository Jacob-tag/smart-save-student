import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  collapsed?: boolean;
}

export function Logo({ className, collapsed }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative h-9 w-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
        <Wallet className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
      </div>
      {!collapsed && (
        <div className="leading-tight">
          <div className="font-display font-bold text-base tracking-tight">Stipend</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">Student finance</div>
        </div>
      )}
    </div>
  );
}
