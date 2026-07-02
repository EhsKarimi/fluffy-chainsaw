import { type PropsWithChildren, useCallback, useMemo, useState } from "react";

import { LocalStorageKeys } from "@/shared/constants/LocalStorageKeys";

import { AuthTexts } from "@/modules/auth/constants/AuthTexts";
import { findMockUserByCredentials, findMockUserByToken } from "@/modules/auth/constants/mock-users";
import { AuthContext, type AuthContextValue } from "@/modules/auth/context/auth-context-value";

type AuthProviderProps = PropsWithChildren;

function removePersistedToken() {
  window.localStorage.removeItem(LocalStorageKeys.AuthToken);
}

function getStoredToken() {
  try {
    const storedToken = window.localStorage.getItem(LocalStorageKeys.AuthToken);

    if (!storedToken) {
      return null;
    }

    if (!findMockUserByToken(storedToken)) {
      removePersistedToken();
      return null;
    }

    return storedToken;
  } catch {
    return null;
  }
}

function persistToken(token: string) {
  window.localStorage.setItem(LocalStorageKeys.AuthToken, token);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());

  const user = useMemo(() => {
    if (!token) {
      return null;
    }

    return findMockUserByToken(token)?.user ?? null;
  }, [token]);

  const login = useCallback(async ({ username, password }: { username: string; password: string }) => {
    await new Promise((resolve) => window.setTimeout(resolve, 300));

    const matchedUser = findMockUserByCredentials(username, password);

    if (!matchedUser) {
      return {
        success: false,
        message: AuthTexts.Validation.InvalidCredentials,
      } as const;
    }

    persistToken(matchedUser.token);
    setToken(matchedUser.token);

    return {
      success: true,
    } as const;
  }, []);

  const logout = useCallback(() => {
    removePersistedToken();
    setToken(null);
  }, []);

  const hasPermission = useCallback(
    (permission: Parameters<AuthContextValue["hasPermission"]>[0]) => {
      return Boolean(user?.permissions.includes(permission));
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
      hasPermission,
    }),
    [hasPermission, login, logout, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
