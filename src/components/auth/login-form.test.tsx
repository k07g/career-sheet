import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./login-form";

const pushMock = vi.fn();
const refreshMock = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
  useSearchParams: () => mockSearchParams,
}));

function mockFetchOnce(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
}

// The "サインイン" tab button and the sign-in submit button share the same
// accessible name, so getByRole alone is ambiguous - narrow to the submit one.
function getSubmitButton(name: string) {
  return screen
    .getAllByRole("button", { name })
    .find((button) => button.getAttribute("type") === "submit")!;
}

describe("LoginForm", () => {
  beforeEach(() => {
    pushMock.mockClear();
    refreshMock.mockClear();
    mockSearchParams = new URLSearchParams();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("signs in and redirects to the form on success", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", mockFetchOnce(200, { email: "taro@example.com" }));
    render(<LoginForm />);

    await user.type(screen.getByLabelText("メールアドレス", { exact: false }), "taro@example.com");
    await user.type(screen.getByLabelText("パスワード", { exact: false }), "password123");
    await user.click(getSubmitButton("サインイン"));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/"));
    expect(refreshMock).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(
      "/api/auth/signin",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("shows the server error message when sign-in fails", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      mockFetchOnce(401, { error: "メールアドレスまたはパスワードが正しくありません" }),
    );
    render(<LoginForm />);

    await user.type(screen.getByLabelText("メールアドレス", { exact: false }), "taro@example.com");
    await user.type(screen.getByLabelText("パスワード", { exact: false }), "wrong-password");
    await user.click(getSubmitButton("サインイン"));

    expect(
      await screen.findByText("メールアドレスまたはパスワードが正しくありません"),
    ).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("moves to the confirm step after a successful sign-up", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", mockFetchOnce(201, { userConfirmed: false }));
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "新規登録" }));
    await user.type(screen.getByLabelText("メールアドレス", { exact: false }), "new-user@example.com");
    await user.type(screen.getByLabelText("パスワード", { exact: false }), "password123");
    await user.click(screen.getByRole("button", { name: "登録する" }));

    expect(await screen.findByLabelText("確認コード", { exact: false })).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      "/api/auth/signup",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("moves from forgot-password to reset-password after requesting a code", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", mockFetchOnce(204, null));
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "パスワードを忘れた場合は" }));
    await user.type(screen.getByLabelText("メールアドレス", { exact: false }), "taro@example.com");
    await user.click(screen.getByRole("button", { name: "リセットコードを送信" }));

    expect(await screen.findByLabelText("リセットコード", { exact: false })).toBeInTheDocument();
    expect(screen.getByLabelText("新しいパスワード", { exact: false })).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      "/api/auth/forgot-password",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("resets the password and returns to sign-in on success", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", mockFetchOnce(204, null));
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "パスワードを忘れた場合は" }));
    await user.type(screen.getByLabelText("メールアドレス", { exact: false }), "taro@example.com");
    await user.click(screen.getByRole("button", { name: "リセットコードを送信" }));

    await user.type(await screen.findByLabelText("リセットコード", { exact: false }), "123456");
    await user.type(screen.getByLabelText("新しいパスワード", { exact: false }), "NewPassw0rd!123");
    await user.click(screen.getByRole("button", { name: "パスワードを再設定" }));

    expect(
      await screen.findByText("パスワードを再設定しました。新しいパスワードでサインインしてください。"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("メールアドレス", { exact: false })).toBeInTheDocument();
    expect(screen.queryByLabelText("リセットコード", { exact: false })).not.toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      "/api/auth/reset-password",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("shows the server error message when resetting the password fails", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) => {
        if (url === "/api/auth/forgot-password") {
          return Promise.resolve({ ok: true, status: 204, json: async () => null });
        }
        return Promise.resolve({
          ok: false,
          status: 400,
          json: async () => ({ error: "invalid or expired confirmation code" }),
        });
      }),
    );
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "パスワードを忘れた場合は" }));
    await user.type(screen.getByLabelText("メールアドレス", { exact: false }), "taro@example.com");
    await user.click(screen.getByRole("button", { name: "リセットコードを送信" }));

    await user.type(await screen.findByLabelText("リセットコード", { exact: false }), "000000");
    await user.type(screen.getByLabelText("新しいパスワード", { exact: false }), "NewPassw0rd!123");
    await user.click(screen.getByRole("button", { name: "パスワードを再設定" }));

    expect(await screen.findByText("invalid or expired confirmation code")).toBeInTheDocument();
  });

  it("returns to sign-in from the forgot-password screen", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "パスワードを忘れた場合は" }));
    expect(screen.getByRole("button", { name: "リセットコードを送信" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "サインインに戻る" }));

    expect(getSubmitButton("サインイン")).toBeInTheDocument();
  });

  it("jumps straight to a password-only reset form when opened from an email link", async () => {
    mockSearchParams = new URLSearchParams({ email: "taro@example.com", code: "482913" });
    const user = userEvent.setup();
    vi.stubGlobal("fetch", mockFetchOnce(204, null));
    render(<LoginForm />);

    // Email/code came from the link, so they shouldn't be editable inputs -
    // only the new password field should require user input.
    expect(screen.queryByLabelText("メールアドレス", { exact: false })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("リセットコード", { exact: false })).not.toBeInTheDocument();
    expect(screen.getByText("taro@example.com")).toBeInTheDocument();

    await user.type(screen.getByLabelText("新しいパスワード", { exact: false }), "NewPassw0rd!123");
    await user.click(screen.getByRole("button", { name: "パスワードを再設定" }));

    expect(fetch).toHaveBeenCalledWith(
      "/api/auth/reset-password",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: "taro@example.com",
          code: "482913",
          newPassword: "NewPassw0rd!123",
        }),
      }),
    );
    expect(
      await screen.findByText("パスワードを再設定しました。新しいパスワードでサインインしてください。"),
    ).toBeInTheDocument();
  });
});
