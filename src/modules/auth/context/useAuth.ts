import { useContext } from "react";

import { AuthContext } from "@/modules/auth/context/auth-context-value";

export function useAuth() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return authContext;
}
