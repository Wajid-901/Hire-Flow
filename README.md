<div align="center">

<img src="client/public/favicon.svg" width="64" height="64" alt="HireFlow Logo" />

# HireFlow

**Track every opportunity. Land your dream job.**

A free, full-stack job application tracker built for students and professionals.  
Organise your job search, visualise your progress, and never lose track of an opportunity again.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://hire-flow-six-theta.vercel.app/)
[![API Health](https://img.shields.io/badge/API-Healthy-10b981?style=for-the-badge&logo=render&logoColor=white)](https://hireflow-api-e53e.onrender.com/api/health)

![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-0ea5e9?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646cff?style=flat-square&logo=vite&logoColor=white)

</div>

---

## What is HireFlow?

Job hunting is chaotic. Most people track applications in notes apps or spreadsheets — they forget where they applied, miss follow-ups, and have no insight into their own funnel.

HireFlow fixes that. It gives you a purpose-built dashboard to log every application, track it through the hiring pipeline, visualise your progress with real charts, and manage your entire job search in one clean place. **Completely free, forever.**

---

## Features

### Core
- Add, edit, delete and track job applications with full details
- Status pipeline: **Applied → Interview → Offer → Rejected**
- Priority levels: Low, Medium, High per application
- Work type: Remote, Hybrid, On-site
- Notes and job listing URL per application

### Search & Filtering
- Real-time search across company, role, and location
- Filter by status, sort by date / company / status
- Shows filtered count vs total

### Bulk Actions
- Checkbox selection — select all or individual rows
- Bulk delete with confirmation
- Export filtered results to CSV

### Analytics
- Applications over time (area chart — last 6 months)
- Status distribution (pie chart)
- Applications by day of week (bar chart)
- Top companies by application count

### Calendar
- Interactive monthly calendar
- Color-coded dots per day by status
- Click any day to see applications on that date
- Month sidebar with full application list

### Resume Manager
- Drag-and-drop file upload (PDF, DOCX, DOC, TXT)
- File list with download and remove
- Resume tips sidebar

### Authentication
- Register and login with JWT (7-day token)
- Persistent sessions (survives page refresh)
- Forgot password → email reset link → new password flow
- Change password from Settings (requires current password)
- Edit name from Profile page

### UI/UX
- Premium dark mode design
- Animated skeleton loaders (no plain spinners)
- Toast notifications on every action
- Fully responsive — desktop, tablet, mobile
- Mobile slide-in sidebar with hamburger menu
- Custom SVG logo and favicon

### Security
- Passwords hashed with bcrypt (10 salt rounds)
- Reset tokens SHA-256 hashed before storage, expire in 1 hour
- Helmet.js security headers on every response
- Rate limiting: 20 req/15min on auth, 200 req/15min on API
- CORS restricted to `CLIENT_URL` environment variable
- Ownership-enforced database queries
- No user enumeration on forgot-password

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI library |
| Vite | 8 | Build tool and dev server |
| Tailwind CSS | 4 | Utility-first styling |
| React Router | 7 | Client-side routing |
| Recharts | 3 | Analytics charts |
| Axios | 1 | HTTP client with JWT interceptor |
| React Icons | 5 | Icon library (Bootstrap Icons set) |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20 | Runtime |
| Express | 5 | Web framework |
| MongoDB Atlas | — | Cloud database |
| Mongoose | 9 | ODM — schemas and queries |
| jsonwebtoken | 9 | JWT generation and verification |
| bcrypt | 6 | Password hashing |
| Nodemailer | 6 | Email delivery (password reset, welcome) |
| Helmet | — | HTTP security headers |
| express-rate-limit | — | Brute-force protection |
| Zod | 4 | Schema-based request validation |

---

## Project Structure

```
HireFlow/
├── client/                        # React frontend (Vite)
│   ├── public/
│   │   └── favicon.svg            # Custom SVG logo
│   └── src/
│       ├── api/                   # Axios instance + API wrappers
│       │   ├── axiosInstance.js   # Base URL + JWT interceptor
│       │   ├── authApi.js         # Auth endpoints
│       │   └── applicationsApi.js # CRUD endpoints
│       ├── components/
│       │   ├── applications/      # ApplicationForm, Table, StatusBadge
│       │   ├── common/            # Button, Input, Modal, Skeleton, Toast, Logo
│       │   ├── dashboard/         # StatsCard, Charts, RecentApplications
│       │   ├── layout/            # Sidebar, Header, MobileSidebar
│       │   └── settings/          # ChangePasswordForm
│       ├── contexts/
│       │   ├── AuthContext.jsx    # Global auth state
│       │   └── ToastContext.jsx   # Global toast notifications
│       ├── hooks/
│       │   ├── useAuth.js         # Consumes AuthContext
│       │   └── useDebounce.js     # Debounce helper
│       ├── layouts/
│       │   └── DashboardLayout.jsx # Sidebar + Header + Outlet
│       ├── pages/
│       │   ├── auth/              # Login, Register, ForgotPassword, ResetPassword
│       │   ├── dashboard/         # Dashboard, Applications, Analytics, Calendar,
│       │   │                      # Resume, Profile, Settings
│       │   ├── HomePage.jsx       # Public landing page
│       │   └── NotFoundPage.jsx   # 404
│       └── routes/
│           ├── AppRouter.jsx      # All route definitions
│           ├── ProtectedRoute.jsx # Redirects to /login if not authenticated
│           └── PublicRoute.jsx    # Redirects to /dashboard if authenticated
│
└── server/                        # Express backend
    ├── config/
    │   └── database.js            # Mongoose connect
    ├── constants/
    │   ├── applicationConstants.js # APPLICATION_STATUS enum
    │   └── authConstants.js        # SALT_ROUNDS
    ├── controllers/
    │   ├── authController.js       # register, login, getMe, updateMe,
    │   │                           # forgotPassword, resetPassword, changePassword
    │   └── applicationController.js # CRUD with ownership checks
    ├── middleware/
    │   ├── authMiddleware.js       # JWT verification → req.user
    │   └── errorMiddleware.js      # Global error handler
    ├── models/
    │   ├── userModel.js            # User schema
    │   └── applicationModel.js    # Application schema
    ├── routes/
    │   ├── authRoutes.js           # /api/auth/*
    │   ├── applicationRoutes.js   # /api/applications/*
    │   └── healthRoutes.js        # /api/health
    ├── services/
    │   ├── emailService.js        # Nodemailer transporter (Gmail / Ethereal)
    │   └── emailTemplates.js      # HTML email templates
    └── validators/
        └── applicationValidator.js # Zod schemas
```

---

## API Reference

### Auth — `/api/auth`

| Method | Path | Protected | Description |
|---|---|---|---|
| `POST` | `/register` | No | Create account, sends welcome email |
| `POST` | `/login` | No | Returns JWT |
| `GET` | `/me` | Yes | Get current user |
| `PATCH` | `/me` | Yes | Update display name |
| `POST` | `/forgot-password` | No | Send reset link to email |
| `POST` | `/reset-password/:token` | No | Set new password via token |
| `POST` | `/change-password` | Yes | Change password (requires current) |

### Applications — `/api/applications`

| Method | Path | Protected | Description |
|---|---|---|---|
| `GET` | `/` | Yes | Get all user's applications |
| `POST` | `/` | Yes | Create application |
| `GET` | `/:id` | Yes | Get single application |
| `PATCH` | `/:id` | Yes | Update application |
| `DELETE` | `/:id` | Yes | Delete application |

### System

| Method | Path | Protected | Description |
|---|---|---|---|
| `GET` | `/api/health` | No | Health check for UptimeRobot |

---

## Getting Started Locally

### Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas account (free tier)
- Gmail account with App Password (for email features)

### 1. Clone

```bash
git clone https://github.com/abdulwajid/hireflow.git
cd hireflow
```

### 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/hireflow
JWT_SECRET=your-long-random-secret-minimum-32-characters
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Email — leave empty to use Ethereal (auto fake inbox, check console for preview URL)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_PASS=your-16-char-gmail-app-password
SMTP_FROM=HireFlow <your@gmail.com>
```

```bash
npm run dev
# → Server running on http://localhost:5000
```

### 3. Frontend setup

```bash
cd ../client
npm install
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

```bash
npm run dev
# → App running on http://localhost:5173
```

---

**Free hosting stack:**

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | auto-assigned `.vercel.app` |
| Backend | Render | auto-assigned `.onrender.com` |
| Database | MongoDB Atlas | cloud.mongodb.com |
| Uptime | UptimeRobot | uptimerobot.com |

---

## Data Models

### User
```
name          String  required
email         String  required, unique
password      String  bcrypt hash
role          "user" | "admin"
resetPasswordToken    String  SHA-256 hashed
resetPasswordExpires  Date    1hr window
createdAt     Date    auto
```

### Application
```
user          ObjectId → User (owner)
companyName   String   required
jobRole       String   required
status        "Applied" | "Interview" | "Offer" | "Rejected"
priority      "Low" | "Medium" | "High"
location      String
workType      "Remote" | "Hybrid" | "On-site"
jobLink       String
notes         String
appliedDate   Date
followUpDate  Date
createdAt     Date     auto
```

---

## Roadmap

- [ ] In-app notification system
- [ ] Application detail / view page
- [ ] Kanban board view
- [ ] Follow-up date reminders with email alerts
- [ ] Google OAuth sign-in
- [ ] AI assistant — resume review and interview prep
- [ ] Email verification on registration
- [ ] Dark / light mode toggle
- [ ] Mobile app (React Native)

---

## Author

**Abdul Wajid**

Built as a production-grade full-stack project — authentication, real-time data, email service, analytics, and deployment all included.

---

<div align="center">

100% free, forever. Made with ❤️

</div>
