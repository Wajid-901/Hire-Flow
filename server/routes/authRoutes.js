import express from "express";
import { 
  loginUser, 
  registerUser, 
  getMe,
  updateMe,
  forgotPassword, 
  resetPassword, 
  changePassword 
} from "../controllers/authController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes — no JWT required
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Protected routes — require authentication
router.get("/me", authenticateUser, getMe);
router.patch("/me", authenticateUser, updateMe);
router.post("/change-password", authenticateUser, changePassword);

export default router;
