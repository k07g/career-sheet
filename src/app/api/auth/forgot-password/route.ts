import { NextRequest, NextResponse } from "next/server";
import { g4ForgotPassword } from "@/lib/g4-client";

export async function POST(request: NextRequest) {
  const { email } = await request.json().catch(() => ({}));
  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  // g4 always responds 204 here regardless of whether the email is
  // registered, to avoid leaking account existence. Mirror that by not
  // distinguishing errors from g4 either.
  await g4ForgotPassword(email).catch(() => {});
  return new NextResponse(null, { status: 204 });
}
