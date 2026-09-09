import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Resume from "../models/resumeModel.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Multer storage ──────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const dir = path.join(__dirname, "../uploads/resumes", req.user.userId);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const ALLOWED_MIMETYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, DOCX, and TXT files are allowed."), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// ─── Controllers ─────────────────────────────────────────────────────────────

// @desc    Upload a resume
// @route   POST /api/resumes
// @access  Private
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded." });
    }

    const { userId } = req.user;

    const resume = await Resume.create({
      user: userId,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    return res.status(201).json({
      success: true,
      message: "Resume uploaded successfully.",
      data: resume,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload resume.",
      error: error.message,
    });
  }
};

// @desc    Get all resumes for logged-in user
// @route   GET /api/resumes
// @access  Private
export const getResumes = async (req, res) => {
  try {
    const { userId } = req.user;

    const resumes = await Resume.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resumes.",
      error: error.message,
    });
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const resume = await Resume.findOne({ _id: id, user: userId });

    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found." });
    }

    // Remove file from disk
    const filePath = path.join(
      __dirname,
      "../uploads/resumes",
      userId,
      resume.storedName
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Resume.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete resume.",
      error: error.message,
    });
  }
};

// @desc    Download / serve a resume file
// @route   GET /api/resumes/:id/download
// @access  Private
export const downloadResume = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const resume = await Resume.findOne({ _id: id, user: userId });

    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found." });
    }

    const filePath = path.join(
      __dirname,
      "../uploads/resumes",
      userId,
      resume.storedName
    );

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ success: false, message: "File not found on server." });
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${resume.originalName}"`
    );
    res.setHeader("Content-Type", resume.mimetype);
    return res.sendFile(filePath);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to download resume.",
      error: error.message,
    });
  }
};
