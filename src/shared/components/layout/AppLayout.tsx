import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type PropsWithChildren } from "react";

import { AppHeader } from "@/shared/components/layout/AppHeader";
import { AppSidebar } from "@/shared/components/layout/AppSidebar";

type AppLayoutProps = PropsWithChildren;

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileOpened, { close, toggle }] = useDisclosure(false);

  return (
    <AppShell
      dir="rtl"
      header={{ height: 64 }}
      navbar={{
        width: 260,
        breakpoint: "md",
        collapsed: { mobile: !mobileOpened },
      }}
      padding="md"
      className="bg-slate-50"
    >
      <AppShell.Header>
        <AppHeader mobileOpened={mobileOpened} onToggleMobileMenu={toggle} />
      </AppShell.Header>

      <AppShell.Navbar>
        <AppSidebar onNavigate={close} />
      </AppShell.Navbar>

      <AppShell.Main className="min-h-screen bg-slate-50">
        <div className="app-page-container">{children}</div>
      </AppShell.Main>
    </AppShell>
  );
}
