import mongoose from "mongoose";
import { APPLICATION_STATUS } from "../constants/applicationConstants.js";

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    jobRole: {
      type: String,
      required: true,
      trim: true,
    },
    jobLink: {
      type: String,
      trim: true,
      default: "",
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
     enum: APPLICATION_STATUS,
      default: "Applied",
    },
    source: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    workType: {
      type: String,
      enum: ["Remote", "Hybrid", "On-site", ""],
      default: "",
    },
    resumeVersion: {
      type: String,
      trim: true,
      default: "",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    // ── Interview reminder fields ──────────────────────────────────────────
    // Optional date+time of the interview — enables 24h and 1h email reminders
    interviewDate: {
      type: Date,
      default: null,
    },
    // Track which reminders have already been sent so we never send duplicates
    reminder24hSent: {
      type: Boolean,
      default: false,
    },
    reminder1hSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;