"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AUTH_TOKEN_KEY, clearAuthToken, getAuthToken, login, logout, setAuthToken, type AuthenticatedUser } from "@/lib/api/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  status: AuthStatus;
  isAuthenticated: boolean;
  user: AuthenticatedUser | undefined;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function tokenHasExpired(token: string): boolean {
  try {
    const payload = token.split(".")[1];
    if (!payload) return false;

    const decoded = JSON.parse(window.atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as { exp?: number };
    return typeof decoded.exp === "number" && decoded.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthenticatedUser>();
  const signingOut = useRef(false);

  useEffect(() => {
    const restoreAuth = () => {
      const token = getAuthToken();

      if (!token) {
        setUser(undefined);
        setStatus("unauthenticated");
        return;
      }

      if (tokenHasExpired(token)) {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
        setUser(undefined);
        setStatus("unauthenticated");
        return;
      }

      setStatus("authenticated");
    };

    const handleAuthChanged = () => restoreAuth();
    const handleUnauthorized = () => {
      clearAuthToken();
      setUser(undefined);
      setStatus("unauthenticated");
    };

    restoreAuth();
    window.addEventListener("storage", handleAuthChanged);
    window.addEventListener("auth:changed", handleAuthChanged);
    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("storage", handleAuthChanged);
      window.removeEventListener("auth:changed", handleAuthChanged);
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    status,
    isAuthenticated: status === "authenticated",
    user,
    signIn: async (credentials) => {
      const result = await login(credentials);
      setAuthToken(result.accessToken);
      setUser(result.user);
      setStatus("authenticated");
    },
    signOut: async () => {
      if (signingOut.current) return;
      signingOut.current = true;

      try {
        await logout();
      } finally {
        clearAuthToken();
        setUser(undefined);
        setStatus("unauthenticated");
        signingOut.current = false;
      }
    },
  }), [status, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}