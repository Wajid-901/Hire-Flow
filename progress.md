# 📋 progress.md — HireFlow Living Progress Tracker

> **This file is for AI assistants, not end users.**
> Update this file at the end of every development session or after every completed phase.
> Read this file before starting any work to understand the current project state.
> The companion file `brain.md` contains permanent architecture decisions — read both.

---

## Project Status

| Field | Value |
|---|---|
| **Current Phase** | Phase 2 — Frontend Authentication UI |
| **Overall Completion** | ~40% |
| **Current Branch** | `main` |
| **Last Updated** | 2026-08-28 |
| **Last Session By** | Antigravity (AI) |

---

## Completed Features

### ✅ Backend (Phase 1 — Complete)

- [x] Express 5 server with ES Modules
- [x] MongoDB Atlas connection via Mongoose
- [x] Environment variables via `dotenv` (`.env`)
- [x] Global CORS middleware
- [x] Global JSON body parser
- [x] Global error middleware (`errorMiddleware.js`)
- [x] User model (`name`, `email`, `password`, `role`, `timestamps`)
- [x] Application model (all tracking fields: `companyName`, `jobRole`, `jobLink`, `status`, `source`, `location`, `workType`, `resumeVersion`, `priority`, `notes`, `followUpDate`, `appliedDate`)
- [x] `APPLICATION_STATUS` constant (`Applied`, `Interview`, `Offer`, `Rejected`)
- [x] `SALT_ROUNDS` constant (`10`)
- [x] Auth routes: `POST /api/auth/register`, `POST /api/auth/login`
- [x] Auth controller: `registerUser` (bcrypt hash + duplicate check), `loginUser` (bcrypt compare + JWT sign)
- [x] JWT auth middleware (`authenticateUser`) — verifies Bearer token, injects `req.user`
- [x] Zod validation schemas: `registerSchema`, `loginSchema`, `applicationSchema`, `updateApplicationSchema`
- [x] Application validators as middleware: `validateApplication`, `validateUpdateApplication`
- [x] Application routes (all protected): `POST /`, `GET /`, `GET /:id`, `DELETE /:id`, `PATCH /:id`
- [x] Application controller: `createApplication`, `getApplications`, `getApplicationById`, `deleteApplication`, `updateApplication`
- [x] Ownership enforcement: all application queries filter by both `_id` AND `user` (prevents data leakage)
- [x] `$set` on updates (partial update — never replaces full document)
- [x] `runValidators: true` on Mongoose `findOneAndUpdate`

### ✅ Frontend — Foundation (Phase 1 — Complete)

- [x] Vite + React 19 project scaffolded
- [x] React Router v6 installed and configured
- [x] `BrowserRouter` wrapping the app in `main.jsx`
- [x] Route map defined in `App.jsx` (login, register, dashboard, 404)
- [x] Root `/` redirects to `/login` via `<Navigate>`
- [x] Placeholder pages created: `LoginPage`, `RegisterPage`, `NotFoundPage`
- [x] Axios pre-configured instance at `src/api/axiosInstance.js`
- [x] Vite proxy: `/api/*` → `http://localhost:5000`
- [x] Request interceptor placeholder (JWT attachment — Phase 2)
- [x] Response interceptor placeholder (401 redirect — Phase 2)

### ✅ Frontend — Dashboard Layout & UI Foundation (Phase 4 — Complete)

