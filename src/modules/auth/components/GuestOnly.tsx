import { Navigate } from "@tanstack/react-router";
import { type PropsWithChildren } from "react";

import { useAuth } from "@/modules/auth/context/useAuth";

type GuestOnlyProps = PropsWithChildren;

export function GuestOnly({ children }: GuestOnlyProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
