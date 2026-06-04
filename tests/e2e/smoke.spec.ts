import { expect, test } from "@playwright/test";

test("renders dashboard shell", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Collections Command Center")).toBeVisible({ timeout: 15_000 });
});

test("health endpoint is healthy", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
});

test("simulation endpoint returns full passing suite", async ({ request }) => {
  const response = await request.post("/api/simulation/run", {
    headers: {
      "x-user-id": "00000000-0000-0000-0000-000000000001",
      "x-organization-id": "10000000-0000-0000-0000-000000000001",
      "x-user-role": "owner"
    },
    data: { includeReports: true }
  });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.data.passed).toBe(true);
  expect(body.data.reports.coverage.scenarioCoveragePercent).toBe(100);
});
