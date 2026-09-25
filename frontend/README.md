# PathForge Frontend

React + TypeScript + Vite + Tailwind CSS v4 frontend for PathForge, wired against the
Spring Boot backend's real REST API (no mock data).

## Setup

```bash
npm install
cp .env.example .env   # points VITE_API_BASE_URL at your backend, defaults to http://localhost:8080/api/v1
npm run dev
```

Make sure the backend is running on port 8080 (or update `.env`) before logging in.

## Structure

- `src/lib/api.ts` — axios instance, JWT attach/401 handling
- `src/lib/resources.ts` — one function per backend endpoint, grouped by module
  (Auth, LearnerProfile, Company, Skill, Experience, Application, Workspace, Task,
  Submission, Evaluation, Passport, Message, Notification, Report, Admin)
- `src/lib/types.ts` — TS interfaces mirroring backend DTOs
- `src/context/` — AuthContext (session + JWT), ThemeContext (dark/light), ToastContext
- `src/components/layout/` — DashboardLayout (role-aware sidebar), AuthLayout
- `src/components/ui/` — Button, Input/Textarea/Select, Card/Badge/StatusBadge/EmptyState/Modal
- `src/pages/auth/` — Login, Register
- `src/pages/public/` — VerifyPassport (public verification-code lookup, no auth)
- `src/pages/learner/` — Dashboard, Experiences (browse/apply), Applications, Workspaces
  (tasks + submissions), Passport, Profile (+ skills)
- `src/pages/company/` — Dashboard, Experiences (create/publish/close), ExperienceManage
  (tabs: Overview, Applications [accept/reject/evaluate], Tasks [create/review/approve], Skills),
  Profile
- `src/pages/admin/` — Dashboard, Companies (verify/reject/suspend by ID lookup — the backend
  has no "list all companies" endpoint yet), Experiences (force-close/moderate), Users
  (suspend/reactivate), Reports (resolve/dismiss)
- `src/pages/shared/` — Messages (per-experience conversation threads), Notifications

## Known backend gaps affecting the UI

- No `GET /admin/companies` list endpoint, so the admin Companies page is a lookup-by-ID
  tool rather than a browsable table. Add that endpoint later if you want a full list view.
- Messaging has no "list my conversations" endpoint; conversations are derived client-side
  from accepted applications/workspaces per experience.

## Design

Dark theme by default (bright green accent, `#0dd956`) matching the reference mockups, with a
light-mode toggle in the sidebar. Tokens live in `src/index.css` under `@theme` and the
`:root[data-theme="light"]` override.
