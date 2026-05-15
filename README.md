# RC Dashboard

A single-file React dashboard for Recruiting Coordinators, backed by an Express.js API server that polls Greenhouse, Google Calendar, Slack, and ModernLoop. Every section shows stub data when credentials are not configured, so the dashboard always renders something useful.

## Backend setup

### 1. Install dependencies

```sh
npm install
```

### 2. Configure credentials (all optional)

```sh
cp .env.example .env
# Edit .env and fill in the keys you have
```

All credentials are optional. Any unconfigured source shows realistic stub data instead of going blank.

| Source | Env var(s) | How to get it | Without it |
|---|---|---|---|
| Greenhouse | `GREENHOUSE_API_KEY` | Greenhouse > Configure > Dev Center > API Credential Management (Harvest role) | "Open roles" KPI shows stub value |
| Google Calendar | `GCAL_SERVICE_ACCOUNT_JSON` + `GCAL_USER_EMAIL` | GCP service account with Calendar API + domain-wide delegation in Google Workspace Admin | GCal feed column shows stub items |
| Slack | `SLACK_BOT_TOKEN` | api.slack.com/apps > Bot Token; scopes: `channels:history`, `im:history`, `im:read`, `users:read` | Slack feed column shows stub items |
| ModernLoop | `MODERNLOOP_API_KEY` | ModernLoop Settings > Integrations | All ML sections show stub data (API not publicly documented) |

### 3. Start the server

```sh
npm run server
```

Dashboard available at http://localhost:3000. Data auto-refreshes every 2 minutes.

### 4. Frontend-only development (optional)

Run the Express backend in one terminal and Vite in another. Vite proxies `/api` calls to the backend automatically.

```sh
# Terminal 1
npm run server

# Terminal 2
npm run dev
```

The Vite dev server (`:5173`) forwards `/api/data` requests to the Express server (`:3000`). If the backend is not running, the dashboard still renders using built-in stub data.

### Field name reference

API responses use these field names (what the dashboard components read):

- Slack items: `{ time, from, ctx, text, urgent, decline }`
- GCal items: `{ time, from, text, urgent, decline, afterHrs }`
- ML feed items: `{ time, from, ctx, text, urgent }`
- Interviewers: `{ name, hours, cap, sched, done, kinds }`
- Team members: `{ name, kind, initials, focus, people: [{name, role, stage}] }`
- Queue stats: `{ label, me, them, lowerBetter? }`
- Decline offenders: `{ name, rate, count, total, note, incidents: [{date, kind, cand, outcome}] }`
- Modules: `{ name, done, sched, health, trend }`

---

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
