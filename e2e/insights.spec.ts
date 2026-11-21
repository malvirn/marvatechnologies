import { test, expect } from "@playwright/test";

test("hub loads and keeps combined filters in the URL after reload", async ({ page }) => {
  await page.goto("/insights");
  await expect(page.getByRole("heading", { name: /Build Notes/ })).toBeVisible();
  await expect(page.getByRole("searchbox", { name: /Search practical engineering notes/ })).toBeVisible();
  await page.getByRole("searchbox").fill("no-result-expected");
  await expect(page).toHaveURL(/q=no-result-expected/);
  await expect(page.getByRole("heading", { name: /No notes match those filters/ })).toBeVisible();
  await page.getByLabel("Filter by track").selectOption("Frontend Engineering");
  await page.getByLabel("Filter by level").selectOption("Foundation");
  await expect(page).toHaveURL(/track=Frontend+Engineering/);
  await expect(page).toHaveURL(/level=Foundation/);
  await page.reload();
  await expect(page.getByLabel("Filter by track")).toHaveValue("Frontend Engineering");
  await expect(page.getByLabel("Filter by level")).toHaveValue("Foundation");
  await expect(page.getByRole("searchbox")).toHaveValue("no-result-expected");
});

test("slash focuses search and escape clears it", async ({ page }) => {
  await page.goto("/insights");
  await page.keyboard.press("/");
  await expect(page.getByRole("searchbox")).toBeFocused();
  await page.getByRole("searchbox").fill("something");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("searchbox")).toHaveValue("");
});

test("published lesson renders its table of contents and reading progress", async ({ page }) => {
  test.skip(!process.env.E2E_LESSON_SLUG, "Set E2E_LESSON_SLUG to an owner-approved published lesson.");
  await page.goto("/insights/" + process.env.E2E_LESSON_SLUG);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".bn-reading-progress")).toHaveAttribute("aria-hidden", "true");
  await expect(page.getByText("On this page").first()).toBeVisible();
  await expect(page.locator(".bn-article-footer")).toBeVisible();
});

test("unknown lesson slugs return a 404", async ({ page }) => {
  const response = await page.goto("/insights/this-lesson-does-not-exist");
  expect(response?.status()).toBe(404);
});

test("hub remains usable on a narrow mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/insights");
  await expect(page.getByRole("heading", { name: /Build Notes/ })).toBeVisible();
  await expect(page.getByRole("searchbox")).toBeVisible();
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(390);
});

test("search finds an owner-approved lesson when one is configured", async ({ page }) => {
  test.skip(!process.env.E2E_LESSON_TITLE, "Set E2E_LESSON_TITLE to the title of a published lesson.");
  await page.goto("/insights");
  await page.getByRole("searchbox").fill(process.env.E2E_LESSON_TITLE!);
  await expect(page.getByRole("link", { name: process.env.E2E_LESSON_TITLE!, exact: false }).first()).toBeVisible();
});

test("existing theme toggle works on the new Insights route", async ({ page }) => {
  await page.goto("/insights");
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
