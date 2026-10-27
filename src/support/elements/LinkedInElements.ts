import { Locator } from '@playwright/test';
import BaseElements from './BaseElements';

export default class LinkedInElements extends BaseElements {
  getTituloPrincipal(): Locator {
    return this.page.getByRole('main').getByRole('heading', { level: 1 });
  }

  getLinkEntrar(): Locator {
    return this.page.getByRole('link', { name: /^(entrar|sign in)$/i }).first();
  }

  getLinkCadastro(): Locator {
    return this.page
      .getByRole('link', { name: /^(cadastre-se(?: agora)?|join now)$/i })
      .first();
  }

  getCampoEmail(): Locator {
    return this.page.getByRole('textbox', {
      name: /e-?mail ou telefone|email or phone/i
    });
  }

  getCampoSenha(): Locator {
    return this.page
      .getByLabel(/^(senha|password)$/i)
      .filter({ visible: true });
  }

  getBotaoEntrar(): Locator {
    return this.page.getByRole('button', { name: /^(entrar|sign in)$/i });
  }

  getBotaoVisibilidadeSenha(): Locator {
    return this.page.getByRole('button', {
      name: /mostrar|exibir|show|ocultar|hide/i
    });
  }

  getErroEmail(): Locator {
    return this.page.getByText(
      /insira um e-mail ou telefone|enter an email address or phone number/i
    );
  }

  getLinkRecuperarSenha(): Locator {
    return this.page.getByRole('link', {
      name: /esqueceu.*senha|forgot password/i
    });
  }

  getCampoRecuperacao(): Locator {
    return this.getCampoEmail();
  }

  getBotaoRejeitarCookies(): Locator {
    return this.page.getByRole('button', { name: /^(rejeitar|reject)$/i });
  }
}
