import { test, expect } from "@playwright/test";

test("loading the sample fills the form and preview", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "サンプルを読み込む" }).click();

  await expect(page.locator("#name")).toHaveValue("山田 太郎");
  await expect(page.getByText("株式会社サンプルテック")).toBeVisible();
  await expect(page.getByText("TypeScript", { exact: true })).toBeVisible();
});

test("confirms before overwriting existing input with the sample", async ({
  page,
}) => {
  await page.goto("/");
  await page.fill("#name", "既存の入力");

  let dialogMessage = "";
  page.once("dialog", (dialog) => {
    dialogMessage = dialog.message();
    dialog.dismiss();
  });
  await page.getByRole("button", { name: "サンプルを読み込む" }).click();

  expect(dialogMessage).toContain("上書き");
  // Dismissed the confirm, so the existing input should be untouched.
  await expect(page.locator("#name")).toHaveValue("既存の入力");
});
