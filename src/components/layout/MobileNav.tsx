import { NavLink } from "@/components/NavLink";
import { PRIMARY_MOBILE_NAV } from "@/lib/nav";

export function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <ul className="grid grid-cols-5">
        {PRIMARY_MOBILE_NAV.map((item) => (
          <li key={item.url}>
            <NavLink
              to={item.url}
              end={item.url === "/"}
              className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground"
              activeClassName="!text-primary"
            >
              <item.icon className="h-5 w-5" />
              <span>{(item as any).short ?? item.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
