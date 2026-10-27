# Configurar SonarQube Cloud e GitHub

Nome do projeto: **Playwright Quality Lab**. Repositório: **[guilhermegm-2k26/playwright-quality-lab](https://github.com/guilhermegm-2k26/playwright-quality-lab)**. A branch original é `master`; o workflow também aceita `main`.

## 1. Conferir o fork

1. Abra o seu fork no GitHub e confirme que o nome é `playwright-quality-lab`.
2. Na aba **Actions**, habilite os workflows do fork, se o GitHub solicitar.
3. Em **Settings > Actions > General**, permita as Actions oficiais usadas pelo projeto, caso sua conta restrinja Actions.
4. Confira que `.github/workflows/node.js.yml`, `sonar-project.properties` e este guia estão na branch padrão.

## 2. Importar o projeto no Sonar

1. Entre em [SonarQube Cloud](https://sonarcloud.io) usando a conta GitHub que possui o fork.
2. Crie ou selecione sua organização. Instale/autorize o aplicativo do Sonar no GitHub com acesso ao novo fork.
3. Use **Analyze new project** (ou a opção equivalente para adicionar um projeto), selecione `playwright-quality-lab` e conclua a importação.
4. Escolha a análise **With GitHub Actions**. Se perguntado o tipo de build, escolha **Other (JS, TS, Go, Python, PHP, …)**.
5. Copie o **Project Key** e a **Organization Key** exibidos pelo Sonar. A chave da organização pode ser diferente do seu login do GitHub; use os valores reais, não os do autor original.
6. Se a análise automática estiver ativa, vá em **Administration > Analysis Method** e desative **Automatic Analysis**. Ela não pode funcionar simultaneamente com o scanner do GitHub Actions.

Este guia usa a região EU e `https://sonarcloud.io`. Se você criar o projeto na região US, siga o endereço e as variáveis de região indicados pelo tutorial do próprio Sonar e ajuste `sonar.host.url` no arquivo de propriedades.

## 3. Criar o token

1. No Sonar, abra **My Account > Security** (ou use o token oferecido no tutorial do projeto).
2. Gere um token de análise com acesso ao projeto. Use um nome como `github-playwright-quality-lab` e uma validade adequada.
3. Copie o token para cadastrar no GitHub. Não coloque o valor em arquivos, commits ou no chat.

## 4. Cadastrar o secret e as variáveis no GitHub

No fork, abra **Settings > Secrets and variables > Actions**. Atalhos: [Secrets](https://github.com/guilhermegm-2k26/playwright-quality-lab/settings/secrets/actions) e [Variables](https://github.com/guilhermegm-2k26/playwright-quality-lab/settings/variables/actions).

Na aba **Secrets**, escolha **New repository secret**:

| Nome | Valor |
| --- | --- |
| `SONAR_TOKEN` | Token gerado no Sonar |

Na aba **Variables**, escolha **New repository variable** para cada item:

| Nome | Valor |
| --- | --- |
| `SONAR_PROJECT_KEY` | Project Key exato exibido pelo Sonar |
| `SONAR_ORGANIZATION` | Organization Key exata exibida pelo Sonar |

Você não precisa criar `GITHUB_TOKEN`: o GitHub Actions fornece esse token automaticamente. Os testes atuais também não precisam de `ZEROSTEP_TOKEN`.

Não é necessário editar as chaves em `sonar-project.properties`: o workflow as recebe dessas variáveis e as fornece ao scanner.

## 5. Executar e conferir

1. No GitHub, abra **[Actions > Build and Tests](https://github.com/guilhermegm-2k26/playwright-quality-lab/actions/workflows/node.js.yml) > Run workflow**.
2. Selecione a branch padrão (`master`, salvo se você a renomeou) e execute.
3. Confira **Run E2E Tests**. Ao fim, baixe `playwright-results` na área **Artifacts** da execução para consultar o relatório e as evidências.
4. Confira **Run SonarCloud**. O scanner publica a análise e aguarda o resultado do **Quality Gate**; se o gate reprovar, o job fica vermelho para sinalizar os problemas.
5. Abra o projeto no Sonar e confira **Overview**, **Issues**, **Security Hotspots** e **Quality Gate**. Uma execução concluída do scanner não garante que o código atende ao gate.

Os jobs são independentes: uma falha de um site externo nos testes não impede a análise estática. O Sonar é ignorado em pull requests vindos de outro fork, pois esses eventos não recebem seu secret.

## 6. Ajustes posteriores no repositório

- Se mudar a chave ou a organização no Sonar, atualize as variáveis em **Settings > Secrets and variables > Actions > Variables**.
- Para trocar os sites testados, ajuste `src/support/fixtures/config.yml`; o cenário Globo usa uma URL diretamente em `src/scenarios/Globo.spec.ts`.
- Para executar outro cenário isolado, ajuste `scenario` em `package.json` ou use `npm test -- src/scenarios/Nome.spec.ts`.
- Se renomear a branch padrão, mantenha os filtros de `push`/`pull_request` no workflow alinhados e confira a branch principal no Sonar.
- Se renomear o repositório após importar no Sonar, confira **Administration > General Settings > Repository binding** e selecione novamente o repositório. A chave Sonar só muda se você a alterar explicitamente.
- Depois da primeira execução bem-sucedida, se quiser bloquear merges com problemas, crie uma regra em **Settings > Rules > Rulesets** ou **Branches** para exigir `Run E2E Tests` e o check do Sonar exibido na sua execução. O nome exato do check deve ser escolhido na lista do GitHub.

## Como interpretar cobertura

Todos os arquivos TypeScript em `src` — cenários, Page Objects e elementos — pertencem à automação e são classificados como código de testes. Os workflows de `.github` são classificados como arquivos de código e recebem a análise YAML. As duas categorias usam regras diferentes no Sonar. A aplicação acessada pelo navegador não está neste repositório.

Essa classificação segue a [distinção oficial entre código de aplicação e código de testes](https://docs.sonarsource.com/sonarqube-cloud/managing-your-projects/project-analysis/setting-analysis-scope/setting-initial-scope). Código de testes não entra na métrica de cobertura da aplicação. Não configuramos `sonar.javascript.lcov.reportPaths` nem geramos um LCOV fictício.

Se você adicionar uma aplicação ou biblioteca que seja o produto testado, inclua seu caminho em `sonar.sources`, sem sobrepor `sonar.tests`, e gere a cobertura real antes do scanner. Não use um relatório vazio, não declare 100% e não exclua arquivos da aplicação apenas para deixar o gate verde.

## Problemas comuns

| Sintoma | O que conferir |
| --- | --- |
| Sonar aparece como skipped/ignorado | Cadastre as duas variáveis e rode novamente; em PR de outro fork o skip é esperado |
| Mensagem para configurar `SONAR_TOKEN` | Cadastre o secret no fork em uso e confira se não expirou |
| Not authorized / project not found | Token, permissões de análise, Organization Key e Project Key |
| Erro de Automatic Analysis | Desative a análise automática no projeto do Sonar |
| Quality Gate failed | Abra os detalhes do gate e corrija os problemas apontados |
| Testes E2E falham | Baixe os artifacts; confira disponibilidade do site, seletores e expectativas |
| Token expirou | Gere outro no Sonar e atualize o secret `SONAR_TOKEN` |

## Referências oficiais

- [Integração Sonar com GitHub](https://docs.sonarsource.com/sonarqube-cloud/discovering-sonarcloud/integration-with-devops-platforms/github)
- [Análise em CI e conflito com análise automática](https://docs.sonarsource.com/sonarqube-cloud/analyzing-source-code/ci-based-analysis/overview-of-integrated-cis)
- [Action oficial do Sonar](https://github.com/SonarSource/sonarqube-scan-action)
- [Cobertura JavaScript/TypeScript e formato LCOV](https://docs.sonarsource.com/sonarqube-cloud/analyzing-source-code/test-coverage/javascript-typescript-test-coverage)
- [Configurar Playwright no CI](https://playwright.dev/docs/ci-intro)
