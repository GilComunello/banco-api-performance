# banco-api-performance

Testes de performance da **Banco API** utilizando [k6](https://k6.io/) e JavaScript.

## Introdução

Este repositório contém testes de carga e performance para a **Banco API**, uma API REST de operações bancárias (autenticação e transferências). Os testes são escritos em JavaScript e executados com o [k6](https://k6.io/), ferramenta de teste de carga da Grafana.

O objetivo é validar o comportamento da API sob diferentes cenários de uso — tempo de resposta, taxa de erros e capacidade de suportar múltiplos usuários simultâneos —, verificando se os limites de qualidade (thresholds) definidos são atendidos.

A URL base da API é parametrizada por meio da variável de ambiente `BASE_URL`, o que permite executar a mesma suíte contra diferentes ambientes (local, homologação, etc.) sem alterar o código. Quando a variável não é informada, o projeto assume o valor definido em `config/config.local.json`.

## Tecnologias utilizadas

| Tecnologia | Uso |
|------------|-----|
| [k6](https://k6.io/) | Execução dos testes de carga e performance |
| JavaScript (ES Modules) | Linguagem de escrita dos testes e módulos auxiliares |
| k6 Web Dashboard | Relatório de execução em tempo real e exportação em HTML |

> **Pré-requisito:** a Banco API precisa estar em execução e acessível na URL informada em `BASE_URL` (por padrão, `http://localhost:3000`).

## Estrutura do repositório

```
banco-api-performance/
├── config/
│   └── config.local.json      # Configurações locais (baseUrl padrão)
├── fixtures/
│   └── postLogin.json         # Massa de dados para autenticação
├── helpers/
│   └── autenticacao.js        # Função de apoio para obtenção do token
├── tests/
│   ├── login.test.js          # Teste de performance do login
│   └── transferencias.test.js # Teste de performance de transferências
├── utils/
│   └── variaveis.js           # Resolução da URL base (BASE_URL / config)
├── .gitignore
└── README.md
```

## Objetivo de cada grupo de arquivos

### `config/`
Guarda as configurações do projeto. O `config.local.json` define a `baseUrl` padrão utilizada quando a variável de ambiente `BASE_URL` não é informada na execução.

### `fixtures/`
Contém a massa de dados (payloads) usada pelos testes. O `postLogin.json` reúne as credenciais enviadas na requisição de autenticação, mantendo os dados de teste separados da lógica dos scripts.

### `helpers/`
Reúne funções de apoio reutilizáveis entre os testes. O `autenticacao.js` faz a requisição de login e retorna o **token** de acesso, evitando duplicar essa lógica em cada cenário que precise estar autenticado.

### `tests/`
Concentra os cenários de teste de performance, um arquivo por fluxo:

- **`login.test.js`** — exercita o endpoint `/login` com carga em estágios (ramp-up, carga sustentada e ramp-down) e valida *thresholds* de tempo de resposta e taxa de falhas.
- **`transferencias.test.js`** — autentica via helper e exercita o endpoint `/transferencias`, validando a criação da transferência.

### `utils/`
Módulos utilitários de uso transversal. O `variaveis.js` centraliza a resolução da URL base por meio da função `pegarBaseUrl()`, que retorna `__ENV.BASE_URL` quando definida e, caso contrário, o valor de `config/config.local.json`.

## Instalação

O k6 **não é instalado via npm** — ele é um binário próprio. Instale conforme o seu sistema operacional:

**macOS (Homebrew):**
```bash
brew install k6
```

**Windows (Chocolatey):**
```bash
choco install k6
```

**Linux (Debian/Ubuntu):**
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

Em seguida, clone o repositório:

```bash
git clone https://github.com/GilComunello/banco-api-performance.git
cd banco-api-performance
```

Confira a instalação com:

```bash
k6 version
```

## Execução

A URL da API é definida pela variável de ambiente **`BASE_URL`**. Passe-a antes do comando `k6 run`:

```bash
k6 run tests/login.test.js -e BASE_URL=http://localhost:3000
```

```bash
k6 run tests/transferencias.test.js -e BASE_URL=http://localhost:3000
```

> No **Windows (PowerShell)**, defina a variável separadamente:
> ```powershell
> $env:BASE_URL="http://localhost:3000"; k6 run tests/login.test.js
> ```

Se a variável `BASE_URL` não for informada, o projeto usa a `baseUrl` de `config/config.local.json` (`http://localhost:3000`):

```bash
k6 run tests/login.test.js
```

### Relatório em tempo real e exportação (Web Dashboard)

O k6 oferece um **dashboard web** que permite acompanhar a execução em tempo real pelo navegador e exportar o resultado em um relatório HTML ao final. Basta habilitar as variáveis `K6_WEB_DASHBOARD` e `K6_WEB_DASHBOARD_EXPORT`:

```bash
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=html-report.html k6 run tests/login.test.js -e BASE_URL=http://localhost:3000 
```

Durante a execução, o dashboard fica disponível em **http://127.0.0.1:5665** para acompanhamento em tempo real. Ao término, o relatório completo é gerado no arquivo **`html-report.html`** na raiz do projeto.

> O arquivo `html-report.html` já está listado no `.gitignore` e, portanto, não é versionado.
