import { api } from "@/src/lib/api-client";

// better-auth endpoints mounted by the backend at /api/auth/*.
// The session is stored in an httpOnly cookie, so there is no token to keep on the client.

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  role?: "student" | "graduate" | "admin" | null;
}

interface AuthResponse {
  token: string | null;
  user: AuthUser;
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthUser> {
  const { data } = await api.post<AuthResponse>("/auth/sign-in/email", {
    email: email.trim(),
    password,
  });
  return data.user;
}

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string,
): Promise<AuthUser> {
  const { data } = await api.post<AuthResponse>("/auth/sign-up/email", {
    name: name.trim(),
    email: email.trim(),
    password,
  });
  return data.user;
}

/** Starts the OAuth flow by sending the browser to the provider's consent page. */
export async function signInWithSocial(
  provider: "google" | "linkedin" | "facebook",
): Promise<void> {
  const { data } = await api.post<{ url: string; redirect: boolean }>(
    "/auth/sign-in/social",
    { provider, callbackURL: `${window.location.origin}/` },
  );
  window.location.href = data.url;
}
