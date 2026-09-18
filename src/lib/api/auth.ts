type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
};

export type LoginResult = {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: AuthenticatedUser;
};

type LoginResponse = {
  success?: boolean;
  data?: {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    user?: AuthenticatedUser;
  };
};

export const AUTH_TOKEN_KEY = "authToken";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.dispatchEvent(new Event("auth:changed"));
}

export function clearAuthToken(): void {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.dispatchEvent(new Event("auth:changed"));
}

export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  const baseUrl = process.env.BASE_URL;

  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const result: LoginResponse | null = await response.json().catch(() => null);
  const accessToken = result?.data?.access_token;

  if (!response.ok || result?.success !== true || !accessToken) {
    throw new Error("Unable to sign in. Please check your credentials and try again.");
  }

  return {
    accessToken,
    refreshToken: result.data?.refresh_token,
    expiresIn: result.data?.expires_in,
    user: result.data?.user,
  };
}

export async function logout(): Promise<void> {
  const baseUrl = process.env.BASE_URL;
  const token = getAuthToken();

  const response = await fetch(`${baseUrl}/api/auth/logout`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok && response.status !== 401 && response.status !== 403) {
    throw new Error("Unable to sign out right now. Please try again.");
  }
}