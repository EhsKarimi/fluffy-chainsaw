import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";

import { RequireAuth } from "@/modules/auth/components/RequireAuth";
import { AppDocumentTitle } from "@/shared/components/layout/AppDocumentTitle";
import { AppLayout } from "@/shared/components/layout/AppLayout";

const RootLayout = () => {
  const pathname = useLocation({ select: (location) => location.pathname });
  const isLoginRoute = pathname === "/login";

  useEffect(() => {
    document.documentElement.classList.toggle("atis-auth-page", isLoginRoute);

    return () => {
      document.documentElement.classList.remove("atis-auth-page");
    };
  }, [isLoginRoute]);

  return (
    <>
      <AppDocumentTitle />

      {isLoginRoute ? (
        <Outlet />
      ) : (
        <RequireAuth>
          <AppLayout>
            <Outlet />
          </AppLayout>
        </RequireAuth>
      )}

      {import.meta.env.DEV ? <TanStackRouterDevtools /> : null}
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
