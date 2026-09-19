import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("adds a work experience entry and reflects it in the preview", async ({
  page,
}) => {
  await expect(page.getByText("職務経歴が登録されていません")).toBeVisible();

  await page
    .getByRole("button", { name: "+ 追加" })
    .first()
    .click();

  const companyInput = page.locator('input[id^="company-"]').first();
  await companyInput.fill("株式会社サンプル");
  await page.locator('input[id^="position-"]').first().fill("バックエンドエンジニア");

  await expect(page.getByText("株式会社サンプル")).toBeVisible();
  await expect(page.getByText("バックエンドエンジニア")).toBeVisible();
});

test("removes a work experience entry", async ({ page }) => {
  await page.getByRole("button", { name: "+ 追加" }).first().click();
  await page.locator('input[id^="company-"]').first().fill("株式会社サンプル");
  await expect(page.getByText("株式会社サンプル")).toBeVisible();

  await page.getByRole("button", { name: "削除" }).first().click();

  await expect(page.getByText("職務経歴が登録されていません")).toBeVisible();
});
