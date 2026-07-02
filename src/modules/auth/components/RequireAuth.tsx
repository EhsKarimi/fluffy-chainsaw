import { Navigate } from "@tanstack/react-router";
import { type PropsWithChildren } from "react";

import { useAuth } from "@/modules/auth/context/useAuth";

type RequireAuthProps = PropsWithChildren;

export function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