- [x] Centralized CSS architecture (`src/styles/` with 6 files)
- [x] `index.css` → import-only entry point
- [x] `base.css` — design tokens, reset, body, scrollbar, focus-visible (extended from original index.css)
- [x] `layout.css` — navbar (sticky + glassmorphism), main-content, dashboard-layout, stats-grid, toolbar-row, responsive breakpoints
- [x] `components.css` — Button (4 variants, 3 sizes), Input (with error state), Select (custom arrow), Card (glassmorphism), Badge (5 status variants), Spinner (CSS animation)
- [x] `dashboard.css` — DashboardHeader (wave animation), StatsCard (5 color variants, left border), SearchAndFilters, ViewToggle, EmptyState
- [x] `forms.css` — auth form layout (reserved for Phase 2)
- [x] `utilities.css` — sr-only, text helpers, flex shortcuts, spacing helpers
- [x] New design tokens: glassmorphism (`--color-surface-glass`, `--glass-blur`, `--glass-border`), status colors (`--color-applied/interview/offer/rejected` + `*-bg`), shadows (`--shadow-sm/md/lg`), transitions (`--transition-fast/base`), extended spacing (`--space-2xl`), extended radii (`--radius-full`), extended typography (`--font-size-xs`, `--font-size-2xl`)
- [x] Reusable UI: `Button.jsx` — variant (primary/secondary/ghost/danger), size (sm/md/lg), fullWidth, prop spreading
- [x] Reusable UI: `Input.jsx` — label, error message, prop spreading
- [x] Reusable UI: `Card.jsx` — glassmorphism container with optional title
- [x] Reusable UI: `Badge.jsx` — status-to-color mapping (Applied/Interview/Offer/Rejected)
- [x] Reusable UI: `Spinner.jsx` — pure CSS animation, 3 sizes, accessible (role="status" + sr-only)
- [x] Dashboard: `DashboardHeader.jsx` — greeting with wave animation, live date, Logout + Add Application buttons
- [x] Dashboard: `StatsCard.jsx` — icon + title + count with variant-colored left border
- [x] Dashboard: `SearchAndFilters.jsx` — search input with icon, status dropdown, sort dropdown (all controlled, UI-only)
- [x] Dashboard: `ViewToggle.jsx` — list/kanban toggle with local state, aria-pressed
- [x] Dashboard: `EmptyState.jsx` — centered CTA with icon, title, description, button
- [x] `DashboardPage.jsx` — composition root assembling all dashboard components with placeholder stats
- [x] `Navbar.jsx` — upgraded from inline styles to glassmorphism CSS classes, brand link, nav links
- [x] `App.jsx` — migrated `<main style={{ flex: 1 }}>` to `.main-content` CSS class
- [x] Responsive: verified desktop, tablet (768px), mobile (375px)
- [x] Zero console errors / React warnings (only React Router v6→v7 future flag informational warnings)

### ✅ Infrastructure

- [x] Monorepo structure: `HireFlow/client/` + `HireFlow/server/`
- [x] Both packages use `"type": "module"` (ES Modules)
- [x] `nodemon` for backend dev server (`npm run dev`)
- [x] Vite dev server for frontend (`npm run dev`)
- [x] oxlint configured for the client
- [x] `brain.md` and `progress.md` created in project root

---

## ❌ Not Yet Built

- [ ] AuthContext (React Context API for global auth state)
- [ ] Login form UI and logic
- [ ] Register form UI and logic
- [ ] ProtectedRoute component
- [ ] JWT stored in `localStorage` (or cookie — to be decided)
- [ ] Axios request interceptor connected to JWT
- [ ] Axios response interceptor connected to logout
- [ ] Add Application form / modal
- [ ] Edit Application form / modal
- [ ] Delete Application confirmation
- [ ] Application list (connected to backend)
- [ ] Stats computed from real data
- [ ] Search/filter/sort logic (connected to state)
- [ ] View toggle content switching (list vs kanban)
- [ ] Kanban board drag-and-drop
- [ ] Resume version tracking UI
- [ ] Follow-up date reminders
- [ ] Email notifications

---

## Current Phase: Phase 2 — Frontend Authentication UI

### What Is Being Built

The login and register pages will be transformed from placeholder stubs into fully functional forms. Users will be able to register an account and log in. The JWT returned by the server will be stored and attached to all future requests.

### Why

The backend authentication API (`/api/auth/register` and `/api/auth/login`) is complete. Phase 2 connects the frontend to these endpoints. Without this, no user can use the application.

### Current Objective

