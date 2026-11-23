# BuildPlanner — Planejador de Builds de Genshin Impact

Aplicação Full Stack desenvolvida para a disciplina **Frameworks Web II — Unilavras**, permitindo que jogadores de **Genshin Impact** cadastrem, filtrem e gerenciem builds de personagens (arma equipada, nível, conjunto de artefatos, status alvo, observações, raridade e elemento), com autenticação stateless via **JWT** e documentação interativa via **Swagger (OpenAPI 3.1)**.

## Integrante
- **João Vitor Silva Santos** (RA: `0032207`)

## Links do Projeto
- **Vídeo de Demonstração:** `<COLE_AQUI_O_LINK_DO_VIDEO>`
- **Deploy Frontend (Netlify):** https://buildplanner-genshin.netlify.app
- **Deploy Backend (Render):** https://genshin-build-planner-api.onrender.com
- **Swagger UI (Produção):** https://genshin-build-planner-api.onrender.com/swagger-ui.html

---

## Stack de Tecnologias

### Backend (`backend/`)
- **Java 25** + **Spring Boot 4.1.2** (Maven)
- **Spring Web MVC** (API RESTful)
- **Spring Data JPA** + **H2 Database** (perfil `dev`) e **PostgreSQL** (perfil `prod`)
- **Spring Security** + **JWT (`jjwt` 0.12.6)** + **BCryptPasswordEncoder**
- **Bean Validation (`jakarta.validation`)** + `@RestControllerAdvice` com respostas de erro padronizadas em JSON
- **Swagger / OpenAPI (`springdoc-openapi-starter-webmvc-ui` 3.2.0)** com `@SecurityScheme` Bearer JWT

### Frontend (`frontend/`)
- **React 19** + **Vite 7** (porta `5173`)
- **React Router DOM v7** (`RotaPrivada`, `/login`, `/cadastro`, `/`, `/personagens/novo`, `/personagens/editar/:id`, `/personagens/:id`)
- **Axios** com interceptores de requisição (`Authorization: Bearer <token>`) e resposta (logout automático em `401`)
- **Tailwind CSS v4** + **Lucide React**

---

## Estrutura do Monorepo

```text
genshin-build-planner/
├── backend/                 # API REST Spring Boot (Java 25, JPA, JWT, Swagger)
│   └── src/main/java/com/genshin/planner/
│       ├── config/          # SecurityConfig, OpenApiConfig, DatabaseSeeder (7 elementos)
│       ├── controller/      # AuthController, ElementoController, PersonagemController
│       ├── dto/             # Java Records com validações
│       ├── exception/       # GlobalExceptionHandler, ApiErrorDTO, exceções de domínio
│       ├── model/           # Usuario, Elemento, Personagem, StatusBuild
│       ├── repository/      # Repositórios Spring Data JPA
│       ├── security/        # JwtService, JwtAuthenticationFilter
│       └── service/         # AuthService, ElementoService, PersonagemService
├── frontend/                # SPA React + Vite + Tailwind CSS
│   └── src/
│       ├── components/      # Alerta, BarraNavegacao, Carregando, CartaoPersonagem, RotaPrivada
│       ├── context/         # AuthContext
│       ├── pages/           # TelaLogin, TelaCadastro, PainelPrincipal, FormularioPersonagem, DetalhesPersonagem
│       ├── services/        # api.js (Axios + interceptores)
│       └── utils/           # constants.js, errors.js
├── ENTREGA.md               # Arquivo de submissão com identificação e links
└── README.md
```

---

## Identidade Visual e Arquitetura CSS

A estilização do frontend usa um tema escuro com **Tailwind CSS v4** e variáveis CSS em `:root` definidas em `frontend/src/index.css`:

