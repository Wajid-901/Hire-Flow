import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  upload,
  uploadResume,
  getResumes,
  deleteResume,
  downloadResume,
} from "../controllers/resumeController.js";

const router = express.Router();

// All resume routes are protected
router.use(authenticateUser);

router.post("/", upload.single("resume"), uploadResume);
router.get("/", getResumes);
router.get("/:id/download", downloadResume);
router.delete("/:id", deleteResume);

export default router;
