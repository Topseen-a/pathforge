# PathForge Frontend

This is the React, TypeScript, Vite and Tailwind CSS v4 frontend for PathForge. It calls the Spring Boot backend's REST API directly and doesn't use any mock data. The [root README](../README.md) covers the whole project, the API and deployment.

## Setup

```bash
npm install
cp .env.example .env   # sets VITE_API_BASE_URL (default http://localhost:8080/api/v1)
npm run dev            # http://localhost:5173
```

Start the backend on port 8080 before you log in, or change the URL in `.env`.

| Script            | What it does |
|-------------------|--------------|
| `npm run dev`     | Starts the Vite dev server |
| `npm run build`   | Type-checks (`tsc -b`) and builds to `dist/` |
| `npm run lint`    | Lints with oxlint |
| `npm run preview` | Serves the production build locally |

In Docker, the app is built with `VITE_API_BASE_URL=/api/v1` and served by Caddy (see `Caddyfile`). Caddy also proxies `/api/*` to the backend.

## Structure

- `src/lib/api.ts`: the axios instance. It stores the JWT in `localStorage`, adds it to every request, and handles 401 responses.
- `src/lib/resources.ts`: one function per backend endpoint, grouped by module: `AuthApi`, `TalentProfileApi`, `CompanyApi`, `SkillApi`, `TalentSkillApi`, `ProjectSkillApi`, `ProjectApi`, `ApplicationApi`, `WorkspaceApi`, `TaskApi`, `SubmissionApi`, `EvaluationApi`, `PassportApi`, `MessageApi`, `NotificationApi`, `ReportApi` and `AdminApi`.
- `src/lib/types.ts`: TypeScript interfaces that mirror the backend DTOs.
- `src/context/`: `AuthContext` (session and JWT) and `ToastContext`.
- `src/hooks/useSmoothScroll.ts`: Lenis smooth scrolling.
- `src/components/`:
  - `ProtectedRoute`, a role-based route guard
  - `layout/` (`DashboardLayout` with a role-aware sidebar, and `AuthLayout`)
  - `ui/` (Button, Input, Modal and other small components)
  - shared pieces such as `Logo`, `InitialsAvatar`, `Reveal`, `PageTransition` and `ChangePasswordCard`
- `src/pages/public/`:
  - `Landing`, shown at `/` to visitors who aren't logged in
  - `VerifyPassport`, a public lookup by verification code that needs no login
- `src/pages/auth/`: `Login`, `Register`, `ForgotPassword` and `ResetPassword`.
- `src/pages/talent/`: `Dashboard`, `Projects` and `ProjectDetail` (browse projects and apply), `Applications`, `Workspaces` and `WorkspaceDetail` (tasks and submissions), `Passport`, and `Profile` (with skills).
- `src/pages/company/`:
  - `Dashboard`
  - `Projects`
  - `ProjectForm` (create or edit)
  - `ProjectManage`, with the tabs Overview, Applications (accept, reject or evaluate a talent through `EvaluateModal`), Tasks and Skills
  - `Profile`
- `src/pages/admin/`:
  - `Dashboard`
  - `Companies` (verify, reject or suspend)
  - `Projects` (moderate)
  - `Users` (suspend or reactivate)
  - `Reports` (resolve or dismiss)
- `src/pages/shared/`: `Messages` and `Notifications`, used by more than one role.

The route definitions live in `src/App.tsx`. They are `/app/talent/*`, `/app/company/*` and `/app/admin/*`, and each set is protected by role. If a logged-in user visits `/`, they are redirected to their role's dashboard.

## Known backend gaps

- The backend has no endpoint that lists a user's conversations. The `Messages` page builds the conversation list in the browser instead: it uses the company's projects and their applications for companies, and the talent's workspaces for talents.

## Design

The app uses a light theme only. It has a warm cream surface palette and a lime/chartreuse accent, and the landing page has deep forest-green sections. The fonts are Inter Tight (body), Bricolage Grotesque (display) and Geist Mono. The design tokens are defined in `src/index.css` under `@theme`.
