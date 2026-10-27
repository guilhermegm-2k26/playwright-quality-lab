import { test } from '@playwright/test';
import { join } from 'path';
import { TheConfig } from 'sicolo';
import LinkedInPage from '../support/pages/LinkedInPage';

test.describe('LinkedIn - fluxos públicos', () => {
  const CONFIG = join(__dirname, '../support/fixtures/config.yml');
  const BASE_URL = TheConfig.fromFile(CONFIG)
    .andPath('application.linkedin')
    .retrieveData();
  let linkedinPage: LinkedInPage;

  test.beforeEach(async ({ page }) => {
    linkedinPage = new LinkedInPage(page);
    await linkedinPage.abrirPaginaInicial(BASE_URL);
  });

  test('deve exibir a página inicial e os acessos de entrada e cadastro', async () => {
    await linkedinPage.validarPaginaInicial();
  });

  test('deve abrir o formulário de login pela página inicial', async () => {
    await linkedinPage.abrirLogin();
    await linkedinPage.validarFormularioLogin();
  });

  test('deve validar a tentativa de entrar com os campos vazios', async () => {
    await linkedinPage.abrirLogin();
    await linkedinPage.validarLoginSemPreenchimento();
  });

  test('deve mostrar e ocultar a senha sem alterar o texto digitado', async () => {
    await linkedinPage.abrirLogin();
    await linkedinPage.validarVisibilidadeDaSenha('Exemplo-local-123!');
  });

  test('deve abrir a recuperação de senha com o campo vazio', async () => {
    await linkedinPage.abrirLogin();
    await linkedinPage.abrirRecuperacaoDeSenha();
  });
});
