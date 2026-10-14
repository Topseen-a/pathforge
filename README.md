# PathForge

PathForge is a platform that connects **talents** with **companies** through real, short-term projects. Companies post projects. Talents apply and do the work in a shared workspace. When a project ends, the company evaluates the talent. Each evaluation becomes a verifiable record in the talent's **Experience Passport**, which anyone can check with a public verification code.

## How it works

1. **A company signs up** and creates its company profile. An admin has to **verify** the company before it can publish projects.
2. **The company creates a project** (`DRAFT`), with tasks, required skills and a work mode (`REMOTE`, `PHYSICAL` or `HYBRID`), and then **publishes** it.
3. **Talents browse published projects** and apply.
4. **The company accepts or rejects** each application, or asks the talent for more information. When an application is accepted, a **workspace** is created for that talent.
5. **In the workspace**, the talent works through the tasks and submits work (text and/or an attached file). The company reviews each submission and either approves it or asks for a revision.
6. **The company evaluates the talent** on overall, quality, communication and professionalism ratings, and leaves written feedback.
7. **The evaluation creates an Experience Record** in the talent's passport, with a unique verification code. Anyone can check the record at `/verify` without logging in.

Throughout the process, users get in-app **notifications**, can **message** each other about a project, and can **report** problems. Admins handle reports, users, companies and projects.

### Roles

| Role      | What they can do |
|-----------|-------------------|
| `TALENT`  | Keep a profile and skills, browse projects and apply, work in workspaces, submit tasks, view their passport |
| `COMPANY` | Keep a company profile, create, publish, close and delete projects, review applications, manage tasks, evaluate talents |
| `ADMIN`   | Verify, reject or suspend companies, moderate projects, suspend or reactivate users, resolve reports |

