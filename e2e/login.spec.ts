import { test, expect } from "@playwright/test";
import { loginAs } from "./utils/auth";

test("redirects unauthenticated visitors from / to /login", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "キャリアシート作成" })).toBeVisible();
});

test("redirects an already-authenticated visitor away from /login", async ({
  page,
}) => {
  await loginAs(page);
  await page.goto("/login");
  await expect(page).toHaveURL(/\/$/);
});

test("shows an error message when sign-in fails", async ({ page }) => {
  await page.route("**/api/auth/signin", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ error: "メールアドレスまたはパスワードが正しくありません" }),
    });
  });

  await page.goto("/login");
  await page.getByLabel("メールアドレス", { exact: false }).fill("taro@example.com");
  await page.getByLabel("パスワード", { exact: false }).fill("wrong-password");
  await page.getByRole("button", { name: "サインイン", exact: true }).last().click();

  await expect(
    page.getByText("メールアドレスまたはパスワードが正しくありません"),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test("signing in redirects to the form", async ({ page }) => {
  // Intercept the sign-in call and seed the session cookie ourselves, the
  // same way loginAs() does, since this route handler mock never reaches our
  // real Next.js route (which would call the g4 backend that CI doesn't run).
  await page.route("**/api/auth/signin", async (route) => {
    await loginAs(page, "taro@example.com");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ email: "taro@example.com" }),
    });
  });

  await page.goto("/login");
  await page.getByLabel("メールアドレス", { exact: false }).fill("taro@example.com");
  await page.getByLabel("パスワード", { exact: false }).fill("password123");
  await page.getByRole("button", { name: "サインイン", exact: true }).last().click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText("taro@example.com としてログイン中")).toBeVisible();
});

test("resets a forgotten password and signs in with the new one", async ({ page }) => {
  await page.route("**/api/auth/forgot-password", async (route) => {
    await route.fulfill({ status: 204 });
  });
  await page.route("**/api/auth/reset-password", async (route) => {
    await route.fulfill({ status: 204 });
  });
  await page.route("**/api/auth/signin", async (route) => {
    await loginAs(page, "taro@example.com");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ email: "taro@example.com" }),
    });
  });

  await page.goto("/login");
  await page.getByRole("button", { name: "パスワードを忘れた場合は" }).click();
  await page.getByLabel("メールアドレス", { exact: false }).fill("taro@example.com");
  await page.getByRole("button", { name: "リセットコードを送信" }).click();

  await expect(page.getByLabel("リセットコード", { exact: false })).toBeVisible();
  await page.getByLabel("リセットコード", { exact: false }).fill("123456");
  await page.getByLabel("新しいパスワード", { exact: false }).fill("NewPassw0rd!123");
  await page.getByRole("button", { name: "パスワードを再設定" }).click();

  await expect(
    page.getByText("パスワードを再設定しました。新しいパスワードでサインインしてください。"),
  ).toBeVisible();

  await page.getByLabel("パスワード", { exact: false }).fill("NewPassw0rd!123");
  await page.getByRole("button", { name: "サインイン", exact: true }).last().click();

  await expect(page).toHaveURL(/\/$/);
});

test("signing out clears the session and returns to /login", async ({ page }) => {
  await loginAs(page);
  await page.goto("/");

  await page.getByRole("button", { name: "ログアウト" }).click();

  await expect(page).toHaveURL(/\/login$/);
});
