import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { AuthProvider } from "@/modules/auth/context/AuthContext";
import { PersonalizationProvider } from "@/modules/profile/context/PersonalizationContext";
import { routeTree } from "@/routeTree.gen";
import { AppRoutePending } from "@/shared/components/layout/AppRoutePending";
import { MantineProviders } from "@/shared/providers/MantineProviders";
import { initializeAppStorage } from "@/shared/storage/initialize-app-storage";

import "./index.css";

initializeAppStorage();

const routerBasePath = import.meta.env.BASE_URL === "/" ? "/" : import.meta.env.BASE_URL.replace(/\/$/, "");

const router = createRouter({
  routeTree,
  basepath: routerBasePath,
  defaultPendingComponent: AppRoutePending,
  defaultPendingMs: 0,
  defaultPendingMinMs: 250,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element was not found");
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <MantineProviders>
        <PersonalizationProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </PersonalizationProvider>
      </MantineProviders>
    </StrictMode>,
  );
}
