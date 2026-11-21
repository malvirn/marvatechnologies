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
  await expect.poll(() => new URL(page.url()).searchParams.get("track")).toBe("Frontend Engineering");
  await expect.poll(() => new URL(page.url()).searchParams.get("level")).toBe("Foundation");
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
  await expect(page.locator(".bn-toc-desktop .bn-toc-title")).toBeVisible();
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

for (const route of ["/", "/about", "/services", "/contact"]) {
  test("existing route remains available: " + route, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("header.site-header")).toBeVisible();
  });
}

test("owner-approved teaching lesson renders comparison tabs and copyable prompt", async ({ page }) => {
  test.skip(!process.env.E2E_TEACHING_LESSON_SLUG, "Set E2E_TEACHING_LESSON_SLUG to the approved audit-before-you-modify lesson.");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/insights/" + process.env.E2E_TEACHING_LESSON_SLUG);
  const comparison = page.locator(".bn-before-after").first();
  await expect(comparison).toBeVisible();
  await comparison.getByRole("tab", { name: "After" }).click();
  await expect(comparison.getByRole("tab", { name: "After" })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".bn-prompt-block")).toBeVisible();
});

test("owner-approved demo lesson loads its interactive example near the viewport", async ({ page }) => {
  test.skip(!process.env.E2E_DEMO_LESSON_SLUG, "Set E2E_DEMO_LESSON_SLUG to an approved lesson containing a demo.");
  await page.goto("/insights/" + process.env.E2E_DEMO_LESSON_SLUG);
  const demo = page.locator(".bn-demo").first();
  await demo.scrollIntoViewIfNeeded();
  await expect(demo.getByRole("button", { name: /Submit order|Mark complete|Reset example/ }).first()).toBeVisible();
});


test("Build Notes publishes a valid RSS feed containing no draft lessons", async ({ request }) => {
  const response = await request.get("/insights/rss.xml");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("application/rss+xml");
  const xml = await response.text();
  expect(xml).toContain("<rss version=\"2.0\"");
  for (const slug of ["debounced-search-url-state", "preventing-duplicate-submissions", "building-unreliable-networks", "database-transactions-ledger-consistency", "audit-before-you-modify", "plan-before-you-code"]) {
    expect(xml).not.toContain(slug);
  }
});

test("sitemap and robots expose only public routes and preserve the verification setup", async ({ request }) => {
  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.ok()).toBeTruthy();
  const sitemap = await sitemapResponse.text();
  expect(sitemap).toContain("/insights");
  expect(sitemap).not.toContain("debounced-search-url-state");
  expect(sitemap).not.toContain("preventing-duplicate-submissions");
  const robotsResponse = await request.get("/robots.txt");
  expect(robotsResponse.ok()).toBeTruthy();
  expect(await robotsResponse.text()).toContain("/sitemap.xml");
});

test("Build Notes hub has a raster 1200 by 630 social image and CollectionPage JSON-LD", async ({ page, request }) => {
  await page.goto("/insights");
  const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
  expect(jsonLd).toContain("CollectionPage");
  const response = await request.get("/insights/opengraph-image");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("image/png");
  const png = await response.body();
  expect(png.toString("hex", 0, 8)).toBe("89504e470d0a1a0a");
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);
});

test("Build Notes provides a working skip link and avoids horizontal overflow at target widths", async ({ page }) => {
  for (const width of [360, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/insights");
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(width);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/insights");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("published lesson exposes Article and BreadcrumbList JSON-LD and its own social image", async ({ page, request }) => {
  test.skip(!process.env.E2E_LESSON_SLUG, "Set E2E_LESSON_SLUG to an owner-approved published lesson.");
  const slug = process.env.E2E_LESSON_SLUG!;
  await page.goto("/insights/" + slug);
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(scripts.join(" ")).toContain("Article");
  expect(scripts.join(" ")).toContain("BreadcrumbList");
  const response = await request.get("/insights/" + slug + "/opengraph-image");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("image/png");
});
