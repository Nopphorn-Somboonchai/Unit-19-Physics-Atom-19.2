import { beforeEach, describe, test } from '@e2e-dev/web';
import { expect } from 'e2e';

describe('Unit 19.2 Photoelectric Effect Portal Smoke E2E', () => {
  beforeEach(async ({ app }) => {
    await app.open('/');
  });

  test('renders home portal, switches across 4 simulator sub-tabs, and grades standard practice Q1', async ({ browser }) => {
    await expect(browser.locator('#sec-home')).toBeVisible();
    await expect(browser.locator('#sec-home')).toContainText('ปรากฏการณ์โฟโตอิเล็กทริก');

    // Open Simulators
    await browser.locator('#sec-home button[onclick="showSection(\'review\')"]').click();
    await expect(browser.locator('#sec-review')).toBeVisible();
    await browser.locator('#btn-tab-19-2-iv').click();
    await expect(browser.locator('#review-tab-19-2-iv')).toBeVisible();
    await browser.locator('#btn-tab-19-2-ekf').click();
    await expect(browser.locator('#review-tab-19-2-ekf')).toBeVisible();
    await browser.locator('#btn-tab-19-2-photocell').click();
    await expect(browser.locator('#review-tab-19-2-photocell')).toBeVisible();

    // Practice standard Q1: 400 nm -> 3.10 eV
    await browser.locator('header button[onclick="showSection(\'home\')"]').click();
    await browser.locator('#sec-home button[onclick="showSection(\'practice\')"]').click();
    await expect(browser.locator('#prac-question-title')).toContainText('ข้อที่ 1 / 5');
    await browser.locator('#prac-input-val1').fill('3.10');
    await browser.locator('#btn-prac-check').click();
    await expect(browser.locator('#prac-feedback')).toContainText('ยินดีด้วย! คำตอบถูกต้อง');
  });
});
