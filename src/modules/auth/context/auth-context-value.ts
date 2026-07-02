import { createContext } from "react";

import { type AuthUser, type LoginResult, type LoginValues, type PermissionKey } from "@/modules/auth/types/auth.types";

export type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (values: LoginValues) => Promise<LoginResult>;
  logout: () => void;
  hasPermission: (permission: PermissionKey) => boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
