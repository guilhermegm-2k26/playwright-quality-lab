# Playwright Quality Lab

Laboratório de automação E2E com **Playwright e TypeScript**, execução no **GitHub Actions** e análise estática no **SonarQube Cloud** (antigo SonarCloud).

Repositório: [guilhermegm-2k26/playwright-quality-lab](https://github.com/guilhermegm-2k26/playwright-quality-lab).

Baseado em [ugioni/playwright-e2e](https://github.com/ugioni/playwright-e2e). A autoria original e a licença MIT foram preservadas.

## Executar localmente

Requer Node.js 22+ e npm. Se usar nvm, execute `nvm use`.

```bash
npm ci
npx playwright install chromium
npm run ci
npm run show-report
```

No Linux, instale também as dependências do navegador com `npx playwright install --with-deps chromium`.

| Comando | Finalidade |
| --- | --- |
| `npm test` | Executar a suíte padrão (sem LinkedIn) |
| `npm run scenario` | Executar apenas Sauce Demo |
| `npm run test:linkedin` | Executar os cinco cenários públicos do LinkedIn |
| `npm run test:linkedin:list` | Listar os cenários do LinkedIn |
| `npm run show-report:linkedin` | Abrir o relatório do LinkedIn |
| `npm run test:list` | Listar cenários sem abrir o navegador |
| `npm run typecheck` | Verificar os tipos do TypeScript |
| `npm run verify` | Conferir a formatação |
| `npm run format` | Aplicar a formatação localmente |
| `npm run debug` | Depurar os testes |
| `npm run ui` | Abrir a interface do Playwright |
| `npm run ci` | Limpar relatórios, validar código e executar testes com um worker |
| `npm run show-report` | Abrir o relatório HTML |

Os relatórios ficam em `artifacts/report/`; traces e capturas de falhas ficam em `artifacts/media/`. Para abrir um trace, execute `npx playwright show-trace caminho/trace.zip`.

## Cenários e estrutura

- `src/scenarios/`: cadastro em Buger Eats, carrinho em Sauce Demo, navegação/busca na Globo e fluxos públicos do LinkedIn.
- `src/support/pages/`: ações e verificações das páginas.
- `src/support/elements/`: seletores dos elementos.
- `src/support/fixtures/`: URLs de demonstração e arquivo de upload.
- `playwright.config.ts`: Chromium, idioma pt-BR e relatórios.
- `.github/workflows/node.js.yml`: testes e análise Sonar em jobs independentes.
- `docs/SONAR_SETUP.md`: configuração passo a passo.
- `docs/LINKEDIN_E2E.md`: cenários, execução e limites da suíte LinkedIn.

Os testes acessam sites externos. Mudanças de página, indisponibilidade e bloqueios de automação podem causar falhas; consulte o relatório antes de alterar uma expectativa. Os cenários atuais não usam ZeroStep nem exigem `ZEROSTEP_TOKEN`.

## Testes do LinkedIn

A suíte do LinkedIn segue o padrão de cenários, páginas e elementos do projeto. Execute `npm run test:linkedin` ou **Actions > LinkedIn E2E > Run workflow**. Não precisa de conta nem senha.

Ela tem configuração e execução manual próprias, pois acessa um serviço externo que pode restringir automação. Não participa de `npm test`/`npm run ci` nem da agenda diária. Um bloqueio é reportado como falha, com evidências no relatório. Consulte o **[guia dos testes LinkedIn](docs/LINKEDIN_E2E.md)**.

## GitHub Actions e Sonar

O workflow executa em pushes e pull requests para `master`/`main`, manualmente e diariamente às 12h UTC (9h de São Paulo). Em forks, habilite a aba **Actions** para permitir as execuções.

Os testes funcionam sem uma conta Sonar. O job do Sonar fica ignorado até configurar as variáveis `SONAR_PROJECT_KEY` e `SONAR_ORGANIZATION`. Também é necessário cadastrar o secret `SONAR_TOKEN`. Consulte o **[guia completo de configuração](docs/SONAR_SETUP.md)**.

O Sonar analisa cenários, páginas e elementos TypeScript como código de testes, com as regras próprias dessa categoria, e os workflows YAML como arquivos de código. Este repositório não contém a aplicação do LinkedIn nem das outras plataformas testadas. O relatório HTML do Playwright não é cobertura LCOV dessas aplicações.
