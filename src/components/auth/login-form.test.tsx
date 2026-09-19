import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./login-form";

const pushMock = vi.fn();
const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
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
});
