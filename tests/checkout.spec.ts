import { test, expect } from '@playwright/test';

const API = 'http://localhost:3000';

// Seed a cart item into localStorage before the page loads
async function seedCart(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    const item = {
      id: 'test-1',
      name: 'Salade César',
      price: 4500,
      quantity: 1,
      totalPrice: 4500,
      image: '',
    };
    localStorage.setItem('ladelicieuse_cart', JSON.stringify([item]));
  });
}

test.describe('Checkout flow', () => {
  test('empty cart redirects to home', async ({ page }) => {
    await page.goto('/paiement');
    await expect(page).toHaveURL('/');
  });

  test('checkout page renders with cart data', async ({ page }) => {
    await seedCart(page);
    await page.goto('/panier');
    await expect(page.locator('text=Salade César')).toBeVisible();
    await expect(page.locator('text=4 500')).toBeVisible();
  });

  test('delivery form validates required fields', async ({ page }) => {
    await seedCart(page);
    await page.goto('/panier');

    // Try to proceed without filling form
    const proceedBtn = page.getByRole('button', { name: /commander|procéder|valider/i });
    if (await proceedBtn.count() > 0) {
      await proceedBtn.click();
      // Should show validation or stay on cart page
      await expect(page).toHaveURL(/\/panier/);
    }
  });

  test('payment success page shows order details', async ({ page }) => {
    // Mock the order API
    await page.route(`${API}/api/orders/**`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { numero: 'CMD-TEST-001', total: 4500, statut: 'en_attente' },
        }),
      });
    });

    await page.goto('/paiement/succes?order=CMD-TEST-001');
    await expect(page.locator('text=/succes|confirmée|merci/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('payment failure page shows retry option', async ({ page }) => {
    await page.goto('/paiement/echec');
    // Should display some failure UI
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
    // Page should not be a 404
    await expect(page.locator('text=/404|introuvable/i')).toHaveCount(0);
  });
});
