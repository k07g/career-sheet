import { test, expect } from "@playwright/test";
import { loginAs } from "./utils/auth";

// Force a narrow viewport regardless of which project runs this file, since
// the tab switcher is only rendered visible below the `lg` breakpoint.
test.use({ viewport: { width: 390, height: 844 } });

test.beforeEach(async ({ page }) => {
  await loginAs(page);
});

test("switches between the input form and preview tabs", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("#name")).toBeVisible();
  await expect(
    page.getByText("フォームに入力すると、ここにプレビューが表示されます"),
  ).toBeHidden();

  await page.getByRole("button", { name: "プレビュー" }).click();

  await expect(page.locator("#name")).toBeHidden();
  await expect(
    page.getByText("フォームに入力すると、ここにプレビューが表示されます"),
  ).toBeVisible();

  await page.getByRole("button", { name: "入力" }).click();

  await expect(page.locator("#name")).toBeVisible();
});
