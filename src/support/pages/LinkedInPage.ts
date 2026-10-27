import { expect, Page } from '@playwright/test';
import LinkedInElements from '../elements/LinkedInElements';
import BasePage from './BasePage';

export default class LinkedInPage extends BasePage {
  readonly linkedinElements: LinkedInElements;

  constructor(page: Page) {
    super(page);
    this.linkedinElements = new LinkedInElements(page);
  }

  async abrirPaginaInicial(url: string): Promise<void> {
    const response = await this.page.goto(url, {
      waitUntil: 'domcontentloaded'
    });
    if (response === null) {
      throw new Error('A página inicial do LinkedIn não respondeu');
    }
    expect(
      response.status(),
      'O LinkedIn recusou o acesso. Consulte o relatório; não contorne CAPTCHA ou bloqueios.'
    ).toBeLessThan(400);
    await expect(this.page).not.toHaveURL(/\/authwall|\/checkpoint\/challenge/);

    const rejeitarCookies = this.linkedinElements.getBotaoRejeitarCookies();
    if (await rejeitarCookies.isVisible()) {
      await rejeitarCookies.click();
    }
  }

  async validarPaginaInicial(): Promise<void> {
    await expect(this.page).toHaveTitle(/linkedin/i);
    await expect(this.linkedinElements.getTituloPrincipal()).toBeVisible();
    await expect(this.linkedinElements.getLinkEntrar()).toBeVisible();
    await expect(this.linkedinElements.getLinkEntrar()).toHaveAttribute(
      'href',
      /https:\/\/www\.linkedin\.com\/login(?:\?|$)/
    );
    await expect(this.linkedinElements.getLinkCadastro()).toBeVisible();
    await expect(this.linkedinElements.getLinkCadastro()).toHaveAttribute(
      'href',
      /https:\/\/www\.linkedin\.com\/signup(?:\?|$)/
    );
  }

  async abrirLogin(): Promise<void> {
    await this.linkedinElements.getLinkEntrar().click();
    await expect(this.page).toHaveURL(
      /https:\/\/www\.linkedin\.com\/login(?:\?|$)/
    );
    await expect(this.linkedinElements.getCampoEmail()).toBeVisible();
  }

  async validarFormularioLogin(): Promise<void> {
    await expect(this.linkedinElements.getCampoEmail()).toBeEditable();
    await expect(this.linkedinElements.getCampoSenha()).toBeEditable();
    await expect(this.linkedinElements.getCampoSenha()).toHaveAttribute(
      'type',
      'password'
    );
    await expect(this.linkedinElements.getBotaoEntrar()).toBeEnabled();
    await expect(this.linkedinElements.getLinkRecuperarSenha()).toBeVisible();
  }

  async validarLoginSemPreenchimento(): Promise<void> {
    await this.linkedinElements.getBotaoEntrar().click();
    await expect(this.linkedinElements.getErroEmail()).toBeVisible();
    await expect(this.linkedinElements.getErroEmail()).toContainText(/\S/);
    await expect(this.page).toHaveURL(/\/login(?:\?|$)/);
  }

  async validarVisibilidadeDaSenha(senha: string): Promise<void> {
    const campoSenha = this.linkedinElements.getCampoSenha();
    await campoSenha.fill(senha);
    await expect(campoSenha).toHaveAttribute('type', 'password');
    await this.linkedinElements.getBotaoVisibilidadeSenha().click();
    await expect(campoSenha).toHaveAttribute('type', 'text');
    await expect(campoSenha).toHaveValue(senha);
    await this.linkedinElements.getBotaoVisibilidadeSenha().click();
    await expect(campoSenha).toHaveAttribute('type', 'password');
    await expect(campoSenha).toHaveValue(senha);
  }

  async abrirRecuperacaoDeSenha(): Promise<void> {
    await this.linkedinElements.getLinkRecuperarSenha().click();
    await expect(this.page).toHaveURL(
      /\/checkpoint\/rp\/request-password-reset(?:\?|$)/
    );
    await expect(this.linkedinElements.getCampoRecuperacao()).toBeVisible();
    await expect(this.linkedinElements.getCampoRecuperacao()).toBeEditable();
    await expect(this.linkedinElements.getCampoRecuperacao()).toHaveValue('');
  }
}
