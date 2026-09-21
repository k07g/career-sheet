// Server-only client for the g4 authentication API (github.com/k07g/g4).
// g4 has no CORS support, so this must only be called from Next.js route
// handlers (server-to-server), never directly from the browser.

const G4_API_BASE_URL = process.env.G4_API_BASE_URL ?? "http://localhost:8080";

export class G4ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function g4Fetch(path: string, init: RequestInit): Promise<Response> {
  return fetch(`${G4_API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
}

async function readErrorMessage(res: Response, fallback: string): Promise<string> {
  const body = await res.json().catch(() => null);
  return (body && typeof body.error === "string" && body.error) || fallback;
}

export interface SignUpResult {
  userSub: string;
  userConfirmed: boolean;
}

export async function g4SignUp(email: string, password: string): Promise<SignUpResult> {
  const res = await g4Fetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new G4ApiError(res.status, await readErrorMessage(res, "サインアップに失敗しました"));
  }
  const body = await res.json();
  return { userSub: body.user_sub, userConfirmed: body.user_confirmed };
}

export async function g4ConfirmSignUp(email: string, code: string): Promise<void> {
  const res = await g4Fetch("/auth/confirm", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
  if (!res.ok) {
    throw new G4ApiError(res.status, await readErrorMessage(res, "確認コードの検証に失敗しました"));
  }
}

export interface SignInResult {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
}

export async function g4SignIn(email: string, password: string): Promise<SignInResult> {
  const res = await g4Fetch("/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new G4ApiError(
      res.status,
      await readErrorMessage(res, "メールアドレスまたはパスワードが正しくありません"),
    );
  }
  const body = await res.json();
  return {
    accessToken: body.access_token,
    idToken: body.id_token,
    refreshToken: body.refresh_token,
    expiresIn: body.expires_in,
  };
}

export async function g4ForgotPassword(email: string): Promise<void> {
  const res = await g4Fetch("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    throw new G4ApiError(res.status, await readErrorMessage(res, "リセットコードの送信に失敗しました"));
  }
}

export async function g4ResetPassword(email: string, code: string, newPassword: string): Promise<void> {
  const res = await g4Fetch("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, code, new_password: newPassword }),
  });
  if (!res.ok) {
    throw new G4ApiError(res.status, await readErrorMessage(res, "パスワードのリセットに失敗しました"));
  }
}

export async function g4SignOut(accessToken: string): Promise<void> {
  const res = await g4Fetch("/auth/signout", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new G4ApiError(res.status, await readErrorMessage(res, "サインアウトに失敗しました"));
  }
}
