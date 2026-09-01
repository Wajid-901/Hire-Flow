import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { SALT_ROUNDS } from "../constants/authConstants.js";
import sendEmail from "../services/emailService.js";
import { passwordResetTemplate, welcomeTemplate } from "../services/emailTemplates.js";

// ─── Register ─────────────────────────────────────────────────────────────────
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, password: hashedPassword });

    // Send welcome email (non-blocking — don't fail registration if email fails)
    sendEmail({ to: email, ...welcomeTemplate({ name }) }).catch((err) =>
      console.error("Welcome email failed:", err.message)
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ success: true, message: "Login successful.", token });
  } catch (error) {
    next(error);
  }
};

// ─── Get current user ─────────────────────────────────────────────────────────
export const getMe = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      data: {
        id:        user._id,
        name:      user.name,
        email:     user.email,
        role:      user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Update profile (name) ────────────────────────────────────────────────────
export const updateMe = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: "Name cannot be empty." });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name: name.trim() },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        id:        user._id,
        name:      user.name,
        email:     user.email,
        role:      user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Forgot password ──────────────────────────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Always return the same response whether user exists or not (no enumeration)
    const genericResponse = {
      success: true,
      message: "If an account exists with this email, a password reset link has been sent.",
    };

    const user = await User.findOne({ email });
    if (!user) return res.status(200).json(genericResponse);

    // Generate raw token → hash it → store hash (never store raw)
    const rawToken    = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken   = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${rawToken}`;

    try {
      await sendEmail({
        to:      user.email,
        ...passwordResetTemplate({ name: user.name, resetUrl, expiryMinutes: 60 }),
      });
    } catch (emailError) {
      // Roll back token if email fails so user isn't stuck with an unusable token
      user.resetPasswordToken   = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      console.error("Password reset email failed:", emailError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again.",
      });
    }

    return res.status(200).json(genericResponse);
  } catch (error) {
    next(error);
  }
};

// ─── Reset password (from email link) ────────────────────────────────────────
export const resetPassword = async (req, res, next) => {
  try {
    const { token }    = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken:   hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or has expired. Please request a new one.",
      });
    }

    user.password             = await bcrypt.hash(password, SALT_ROUNDS);
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    next(error);
  }
};

// ─── Change password (authenticated) ─────────────────────────────────────────
export const changePassword = async (req, res, next) => {
  try {
    const { userId }                    = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect." });
    }

    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    next(error);
  }
};
