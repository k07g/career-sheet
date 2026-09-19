import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { g4SignOut } from "@/lib/g4-client";
import { ACCESS_TOKEN_COOKIE, EMAIL_COOKIE } from "@/lib/session-cookies";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (token) {
    // Best-effort: still clear the local session below even if this fails
    // (e.g. the access token already expired or the auth API is unreachable).
    await g4SignOut(token).catch(() => {});
  }

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(EMAIL_COOKIE);
  return new NextResponse(null, { status: 204 });
}
