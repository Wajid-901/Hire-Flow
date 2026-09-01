# HireFlow — Deployment Guide

## Stack
- **Frontend** → Vercel (free)
- **Backend** → Render (free)
- **Database** → MongoDB Atlas (already running)
- **Uptime** → UptimeRobot (free, keeps Render alive)

---

## Step 1 — Push to GitHub

Create a repo at github.com, then from your project root:

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/<you>/hireflow.git
git push -u origin main
```

Make sure `.gitignore` covers both `.env` files — they must never be committed.

---

## Step 2 — Deploy Backend on Render

1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Set these values:

| Field | Value |
|---|---|
| Name | `hireflow-api` |
| Root Directory | `server` |
| Runtime | `Node` |
| Build Command | `npm install` |
| Start Command | `npm start` |

5. Add **Environment Variables** (click "Add Environment Variable"):

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | your Atlas connection string |
| `JWT_SECRET` | a long random string (32+ chars) |
| `CLIENT_URL` | your Vercel URL (add after Step 3) |

6. Click **Create Web Service**
7. Wait ~2 min. Your API URL will be: `https://hireflow-api.onrender.com`
8. Test it: visit `https://hireflow-api.onrender.com/api/health` — should return `{"status":"ok",...}`

---

## Step 3 — Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **Add New → Project**
3. Import your GitHub repo
4. Set **Root Directory** to `client`
5. Vercel auto-detects Vite — no build settings needed
6. Add **Environment Variable**:

| Key | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://hireflow-api.onrender.com/api` |

7. Click **Deploy**
8. Your app URL will be: `https://hireflow.vercel.app` (or similar)

---

## Step 4 — Connect Frontend ↔ Backend

1. Copy your Vercel URL (e.g. `https://hireflow.vercel.app`)
2. Go to Render → your service → **Environment**
3. Update `CLIENT_URL` to your Vercel URL
4. Render auto-redeploys

---

## Step 5 — UptimeRobot (keep Render alive)

Render's free tier sleeps after 15 min of inactivity. UptimeRobot pings it every 5 min.

1. Go to [uptimerobot.com](https://uptimerobot.com) → Sign up free
2. Click **Add New Monitor**
3. Fill in:

| Field | Value |
|---|---|
| Monitor Type | `HTTP(s)` |
| Friendly Name | `HireFlow API` |
| URL | `https://hireflow-api.onrender.com/api/health` |
| Monitoring Interval | `5 minutes` |

4. Click **Create Monitor**

Now your server stays warm 24/7 for free.

---

## Step 6 — MongoDB Atlas Network Access

Your Atlas cluster must allow connections from anywhere (Render uses dynamic IPs):

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. **Network Access → Add IP Address**
3. Click **Allow Access from Anywhere** (`0.0.0.0/0`)
4. Confirm

---

## After Deployment — Checklist

- [ ] `https://<your-app>.vercel.app` loads the landing page
- [ ] Register a new account works
- [ ] Login works
- [ ] Add an application works
- [ ] `https://hireflow-api.onrender.com/api/health` returns `{"status":"ok"}`
- [ ] UptimeRobot monitor shows green

---

## Updating After Deployment

Every `git push` to `main` auto-redeploys both Vercel and Render.

```bash
git add .
git commit -m "your message"
git push
```

That's it — CI/CD is handled automatically.
