import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { TopBar } from "./TopBar";

interface AppShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={title} subtitle={subtitle} />
        <main className="flex-1 px-4 lg:px-8 py-6 pb-24 lg:pb-10 animate-fade-in">
          <div className="max-w-[1400px] mx-auto w-full">{children}</div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
