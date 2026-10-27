import { expect, Route, test } from '@playwright/test';
import LinkedInPage from '../support/pages/LinkedInPage';

test('LinkedInPage deve abrir um login utilizável sem aguardar recursos pendentes', async ({
  page
}) => {
  test.setTimeout(10000);
  const imagensPendentes: Route[] = [];

  // Respostas locais: este cenário não acessa o serviço do LinkedIn.
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin !== 'https://www.linkedin.com') {
      await route.abort();
    } else if (url.pathname === '/') {
      await route.fulfill({
        contentType: 'text/html',
        body: '<a href="/login/pt?lipi=regressao">Entrar</a>'
      });
    } else if (url.pathname === '/login/pt') {
      await route.fulfill({
        contentType: 'text/html',
        body: `<!doctype html><html lang="pt"><body>
          <label>E-mail ou telefone<input type="email"></label>
          <label>Senha<input type="password"></label>
          <a href="/passwordReset/">Esqueceu a senha?</a>
          <img src="/imagem-pendente.png" alt="">
        </body></html>`
      });
    } else if (url.pathname === '/imagem-pendente.png') {
      imagensPendentes.push(route);
    } else {
      await route.abort();
    }
  });

  const linkedinPage = new LinkedInPage(page);
  await linkedinPage.abrirPaginaInicial('https://www.linkedin.com/');
  await linkedinPage.abrirLogin();

  await expect(page).toHaveURL(
    'https://www.linkedin.com/login/pt?lipi=regressao'
  );
  expect(await page.evaluate(() => document.readyState)).toBe('interactive');
  expect(imagensPendentes).toHaveLength(1);

  await Promise.all(imagensPendentes.map(route => route.abort()));
});
