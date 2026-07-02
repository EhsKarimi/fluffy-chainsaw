import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { AuthProvider } from "@/modules/auth/context/AuthContext";
import { MantineProviders } from "@/shared/providers/MantineProviders";

import "./index.css";
import { routeTree } from "@/routeTree.gen";

const routerBasePath =
  import.meta.env.BASE_URL === "/"
    ? "/"
    : import.meta.env.BASE_URL.replace(/\/$/, "");

const router = createRouter({ routeTree, basepath: routerBasePath });

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
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </MantineProviders>
    </StrictMode>,
  );
}
