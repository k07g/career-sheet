"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/ui/field";

type Mode = "signin" | "signup" | "confirm" | "forgot" | "reset";

async function postJson(path: string, body: unknown) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

function SubmitButton({ label, isSubmitting }: { label: string; isSubmitting: boolean }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSubmitting ? "処理中..." : label}
    </button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
    setInfo("");
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const { ok, data } = await postJson("/api/auth/signin", { email, password });
      if (!ok) {
        setError(data.error ?? "サインインに失敗しました");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("認証サーバーに接続できませんでした");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const { ok, data } = await postJson("/api/auth/signup", { email, password });
      if (!ok) {
        setError(data.error ?? "登録に失敗しました");
        return;
      }
      setMode("confirm");
      setInfo("確認コードを記載したメールを送信しました。コードを入力してください。");
    } catch {
      setError("認証サーバーに接続できませんでした");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const { ok, data } = await postJson("/api/auth/confirm", { email, code });
      if (!ok) {
        setError(data.error ?? "確認コードの検証に失敗しました");
        return;
      }
      setMode("signin");
      setPassword("");
      setCode("");
      setInfo("登録が完了しました。サインインしてください。");
    } catch {
      setError("認証サーバーに接続できませんでした");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const { ok, data } = await postJson("/api/auth/forgot-password", { email });
      if (!ok) {
        setError(data.error ?? "リセットコードの送信に失敗しました");
        return;
      }
      setMode("reset");
      setInfo(
        "入力されたメールアドレス宛にパスワード再設定用のコードを送信しました(該当するアカウントが存在する場合)。届いたコードと新しいパスワードを入力してください。",
      );
    } catch {
      setError("認証サーバーに接続できませんでした");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const { ok, data } = await postJson("/api/auth/reset-password", {
        email,
        code,
        newPassword,
      });
      if (!ok) {
        setError(data.error ?? "パスワードの再設定に失敗しました");
        return;
      }
      setMode("signin");
      setPassword("");
      setCode("");
      setNewPassword("");
      setInfo("パスワードを再設定しました。新しいパスワードでサインインしてください。");
    } catch {
      setError("認証サーバーに接続できませんでした");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="mb-1 text-lg font-bold text-slate-900">キャリアシート作成</h1>
      <p className="mb-6 text-sm text-slate-500">
        {mode === "signin" && "サインインして入力を始めましょう"}
        {mode === "signup" && "アカウントを作成してください"}
        {mode === "confirm" && "メールに届いた確認コードを入力してください"}
        {mode === "forgot" && "登録済みのメールアドレスを入力してください"}
        {mode === "reset" && "届いたコードと新しいパスワードを入力してください"}
      </p>

      {(mode === "signin" || mode === "signup") && (
        <div className="mb-4 flex rounded-md border border-slate-200 bg-slate-50 p-1 text-sm">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className={`flex-1 rounded px-3 py-1.5 font-medium ${
              mode === "signin" ? "bg-white shadow-sm" : "text-slate-500"
            }`}
          >
            サインイン
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 rounded px-3 py-1.5 font-medium ${
              mode === "signup" ? "bg-white shadow-sm" : "text-slate-500"
            }`}
          >
            新規登録
          </button>
        </div>
      )}

      {info && (
        <p className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{info}</p>
      )}
      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      {mode === "signin" && (
        <form onSubmit={handleSignIn} className="space-y-4">
          <TextField
            label="メールアドレス"
            htmlFor="signin-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <TextField
              label="パスワード"
              htmlFor="signin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => switchMode("forgot")}
              className="mt-1.5 text-sm text-slate-500 underline hover:text-slate-700"
            >
              パスワードを忘れた場合は
            </button>
          </div>
          <SubmitButton label="サインイン" isSubmitting={isSubmitting} />
        </form>
      )}

      {mode === "signup" && (
        <form onSubmit={handleSignUp} className="space-y-4">
          <TextField
            label="メールアドレス"
            htmlFor="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="パスワード"
            htmlFor="signup-password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SubmitButton label="登録する" isSubmitting={isSubmitting} />
        </form>
      )}

      {mode === "confirm" && (
        <form onSubmit={handleConfirm} className="space-y-4">
          <TextField
            label="メールアドレス"
            htmlFor="confirm-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="確認コード"
            htmlFor="confirm-code"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <SubmitButton label="確認する" isSubmitting={isSubmitting} />
        </form>
      )}

      {mode === "forgot" && (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <TextField
            label="メールアドレス"
            htmlFor="forgot-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <SubmitButton label="リセットコードを送信" isSubmitting={isSubmitting} />
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className="w-full text-center text-sm text-slate-500 underline hover:text-slate-700"
          >
            サインインに戻る
          </button>
        </form>
      )}

      {mode === "reset" && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <TextField
            label="メールアドレス"
            htmlFor="reset-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="リセットコード"
            htmlFor="reset-code"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <TextField
            label="新しいパスワード"
            htmlFor="reset-new-password"
            type="password"
            autoComplete="new-password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <SubmitButton label="パスワードを再設定" isSubmitting={isSubmitting} />
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className="w-full text-center text-sm text-slate-500 underline hover:text-slate-700"
          >
            サインインに戻る
          </button>
        </form>
      )}
    </div>
  );
}
