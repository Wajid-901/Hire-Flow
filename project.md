# HireFlow — Complete Interview Preparation Guide

> Study this file before any technical interview.
> Every question an interviewer can ask about this project is answered here.

---

## Table of Contents

1. [Phase 1 — High-Level Understanding](#phase-1--high-level-understanding)
2. [Phase 2 — Folder-by-Folder Breakdown](#phase-2--folder-by-folder-breakdown)
3. [Phase 3 — File-by-File Analysis](#phase-3--file-by-file-analysis)
4. [Phase 4 — JavaScript Concepts Used](#phase-4--javascript-concepts-used)
5. [Phase 5 — React Concepts Used](#phase-5--react-concepts-used)
6. [Phase 6 — Backend Concepts](#phase-6--backend-concepts)
7. [Phase 7 — MongoDB Deep Dive](#phase-7--mongodb-deep-dive)
8. [Phase 8 — Security Review](#phase-8--security-review)
9. [Phase 9 — Performance Review](#phase-9--performance-review)
10. [Phase 10 — System Design & Scalability](#phase-10--system-design--scalability)
11. [Phase 11 — Interview Questions with Answers](#phase-11--interview-questions-with-answers)
12. [Phase 12 — Project Defense](#phase-12--project-defense)
13. [Phase 13 — Resume Preparation](#phase-13--resume-preparation)

---

# Phase 1 — High-Level Understanding

## What problem does HireFlow solve?

When people apply for jobs, they use spreadsheets or sticky notes. They forget which companies they applied to, miss follow-up deadlines, cannot see patterns in their rejections, and have no insight into their own job search funnel.

HireFlow replaces the spreadsheet with a purpose-built web application that:
- Stores every job application with full details
- Tracks applications through a hiring pipeline (Applied → Interview → Offer → Rejected)
- Visualises progress with real charts
- Sends emails (password reset, welcome)
- Lets users search, filter, sort, and export their data

## Why does this project exist?

Most job application trackers are either expensive SaaS tools or basic spreadsheet templates. HireFlow is built to be completely free, production-grade, and technically impressive — a full-stack project that demonstrates real engineering skills.

## Who are the users?

- Students applying for internships or first jobs
- Professionals making career transitions
- Anyone applying to multiple companies and needing organisation

## Real-world use cases

1. A student applies to 50 companies over 3 months. HireFlow lets them see which companies are at the interview stage, which rejected them, and their overall success rate.
2. A professional uses the CSV export to share their job search data with a career counsellor.
3. A user forgets their password → uses the forgot-password flow → receives a professional HTML email with a reset link.

## Overall Architecture

```
┌─────────────────────────────────────────────────────┐
│                    BROWSER                          │
│         React SPA (Vite + TailwindCSS)             │
│         https://hireflow.vercel.app                │
└─────────────────┬───────────────────────────────────┘
                  │ HTTPS + JSON
                  │ Authorization: Bearer <JWT>
                  ▼
┌─────────────────────────────────────────────────────┐
│                 EXPRESS API SERVER                  │
│         Node.js 20 on Render.com                   │
│         https://hireflow-api-e53e.onrender.com     │
│                                                     │
│  Helmet → CORS → Rate Limiter → Routes →           │
│  Auth Middleware → Zod Validator → Controller      │
└─────────────────┬───────────────────────────────────┘
                  │ Mongoose ODM
                  ▼
┌─────────────────────────────────────────────────────┐
│               MONGODB ATLAS                         │
│         Cloud database (free tier)                 │
│         Collections: users, applications           │
└─────────────────────────────────────────────────────┘
```

## Technology Stack — with reasons

### Frontend

| Tech | Why this, not alternatives |
|---|---|
| **React 18** | Component model makes UI reusable. Huge ecosystem. Industry standard. Alternative: Vue (smaller ecosystem), Angular (too complex for this scale), Svelte (smaller community). |
| **Vite** | Starts in milliseconds. HMR is near-instant. Alternative was Create React App — abandoned and slow. |
| **Tailwind CSS** | Utility classes mean no separate CSS files. Design stays consistent. Alternative: CSS Modules (more files), Styled Components (runtime overhead), plain CSS (too verbose). |
| **React Router v7** | Declarative routing. Nested routes. Protected routes pattern. Alternative: TanStack Router (newer, less adoption). |
| **Axios** | Interceptors let us attach JWT to every request automatically. Alternative: fetch (no interceptors, verbose). |
| **Recharts** | React-native chart library. Composable, responsive. Alternative: Chart.js (not React-native), D3 (too low-level for this). |
| **React Context** | Sufficient for this scale. No prop drilling. Alternative: Redux (overkill — this app has no complex state interactions), Zustand (lighter but external dependency). |

### Backend

| Tech | Why this, not alternatives |
|---|---|
| **Node.js** | Same language as frontend (JavaScript). Non-blocking I/O handles concurrent requests well. Alternative: Python/Django (different language), Java Spring (too heavy). |
| **Express 5** | Minimal, flexible, industry standard. Alternative: Fastify (slightly faster but less adoption), NestJS (opinionated, more complex). |
| **MongoDB Atlas** | Schema flexibility suits job applications (different fields per application). Free cloud tier. Alternative: PostgreSQL (relational, needs fixed schema, better for complex joins), MySQL. |
| **Mongoose** | Schema validation, middleware hooks, clean query syntax on top of MongoDB. Alternative: raw MongoDB driver (no schema validation). |
| **JWT** | Stateless. Server doesn't store sessions. Scales horizontally without shared session store. Alternative: Sessions + cookies (stateful, needs Redis for scaling). |
| **bcrypt** | Industry standard for password hashing. Adaptive — can increase cost as hardware improves. Alternative: argon2 (newer, slightly better but less battle-tested). |
| **Nodemailer** | Most popular Node.js email library. Works with any SMTP provider. Alternative: SendGrid SDK (vendor lock-in). |
| **Zod** | Schema-first validation. TypeScript-friendly. Alternative: Joi (older), express-validator (less elegant). |
| **Helmet** | One line adds ~14 security headers. Alternative: setting headers manually (error-prone). |
| **express-rate-limit** | Protects auth endpoints from brute force. Alternative: nginx rate limiting (requires infrastructure changes). |

## Data Flow — Complete Request-Response Lifecycle

**Example: User logs in**

```
1. User types email + password, clicks "Sign In"

2. React calls loginUser() in authApi.js
   → axios.post('/auth/login', { email, password })

3. Axios interceptor runs BEFORE the request:
   → Checks localStorage for token
   → Adds "Authorization: Bearer <token>" header (not needed for login, but runs anyway)

4. Request leaves browser as HTTP POST to:
   https://hireflow-api-e53e.onrender.com/api/auth/login

5. Express receives request. Middleware chain runs in order:
   a. Helmet → adds security headers to response
   b. CORS → checks if origin is allowed
   c. express.json() → parses body: { email: "...", password: "..." }
   d. authLimiter → checks rate limit (max 20 req/15min per IP)
   e. Router matches POST /api/auth/login → calls loginUser controller

6. loginUser controller runs:
   a. Extracts email, password from req.body
   b. User.findOne({ email }) → queries MongoDB Atlas
   c. If user not found → return 401 "Invalid email or password"
   d. bcrypt.compare(password, user.password) → checks hash
   e. If no match → return 401
   f. jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" })
   g. Returns 200: { success: true, token: "eyJ..." }

7. Response travels back to browser

8. React (LoginPage.jsx) receives the response:
   a. localStorage.setItem("token", response.token)
   b. Calls GET /api/auth/me with the token
   c. Gets user object: { id, name, email, role }
   d. loginContext({ user, token }) → updates AuthContext state
   e. navigate("/dashboard") → React Router changes the URL

9. DashboardPage renders → useEffect fires → fetches applications
```

---

# Phase 2 — Folder-by-Folder Breakdown

## `server/` — Express Backend

```
server/
├── config/          stores database connection logic
├── constants/       application-wide constant values
├── controllers/     business logic — what happens when a route is hit
├── middleware/      functions that run between request and controller
├── models/          MongoDB schemas — shape of data in the database
├── routes/          URL definitions — which controller handles which URL
├── services/        reusable logic (email sending) not tied to a route
├── validators/      Zod schemas for request body validation
├── app.js           Express app setup (middleware + routes)
└── server.js        entry point — starts the server
```

**Why this structure?**
This is the **MVC pattern** (Model-View-Controller). Each folder has one responsibility. If you need to change how emails work, you only touch `services/`. If you need to change what data an application stores, you only touch `models/`. This is called **separation of concerns**.

**What if you put everything in one file?**
It would work for 100 lines. At 1000+ lines it becomes impossible to navigate, test, or maintain. You'd have to scroll through auth code to find database code.

## `server/config/`

Responsibility: connection to external services. Currently only MongoDB.
If removed: the server starts but crashes immediately because nothing connects to the database.

## `server/constants/`

Responsibility: single source of truth for values used in multiple places.
Example: `APPLICATION_STATUS = ["Applied", "Interview", "Offer", "Rejected"]`
If you need to add "Assessment" as a status, you change it in ONE place and both the model validation and frontend dropdown stay in sync.
If removed: you'd have the same string repeated in multiple files. One typo breaks everything.

## `server/controllers/`

Responsibility: business logic. Controllers read from `req`, talk to the database, and write to `res`.
They are intentionally thin — no database queries should live outside controllers and models.
If removed: routes would have to contain all the business logic — making them unreadable and untestable.

## `server/middleware/`

Responsibility: cross-cutting concerns that apply to many routes.
`authMiddleware.js` — verifies JWT, injects `req.user`
`errorMiddleware.js` — catches any error passed to `next(error)` from any controller
If removed: every route would need to manually verify tokens and handle errors.

## `server/models/`

Responsibility: the schema — what data looks like in MongoDB.
Mongoose models are the only place that talks to the database collections.
If removed: you lose schema validation, type enforcement, and the query abstraction layer.

## `server/routes/`

Responsibility: URL-to-controller mapping. Nothing else.
A route file should only have `router.get/post/patch/delete` calls.
If removed: Express has no idea which URL maps to which controller.

## `server/services/`

Responsibility: reusable logic that isn't tied to any specific route.
`emailService.js` can be called from registration, password reset, and future notifications.
Without this, email-sending code would be duplicated in every controller that needs it.

## `server/validators/`

Responsibility: validate the request body BEFORE the controller runs.
Uses Zod schemas. If validation fails, returns 400 immediately — the controller never runs.
This is defence in depth: bad data is rejected at the door, not inside business logic.

## `client/src/`

```
api/         wrappers around axios calls — keeps HTTP logic out of components
components/  reusable UI pieces — used across multiple pages
contexts/    global state (auth, toasts) — accessible from any component
hooks/       custom React hooks — reusable stateful logic
layouts/     page shells (sidebar + header) that wrap page content
pages/       one file per route — composes components into full pages
routes/      routing configuration and route guards
utils/       pure helper functions (date formatting, storage, etc.)
```

---

# Phase 3 — File-by-File Analysis

## `server/server.js`

```javascript
import "dotenv/config";        // loads .env file into process.env
import app from "./app.js";    // the configured Express application
import connectDB from "./config/database.js"; // MongoDB connect function

const PORT = process.env.PORT || 5000;
// process.env.PORT is set by Render in production (dynamic port assignment)
// || 5000 is the fallback for local development

const startServer = async () => {
  await connectDB();   // wait for DB connection BEFORE starting HTTP server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
```

**Why `async/await` here?**
`connectDB()` returns a Promise. If you call `app.listen()` before the database connects, the server accepts requests but any database query will fail. `await` ensures the DB is connected first.

**Why `process.env.PORT || 5000`?**
Render (and all cloud platforms) assign a random port and inject it as `PORT` environment variable. The `|| 5000` means: use the platform's port if available, otherwise fall back to 5000 for local dev.

## `server/app.js`

This file is the heart of the backend. It wires together every piece.

```javascript
import express   from "express";
import cors      from "cors";
import helmet    from "helmet";
import rateLimit from "express-rate-limit";
```

**What is `express`?**
Express is a web framework. Without it you'd use Node's raw `http` module, which requires manually parsing URLs, request bodies, and headers. Express does all that automatically.

**What is `cors`?**
CORS stands for Cross-Origin Resource Sharing. Browsers block requests from one domain to another by default (security policy). Our React app is on `vercel.app` and our API is on `onrender.com` — different domains. The `cors` middleware tells the browser "yes, requests from this origin are allowed."

**What is `helmet`?**
Helmet sets HTTP response headers that prevent common attacks:
- `X-Content-Type-Options: nosniff` — prevents MIME type sniffing
- `X-Frame-Options: SAMEORIGIN` — prevents clickjacking
- `Strict-Transport-Security` — forces HTTPS
- And 11 more. One line of code, 14 protections.

**What is `rateLimit`?**
Limits how many requests an IP address can make in a time window. Without this, an attacker can send millions of login attempts per second (brute force attack). With our config, an IP gets 20 attempts per 15 minutes on auth endpoints.

```javascript
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((u) => u.trim())
  : ["http://localhost:5173", "http://localhost:5174"];
```

**Why `.split(",").map(u => u.trim())`?**
`CLIENT_URL` in the environment can be set to multiple comma-separated URLs. This line splits them into an array. `.map(u => u.trim())` removes any accidental spaces around the commas.

```javascript
const vercelPreviewPattern = /^https:\/\/hireflow.*\.vercel\.app$/;
```

**What is this regex?**
A regular expression that matches any URL starting with `https://hireflow` and ending with `.vercel.app`. Vercel creates a new preview URL for every git push (like `hireflow-git-main-abc123.vercel.app`). Without this, every preview deployment would be blocked by CORS.

Breaking it down:
- `^` — must start here
- `https:\/\/` — literal `https://`
- `hireflow` — literal text
- `.*` — any characters (the random hash Vercel adds)
- `\.vercel\.app` — literal `.vercel.app`
- `$` — must end here

## `server/controllers/authController.js`

### `registerUser`

```javascript
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // Destructuring — extracts these 3 values from req.body object

    const existingUser = await User.findOne({ email });
    // findOne queries MongoDB for a document where email matches
    // Returns the user document or null

    if (existingUser) {
      return res.status(409).json({ ... });
      // 409 = Conflict — the resource already exists
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    // bcrypt.hash is async — it does CPU-intensive work
    // SALT_ROUNDS = 10 — how many times to process (higher = slower = more secure)

    const user = await User.create({ name, email, password: hashedPassword });
    // Creates a new document in the users collection

    sendEmail({ to: email, ...welcomeTemplate({ name }) }).catch(err =>
      console.error("Welcome email failed:", err.message)
    );
    // .catch() not await — we don't want registration to fail if email fails
    // This is called "fire and forget" — send the email but don't wait for it
```

**What is `SALT_ROUNDS = 10`?**
bcrypt works by running a hashing algorithm multiple times. `10` means it runs `2^10 = 1024` iterations. This takes about 100ms — fast enough for users, slow enough to make brute force attacks impractical. With 1024 iterations, an attacker can only try ~10 passwords per second instead of millions.

**Why not store the plain password?**
If your database is hacked, the attacker gets bcrypt hashes, not passwords. They cannot reverse a bcrypt hash. They would have to try every possible password, hash it, and compare — which takes years with the right number of salt rounds.

### `loginUser`

```javascript
const isMatch = await bcrypt.compare(password, user.password);
```

**How does bcrypt.compare work?**
bcrypt stores the salt inside the hash string. When you call `compare(plaintext, hash)`, bcrypt extracts the salt from the hash, hashes the plaintext with the same salt, and compares the result. If they match, the password is correct.

**Why do both wrong email and wrong password return the same message?**
"Invalid email or password." — If you returned "Email not found" for wrong email, an attacker could use your login form as a way to check which email addresses are registered. This is called **user enumeration**. The identical message prevents this.

### `forgotPassword`

```javascript
const rawToken = crypto.randomBytes(32).toString("hex");
const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
```

**Why two tokens — raw and hashed?**
- The `rawToken` is sent in the email URL. Only the user ever sees it.
- The `hashedToken` is stored in the database.
- If the database is breached, the attacker finds SHA-256 hashes — they cannot reverse these to get the raw tokens.
- When the user visits the reset link, we hash the URL token and compare it to the stored hash.

**Why `crypto.randomBytes(32)`?**
`crypto` is a built-in Node.js module. `randomBytes(32)` generates 32 cryptographically secure random bytes. `.toString("hex")` converts them to a 64-character hex string. This token is computationally impossible to guess.

```javascript
user.resetPasswordToken   = hashedToken;
user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
```

**Why store expiry?**
Without expiry, a stolen reset link works forever. With a 1-hour window, even if an attacker intercepts the email, the link is useless after 60 minutes.

```javascript
} catch (emailError) {
  user.resetPasswordToken   = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return res.status(500).json({ ... });
}
```

**Why roll back the token if email fails?**
If the email fails but the token is saved, the user has a token they never received. They can't reset their password AND they can't request a new one because a token already exists. Rolling back keeps the system in a clean state.

## `server/models/userModel.js`

```javascript
const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ["user", "admin"], default: "user" },
    resetPasswordToken:   { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);
```

**What is `trim: true`?**
Automatically removes leading and trailing whitespace before saving. Prevents `" john "` being saved instead of `"john"`.

**What is `lowercase: true` on email?**
Automatically converts to lowercase before saving. Prevents `John@Gmail.com` and `john@gmail.com` being treated as different users.

**What is `unique: true`?**
Tells MongoDB to create a unique index on this field. MongoDB will reject any document where the email already exists. This is enforced at the database level, not just application level.

**What is `enum`?**
Restricts the value to one of the listed options. If you try to save `role: "superadmin"`, Mongoose throws a validation error.

**What is `timestamps: true`?**
Automatically adds `createdAt` and `updatedAt` fields to every document. You get these for free — no need to manage them manually.

## `server/models/applicationModel.js`

```javascript
const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
```

**What is `ObjectId`?**
Every MongoDB document has a unique `_id` field of type `ObjectId` — a 12-byte unique identifier. By storing `user: ObjectId`, we create a reference from an application to the user who owns it. This is MongoDB's way of doing a foreign key (like in relational databases).

**What is `ref: "User"`?**
Tells Mongoose that this ObjectId references the `User` model. This enables `.populate("user")` which lets you fetch the full user object alongside the application in a single query. We don't use it in this project yet but the reference is there.

**Why is `required: false` on user?**
Belt-and-suspenders approach during development. In production, all applications belong to a user. The ownership is enforced in every controller query: `{ _id: id, user: userId }`.

## `server/middleware/authMiddleware.js`

```javascript
export const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // "Authorization: Bearer eyJ..."

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ ... });
    }

    const token = authHeader.split(" ")[1];
    // "Bearer eyJ..." → ["Bearer", "eyJ..."] → "eyJ..."

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Verifies the signature AND checks expiry
    // If invalid or expired → throws an error → caught by catch block

    req.user = decoded;
    // decoded = { userId: "...", role: "user", iat: ..., exp: ... }
    // Injects user info so controllers can access req.user.userId

    next(); // proceed to the next middleware or controller
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};
```

**What is `next()`?**
In Express, middleware functions receive `(req, res, next)`. Calling `next()` tells Express to move to the next middleware or route handler in the chain. NOT calling `next()` means the request hangs forever unless you send a response.

**What does `jwt.verify` actually check?**
1. It splits the token into three parts: header, payload, signature
2. It re-creates the signature using `JWT_SECRET`
3. If the re-created signature matches the token's signature → token is authentic
4. It checks `exp` (expiry time) — if the current time is past `exp`, throws an error
5. Returns the decoded payload: `{ userId, role, iat, exp }`

**What is `iat` and `exp`?**
- `iat` = "issued at" — Unix timestamp when the token was created
- `exp` = "expires at" — Unix timestamp when the token expires
- Both are automatically set by `jwt.sign()` based on the `expiresIn` option

## `client/src/api/axiosInstance.js`

```javascript
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

**What is `import.meta.env`?**
Vite's way of accessing environment variables. Variables must be prefixed with `VITE_` to be exposed to the browser. `import.meta.env.VITE_API_BASE_URL` reads from the `.env` file.

**What is an interceptor?**
A function that runs before every request (request interceptor) or after every response (response interceptor). Instead of manually adding the Authorization header in every API call, we add it once in the interceptor and it applies everywhere automatically.

**Why `localStorage` instead of a cookie?**
We chose localStorage for simplicity. Cookies have advantages (HttpOnly cookies can't be read by JavaScript, preventing XSS attacks) but require more setup (CORS credentials, SameSite settings). For this project, localStorage is acceptable. This is a valid interview discussion point.

## `client/src/contexts/AuthContext.jsx`

```javascript
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
```

**Why `loading` starts as `true`?**
When the app loads, we don't know if the user is logged in until we've checked localStorage and hit the `/api/auth/me` endpoint. During this check, `loading = true`. This prevents the app from briefly showing the login page to a logged-in user (called "flash of unauthenticated content").

```javascript
useEffect(() => {
  const restoreSession = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    try {
      const data = await getCurrentUser();
      setUser(data.data);
    } catch (error) {
      logout(); // token is invalid/expired — clean up
    } finally {
      setLoading(false);
    }
  };
  restoreSession();
}, []); // empty array = run once when component mounts
```

**Why call `/api/auth/me` instead of just reading the token?**
The token in localStorage could be expired. By hitting the API, we verify the token is still valid AND get fresh user data. If the token is expired, the server returns 401, we catch it, and call `logout()` to clean up.

**What is `useMemo` doing here?**
```javascript
const value = useMemo(
  () => ({ user, loading, isAuthenticated, login, logout }),
  [user, loading, isAuthenticated]
);
```
`useMemo` caches the context value object. Without it, every state change creates a new object reference, causing all context consumers to re-render even if the values didn't change. With `useMemo`, consumers only re-render when `user`, `loading`, or `isAuthenticated` actually changes.

## `client/src/routes/ProtectedRoute.jsx` and `PublicRoute.jsx`

```javascript
// ProtectedRoute — only for logged-in users
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

// PublicRoute — only for logged-OUT users
const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" />;
};
```

**What is `<Outlet />`?**
React Router's way of rendering nested routes. When a route is nested inside another, `<Outlet />` is where the child route renders.

**Why check `loading` before redirecting?**
During session restore, `isAuthenticated` is temporarily `false` (because user hasn't been fetched yet). Without checking `loading`, a logged-in user refreshing the dashboard would be briefly redirected to `/login`. The loading check prevents this.

## `client/src/pages/dashboard/ApplicationsPage.jsx`

```javascript
const filtered = useMemo(() => {
  let list = [...applications]; // spread creates a copy — never mutate state directly

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    list = list.filter(
      (a) =>
        a.companyName?.toLowerCase().includes(q) ||
        a.jobRole?.toLowerCase().includes(q) ||
        a.location?.toLowerCase().includes(q)
    );
  }

  if (statusFilter !== "all") {
    list = list.filter((a) => a.status === statusFilter);
  }

  list.sort((a, b) => { ... });

  return list;
}, [applications, searchQuery, statusFilter, sortBy]);
```

**Why `useMemo` here?**
Filtering and sorting an array is O(n log n) — it costs CPU time. Without `useMemo`, this runs on EVERY re-render — including when the user types in a completely unrelated input. With `useMemo`, it only re-runs when `applications`, `searchQuery`, `statusFilter`, or `sortBy` actually change.

**Why `[...applications]` instead of just `applications`?**
`Array.sort()` mutates the original array. If we sorted `applications` directly, we'd mutate React state, which is forbidden. Spreading into a new array `[...applications]` creates a copy that we can safely sort.

**What is the `?.` operator?**
Optional chaining. `a.companyName?.toLowerCase()` means: if `a.companyName` is `null` or `undefined`, return `undefined` instead of throwing `TypeError: Cannot read property 'toLowerCase' of undefined`.

---

# Phase 4 — JavaScript Concepts Used

## Async/Await

**What is it?**
A syntax for writing asynchronous code that looks synchronous. Under the hood, it uses Promises.

```javascript
// Without async/await (Promise chain)
User.findOne({ email })
  .then(user => bcrypt.compare(password, user.password))
  .then(isMatch => { ... })
  .catch(error => next(error));

// With async/await (same thing, easier to read)
const user = await User.findOne({ email });
const isMatch = await bcrypt.compare(password, user.password);
```

**What is a Promise?**
An object representing a value that will be available in the future. Has three states:
- Pending — operation not complete
- Fulfilled — operation succeeded, value available
- Rejected — operation failed, error available

**What is the Event Loop?**
JavaScript runs on a single thread. When you call `await User.findOne()`, JavaScript doesn't block. It sends the database query and moves on. When the query comes back, the Event Loop picks up the result and resumes from where `await` was.

```
Call Stack: [ startServer() ]
     ↓
await connectDB() → moves to Microtask Queue
     ↓
Call Stack is empty → Event Loop checks Microtask Queue
     ↓
connectDB resolves → back to Call Stack → app.listen()
```

## Destructuring

```javascript
const { name, email, password } = req.body;
// Instead of:
const name     = req.body.name;
const email    = req.body.email;
const password = req.body.password;
```

## Spread Operator

```javascript
sendEmail({ to: email, ...welcomeTemplate({ name }) });
// welcomeTemplate returns { subject: "...", html: "..." }
// Spread merges it: { to: email, subject: "...", html: "..." }
```

## Modules (ES Modules)

```javascript
import express from "express";  // named import
export const registerUser = ...  // named export
export default router;           // default export
```

**Why `"type": "module"` in package.json?**
Tells Node.js to treat all `.js` files as ES Modules (import/export) rather than CommonJS (require/module.exports). ES Modules are the modern standard.

## Closures

```javascript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  // ...
});
```

`rateLimit()` returns a function (the middleware). That function "closes over" the configuration — it remembers `windowMs` and `max` even after `rateLimit()` has returned. This is a closure: an inner function that has access to the variables of its outer function.

---

# Phase 5 — React Concepts Used

## Component Lifecycle

React functional components have a simplified lifecycle managed by hooks:

```
Mount    → useEffect(() => {...}, [])      runs once after render
Update   → useEffect(() => {...}, [dep])   runs when dep changes
Unmount  → useEffect(() => { return () => cleanup() }, [])
```

In `DashboardPage`:
```javascript
useEffect(() => {
  fetchApplications(); // runs once when component first renders
}, []); // empty = mount only
```

## Re-rendering

A component re-renders when:
1. Its state changes (`useState` setter is called)
2. Its props change
3. Its parent re-renders
4. Its context value changes

**Why does this matter?**
Unnecessary re-renders waste CPU. `useMemo` and `useCallback` prevent expensive computations from running on every render.

## Virtual DOM

React maintains a lightweight JavaScript copy of the real DOM. When state changes, React:
1. Creates a new Virtual DOM tree
2. Diffs it against the previous Virtual DOM (reconciliation)
3. Only updates the real DOM nodes that actually changed

This is much faster than rebuilding the entire DOM on every state change.

## JSX

JSX is syntactic sugar. This:
```jsx
<StatsCard title="Total" value={10} />
```

Compiles to:
```javascript
React.createElement(StatsCard, { title: "Total", value: 10 })
```

## Context API

Used for global state that needs to be accessible anywhere in the component tree without prop drilling.

```
App
├── AuthProvider (creates context)
│   ├── Header (useAuth() → reads context)
│   ├── Sidebar (useAuth() → reads context)
│   └── DashboardPage (useAuth() → reads context)
```

Without Context, you'd have to pass `user` as a prop from App all the way down to every component — called "prop drilling."

## Hooks

**useState** — declares state in a functional component
```javascript
const [loading, setLoading] = useState(true);
// loading = current value
// setLoading = function to update it
// true = initial value
```

**useEffect** — side effects (API calls, subscriptions, timers)
```javascript
useEffect(() => {
  fetchApplications();
}, []); // dependency array controls when effect re-runs
```

**useMemo** — caches expensive computed values
```javascript
const filtered = useMemo(() => computeFiltered(apps), [apps, query]);
```

**useContext** — reads from a context
```javascript
const { user, logout } = useContext(AuthContext);
// Shortcut: const { user, logout } = useAuth();
```

**useNavigate** — programmatic navigation in React Router
```javascript
const navigate = useNavigate();
navigate("/dashboard"); // pushes to history, no page reload
```

---

# Phase 6 — Backend Concepts

## Express Middleware Chain

```
Request comes in
      ↓
Helmet (sets security headers)
      ↓
CORS (checks origin, adds Allow-Origin header)
      ↓
express.json() (parses body string → JavaScript object)
      ↓
Rate Limiter (checks request count for this IP)
      ↓
Router (matches URL and HTTP method)
      ↓
authenticateUser (for protected routes — verifies JWT)
      ↓
validateApplication (Zod validation — checks body fields)
      ↓
Controller (business logic — talks to DB, sends response)
      ↓
errorMiddleware (catches any error from above)
      ↓
Response sent to client
```

Every middleware receives `(req, res, next)`. Calling `next()` moves to the next step. Calling `next(error)` skips to the error handler.

## REST API Principles

REST = Representational State Transfer. Rules:

| Principle | How we follow it |
|---|---|
| Use HTTP methods correctly | GET=read, POST=create, PATCH=update, DELETE=delete |
| Use nouns in URLs, not verbs | `/applications` not `/getApplications` |
| Stateless | Server doesn't store session state. Each request has all info needed (JWT). |
| Use status codes correctly | 200=OK, 201=Created, 400=Bad Request, 401=Unauthorized, 404=Not Found, 409=Conflict, 500=Server Error |

## JWT Structure

A JWT has 3 parts separated by dots:
```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMifQ.abc123
     HEADER                   PAYLOAD              SIGNATURE
```

- **Header**: `{ "alg": "HS256", "typ": "JWT" }` — algorithm used
- **Payload**: `{ "userId": "123", "role": "user", "iat": 1234, "exp": 5678 }` — the data
- **Signature**: HMAC-SHA256(base64(header) + "." + base64(payload), JWT_SECRET)

**Why can't you tamper with the payload?**
If you change the payload, the signature no longer matches. `jwt.verify()` recalculates the signature and detects the mismatch. Without knowing `JWT_SECRET`, you cannot generate a valid signature.

## HTTP Status Codes We Use

| Code | Meaning | When we use it |
|---|---|---|
| 200 | OK | Successful GET, PATCH |
| 201 | Created | Successful POST (new resource) |
| 400 | Bad Request | Validation error, bad input |
| 401 | Unauthorized | Wrong password, invalid token |
| 403 | Forbidden | Valid token but no permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Email already registered |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected error |

---

# Phase 7 — MongoDB Deep Dive

## Schema vs Model

```javascript
// Schema — blueprint, definition
const userSchema = new mongoose.Schema({ name: String, email: String });

// Model — the class that lets you query the database
const User = mongoose.model("User", userSchema);

// Usage
const user = await User.findOne({ email: "test@test.com" });
const newUser = await User.create({ name: "John", email: "john@test.com" });
```

## Queries We Use

```javascript
User.findOne({ email })           // find one document matching condition
User.findById(userId)             // find by _id
User.findByIdAndUpdate(id, data, { new: true })  // update and return NEW doc
Application.find({ user: userId }).sort({ createdAt: -1 })  // find all, newest first
Application.findOneAndDelete({ _id: id, user: userId })  // delete with ownership check
```

**What is `{ new: true }` in `findByIdAndUpdate`?**
By default, Mongoose returns the document as it was BEFORE the update. `{ new: true }` returns the document AFTER the update. Almost always you want `new: true`.

**What is `{ runValidators: true }`?**
By default, `findByIdAndUpdate` skips schema validation. `runValidators: true` enforces the schema rules (like enum values) during updates.

## Ownership-Enforced Queries

Every application query includes the user's ID:
```javascript
Application.findOne({ _id: id, user: userId })
```

This is critical. Without it:
- User A knows User B's application `_id`
- User A sends `DELETE /api/applications/<B's ID>`
- Without ownership check, User A deletes User B's application

With the ownership check, the query returns `null` for User A (because the application belongs to User B), and we return 404.

## Document Structure in MongoDB

MongoDB stores data as BSON (Binary JSON) documents:
```json
{
  "_id": ObjectId("64a1b2c3..."),
  "user": ObjectId("64a0..."),
  "companyName": "Google",
  "jobRole": "Frontend Engineer",
  "status": "Interview",
  "priority": "High",
  "appliedDate": ISODate("2026-08-15"),
  "createdAt": ISODate("2026-08-15"),
  "updatedAt": ISODate("2026-08-20")
}
```

---

# Phase 8 — Security Review

## What we implemented

| Threat | Our Defence |
|---|---|
| Brute force login | Rate limiter: 20 attempts per 15 minutes |
| SQL/NoSQL injection | Mongoose parameterised queries — never string concatenation |
| XSS | Helmet sets `X-Content-Type-Options`, React escapes JSX by default |
| Password theft via DB breach | bcrypt hashing, never store plaintext |
| Token theft | Tokens expire in 7 days, reset tokens expire in 1 hour |
| Reset token database theft | SHA-256 hash stored, not the raw token |
| CORS attacks | Whitelist of allowed origins |
| Clickjacking | Helmet sets `X-Frame-Options: SAMEORIGIN` |
| Large payload attacks | `express.json({ limit: "10kb" })` |
| User enumeration | Same response for existing and non-existing emails |
| Credential exposure | `.env` in `.gitignore`, never committed |
| Ownership bypass | Every query includes `user: userId` |

## Remaining Vulnerabilities (honest assessment)

**1. JWT stored in localStorage**
localStorage is accessible by JavaScript. An XSS attack could steal it. **Better approach**: HttpOnly cookie (JavaScript can't access it). Trade-off: more complex CORS setup.

**2. No email verification**
Users can register with any email. A user could register with someone else's email. **Fix**: Send verification email on registration, require verification before allowing login.

**3. No CSRF protection**
Relevant if we switch to cookies. Currently using localStorage + JWT, so CSRF is less of a concern.

**4. No security logging**
We don't log failed login attempts. In production, you'd want to alert on suspicious activity.

**5. JWT cannot be invalidated**
Once issued, a JWT is valid until expiry. If a user's account is compromised and you want to force logout, you can't — the token is still valid. **Fix**: Maintain a token blacklist in Redis, or use short-lived tokens (15 min) + refresh tokens.

---

# Phase 9 — Performance Review

## Frontend Performance

**Bundle size**: 847KB JS (gzipped: 244KB). This is larger than ideal.

The main culprit is Recharts. **Fix**: Dynamic import with React.lazy():
```javascript
const AnalyticsPage = React.lazy(() => import('./pages/dashboard/AnalyticsPage'));
```
This means Recharts is only downloaded when the user visits the Analytics page, not on initial load.

**useMemo on filtering**: Correctly implemented. Filtering 500 applications takes <1ms client-side.

**Skeleton loaders**: Correctly implemented. Users see content shape immediately instead of blank screens.

## Backend Performance

**N+1 query problem**: Not present. We fetch all applications in one query.

**No database indexes**: The `email` field has a unique index (automatically). But `user` field in applications has no index.

**Fix**: Add an index on `application.user` so queries by user are fast:
```javascript
applicationSchema.index({ user: 1, createdAt: -1 });
```
Without this index, finding a user's applications requires scanning ALL applications. With index, it's O(log n).

**No caching**: Every dashboard load hits the database. With Redis, you could cache user applications for 60 seconds.

## Database Performance

At current scale (single free tier): fine.

At 10,000 users each with 100 applications = 1 million documents. Without indexes, queries slow down. With proper indexes, still fast.

---

# Phase 10 — System Design & Scalability

## Current Architecture (10-100 users)

```
Browser → Vercel (CDN) → Render (single Node instance) → MongoDB Atlas
```

Works fine. No problems at this scale.

## 1,000 Users

Same architecture works. Render free tier handles ~1000 concurrent requests.

Add: **UptimeRobot** to prevent cold starts.

## 10,000 Users

```
Browser → Vercel CDN → Load Balancer → 2-3 Node instances → MongoDB Atlas
```

Need:
- Multiple server instances (Render paid tier or move to AWS)
- Session affinity not needed (stateless JWT — any server can handle any request)
- MongoDB connection pooling (Mongoose handles this automatically)
- Redis for caching frequent queries (user's applications list)

## 100,000 Users

```
Browser → CloudFront CDN → ALB → Auto Scaling Group of Node instances
→ MongoDB Atlas (M30+ cluster with replica sets)
→ Redis cluster for caching
→ SQS for email queue (don't block requests on email sending)
```

Need:
- Email sending moved to background job queue (SQS + Worker)
- MongoDB indexes on all query fields
- Redis for caching application lists (60 second TTL)
- CDN for static assets
- Monitoring (Datadog, CloudWatch)

## 1,000,000 Users

```
Browser → CDN → API Gateway → Microservices:
├── Auth Service (Node.js)
├── Applications Service (Node.js)
├── Email Service (Python or Node.js)
├── Analytics Service (Python for data processing)
→ MongoDB sharded cluster (horizontal scaling)
→ Redis cluster
→ Kafka for event streaming
→ Elasticsearch for application search
```

Need:
- Microservices (each service scales independently)
- MongoDB sharding (distribute data across multiple servers)
- Elasticsearch for full-text search across millions of applications
- Rate limiting at API Gateway level
- CDN for all static assets
- Multi-region deployment
- Database read replicas for analytics queries

---

# Phase 11 — Interview Questions with Answers

## Beginner Questions

**Q: What is HireFlow?**
A: HireFlow is a full-stack job application tracking web application. Users can register, log in, and track their job applications through a pipeline from Applied to Interview to Offer or Rejected. It's built with React on the frontend, Node.js/Express on the backend, and MongoDB as the database.

**Q: What is the difference between frontend and backend?**
A: The frontend is the React application — what the user sees in their browser. The backend is the Express server — it handles authentication, stores data in the database, and sends emails. They communicate via HTTP requests. The frontend sends JSON data to the backend, the backend processes it and sends JSON responses back.

**Q: What is a REST API?**
A: REST is a set of rules for designing web APIs. It uses HTTP methods (GET, POST, PATCH, DELETE) to perform operations on resources. URLs represent resources (like `/applications`), not actions. Each request contains all information needed — the server doesn't remember previous requests (stateless).

**Q: What is JWT?**
A: JWT stands for JSON Web Token. It's a way to prove identity without storing sessions. After login, the server creates a token containing the user's ID, signs it with a secret key, and sends it to the client. The client sends this token with every request. The server verifies the signature to confirm the token is authentic and extracts the user's ID.

## Intermediate Questions

**Q: Why did you choose MongoDB over PostgreSQL?**
A: MongoDB's document model was a good fit because job applications have flexible structures — some have salary ranges, some don't; some have work type, some don't. In SQL you'd need nullable columns or separate tables. MongoDB lets each document have different fields naturally. Also, MongoDB Atlas has a generous free tier. That said, PostgreSQL would be equally valid — for structured data with relationships it's often the better choice.

**Q: Explain how password reset works in your project.**
A: When a user requests a reset, we generate a cryptographically random 32-byte token using Node's `crypto.randomBytes()`. We hash this with SHA-256 and store the hash in the database, along with a 1-hour expiry time. We email the raw token in the URL. When the user visits the reset link, we hash the URL token with SHA-256 and compare it to the stored hash. If they match and the expiry hasn't passed, we allow the password change. Storing the hash means a database breach doesn't expose usable tokens.

**Q: What is bcrypt and why do you use it for passwords?**
A: bcrypt is an adaptive password hashing function. Unlike MD5 or SHA-256 which are fast (bad for passwords), bcrypt is intentionally slow — it runs the hashing algorithm 2^10 times with salt rounds of 10. This makes brute force attacks impractical. It also automatically generates and stores a unique salt for each password, preventing rainbow table attacks. If hardware gets faster, you can increase the salt rounds.

**Q: How does CORS work in your project?**
A: CORS is a browser security policy that blocks requests from one origin to another. Our React app on vercel.app tries to call our API on onrender.com — different origins. The browser sends a "preflight" OPTIONS request asking if the cross-origin request is allowed. Our Helmet+CORS middleware checks if the request's origin is in our whitelist. If yes, it adds `Access-Control-Allow-Origin` header to the response and the browser allows the request.

## Advanced Questions

**Q: How would you implement real-time notifications?**
A: Two main approaches. WebSockets: maintain a persistent connection between browser and server — server pushes notifications instantly. Server-Sent Events (SSE): one-way stream from server to browser, simpler than WebSockets. For HireFlow, SSE is sufficient — notifications are server-to-client only. I'd create a notification MongoDB collection, have controllers create notification documents when significant events occur (status change, interview scheduled), and stream new notifications to connected clients via SSE.

**Q: Explain the security vulnerability of storing JWT in localStorage.**
A: localStorage is accessible by any JavaScript on the page. If the site has an XSS vulnerability — where an attacker injects malicious JavaScript — that script can read `localStorage.getItem("token")` and steal the JWT. With a stolen JWT, the attacker can impersonate the user until the token expires. The more secure approach is HttpOnly cookies — these cannot be accessed by JavaScript at all. However, HttpOnly cookies introduce CSRF vulnerabilities, which require their own mitigation (CSRF tokens or SameSite cookie attribute).

**Q: How would you handle 10,000 concurrent users?**
A: Node.js handles this well because of its non-blocking I/O model. For the current architecture: horizontal scaling (run 3-4 Node instances behind a load balancer), database connection pooling (Mongoose does this automatically), Redis caching for the most frequent queries (user's applications list, cached for 60 seconds), and moving email sending to a background job queue so requests don't wait for SMTP. MongoDB Atlas would need to be on at least an M10 cluster with proper indexes.

**Q: What is the N+1 query problem and does your project have it?**
A: The N+1 problem is when you make 1 query to get a list, then N separate queries to get details for each item — total N+1 queries. For example: fetching 50 applications then making 50 separate queries to get each user's name. My project doesn't have this problem because applications already embed all needed data in one document. If I added a feature to show the user's avatar on each application using a separate User query, that would be an N+1 problem — fixed by using Mongoose's `.populate()` to join in a single query.

## Senior Questions

**Q: How would you redesign this for 1 million users?**
A: Move to microservices: Auth Service, Applications Service, Email Service, Analytics Service — each scales independently. MongoDB would need sharding — partition data across multiple servers by user ID. Elasticsearch for full-text application search. Redis cluster for distributed caching. Kafka for async event processing (application status changes triggering emails/notifications). API Gateway for rate limiting, authentication, and routing. CDN for all static assets. Multi-region deployment for global users. The current monolith is appropriate for current scale — premature microservices add complexity without benefit.

**Q: How would you add real-time collaboration — multiple users on one account?**
A: This requires optimistic locking or operational transformation. When two users edit the same application, the second save must not silently overwrite the first. Implementation: Add a `version` field to each application document. When updating, include the version in the query: `{ _id: id, version: knownVersion }`. If another user updated it first, the version won't match and the update returns null. Return a 409 Conflict to the client. Client shows "This was updated by someone else — please refresh." This is optimistic locking.

---

# Phase 12 — Project Defense

## Why React instead of Vue or Angular?

React has the largest ecosystem and job market demand. For a project I want to showcase, React is the industry standard. Vue is excellent but has a smaller ecosystem. Angular is opinionated and more complex — overkill for this project size. React's component model maps naturally to our UI — StatsCard, ApplicationTable, Modal are all reusable components.

## Why Express instead of Fastify or NestJS?

Express has 20+ years of battle-tested stability and the largest middleware ecosystem. Fastify is ~10% faster but speed is not our bottleneck — database queries are. NestJS is great for teams and large codebases but introduces significant complexity (decorators, modules, dependency injection) that would slow down a solo developer. Express lets you move fast.

## Why MongoDB instead of PostgreSQL?

Our application data (job applications) has variable fields and doesn't need complex joins. MongoDB's document model fits this naturally. Also, MongoDB Atlas's free tier was sufficient for development. That said, if I were building this for a large company, I'd use PostgreSQL — it has stronger ACID guarantees, better support for complex reporting queries, and schema migrations are more predictable.

## Why JWT instead of sessions?

Sessions require storing state on the server (in memory or Redis). JWT is stateless — the server doesn't store anything. With multiple server instances (horizontal scaling), sessions would need a shared Redis store. JWT works identically across any number of servers because the token is self-contained. The trade-off is that you can't immediately invalidate a JWT — with sessions you can delete the session from Redis and the user is immediately logged out.

## Why not Redux?

Redux adds significant boilerplate and complexity. It's appropriate when state is deeply nested, actions need to be trackable/undoable, or multiple unrelated parts of the app need the same state. HireFlow's state is simple: auth state (one context) and page-level state (local useState). Adding Redux would be over-engineering — React Context and local state are sufficient and simpler.

## Why not Next.js?

Next.js is a full-stack React framework with server-side rendering. It's excellent for SEO-critical public pages. HireFlow's dashboard pages don't need SEO — they're behind authentication. The landing page could benefit from SSR, but it's a small part of the app. Also, Next.js would require us to merge frontend and backend into one codebase, which is a bigger architectural change than the benefit justifies at this scale.

## Why Zod for validation?

Zod is schema-first, which means you define the shape of data once and get both TypeScript types and runtime validation from the same definition. It has excellent error messages and is composable. The alternative, Joi, is older and not TypeScript-native. Express-validator works but is more verbose. Zod's `.safeParse()` returns a clean result object — easy to work with in middleware.

---

# Phase 13 — Resume Preparation

## Tell me about your project

"I built HireFlow, a full-stack SaaS job application tracker. The problem it solves: job seekers track applications in spreadsheets, lose track of where they applied, and have no insight into their job search. HireFlow gives them a dashboard to track every application, visualise their pipeline with charts, and manage the entire job search in one place.

Technically, it's a React frontend deployed on Vercel, a Node.js/Express API deployed on Render, MongoDB Atlas for the database, and Nodemailer for email. I implemented JWT authentication with a complete password reset flow using cryptographic tokens, rate limiting with express-rate-limit, and security headers with Helmet. The frontend has real-time search and filtering using useMemo, bulk actions, CSV export, and Recharts for analytics. It's live at hireflow.vercel.app."

## Biggest technical challenge

"The biggest challenge was the field name mismatch bug. The frontend was sending `company` and `role` but the backend model expected `companyName` and `jobRole`. Every create and update operation was silently failing because Zod validation was rejecting the request body. It took careful debugging — reading both the model schema and the form submission simultaneously — to spot the mismatch. After fixing it, I realised the importance of keeping frontend field names and backend schema field names in sync from the start, ideally by sharing a types file or API contract document."

## Biggest bug fixed

"The AuthContext was reading `data.user` but `getCurrentUser()` returned `{ success, data: { id, name, email } }` — so it should have been `data.data`. This meant every page refresh silently failed to restore the user session and logged the user out. The bug was invisible because the app didn't crash — it just redirected to login silently. I found it by console.logging the exact response shape from the API and comparing it to what the context expected."

## What would you improve?

"Three things. First, move JWT from localStorage to HttpOnly cookies — more secure against XSS. Second, add database indexes on `application.user` and `application.status` for faster queries at scale. Third, add email verification on registration — currently users can register with any email address they don't own."

## Favourite feature

"The forgot-password flow. It demonstrates full-stack thinking: cryptographically secure token generation on the backend, SHA-256 hashing before database storage so a DB breach doesn't expose usable tokens, 1-hour expiry, rollback on email failure, professional HTML email template, and a clean UI with cold-start handling on the frontend. It's small in terms of UI but represents a lot of security and reliability thinking."

## Authentication flow

"The user registers → bcrypt hashes their password → stored in MongoDB. On login, we find the user by email, call bcrypt.compare() to verify the password without ever decrypting it, then sign a JWT with the user's ID and role using jwt.sign() — token expires in 7 days. The frontend stores the token in localStorage. An Axios interceptor reads the token and adds it to every request as `Authorization: Bearer <token>`. On the backend, the authenticateUser middleware calls jwt.verify(), which checks the signature and expiry, then injects the decoded user into req.user for the controller to use."

## Deployment

"Frontend is on Vercel — it detects Vite automatically, builds in 10 seconds, and the CDN serves it globally. Backend is on Render free tier — it auto-deploys on every git push via GitHub integration. MongoDB is on Atlas free tier. The only challenge with Render's free tier is the 15-minute sleep after inactivity — I solved this with UptimeRobot, which pings the `/api/health` endpoint every 5 minutes to keep the server warm. The frontend has a cold-start UX: after 8 seconds of waiting it shows 'Server is waking up, please wait' instead of just spinning silently."

## Future improvements

"In order of priority: email verification on registration, in-app notification system, application detail page with full edit history, Kanban board view for drag-and-drop status updates, Google OAuth, AI assistant for interview prep using OpenAI API, follow-up reminders with email alerts, and eventually a mobile app using React Native against the same API."

---

## Quick Reference — Key Numbers

| Item | Value |
|---|---|
| JWT expiry | 7 days |
| Reset token expiry | 1 hour |
| bcrypt salt rounds | 10 (~100ms per hash) |
| Auth rate limit | 20 requests per 15 minutes per IP |
| API rate limit | 200 requests per 15 minutes per IP |
| Max request body | 10KB |
| Axios timeout | 30 seconds |
| Frontend bundle | 847KB (244KB gzipped) |
| UptimeRobot interval | 5 minutes |
| API endpoints | 12 total (7 auth, 5 applications) |

---

*Study this file. Know every answer cold. You built this — own it.*
