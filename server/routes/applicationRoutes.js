import express from "express";
import {
  createApplication,
  getApplications,
  getApplicationById,
  deleteApplication,
  updateApplication,
} from "../controllers/applicationController.js";
import {
  validateApplication,
  validateUpdateApplication,
} from "../validators/applicationValidator.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication — user must be logged in
router.post("/", authenticateUser, validateApplication, createApplication);
router.get("/", authenticateUser, getApplications);
router.get("/:id", authenticateUser, getApplicationById);
router.delete("/:id", authenticateUser, deleteApplication);
router.patch("/:id", authenticateUser, validateUpdateApplication, updateApplication);

export default router;
