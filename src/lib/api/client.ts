import { clearAuthToken, getAuthToken } from "@/lib/api/auth";

export async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = getAuthToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(input, { ...init, headers });

  if (response.status === 401 || response.status === 403) {
    clearAuthToken();
    window.dispatchEvent(new Event("auth:unauthorized"));
  }

  return response;
}