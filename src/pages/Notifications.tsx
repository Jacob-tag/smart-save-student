import { AppShell } from "@/components/layout/AppShell";
import { notifications } from "@/lib/mock-data";
import { AlertTriangle, CheckCircle2, Info, Sparkles, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TYPE_META = {
  warning: { icon: AlertTriangle, bg: "bg-warning-soft", color: "text-warning", label: "Alert" },
  success: { icon: CheckCircle2, bg: "bg-success-soft", color: "text-success", label: "Milestone" },
  info: { icon: Info, bg: "bg-primary/10", color: "text-primary", label: "Info" },
  tip: { icon: Sparkles, bg: "bg-accent", color: "text-foreground", label: "Smart tip" },
} as const;

const Notifications = () => {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <AppShell title="Notifications" subtitle={`${unreadCount} unread • stay on top of your money`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" className="rounded-full">All</Button>
          <Button size="sm" variant="ghost" className="rounded-full">Unread</Button>
          <Button size="sm" variant="ghost" className="rounded-full">Alerts</Button>
        </div>
        <Button size="sm" variant="outline" className="gap-2">
          <BellOff className="h-4 w-4" /> Mark all read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => {
          const meta = TYPE_META[n.type];
          const Icon = meta.icon;
          return (
            <div
              key={n.id}
              className={cn(
                "card-elevated p-4 lg:p-5 flex items-start gap-4 hover:shadow-floating transition-shadow",
                n.unread && "ring-1 ring-primary/15",
              )}
            >
              <div className={cn("h-10 w-10 rounded-xl grid place-items-center shrink-0", meta.bg, meta.color)}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">{n.title}</span>
                  <span className={cn("stat-pill", meta.bg, meta.color)}>{meta.label}</span>
                  {n.unread && <span className="h-2 w-2 rounded-full bg-primary" aria-label="Unread" />}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
              </div>
              <div className="text-xs text-muted-foreground shrink-0 pt-1">{n.time}</div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
};

export default Notifications;
