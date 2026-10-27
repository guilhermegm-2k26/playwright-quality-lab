import { Locator } from '@playwright/test';
import BaseElements from './BaseElements';

export default class LinkedInElements extends BaseElements {
  getTituloPrincipal(): Locator {
    return this.page.getByRole('main').getByRole('heading', { level: 1 });
  }

  getLinkEntrar(): Locator {
    return this.page.locator(
      'nav a[data-tracking-control-name$="nav-header-signin"]'
    );
  }

  getLinkCadastro(): Locator {
    return this.page.locator(
      'nav a[data-tracking-control-name$="nav-header-join"]'
    );
  }

  getCampoEmail(): Locator {
    return this.page.locator('#username');
  }

  getCampoSenha(): Locator {
    return this.page.locator('#password');
  }

  getBotaoEntrar(): Locator {
    return this.page.getByRole('button', { name: /^(entrar|sign in)$/i });
  }

  getBotaoVisibilidadeSenha(): Locator {
    return this.page.getByRole('button', {
      name: /mostrar|show|ocultar|hide/i
    });
  }

  getErroEmail(): Locator {
    return this.page.locator('#error-for-username');
  }

  getLinkRecuperarSenha(): Locator {
    return this.page.getByRole('link', {
      name: /esqueceu.*senha|forgot password/i
    });
  }

  getCampoRecuperacao(): Locator {
    return this.page.locator('#username');
  }

  getBotaoRejeitarCookies(): Locator {
    return this.page.getByRole('button', { name: /^(rejeitar|reject)$/i });
  }
}
