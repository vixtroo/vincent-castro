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