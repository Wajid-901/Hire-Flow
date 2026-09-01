import express   from "express";
import cors      from "cors";
import helmet    from "helmet";
import rateLimit from "express-rate-limit";

import applicationRoutes from "./routes/applicationRoutes.js";
import authRoutes        from "./routes/authRoutes.js";
import healthRoutes      from "./routes/healthRoutes.js";
import errorMiddleware   from "./middleware/errorMiddleware.js";

const app = express();

app.use(helmet());

// Allow production URL + any Vercel preview deployments for this project
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((u) => u.trim())
  : ["http://localhost:5173", "http://localhost:5174"];

// Regex to allow all Vercel preview URLs for Wajid's project
const vercelPreviewPattern = /^https:\/\/hireflow.*\.vercel\.app$/;

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    if (vercelPreviewPattern.test(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json({ limit: "10kb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, try again in 15 minutes." },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please slow down." },
});

app.use("/api/health",       healthRoutes);
app.use("/api/auth",         authLimiter, authRoutes);
app.use("/api/applications", apiLimiter,  applicationRoutes);
app.use(errorMiddleware);

export default app;
