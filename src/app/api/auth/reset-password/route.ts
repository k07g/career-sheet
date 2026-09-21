import { NextRequest, NextResponse } from "next/server";
import { G4ApiError, g4ResetPassword } from "@/lib/g4-client";

export async function POST(request: NextRequest) {
  const { email, code, newPassword } = await request.json().catch(() => ({}));
  if (!email || !code || !newPassword) {
    return NextResponse.json(
      { error: "email, code and newPassword are required" },
      { status: 400 },
    );
  }

  try {
    await g4ResetPassword(email, code, newPassword);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (err instanceof G4ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "認証サーバーに接続できませんでした" }, { status: 502 });
  }
}