Nobody can register as an admin through the app. The first admin account is created on startup from the environment variables (see [Admin account](#admin-account)).

## Tech stack

| Layer     | Technology |
|-----------|------------|
| Backend   | Java 21, Spring Boot 3.3 (Web, Data JPA, Security, Validation, Mail), JWT (jjwt), Lombok |
| Database  | PostgreSQL 16, with Flyway migrations |
| API docs  | springdoc-openapi (Swagger UI) |
| Frontend  | React 19, TypeScript, Vite, Tailwind CSS v4, React Router 7, Axios, Recharts, Lenis, lucide-react |
| Serving   | Caddy (static files plus a reverse proxy to the API) |
| Packaging | Docker and Docker Compose |

## Project structure

```
pathforge/
├── docker-compose.yml          # Full production stack: db + backend + web
├── .env.production.example     # Template for the production .env
├── backend/                    # Spring Boot API
│   ├── docker-compose.yml      # Postgres only, for local development
│   ├── .env.example
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/pathforge/
│       │   ├── admin/          # Admin moderation endpoints
│       │   ├── application/    # Applying to projects and accept/reject decisions
│       │   ├── auth/           # Register, login, forgot/reset/change password
│       │   ├── common/         # BaseEntity, shared enums, exception handling
│       │   ├── company/        # Company profiles
│       │   ├── config/         # Security, CORS, admin bootstrap
│       │   ├── email/          # SMTP email (password reset)
│       │   ├── evaluation/     # Company evaluations of talents
│       │   ├── messaging/      # User-to-user messages
│       │   ├── notification/   # In-app notifications
│       │   ├── passport/       # Experience records and public verification
│       │   ├── project/        # Projects (DRAFT → PUBLISHED → CLOSED …)
│       │   ├── report/         # User reports
│       │   ├── security/       # JWT filter and service, UserDetails
│       │   ├── skill/          # Skill catalog, talent skills, project skills
│       │   ├── submission/     # Task submissions
│       │   ├── talent/         # Talent profiles
│       │   ├── task/           # Project tasks
│       │   ├── user/           # User accounts
│       │   └── workspace/      # Per-talent project workspaces
│       └── resources/
│           ├── application.yml
│           └── db/migration/   # Flyway scripts V1–V6
└── frontend/                   # React SPA
    ├── Dockerfile
    ├── Caddyfile
    └── src/
        ├── components/         # Layouts, UI primitives, route guards
        ├── context/            # AuthContext (JWT session), ToastContext
        ├── hooks/
        ├── lib/                # api.ts (axios), resources.ts (endpoint calls), types.ts
        └── pages/
            ├── public/         # Landing, VerifyPassport
            ├── auth/           # Login, Register, ForgotPassword, ResetPassword
            ├── talent/         # Dashboard, Projects, Applications, Workspaces, Passport, Profile
            ├── company/        # Dashboard, Projects, ProjectForm, ProjectManage (tabs), Profile
            ├── admin/          # Dashboard, Companies, Projects, Users, Reports
            └── shared/         # Messages, Notifications
```

Each backend module follows the same layout: `controller/`, `service/`, `repository/`, `model/` and `dto/{request,response}/`.

## Getting started (local development)

### Prerequisites

- Java 21 (the project includes the Maven wrapper, so you don't need to install Maven)
- Node.js 20 or later, and npm
- Docker, to run PostgreSQL

### 1. Start the database

```bash
cd backend
cp .env.example .env        # set DB_PASSWORD, and optionally ADMIN_EMAIL / ADMIN_PASSWORD
docker compose up -d        # starts Postgres 16 on DB_PORT (default 5432)
```

### 2. Run the backend

```bash
# still inside backend/
./mvnw spring-boot:run
```

The API runs at `http://localhost:8080`. The backend reads `backend/.env` automatically through `spring-dotenv`. Flyway creates the database schema on the first startup.

- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

### 3. Run the frontend

```bash
cd frontend
npm install
cp .env.example .env        # VITE_API_BASE_URL=http://localhost:8080/api/v1
npm run dev
```

Open http://localhost:5173.

### Useful scripts

| Where       | Command               | What it does |
|-------------|-----------------------|--------------|
| `backend/`  | `./mvnw test`         | Runs the backend tests (needs the database running) |
| `backend/`  | `./mvnw clean package`| Builds `target/*.jar` |
| `frontend/` | `npm run build`       | Type-checks and builds to `dist/` |
| `frontend/` | `npm run lint`        | Lints with oxlint |
| `frontend/` | `npm run preview`     | Serves the production build locally |

## Configuration

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `pathforge` | Database name |
| `DB_USERNAME` | `postgres` | Database user |
| `DB_PASSWORD` | `postgres` | Database password |
| `JWT_SECRET` | *(insecure placeholder)* | Key used to sign JWTs. **Always set this to a long random value.** |
| `FRONTEND_URL` | `http://localhost:5173` | Used for CORS and for building password-reset links |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` | blank / `587` | SMTP settings. If they are blank, password-reset links are written to the backend log instead of being emailed. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | blank | Credentials for the first admin account (see below) |

Other settings in `application.yml`: JWTs expire after **24 hours**, and password-reset tokens expire after **60 minutes**.

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Base URL of the API, for example `http://localhost:8080/api/v1`. In Docker it is `/api/v1`, which Caddy proxies to the backend. |

### Admin account

`/auth/register` does not accept the `ADMIN` role. To create an admin, set **both** `ADMIN_EMAIL` and `ADMIN_PASSWORD` and restart the backend. `AdminBootstrapRunner` creates the admin account only if no admin exists yet and the email isn't already used by another account. Without an admin, nobody can verify companies, so no company can publish a project.

## API overview

All endpoints are under `/api/v1`. Authenticated requests need an `Authorization: Bearer <token>` header. Only the following endpoints are public:

- `POST /auth/register`, `POST /auth/login`, `POST /auth/forgot-password`, `POST /auth/reset-password`
- `GET /verify/{verificationCode}`, for public passport verification
- Swagger UI and the OpenAPI docs

| Area | Endpoints |
|------|-----------|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/forgot-password`, `POST /auth/reset-password`, `PUT /auth/change-password` |
| Talent profile | `POST/GET/PUT /talents/me/profile`, `GET /talents/{profileId}/profile` |
| Talent skills | `GET/POST /talents/me/skills`, `DELETE /talents/me/skills/{skillId}` |
| Company | `POST/GET/PUT /companies/me`, `GET /companies/{companyId}` |
| Skills catalog | `GET/POST /skills` |
| Projects | `POST /projects`, `GET /projects`, `GET /projects/mine`, `GET/PUT/DELETE /projects/{id}`, `POST /projects/{id}/publish`, `POST /projects/{id}/close` |
| Project skills | `GET/POST /projects/{id}/skills`, `DELETE /projects/{id}/skills/{skillId}` |
| Applications | `POST/GET /projects/{id}/applications`, `GET /applications/mine`, `GET /applications/{id}`, `PUT /applications/{id}/decision` |
| Workspaces | `GET /workspaces/mine`, `GET /workspaces/{id}` |
| Tasks | `POST/GET /projects/{id}/tasks`, `PUT /projects/{id}/tasks/{taskId}`, `PUT /projects/{id}/tasks/{taskId}/status` |
| Submissions | `POST/GET /tasks/{taskId}/submissions`, `GET /tasks/{taskId}/submissions/mine`, `GET /submissions/mine` |
| Evaluations | `POST/GET /projects/{id}/talents/{talentId}/evaluation`, `GET /evaluations/mine` |
| Passport | `GET /passport/mine`, `GET /passport/{recordId}`, `GET /verify/{verificationCode}` |
| Messages | `POST /messages`, `GET /messages/with/{otherUserId}`, `GET /messages/project/{projectId}` |
| Notifications | `GET /notifications`, `GET /notifications/unread`, `GET /notifications/unread/count`, `PUT /notifications/{id}/read` |
| Reports | `POST /reports`, `GET /reports/mine` |
| Admin | `GET /admin/companies`, `PUT /admin/companies/{id}/verify`, `PUT /admin/projects/{id}/moderate`, `GET /admin/users`, `GET /admin/users/{id}`, `PUT /admin/users/{id}/suspend`, `PUT /admin/users/{id}/reactivate`, `GET /admin/reports`, `PUT /admin/reports/{id}/resolve` |

Swagger UI lists the full request and response schemas.

### Statuses

| Entity | Statuses |
|--------|----------|
| Project | `DRAFT`, `PUBLISHED`, `IN_PROGRESS`, `CLOSED`, `COMPLETED` |
| Application | `PENDING`, `ACCEPTED`, `REJECTED`, `INFO_REQUESTED` |
| Task | `NOT_STARTED`, `IN_PROGRESS`, `SUBMITTED`, `APPROVED`, `NEEDS_REVISION`, `COMPLETED` |
| Company verification | `PENDING`, `VERIFIED`, `REJECTED`, `SUSPENDED` |
| User | `ACTIVE`, `SUSPENDED`, `DEACTIVATED` |
| Report | `OPEN`, `IN_REVIEW`, `RESOLVED`, `DISMISSED` |

## Database

Flyway manages the schema (`backend/src/main/resources/db/migration`). Hibernate runs with `ddl-auto: validate`, so **every schema change must be a new migration file** (`V7__...sql`, and so on). Never edit a migration that has already been applied.

| Migration | Change |
|-----------|--------|
| V1 | Initial schema: users, profiles, companies, skills, projects, tasks, applications, workspaces, submissions, evaluations, experience records, messages, notifications, reports |
| V2 | Renames `learner` to `talent` and `experience` to `project` |
| V3 | Password reset tokens |
| V4 | Company logo |
| V5 | Talent avatar |
| V6 | Submission file size |

## Deployment (Docker Compose)

The root `docker-compose.yml` runs the whole stack:

- **db**: PostgreSQL 16, with data stored in the `pgdata` volume
- **backend**: the Spring Boot JAR on port 8080, reachable only inside the Compose network
- **web**: Caddy on port **80**. It serves the built SPA and proxies `/api/*` to `backend:8080`.

```bash
cp .env.production.example .env
# Fill in DB_PASSWORD, JWT_SECRET and FRONTEND_URL (all required), and optionally the SMTP and admin values.
#   openssl rand -base64 24   # DB_PASSWORD
#   openssl rand -base64 48   # JWT_SECRET
docker compose up -d --build
```

The app is then served at `FRONTEND_URL`. If SMTP isn't configured, you can find password-reset links with `docker compose logs backend`.

## Frontend routes

| Path | Who can see it |
|------|----------------|
| `/` | Public landing page. Logged-in users are redirected to their dashboard. |
| `/login`, `/register`, `/forgot-password`, `/reset-password` | Public |
| `/verify` | Public passport verification |
| `/app/talent/*` | Talents: dashboard, projects, applications, workspaces, passport, messages, notifications, profile |
| `/app/company/*` | Companies: dashboard, projects (create, edit, manage), messages, notifications, profile |
| `/app/admin/*` | Admins: dashboard, companies, projects, users, reports, notifications |

## Author

Built by [Temitope](https://github.com/Topseen-a).
