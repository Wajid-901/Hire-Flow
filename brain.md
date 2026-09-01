# HireFlow — Complete Project Brain

> Everything you need to understand, run, explain, and extend this project.  
> Written for a college presentation and for onboarding any new developer.

---

## Table of Contents

1. [What is HireFlow?](#1-what-is-hireflow)
2. [Why We Built It](#2-why-we-built-it)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Architecture Overview](#5-architecture-overview)
6. [Backend Deep-Dive](#6-backend-deep-dive)
7. [Frontend Deep-Dive](#7-frontend-deep-dive)
8. [Full Feature Walkthrough](#8-full-feature-walkthrough)
9. [All API Endpoints](#9-all-api-endpoints)
10. [Data Models](#10-data-models)
11. [Authentication Flow](#11-authentication-flow)
12. [Password Reset Flow](#12-password-reset-flow)
13. [Application CRUD Flow](#13-application-crud-flow)
14. [How State is Managed](#14-how-state-is-managed)
15. [Routing System](#15-routing-system)
16. [Security Decisions](#16-security-decisions)
17. [Known Limitations & Next Steps](#17-known-limitations--next-steps)
18. [How to Run the Project](#18-how-to-run-the-project)
19. [Environment Variables](#19-environment-variables)
20. [Glossary](#20-glossary)

---

## 1. What is HireFlow?

HireFlow is a **job application tracking SaaS** (Software as a Service) built for students and professionals. Instead of using a messy spreadsheet, users log every job they apply to and track it through the hiring pipeline from "Applied" → "Interview" → "Offer" / "Rejected".

The app gives you:
- A **dashboard** with live stats pulled from your real data
- An **applications table** with search, filter, sort, bulk-delete, and CSV export
- **Password reset** and **change password** flows for account security
- A **profile page** where you can edit your name
- A clean, dark-mode premium UI that looks like a real SaaS product

---

## 2. Why We Built It

Most job seekers track applications in a Notes app or a spreadsheet. They forget where they applied, miss follow-ups, and have no insight into their own funnel. HireFlow solves this with a purpose-built tracker that:

- Centralises every application in one place
- Shows you at a glance how your job search is performing
- Lets you filter and find any application instantly
- Exports your data to CSV if you ever want it

It is offered **completely free** — no pricing tiers, no paywalls.

---

## 3. Tech Stack

### Backend
| Layer | Technology | Why |
|---|---|---|
| Runtime | Node.js 20 | Fast, non-blocking I/O, huge ecosystem |
| Framework | Express.js | Minimal, flexible, industry standard |
| Database | MongoDB Atlas | Flexible document model, free cloud tier |
| ODM | Mongoose | Schema validation + easy querying on top of MongoDB |
| Auth | JSON Web Tokens (JWT) | Stateless, scales horizontally, no session store needed |
| Password hashing | bcrypt | Industry-standard adaptive hashing with salt |
| Token generation | Node.js `crypto` | Built-in — no extra package needed |
| Validation | Zod | Schema-first validation with great TypeScript-like safety in JS |
| Dev server | nodemon | Auto-restarts on file changes |
| Env management | dotenvx | Loads `.env` with encryption support |

### Frontend
| Layer | Technology | Why |
|---|---|---|
| UI library | React 18 | Component model, huge community, hooks API |
| Build tool | Vite | Near-instant dev server, fast HMR |
| Styling | Tailwind CSS | Utility-first, no custom CSS files needed |
| Routing | React Router v6 | Declarative nested routing, protected routes |
| HTTP client | Axios | Interceptors for automatic JWT attachment |
| Icons | react-icons (Bootstrap Icons) | 2000+ icons, tree-shakeable |
| State | React Context + useState/useMemo | Sufficient for this scale — no Redux overhead |

---

## 4. Project Structure

```
HireFlow/
├── server/                      ← Express backend
│   ├── app.js                   ← Express app setup (CORS, middleware, routes)
│   ├── server.js                ← Entry point: connects DB, starts server
│   ├── .env                     ← Secrets (not committed)
│   ├── config/
│   │   └── database.js          ← Mongoose connect function
│   ├── constants/
│   │   ├── applicationConstants.js   ← APPLICATION_STATUS enum array
│   │   └── authConstants.js          ← SALT_ROUNDS
│   ├── controllers/
│   │   ├── authController.js         ← register, login, getMe, updateMe,
│   │   │                               forgotPassword, resetPassword, changePassword
│   │   └── applicationController.js  ← CRUD for applications
│   ├── middleware/
│   │   ├── authMiddleware.js         ← JWT verification, injects req.user
│   │   └── errorMiddleware.js        ← Global error handler
│   ├── models/
│   │   ├── userModel.js              ← User schema
│   │   └── applicationModel.js       ← Application schema
│   ├── routes/
│   │   ├── authRoutes.js             ← /api/auth/*
│   │   └── applicationRoutes.js      ← /api/applications/*
│   ├── validators/
│   │   └── applicationValidator.js   ← Zod validation middleware
│   └── utils/                        ← (reserved for helpers)
│
└── client/                      ← React frontend
    ├── index.html               ← Single HTML shell
    ├── vite.config.js           ← Vite + proxy config
    ├── src/
    │   ├── main.jsx             ← React root, wraps app in AuthProvider
    │   ├── App.jsx              ← Renders AppRouter
    │   ├── index.css            ← Tailwind directives + global CSS vars
    │   ├── api/
    │   │   ├── axiosInstance.js      ← Axios base URL + JWT interceptor
    │   │   ├── authApi.js            ← register(), login(), getCurrentUser()
    │   │   └── applicationsApi.js    ← CRUD wrappers for /api/applications
    │   ├── contexts/
    │   │   └── AuthContext.jsx       ← Global auth state (user, login, logout)
    │   ├── hooks/
    │   │   ├── useAuth.js            ← Consumes AuthContext
    │   │   ├── useApplications.js    ← (reserved hook)
    │   │   └── useDebounce.js        ← Debounce helper
    │   ├── routes/
    │   │   ├── AppRouter.jsx         ← All route definitions
    │   │   ├── ProtectedRoute.jsx    ← Redirects to /login if not authenticated
    │   │   └── PublicRoute.jsx       ← Redirects to /dashboard if already logged in
    │   ├── layouts/
    │   │   ├── DashboardLayout.jsx   ← Sidebar + Header + <Outlet />
    │   │   └── AuthLayout.jsx        ← (reserved)
    │   ├── pages/
    │   │   ├── HomePage.jsx          ← Public landing page
    │   │   ├── NotFoundPage.jsx      ← 404 page
    │   │   ├── auth/
    │   │   │   ├── LoginPage.jsx
    │   │   │   ├── RegisterPage.jsx
    │   │   │   ├── ForgotPasswordPage.jsx
    │   │   │   └── ResetPasswordPage.jsx
    │   │   └── dashboard/
    │   │       ├── DashboardPage.jsx
    │   │       ├── ApplicationsPage.jsx
    │   │       ├── AnalyticsPage.jsx      ← Coming soon placeholder
    │   │       ├── CalendarPage.jsx       ← Coming soon placeholder
    │   │       ├── ResumePage.jsx         ← Coming soon placeholder
    │   │       ├── ProfilePage.jsx        ← Functional (edit name)
    │   │       └── SettingsPage.jsx       ← Change password + placeholders
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Button.jsx
    │   │   │   ├── Input.jsx
    │   │   │   ├── ErrorMessage.jsx
    │   │   │   ├── Modal.jsx
    │   │   │   ├── Loader.jsx
    │   │   │   ├── EmptyState.jsx
    │   │   │   ├── ComingSoon.jsx
    │   │   │   └── FloatingAIAssistant.jsx   ← "Coming soon" popup
    │   │   ├── layout/
    │   │   │   ├── Sidebar.jsx            ← Desktop nav
    │   │   │   ├── MobileSidebar.jsx      ← Slide-in nav for mobile
    │   │   │   ├── Header.jsx             ← Top bar with search, user, notifications
    │   │   │   └── PageContainer.jsx      ← Consistent page padding wrapper
    │   │   ├── applications/
    │   │   │   ├── ApplicationForm.jsx    ← Add/Edit form (modal content)
    │   │   │   ├── ApplicationTable.jsx   ← Table with selection, actions
    │   │   │   ├── ApplicationCard.jsx    ← (reserved for Kanban view)
    │   │   │   └── StatusBadge.jsx        ← Coloured status pill
    │   │   ├── dashboard/
    │   │   │   ├── StatsCard.jsx          ← Animated stat with gradient
    │   │   │   ├── RecentApplications.jsx ← Last 4 applications list
    │   │   │   ├── ProgressCard.jsx       ← Progress bars per stage
    │   │   │   └── ActivityChart.jsx      ← Bar chart (applications per day)
    │   │   ├── settings/
    │   │   │   └── ChangePasswordForm.jsx ← Inline change-password form
    │   │   └── profile/
    │   │       └── ProfileCard.jsx        ← (reserved)
    │   └── utils/
    │       ├── constants.js
    │       ├── formatDate.js
    │       ├── navigation.js
    │       └── storage.js
```

---

## 5. Architecture Overview

```
Browser (React SPA)
        │
        │  HTTP/JSON  (Axios + JWT Bearer token)
        ▼
Express REST API  (:5000)
        │
        │  Mongoose ODM
        ▼
MongoDB Atlas  (cloud database)
```

### Key architectural decisions

**Monorepo with two separate apps** — `client/` and `server/` are independent Node projects. They run on different ports during development (5173 and 5000). In production they would be deployed separately (e.g. Vercel for client, Railway/Render for server).

**Stateless JWT auth** — The server does not store sessions. Every request that needs auth sends `Authorization: Bearer <token>` in the HTTP header. The server verifies the token's signature and expiry using the `JWT_SECRET` environment variable. This means the server can restart without logging anyone out.

**Single-page application (SPA)** — The browser loads one HTML file, and React Router handles all navigation client-side. Page transitions are instant because no full-page reloads happen.

---

## 6. Backend Deep-Dive

### `server.js` — Entry point
- Imports `app.js` and `database.js`
- Calls `connectDB()` then starts `app.listen(PORT)`
- All uncaught errors bubble up here

### `app.js` — Express setup
```js
app.use(cors())           // allow requests from the React dev server
app.use(express.json())   // parse JSON request bodies
app.use("/api/applications", applicationRoutes)
app.use("/api/auth", authRoutes)
app.use(errorMiddleware)  // catches any error passed to next(error)
```

### `authMiddleware.js` — JWT guard
Every protected route runs through this first:
1. Reads `Authorization` header
2. Strips the `Bearer ` prefix to get the raw token
3. Calls `jwt.verify(token, JWT_SECRET)` — throws if expired or tampered
4. Attaches decoded payload as `req.user` so controllers can read `req.user.userId`

### `applicationValidator.js` — Zod validation
Runs before the controller. Validates that `companyName`, `jobRole`, and `status` are present and correct. If validation fails, returns a `400` with a structured errors array — the controller never even runs.

### Controllers
All controller functions follow the same pattern:
```js
export const someAction = async (req, res, next) => {
  try {
    // 1. Extract data from req.body / req.params / req.user
    // 2. Query/mutate the database via Mongoose
    // 3. Return a JSON response: { success: true, data: ... }
  } catch (error) {
    next(error); // passes to errorMiddleware
  }
};
```

### Models

**User model fields:**
- `name`, `email`, `password` (hashed), `role` (user/admin)
- `resetPasswordToken` (SHA-256 hash of the raw token)
- `resetPasswordExpires` (Date — 1 hour from generation)
- `isEmailVerified`, `emailVerificationToken` (ready for email verification feature)

**Application model fields:**
- `user` (ObjectId ref to User — ownership)
- `companyName`, `jobRole`, `jobLink`
- `status` (enum: `Applied | Interview | Offer | Rejected`)
- `location`, `workType` (Remote / Hybrid / On-site)
- `priority` (Low / Medium / High)
- `appliedDate`, `notes`, `followUpDate`

---

## 7. Frontend Deep-Dive

### `main.jsx` — React root
```jsx
<AuthProvider>
  <App />
</AuthProvider>
```
`AuthProvider` wraps everything so any component can access auth state via `useAuth()`.

### `AuthContext.jsx` — Global auth state
Stores `user` object and `loading` boolean. On app mount it runs `restoreSession()`:
1. Reads JWT from `localStorage`
2. If token exists, calls `GET /api/auth/me`
3. If successful, sets `user` in state (user stays logged in across refreshes)
4. If the token is expired/invalid, calls `logout()` (clears localStorage)

The context exposes: `user`, `loading`, `isAuthenticated`, `login()`, `logout()`

### `axiosInstance.js` — HTTP client
```js
const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

// Interceptor runs before EVERY request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```
This means **no component ever manually sets the Authorization header** — it's automatic.

### `AppRouter.jsx` — Routing
Three route types:
- **Public routes** (`/`, `/login`, `/register`, `/forgot-password`, `/reset-password/:token`) — accessible by anyone
- **PublicRoute wrapper** — if already logged in, redirects to `/dashboard` (can't visit login when authenticated)
- **ProtectedRoute wrapper** — if not logged in, redirects to `/login` (can't visit dashboard when unauthenticated)

Dashboard routes are nested inside `DashboardLayout` which renders `Sidebar + Header + <Outlet />`.

### `DashboardLayout.jsx` — Shell
```
┌──────────────┬────────────────────────────────────┐
│              │  Header (search, notif, user)       │
│   Sidebar    ├────────────────────────────────────┤
│  (desktop)   │                                    │
│              │   <Outlet />  (page content)        │
│              │                                    │
└──────────────┴────────────────────────────────────┘
```
On mobile: sidebar is hidden, hamburger button in Header opens `MobileSidebar` (slide-in overlay).

### `useMemo` for performance
In `ApplicationsPage`, the filtered+sorted list is wrapped in `useMemo`:
```js
const filtered = useMemo(() => {
  // filter by search query, statusFilter
  // sort by sortBy
}, [applications, searchQuery, statusFilter, sortBy]);
```
This means the list is only recomputed when those four dependencies change — not on every render.

---

## 8. Full Feature Walkthrough

### Landing Page (`/`)
- Full marketing page: Hero, Features, How It Works, Testimonials, FAQ, Footer
- CTA buttons link to `/register`
- No hardcoded user data — purely marketing content

### Register (`/register`)
1. User fills in name, email, password, confirm password
2. Frontend validates passwords match
3. Calls `POST /api/auth/register` — backend hashes password with bcrypt, creates User
4. Immediately calls `POST /api/auth/login` with same credentials
5. Stores JWT in `localStorage`, calls `GET /api/auth/me`, saves user to context
6. Navigates to `/dashboard`

### Login (`/login`)
1. User enters email + password
2. Calls `POST /api/auth/login` — backend compares hashed password
3. On success: stores token, fetches user, navigates to `/dashboard`
4. "Forgot password?" link goes to `/forgot-password`

### Forgot Password (`/forgot-password`)
1. User enters email address
2. Backend generates a random 32-byte token via `crypto.randomBytes(32)`
3. Token is hashed with SHA-256 and saved to the user's `resetPasswordToken` field
4. Raw token is printed to console (production: would be emailed)
5. User visits `/reset-password/{rawToken}`

### Reset Password (`/reset-password/:token`)
1. Frontend sends `POST /api/auth/reset-password/:token` with new password
2. Backend hashes the URL token with SHA-256 and looks it up in DB
3. Checks `resetPasswordExpires > Date.now()` (1-hour window)
4. If valid: hashes new password, saves it, clears token fields
5. User is redirected to `/login`

### Dashboard (`/dashboard`)
- Fetches all applications on mount
- Computes stats in-memory: total, interviews, offers, rejected
- Shows 4 StatsCards, RecentApplications (last 4), ProgressCard, ActivityChart
- Empty state shown if no applications yet
- "Add Application" button navigates to `/dashboard/applications`

### Applications (`/dashboard/applications`)
- Fetches all applications from `GET /api/applications`
- **Search**: filters across `companyName`, `jobRole`, `location` — instant, client-side
- **Filter**: by status (Applied / Interview / Offer / Rejected)
- **Sort**: newest, oldest, company A-Z, status
- **Table**: checkbox selection, view link, edit button, delete button
- **Bulk delete**: select multiple → delete all at once
- **Export CSV**: downloads filtered results as a `.csv` file
- **Add/Edit modal**: `ApplicationForm` inside `Modal` component
- Form sends `companyName`, `jobRole`, `location`, `workType`, `status`, `priority`, `notes`, `jobLink`, `appliedDate`

### Profile (`/dashboard/profile`)
- Shows name, email, role, member since
- Inline name editing: click "Edit Name" → input appears → save calls `PATCH /api/auth/me`
- On save success: updates the user in `AuthContext` so header/sidebar also update immediately

### Settings (`/dashboard/settings`)
- **Change Password** section: functional — current password + new password + confirm
- Calls `POST /api/auth/change-password`
- Notifications, Preferences, Privacy sections: "Coming soon" placeholders

### Analytics, Calendar, Resume
- "Coming soon" placeholder pages — structure is in place, features are roadmapped

---

## 9. All API Endpoints

### Auth — `/api/auth`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | No | Create new account |
| POST | `/login` | No | Login, returns JWT |
| GET | `/me` | Yes | Get logged-in user's data |
| PATCH | `/me` | Yes | Update user's name |
| POST | `/forgot-password` | No | Request password reset link |
| POST | `/reset-password/:token` | No | Reset password with token |
| POST | `/change-password` | Yes | Change password (requires current password) |

### Applications — `/api/applications`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Yes | Get all applications for logged-in user |
| POST | `/` | Yes | Create a new application |
| GET | `/:id` | Yes | Get a single application |
| PATCH | `/:id` | Yes | Update an application |
| DELETE | `/:id` | Yes | Delete an application |

**All application routes enforce ownership** — a user can only read/update/delete their own applications. The query always includes `{ user: req.user.userId }` so one user can never access another's data.

---

## 10. Data Models

### User
```
{
  name:                   String (required)
  email:                  String (required, unique, lowercase)
  password:               String (required, bcrypt hash)
  role:                   "user" | "admin"  (default: "user")
  resetPasswordToken:     String (SHA-256 hash)
  resetPasswordExpires:   Date   (1hr from generation)
  isEmailVerified:        Boolean (default: false)
  emailVerificationToken: String
  createdAt:              Date (auto)
  updatedAt:              Date (auto)
}
```

### Application
```
{
  user:          ObjectId → User (owner)
  companyName:   String (required)
  jobRole:       String (required)
  jobLink:       String
  status:        "Applied" | "Interview" | "Offer" | "Rejected"  (default: "Applied")
  location:      String
  workType:      "Remote" | "Hybrid" | "On-site" | ""
  priority:      "Low" | "Medium" | "High"  (default: "Medium")
  notes:         String
  appliedDate:   Date (default: now)
  followUpDate:  Date
  source:        String
  resumeVersion: String
  createdAt:     Date (auto)
  updatedAt:     Date (auto)
}
```

---

## 11. Authentication Flow

```
User fills login form
        │
        ▼
POST /api/auth/login
        │
        ├── Find user by email
        ├── bcrypt.compare(password, user.password)
        ├── jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" })
        │
        ▼
Return { success: true, token: "eyJ..." }
        │
        ▼
Frontend stores token in localStorage
        │
        ▼
GET /api/auth/me  (with Bearer token)
        │
        ├── authMiddleware verifies token
        ├── Finds user by userId from token payload
        │
        ▼
Return { success: true, data: { id, name, email, role } }
        │
        ▼
AuthContext.setUser(data)  →  app knows user is logged in
        │
        ▼
Navigate to /dashboard
```

On every subsequent request, the Axios interceptor automatically reads the token from `localStorage` and adds it to the `Authorization` header.

---

## 12. Password Reset Flow

```
1. User visits /forgot-password
        │
        ▼
POST /api/auth/forgot-password  { email }
        │
        ├── Find user by email (no error if not found — prevents enumeration)
        ├── crypto.randomBytes(32) → rawToken
        ├── SHA-256 hash → hashedToken (stored in DB)
        ├── Set resetPasswordExpires = now + 1 hour
        ├── Save user
        ├── console.log reset URL (dev) / send email (prod)
        │
        ▼
User copies token from console, visits /reset-password/{rawToken}
        │
        ▼
POST /api/auth/reset-password/:token  { password }
        │
        ├── SHA-256 hash the token from URL
        ├── Find user where resetPasswordToken = hash AND expires > now
        ├── If not found → 400 "Token invalid or expired"
        ├── bcrypt.hash(newPassword) → store as user.password
        ├── Clear resetPasswordToken and resetPasswordExpires
        ├── Save user
        │
        ▼
Return success → frontend redirects to /login
```

**Why hash the token before storing it?**  
If the database were ever breached, an attacker would find only SHA-256 hashes — they cannot reverse those to get the raw tokens needed to reset passwords. The raw token only ever lives in the email (or console log in dev).

---

## 13. Application CRUD Flow

### Create
```
User fills ApplicationForm → clicks "Add Application"
        │
POST /api/applications  { companyName, jobRole, status, ... }
        │
        ├── authMiddleware injects req.user
        ├── validateApplication (Zod) checks required fields
        ├── Application.create({ ...req.body, user: req.user.userId })
        │
Return { success: true, data: newApplication }
        │
Frontend refreshes the applications list
```

### Read (list)
```
Component mounts → useEffect calls getApplications()
        │
GET /api/applications  (with Bearer token)
        │
Application.find({ user: userId }).sort({ createdAt: -1 })
        │
Return { success: true, count: N, data: [...] }
        │
setApplications(response.data)
        │
useMemo recomputes filtered/sorted list → table re-renders
```

### Update
```
User clicks pencil icon → modal opens with pre-filled form
User edits fields → clicks "Update Application"
        │
PATCH /api/applications/:id  { ...changes }
        │
findOneAndUpdate({ _id: id, user: userId }, { $set: req.body })
        │  ↑ ownership enforced at database level
Return updated document
        │
Frontend refreshes list
```

### Delete
```
User clicks trash icon → confirm dialog
        │
DELETE /api/applications/:id
        │
findOneAndDelete({ _id: id, user: userId })
        │
Return { success: true, message: "Deleted" }
        │
Frontend refreshes list
```

---

## 14. How State is Managed

HireFlow uses **React Context + local useState** — no Redux, no Zustand, no external state library. This is intentional: the app is not complex enough to need a state machine.

### Auth state (`AuthContext`)
- Global: lives at the root level in `AuthProvider`
- Contains: `user`, `loading`, `isAuthenticated`
- Consumed via: `const { user, logout } = useAuth()`
- Persisted via: JWT in `localStorage` + session restore on app load

### Page state (local)
Every page manages its own data:
```js
const [applications, setApplications] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
```
This keeps pages independent — refreshing one page doesn't affect another.

### Derived state (useMemo)
Filtering and sorting never hit the server — it's computed client-side from the already-fetched `applications` array. `useMemo` ensures the computation only re-runs when the input actually changes.

---

## 15. Routing System

```
/                           → HomePage (public)
/login                      → LoginPage (public-only: redirect if logged in)
/register                   → RegisterPage (public-only)
/forgot-password            → ForgotPasswordPage (public-only)
/reset-password/:token      → ResetPasswordPage (public-only)

/dashboard                  → DashboardPage         ┐
/dashboard/applications     → ApplicationsPage      │ All protected:
/dashboard/analytics        → AnalyticsPage         │ redirect to /login
/dashboard/calendar         → CalendarPage          │ if not authenticated
/dashboard/resume           → ResumePage            │
/dashboard/profile          → ProfilePage           │
/dashboard/settings         → SettingsPage          ┘

*                           → NotFoundPage (404)
```

**ProtectedRoute** checks `isAuthenticated`. If false and auth has finished loading, it redirects to `/login`.

**PublicRoute** checks `isAuthenticated`. If true, it redirects to `/dashboard`. This prevents a logged-in user from seeing the login form.

Both routes show a loading spinner while `AuthContext` is still restoring the session from `localStorage`.

---

## 16. Security Decisions

| Decision | Implementation | Reason |
|---|---|---|
| Passwords never stored plain | `bcrypt.hash(password, 10)` | One-way hash — even we can't read passwords |
| Passwords never returned to client | `.select("-password")` in Mongoose queries | Never expose hashed passwords over the wire |
| JWT secret in env variable | `process.env.JWT_SECRET` | Never hardcoded — different per environment |
| Ownership check on every query | `{ _id: id, user: userId }` | User A cannot access User B's applications |
| Reset tokens hashed before storage | SHA-256 hash in DB | DB breach doesn't expose usable tokens |
| Reset token expiry | 1 hour | Limits the attack window |
| No user enumeration | Forgot password returns same message whether email exists or not | Prevents checking which emails are registered |
| Input validation | Zod middleware before controllers | Rejects malformed data before it touches the DB |
| CORS enabled | `app.use(cors())` | Allows the React dev server to call the API |

---

## 17. Known Limitations & Next Steps

### Current limitations
- **No email sending** — password reset token is logged to console. Needs SendGrid/Nodemailer in production.
- **No email verification** — users can register with any email address.
- **No rate limiting** — the forgot-password endpoint can be called in a loop.
- **All data loads at once** — no pagination. Fine for <500 applications, but would need cursor-based pagination beyond that.
- **No file uploads** — resume upload is a "coming soon" placeholder.

### Next features (roadmapped)
1. **Interview Calendar** — schedule interviews, get reminders
2. **Analytics Dashboard** — charts: applications over time, funnel conversion, success rate
3. **Email Service** — nodemailer + SendGrid for password reset emails
4. **Rate Limiting** — express-rate-limit on auth endpoints
5. **Resume Manager** — upload, store, attach to applications
6. **Email Verification** — verify email on registration
7. **Google OAuth** — sign in with Google
8. **Mobile App** — React Native client using the same API

---

## 18. How to Run the Project

### Prerequisites
- Node.js 18 or 20
- npm
- A MongoDB Atlas account (or local MongoDB)

### Backend
```powershell
cd server
npm install
# Create .env file (see section 19)
npm run dev
# Server starts at http://localhost:5000
```

### Frontend
```powershell
cd client
npm install
# Create .env file (see section 19)
npm run dev
# App starts at http://localhost:5173
```

### Both at once (from repo root)
```powershell
# Terminal 1
cd server ; npm run dev

# Terminal 2
cd client ; npm run dev
```

---

## 19. Environment Variables

### `server/.env`
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=a-long-random-string-at-least-32-chars
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### `client/.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> **Never commit `.env` files.** Both are listed in `.gitignore`.

---

## 20. Glossary

| Term | Meaning in this project |
|---|---|
| **SaaS** | Software as a Service — web app delivered over the internet, no install needed |
| **JWT** | JSON Web Token — a signed string encoding user identity, used instead of sessions |
| **bcrypt** | Password hashing algorithm with a configurable "cost factor" (salt rounds) |
| **Mongoose** | ODM (Object Document Mapper) — maps JS objects to MongoDB documents |
| **Schema** | The shape of a MongoDB document defined in Mongoose (fields, types, validation) |
| **Middleware** | Function that runs between the HTTP request and the final controller |
| **Controller** | Function that handles the business logic for a specific route |
| **Context** | React's built-in mechanism for sharing state across the component tree |
| **SPA** | Single Page Application — the browser never does a full-page reload |
| **HMR** | Hot Module Replacement — Vite swaps changed modules in the browser without reload |
| **Enum** | A fixed set of allowed values — e.g. status can only be Applied/Interview/Offer/Rejected |
| **useMemo** | React hook that caches an expensive computation result between renders |
| **Protected route** | A route that redirects to login if the user is not authenticated |
| **CORS** | Cross-Origin Resource Sharing — allows the frontend (port 5173) to call the API (port 5000) |
| **ODM** | Object Document Mapper — like an ORM but for document databases (MongoDB) |