Build the complete authentication flow:
1. `AuthContext` — global state for user session
2. Register page — form with validation feedback
3. Login page — form with validation feedback
4. JWT storage + Axios interceptor wiring
5. `ProtectedRoute` — block unauthenticated access to `/dashboard`

---

## Current Session Summary (2026-08-28)

### What Was Done

This session completed **Phase 4 — Dashboard Layout & UI Foundation**.

**Files Created (16 new files):**

CSS Architecture:
- `client/src/styles/base.css` — design tokens, reset, scrollbar, focus-visible
- `client/src/styles/layout.css` — navbar, dashboard grid, toolbar, responsive breakpoints
- `client/src/styles/components.css` — Button, Input, Select, Card, Badge, Spinner
- `client/src/styles/dashboard.css` — DashboardHeader, StatsCard, SearchAndFilters, ViewToggle, EmptyState
- `client/src/styles/forms.css` — auth form layout (reserved for Phase 2)
- `client/src/styles/utilities.css` — accessibility and layout helpers

Reusable UI Components:
- `client/src/components/ui/Button.jsx`
- `client/src/components/ui/Input.jsx`
- `client/src/components/ui/Card.jsx`
- `client/src/components/ui/Badge.jsx`
- `client/src/components/ui/Spinner.jsx`

Dashboard Components:
- `client/src/components/dashboard/DashboardHeader.jsx`
- `client/src/components/dashboard/StatsCard.jsx`
- `client/src/components/dashboard/SearchAndFilters.jsx`
- `client/src/components/dashboard/ViewToggle.jsx`
- `client/src/components/dashboard/EmptyState.jsx`

**Files Modified (3 files):**
- `client/src/index.css` — stripped to import-only entry point
- `client/src/components/layout/Navbar.jsx` — inline styles → CSS classes, glassmorphism, Link-based brand/nav
- `client/src/pages/DashboardPage.jsx` — placeholder → full dashboard layout with all components
- `client/src/App.jsx` — `style={{ flex: 1 }}` → `.main-content` CSS class

**Architecture Decisions:**
- Centralized CSS in `src/styles/` instead of per-component CSS files (user-approved)
- No App.css (user-approved)
- BEM-like flat class names (`.btn--primary`, `.stats-card--interview`) for low specificity
- Glassmorphism as the visual language for cards, navbar, and surfaces
- Status colors mapped consistently: Applied=purple, Interview=amber, Offer=green, Rejected=red

**Problems Solved:**
- Migrated all inline styles from Phase 1 to centralized CSS
- Created a scalable CSS token system ready for all future phases
- Built responsive layouts that work at desktop, tablet, and mobile breakpoints

---

## Next Immediate Tasks

Execute in this exact order at the start of Phase 2:

1. **Create `AuthContext.jsx`** in `client/src/context/`
   - `user` state (null when logged out)
   - `login(token)` function — stores JWT, decodes user from token
   - `logout()` function — clears JWT, resets user
   - `isAuthenticated` boolean derived from `user`

2. **Wire `AuthContext` into Axios interceptor** (`axiosInstance.js`)
   - Request interceptor: read token from `localStorage`, attach as `Authorization: Bearer <token>`
   - Response interceptor: on 401, call `logout()` and redirect to `/login`

3. **Build `LoginPage.jsx`** — real form using `Input` and `Button` from `ui/`
   - Email + password fields
   - Validation feedback (inline errors)
   - Call `POST /api/auth/login` via Axios
   - On success: call `login(token)`, redirect to `/dashboard`
   - On error: display server error message
   - Use form styles from `styles/forms.css`

4. **Build `RegisterPage.jsx`** — real form using `Input` and `Button` from `ui/`
   - Name + email + password fields
   - Validation feedback
   - Call `POST /api/auth/register` via Axios
   - On success: redirect to `/login` with success message
   - On error: display server error message
   - Use form styles from `styles/forms.css`

