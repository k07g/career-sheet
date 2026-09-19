import { NextRequest, NextResponse } from "next/server";
import { G4ApiError, g4SignUp } from "@/lib/g4-client";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json({ error: "email and password are required" }, { status: 400 });
  }

  try {
    const result = await g4SignUp(email, password);
    return NextResponse.json({ userConfirmed: result.userConfirmed }, { status: 201 });
  } catch (err) {
    if (err instanceof G4ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "認証サーバーに接続できませんでした" }, { status: 502 });
  }
}
