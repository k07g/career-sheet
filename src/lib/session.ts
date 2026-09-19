import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE, EMAIL_COOKIE } from "@/lib/session-cookies";

export async function getSessionEmail(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(ACCESS_TOKEN_COOKIE)?.value;
  const email = store.get(EMAIL_COOKIE)?.value;
  if (!token || !email) return null;
  return email;
}

export async function getAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}