5. **Create `ProtectedRoute.jsx`** in `client/src/components/`
   - Reads `isAuthenticated` from `AuthContext`
   - If authenticated: renders the child route
   - If not: redirects to `/login`

6. **Update `App.jsx`**
   - Wrap `AuthContext.Provider` around the entire app
   - Wrap `/dashboard` route with `<ProtectedRoute>`

7. **Update `Navbar.jsx`**
   - Show "Logout" button when authenticated
   - Show "Login" / "Register" links when not authenticated
   - Use `AuthContext` to determine which to show

8. **Update `DashboardHeader.jsx`**
   - Replace "User" with real user name from `AuthContext`
   - Wire Logout button to `logout()` from `AuthContext`

---

## Future Roadmap

### Phase 2 — Frontend Authentication UI (Next)

- AuthContext, Login form, Register form, ProtectedRoute, Axios interceptors
- Navbar auth-aware links

### Phase 3 — Application CRUD UI

- Add Application form/modal (connects to `POST /api/applications`)
- Application list on dashboard (connects to `GET /api/applications`)
- Delete application (connects to `DELETE /api/applications/:id`)
- Edit application (connects to `PATCH /api/applications/:id`)
- Stats computed from real data
- Search/filter/sort logic wired to SearchAndFilters state

### Phase 5 — Kanban Board View

- Drag-and-drop board: Applied → Interview → Offer / Rejected
- Updating status by dragging a card calls `PATCH /api/applications/:id`
- ViewToggle content switching (list vs kanban)

### Phase 6 — Polish & UX

- Toast notifications (success/error feedback)
- Loading skeletons / spinners (Spinner component ready)
- Animations and transitions
- Empty states with real data awareness
- Confirm dialog before delete

### Phase 7 — Advanced Features (Future)

- Follow-up date reminders
- Resume version tracking per application
- Export applications to CSV
- Dark/Light mode toggle
- Admin panel

### Phase 8 — Deployment

- Backend: Railway, Render, or Fly.io
- Frontend: Vercel or Netlify
- Environment variable management in production
- CORS configuration for production domain

---

## Known Issues & Technical Debt

### Current Bugs

| Issue | Severity | Notes |
|---|---|---|
| No known bugs | — | Dashboard renders cleanly on all viewports |

### Technical Debt

| Issue | Priority | Notes |
|---|---|---|
| `middleware/validateRegister.js` and `middleware/validateLogin.js` appear to be legacy files | Low | The canonical validators are now in `validators/authValidator.js`. Verify before Phase 2. |
| `authRoutes.js` does not use Zod validation middleware | Medium | The auth routes call controllers directly without validation middleware. The Zod schemas exist but are not wired. Should be fixed in Phase 2. |
| `utils/` folder is empty | Low | Reserved for future helpers. |
| CORS in `app.js` is fully open (`cors()` with no options) | Low | Must be restricted in production. |
| React Router v6 future flag warnings | Low | Informational only. Will auto-resolve on upgrade to v7. |

### Important Reminders for Phase 2

- The `axiosInstance.js` interceptors are currently stubs (TODOs). They must be completed in Phase 2.
- JWT token storage: `localStorage` is simple but vulnerable to XSS. HttpOnly cookies are more secure. **Discuss this tradeoff with the developer before implementing.**
- `AuthContext` must be provided at the highest level (wrap `<App>` in `main.jsx`) so the Axios interceptor can read the token.
- Form styles are pre-built in `styles/forms.css` — use `.auth-form-container`, `.auth-form`, `.auth-form__title`, etc.
- Reusable `Input` and `Button` components are ready in `components/ui/` — use them in the auth forms.

---

## Testing Status

### Backend

