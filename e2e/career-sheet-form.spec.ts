import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("shows a placeholder in the preview until something is entered", async ({
  page,
}) => {
  await expect(
    page.getByText("フォームに入力すると、ここにプレビューが表示されます"),
  ).toBeVisible();
});

test("reflects basic info input in the live preview", async ({ page }) => {
  await page.fill("#name", "山田 太郎");
  await page.fill("#nameKana", "ヤマダ タロウ");
  await page.fill("#email", "taro.yamada@example.com");
  await page.fill("#summary", "バックエンド開発に5年間従事しています。");

  // Input values aren't text nodes, so these matches are unambiguously the
  // live preview's rendered output - except <textarea>, whose value Playwright
  // does treat as matchable text, so the summary check is scoped to the <p>.
  await expect(page.getByText("山田 太郎", { exact: true })).toBeVisible();
  await expect(page.getByText("taro.yamada@example.com")).toBeVisible();
  await expect(
    page.locator("p", { hasText: "バックエンド開発に5年間従事しています。" }),
  ).toBeVisible();
});

test("persists input across a page reload via localStorage", async ({
  page,
}) => {
  await page.fill("#name", "山田 太郎");
  await page.fill("#email", "taro.yamada@example.com");

  // Autosave is debounced (600ms) - wait for the "saved" status before reloading.
  await expect(page.getByText("保存済み")).toBeVisible();

  await page.reload();

  await expect(page.locator("#name")).toHaveValue("山田 太郎");
  await expect(page.locator("#email")).toHaveValue("taro.yamada@example.com");
});

test("clears all input after confirming the clear action", async ({
  page,
}) => {
  await page.fill("#name", "山田 太郎");
  await expect(page.getByText("保存済み")).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "クリア" }).click();

  await expect(page.locator("#name")).toHaveValue("");
  await expect(
    page.getByText("フォームに入力すると、ここにプレビューが表示されます"),
  ).toBeVisible();
});
