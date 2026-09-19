import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { G4ApiError, g4SignIn } from "@/lib/g4-client";
import { ACCESS_TOKEN_COOKIE, EMAIL_COOKIE } from "@/lib/session-cookies";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json({ error: "email and password are required" }, { status: 400 });
  }

  try {
    const result = await g4SignIn(email, password);

    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax" as const,
      path: "/",
      maxAge: result.expiresIn,
    };
    cookieStore.set(ACCESS_TOKEN_COOKIE, result.accessToken, cookieOptions);
    cookieStore.set(EMAIL_COOKIE, email, cookieOptions);

    return NextResponse.json({ email });
  } catch (err) {
    if (err instanceof G4ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "認証サーバーに接続できませんでした" }, { status: 502 });
  }
}