| Endpoint | Manual Test | Automated Test |
|---|---|---|
| `POST /api/auth/register` | ✅ Likely tested manually | ❌ No automated tests |
| `POST /api/auth/login` | ✅ Likely tested manually | ❌ No automated tests |
| `POST /api/applications` | ✅ Likely tested manually | ❌ No automated tests |
| `GET /api/applications` | ✅ Likely tested manually | ❌ No automated tests |
| `GET /api/applications/:id` | ✅ Likely tested manually | ❌ No automated tests |
| `DELETE /api/applications/:id` | ✅ Likely tested manually | ❌ No automated tests |
| `PATCH /api/applications/:id` | ✅ Likely tested manually | ❌ No automated tests |

### Frontend

| Page / Component | Status |
|---|---|
| `Navbar` | ✅ Styled with glassmorphism, brand link, nav links |
| `DashboardPage` | ✅ Full layout with all Phase 4 components |
| `DashboardHeader` | ✅ Greeting, date, action buttons |
| `StatsCard` (x5) | ✅ Rendering with placeholder 0 counts |
| `SearchAndFilters` | ✅ Search + 2 dropdowns, controlled inputs |
| `ViewToggle` | ✅ List/Board toggle with local state |
| `EmptyState` | ✅ CTA with icon and description |
| `Button` | ✅ 4 variants, 3 sizes |
| `Input` | ✅ Label + error support |
| `Card` | ✅ Glassmorphism container |
| `Badge` | ✅ 5 status variants |
| `Spinner` | ✅ 3 sizes, accessible |
| `LoginPage` | Placeholder only — Phase 2 |
| `RegisterPage` | Placeholder only — Phase 2 |
| `NotFoundPage` | Placeholder — functional |

### Pending Testing (Phase 2)

- End-to-end auth flow: register → login → dashboard redirect
- Protected route redirect when not authenticated
- JWT expiry handling (7 day token)
- Form validation error display
- Axios 401 auto-logout

---

## Deployment Status

| Environment | Status | Notes |
|---|---|---|
| **Development** | ✅ Running | Backend: `localhost:5000`, Frontend: `localhost:5173` |
| **Staging** | ❌ Not set up | Planned for Phase 8 |
| **Production** | ❌ Not deployed | Planned for Phase 8 |

---

## Learning Notes

Key concepts covered through Phase 4 that the developer should understand:

**Backend Concepts (Phase 1)**
- **MVC pattern** — why separate routes, controllers, and models
- **Middleware pipeline** — how `app.use()` chains work in Express
- **JWT authentication** — signing at login, verifying per request, `req.user` injection
- **bcrypt** — why you hash passwords, what salt rounds mean
- **Zod `safeParse()`** — structured validation vs throwing errors
- **`.partial()`** — how update schemas derive from base schemas
- **`findOneAndUpdate` with filter** — ownership enforced at DB level
- **`$set` operator** — partial updates without document replacement
- **`runValidators: true`** — why Mongoose validators don't run on update by default
- **Constants pattern** — sharing enum values between model, validator, and controller
- **Error middleware** — why the catch-all must have 4 parameters and be registered last

**Frontend Foundation Concepts (Phase 1)**
- **`BrowserRouter` placement** — must be at root so all children have routing context
- **`<Navigate>` for redirects** — declarative vs imperative (`useNavigate`)
- **`path="*"` catch-all** — must be last, matches any unmatched URL
- **CSS custom properties** — design tokens, why not to hardcode values
- **Axios instance** — base URL, interceptors, centralized config
- **Vite proxy** — how `/api` requests are forwarded to the backend in dev

**Dashboard & UI Concepts (Phase 4)**
- **Centralized CSS architecture** — why `styles/` directory beats per-component CSS files for small-to-medium projects
- **CSS import order** — base → layout → components → dashboard → forms → utilities (specificity cascade)
- **BEM-like naming** — `.block--modifier` keeps specificity flat and predictable
- **Glassmorphism** — `backdrop-filter: blur()` + semi-transparent background creates depth on dark UIs
- **CSS custom properties for theming** — status colors, glass tokens, shadows enable consistent, changeable design
- **Component composition** — page = layout of composites; composite = arrangement of primitives
- **Presentational components** — components that take data in and render UI out with zero side effects (Badge, StatsCard)
- **Controlled components** — React-managed form state via `useState` + `onChange` (SearchAndFilters)
- **Prop spreading** — `{...props}` on native elements lets callers pass any HTML attribute without the component knowing
- **`aria-pressed`** — accessibility for toggle buttons (ViewToggle)
- **`role="status"` + `sr-only`** — making loading spinners accessible to screen readers
- **Responsive CSS Grid** — `auto-fit + minmax()` creates naturally responsive layouts without media queries
- **Media query breakpoints** — 768px for tablet, 480px for mobile