- **Tokens em `:root` e Superfícies em Camadas:** Fundo azul-noite profundo (`--bg-obsidiana: #090C17`) com campo estelar sutil em CSS puro, superfícies em camadas (`--bg-superficie: #111626`, `--bg-superficie-elevada: #182038`), campos dedicados (`--bg-input: #0B0F1D`), moldura interna (`.moldura-ornamental`) e divisórias finas (`.divisor-estrela`).
- **Tipografia:** Importada do Google Fonts em `frontend/index.html` — **Cinzel** (600/700, via `.font-display`) usada no logo `BUILDPLANNER` e nos nomes dos personagens; **Plus Jakarta Sans** para a interface; e **JetBrains Mono** (`.font-mono-tabular` com `tabular-nums`) para níveis, raridade, contadores e metas de atributos.
- **Metais de Raridade (`.glass-gold` e `.glass-silver`):** Borda fina acompanhada de brilho no topo do card em dourado champanhe (`#E2C16B`) para personagens **5 estrelas** e prata lunar (`#C8D1E2`) para **4 estrelas**, além do efeito de brilho diagonal (`.carta-personagem`) e halo elemental via `--el-cor`.
- **Cores Dinâmicas por Elemento (`corHex`) e Fallback Geométrico:** O código hexadecimal retornado por `GET /elementos` estiliza dinamicamente os filtros, badges, gradientes de cabeçalho e o fallback geométrico com a inicial do personagem (`RetratoPersonagem`) quando `imagemUrl` está ausente ou falha ao carregar.
- **Layout Responsivo:** Grade *mobile-first* com Tailwind (`grid-cols-2 lg:grid-cols-4` nos indicadores de resumo, `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` nos cards e cabeçalho assimétrico de ficha técnica em `DetalhesPersonagem`).

---

## Como Executar Localmente

### Pré-requisitos
- **Java 25 (JDK 25)**
- **Node.js 20+** e **npm**

### 1. Executar o Backend (`http://localhost:8080`)
```powershell
cd backend
# Caso o Java padrão do sistema não seja o JDK 25, aponte JAVA_HOME:
# $env:JAVA_HOME = "C:\Users\USER\Documents\Java_JDK\openJdk-25"
.\mvnw.cmd spring-boot:run
```

- Por padrão, o perfil ativo é `dev` (banco em memória **H2**, populado automaticamente com os 7 elementos do Genshin).
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **Console H2 (dev):** `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:genshindb`, usuário `sa`, senha em branco).

#### Variáveis de Ambiente do Backend (Produção / PostgreSQL)
| Variável | Descrição | Padrão (`dev`) |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | Perfil ativo (`dev` ou `prod`) | `dev` |
| `DATABASE_URL` | URL JDBC do PostgreSQL (perfil `prod`) | `jdbc:postgresql://localhost:5432/genshin_builds` |
| `DB_USERNAME` | Usuário do PostgreSQL | `postgres` |
| `DB_PASSWORD` | Senha do PostgreSQL | `postgres` |
| `JWT_SECRET` | Chave secreta HMAC-SHA256 (mín. 32 chars; obrigatória em `prod`) | Chave fixa de dev |
| `JWT_EXPIRATION_MS` | Expiração do token em milissegundos | `86400000` (24h) |
| `CORS_ALLOWED_ORIGINS` | Origens permitidas separadas por vírgula | `http://localhost:5173` |

### 2. Executar o Frontend (`http://localhost:5173`)
```powershell
cd frontend
npm install
npm run dev
```

#### Variável de Ambiente do Frontend
Crie um arquivo `.env` na pasta `frontend/` (baseado em `.env.example`) caso queira apontar para outra URL da API:
```env
VITE_API_URL=http://localhost:8080
```

---

## Deploy em Produção

- **Backend (`backend/Dockerfile`):** Pronto para **Render** ou **Railway** usando Docker com **Java 25** e porta dinâmica (`PORT`). Configure `SPRING_PROFILES_ACTIVE=prod`, os dados do PostgreSQL (`DATABASE_URL`, `DB_USERNAME`, `DB_PASSWORD`), `JWT_SECRET` (mín. 32 caracteres) e `CORS_ALLOWED_ORIGINS` com a URL do frontend.
- **Frontend (`frontend/vercel.json` e `frontend/public/_redirects`):** Pronto para **Vercel** ou **Netlify** (com Root Directory `frontend`, build `npm run build` e saída `dist`), já com fallback SPA configurado para o React Router e variável `VITE_API_URL` apontando para o backend.
