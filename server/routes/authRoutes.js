import express from "express";
import rateLimit from "express-rate-limit";

import {
  loginUser,
  registerUser,
  verifyEmail,
  getMe,
  updateMe,
  deleteMe,
  forgotPassword,
  resetPassword,
  changePassword,
  updateNotifications,
} from "../controllers/authController.js";

import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
} from "../validators/authValidator.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts, please try again in 15 minutes.",
  },
});

// Public routes
router.post("/register", authLimiter, validateRegister, registerUser);
router.post("/login", authLimiter, validateLogin, loginUser);
router.get("/verify-email/:token", verifyEmail);
router.post(
  "/forgot-password",
  authLimiter,
  validateForgotPassword,
  forgotPassword,
);
router.post(
  "/reset-password/:token",
  authLimiter,
  validateResetPassword,
  resetPassword,
);

// Protected routes
router.get("/me", authenticateUser, getMe);
router.patch("/me", authenticateUser, updateMe);
router.delete("/me", authenticateUser, deleteMe);
router.patch("/me/notifications", authenticateUser, updateNotifications);
router.post(
  "/change-password",
  authenticateUser,
  validateChangePassword,
  changePassword,
);

export default router;
