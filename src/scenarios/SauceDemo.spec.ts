import { expect, test } from '@playwright/test';
import { join } from 'path';
import { TheConfig } from 'sicolo';
import CadastroPage from '../support/pages/CadastroPage';

test.describe('Sauce Demo', () => {
  const CONFIG = join(__dirname, '../support/fixtures/config.yml');
  let cadastroPage: CadastroPage;
  const BASE_URL = TheConfig.fromFile(CONFIG)
    .andPath('application.sauceDemo')
    .retrieveData();

  test.beforeEach(async ({ page }) => {
    cadastroPage = new CadastroPage(page);
    await page.goto(BASE_URL);
  });

  test('Validação do carrinho', async ({ page }) => {
    await cadastroPage.validarCarrinho();
    await expect(page).toHaveURL(/\/checkout-step-one\.html(?:\?|$)/);
  });
});
