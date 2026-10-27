# Testes E2E do LinkedIn

Suíte para os fluxos públicos de https://www.linkedin.com/, baseada na estrutura existente do Playwright Quality Lab. Os cenários usam uma sessão nova e sem autenticação em cada teste.

## Cenários implementados

| Cenário | Verificação |
| --- | --- |
| Página inicial | Título LinkedIn, destaque principal e links de entrada e cadastro visíveis, com destinos corretos |
| Acesso ao login | Navegação pelo botão de entrada da home, campos editáveis, senha mascarada e opção de recuperação |
| Campos vazios | Tentativa de entrar sem preencher o formulário; mensagem de validação e permanência no login |
| Visibilidade da senha | Mostrar e ocultar um texto de exemplo, preservando seu valor |
| Recuperação de acesso | Navegação para a tela de recuperação, com campo vazio e editável |

A suíte não autentica uma conta, não cadastra usuários, não envia pedidos de recuperação, não publica conteúdo e não realiza candidaturas. O texto usado no teste de senha é apenas um exemplo preenchido localmente no formulário; não é enviado como credencial.

## Executar localmente

Requisitos: Node.js 22+, npm e Chromium instalado pelo Playwright.

```bash
npm ci
npx playwright install chromium
npm run test:linkedin:list
npm run test:linkedin
npm run show-report:linkedin
```

No Linux, use `npx playwright install --with-deps chromium`.

Para acompanhar no navegador:

```bash
npm run test:linkedin -- --headed
npm run test:linkedin -- --debug
```

Para executar somente um cenário:

```bash
npm run test:linkedin -- --grep "campos vazios"
```

## Executar no GitHub Actions

1. Abra [Actions > LinkedIn E2E](https://github.com/guilhermegm-2k26/playwright-quality-lab/actions/workflows/linkedin-e2e.yml).
2. Clique em **Run workflow** e selecione `master`.
3. Ao concluir, consulte o job **Run LinkedIn E2E**.
4. Baixe o artifact **linkedin-results** para consultar o relatório HTML, capturas e traces de falhas.

O workflow não exige novos secrets nem credenciais do LinkedIn. A execução é manual e usa um único worker, sem tentativas automáticas adicionais.

A suíte herda os limites da configuração principal: 120 segundos por cenário e 10 minutos no total. Ao abrir o login, aguarda o DOM e os campos editáveis, sem depender da remoção de parâmetros de rastreamento nem do carregamento completo de todos os recursos da página.

## Estrutura

- `src/scenarios/LinkedIn.spec.ts`: os cinco cenários.
- `src/support/pages/LinkedInPage.ts`: navegação, ações e validações.
- `src/support/elements/LinkedInElements.ts`: seletores dos elementos.
- `src/support/fixtures/config.yml`: URL em `application.linkedin`.
- `playwright.linkedin.config.ts`: configuração exclusiva da suíte.
- `.github/workflows/linkedin-e2e.yml`: execução manual no GitHub.

A configuração padrão ignora explicitamente `LinkedIn.spec.ts`. A configuração LinkedIn remove essa exclusão e seleciona somente esse arquivo. Os comandos `npm test`, `npm run ci` e a agenda diária executam os cinco cenários anteriores e uma regressão de navegação sem acesso ao LinkedIn (`LinkedInNavigation.spec.ts`). Essa regressão verifica um formulário pronto cujo carregamento completo está pendente e cuja URL mantém parâmetros de rastreamento; ela não substitui os cinco testes no site real.

## Relatórios

- HTML: `artifacts/linkedin/report/index.html`.
- Capturas e traces de falhas: `artifacts/linkedin/media/`.
- Abrir um trace: `npx playwright show-trace caminho/trace.zip`.

## Restrições do serviço externo

LinkedIn pode retornar erro HTTP, CAPTCHA, desafio de segurança ou tela de acesso restrito. Isso depende da rede, da região e das políticas do próprio site. Esses resultados devem ser registrados como falhas da execução, sem contornar o bloqueio e sem marcá-los automaticamente como testes aprovados ou ignorados.

Se a navegação for permitida, mas o site mudar o formulário ou os links, consulte a captura e o trace e atualize os seletores de `LinkedInElements.ts`. As validações não dependem do texto completo da home; os botões de login e recuperação aceitam português e inglês.

A suíte verifica comportamento de interface. Ela não mede cobertura do código interno do LinkedIn nem autenticação, feed ou recursos da área logada.
