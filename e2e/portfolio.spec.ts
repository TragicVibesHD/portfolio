import { expect, test, type Page } from '@playwright/test';

/**
 * Wait for React to hydrate before interacting.
 *
 * Playwright considers a server-rendered button actionable the moment it
 * is painted, which is before the client bundle has attached any
 * handlers. Clicking then is a no-op and the test fails for a reason that
 * has nothing to do with the behaviour under test.
 */
async function ready(page: Page) {
  await page.waitForLoadState('networkidle');
}

/**
 * End-to-end coverage for the things a broken deploy would actually cost:
 * the pages loading, the projects being reachable, the form validating, and
 * the 3D never becoming the only way to get somewhere.
 */

test.describe('core pages', () => {
  test('home page renders its hero and navigation', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'View my work' })).toBeVisible();
  });

  test('every primary route responds', async ({ page }) => {
    for (const path of ['/', '/about', '/projects', '/lab', '/contact']) {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should return 200`).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });

  test('unknown routes render the 404 page', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });

  test('exposes exactly one h1 per page', async ({ page }) => {
    for (const path of ['/', '/about', '/projects', '/lab', '/contact']) {
      await page.goto(path);
      await expect(page.locator('h1')).toHaveCount(1);
    }
  });
});

test.describe('projects', () => {
  test('project index lists projects and filters them', async ({ page }) => {
    await page.goto('/projects');
    await ready(page);

    const cards = page.locator('article');
    const total = await cards.count();
    expect(total).toBeGreaterThan(0);

    // Narrowing to a single category must reduce the visible set
    await page.getByRole('button', { name: /^Data & Machine Learning/ }).click();
    await expect(cards).not.toHaveCount(total);

    await page.getByRole('button', { name: /^All/ }).click();
    await expect(cards).toHaveCount(total);
  });

  test('a project card opens its case study', async ({ page }) => {
    await page.goto('/projects');
    await ready(page);

    await page.locator('article a').first().click();
    await expect(page).toHaveURL(/\/projects\/[a-z0-9-]+$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tech stack' })).toBeVisible();
  });

  test('case studies never render a placeholder URL as a live link', async ({ page }) => {
    await page.goto('/projects');
    await page.locator('article a').first().click();

    // A bracket placeholder that leaked into an href would 404 in front of
    // whoever is reading the case study.
    const hrefs = await page
      .locator('a[href]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href') ?? ''));
    expect(hrefs.filter((href) => /\[[A-Z0-9_]+\]/.test(href))).toEqual([]);
  });
});

test.describe('the lab', () => {
  test('lists every project as a real link, not only as 3D objects', async ({ page }) => {
    await page.goto('/lab');

    // The canvas must never be the only route to a project.
    const links = page.locator('a[href^="/projects/"]');
    expect(await links.count()).toBeGreaterThan(0);
    await expect(links.first()).toBeVisible();
  });
});

test.describe('contact form', () => {
  test('shows validation errors and does not submit an empty form', async ({ page }) => {
    await page.goto('/contact');
    await ready(page);

    await page.getByRole('button', { name: 'Send message' }).click();

    await expect(page.getByText('Please enter your name')).toBeVisible();
    await expect(page.getByText('Please enter your email address')).toBeVisible();
  });

  test('rejects a malformed email address', async ({ page }) => {
    await page.goto('/contact');
    await ready(page);

    await page.getByLabel('Name').fill('Jane Doe');
    await page.getByLabel('Email').fill('nope');
    await page.getByLabel('Message').fill('A'.repeat(40));
    await page.getByRole('button', { name: 'Send message' }).click();

    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
  });
});

test.describe('accessibility basics', () => {
  test('skip link is reachable by keyboard and targets main', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Skip to content' });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toHaveAttribute('href', '#main');
  });

  test('theme toggle switches the document theme', async ({ page }) => {
    await page.goto('/');
    await ready(page);

    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);

    await page.getByRole('button', { name: 'Toggle colour theme' }).click();
    await expect(html).toHaveClass(/light/);
  });

  test('every image carries an alt attribute', async ({ page }) => {
    await page.goto('/projects');

    const missing = await page.locator('img:not([alt])').count();
    expect(missing).toBe(0);
  });
});