**Concepts Coming in Phase 2**
- React Context API — provider, consumer, `useContext`
- `localStorage` vs HttpOnly cookies for token storage
- `ProtectedRoute` pattern in React Router v6
- Controlled forms in React (`useState` for each field)
- Inline error display pattern

---

## Session Handoff

> **Read this section first if you are an AI starting a new session.**
> This gives you everything you need to continue without reading the whole file.

### What Was Completed in the Last Session

- Phase 4 (Dashboard Layout & UI Foundation) is **fully complete**
- Created 16 new files: 6 CSS files + 5 UI components + 5 dashboard components
- Modified 3 existing files: index.css, Navbar.jsx, DashboardPage.jsx, App.jsx
- Centralized CSS architecture in `src/styles/` (user-approved)
- All components verified: desktop, tablet, mobile — zero errors

### Current Project State

- The backend REST API is fully functional (auth + CRUD)
- The frontend has a complete dashboard UI shell with glassmorphism design
- All 5 reusable UI primitives (Button, Input, Card, Badge, Spinner) are ready to use
- Auth pages (`LoginPage`, `RegisterPage`) are still placeholders
- Auth state management does not exist yet (no AuthContext)
- No real data flows through the dashboard — all placeholder values

### Exact Next Task

**Start Phase 2 with `AuthContext.jsx`.**

Create `client/src/context/AuthContext.jsx`. This is the first file to write in Phase 2. It should:
- Provide `user`, `login(token)`, `logout()`, `isAuthenticated` to the entire app
- Store the JWT in `localStorage`
- Decode the user from the JWT payload using `atob()` (or `jwt-decode` if approved)

### Files Likely to Be Modified Next

1. `client/src/context/AuthContext.jsx` — **[NEW]**
2. `client/src/main.jsx` — wrap app with `AuthContext.Provider`
3. `client/src/api/axiosInstance.js` — fill in interceptors with token logic
4. `client/src/pages/LoginPage.jsx` — real form UI (use `Input`, `Button` from `ui/`, styles from `forms.css`)
5. `client/src/pages/RegisterPage.jsx` — real form UI
6. `client/src/components/ProtectedRoute.jsx` — **[NEW]**
7. `client/src/App.jsx` — wrap dashboard route with `<ProtectedRoute>`
8. `client/src/components/layout/Navbar.jsx` — auth-aware links
9. `client/src/components/dashboard/DashboardHeader.jsx` — replace "User" with real name

### Warnings and Important Notes

⚠️ **The auth Zod validators are not wired to the auth routes.** `POST /api/auth/register` and `POST /api/auth/login` currently skip Zod validation. This is technical debt to address.

⚠️ **Discuss JWT storage before implementing.** `localStorage` is simple. HttpOnly cookies are more secure. Explain the tradeoff before writing the `login()` function.

⚠️ **Do not install `jwt-decode` without asking.** The JWT payload can be decoded manually with `atob(token.split('.')[1])`.

⚠️ **Form styles are pre-built.** `styles/forms.css` already contains `.auth-form-container`, `.auth-form`, `.auth-form__title`, `.auth-form__subtitle`, `.auth-form__footer`, and `.auth-form__error`. Use these in the login/register pages.

⚠️ **UI components are ready.** `components/ui/Button.jsx` and `components/ui/Input.jsx` are built and styled. Use them in the auth forms — do not create new form input styles.
