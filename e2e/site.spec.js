const { test, expect } = require("@playwright/test");

test.describe("main landing page", () => {
  test("loads primary content and section navigation", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/The Fatherless/);
    await expect(page.getByRole("heading", { level: 1, name: "The Fatherless" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();

    await page.getByRole("link", { name: "Visual Concepts" }).click();
    await expect(page).toHaveURL(/#visuals$/);
    await expect(page.getByRole("heading", { level: 2, name: "Visual Concepts" })).toBeVisible();
  });

  test("switches pitch tabs with mouse and keyboard", async ({ page }) => {
    await page.goto("/");

    const editorialTab = page.getByRole("tab", { name: "Editorial View" });
    const producerTab = page.getByRole("tab", { name: "Producer View" });
    const editorialPanel = page.locator("#panel-editorial");
    const producerPanel = page.locator("#panel-producer");

    await expect(editorialTab).toHaveAttribute("aria-selected", "true");
    await expect(editorialPanel).toBeVisible();
    await expect(producerPanel).toBeHidden();

    await producerTab.click();
    await expect(producerTab).toHaveAttribute("aria-selected", "true");
    await expect(producerPanel).toBeVisible();
    await expect(editorialPanel).toBeHidden();

    await producerTab.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(editorialTab).toBeFocused();
    await expect(editorialTab).toHaveAttribute("aria-selected", "true");
    await expect(editorialPanel).toBeVisible();
  });

  test("links to the prequel and sequel landing pages", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Prequel: Age of Embers" }).click();
    await expect(page).toHaveURL(/\/prequel\/$/);
    await expect(page.getByRole("heading", { level: 1, name: "The Fatherless: Age of Embers" })).toBeVisible();

    await page.goto("/");
    await page.getByRole("link", { name: "Sequel: Neurion" }).click();
    await expect(page).toHaveURL(/\/sequel\/$/);
    await expect(page.getByRole("heading", { level: 1, name: "The Fatherless II: Neurion" })).toBeVisible();
  });
});

test.describe("companion landing pages", () => {
  test("prequel page exposes expected navigation and assets", async ({ page }) => {
    await page.goto("/prequel/");

    await expect(page).toHaveTitle(/Age of Embers/);
    await expect(page.getByRole("heading", { level: 1, name: "The Fatherless: Age of Embers" })).toBeVisible();
    await expect(page.getByRole("img", { name: /Prequel hero concept/i })).toBeVisible();

    await page.getByRole("link", { name: "Visual Concepts" }).click();
    await expect(page).toHaveURL(/\/prequel\/#visuals$/);
  });

  test("sequel page exposes expected navigation and assets", async ({ page }) => {
    await page.goto("/sequel/");

    await expect(page).toHaveTitle(/Neurion/);
    await expect(page.getByRole("heading", { level: 1, name: "The Fatherless II: Neurion" })).toBeVisible();
    await expect(page.getByRole("img", { name: /Sequel hero concept/i })).toBeVisible();

    await page.getByRole("link", { name: "Back to Main Landing" }).click();
    await expect(page).toHaveURL(/\/(?:index\.html)?$/);
    await expect(page.getByRole("heading", { level: 1, name: "The Fatherless" })).toBeVisible();
  });
});
