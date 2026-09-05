import express    from "express";
import rateLimit  from "express-rate-limit";
import sendEmail  from "../services/emailService.js";

const router = express.Router();

// Strict rate limit: max 5 messages per IP per hour (prevents email spam)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, message: "Too many messages sent. Please wait before trying again." },
});

// Simple but effective RFC-5322 inspired email regex
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

router.post("/", contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Required-field check
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Email format validation — catches obviously fake/garbage addresses
    if (!EMAIL_RE.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }

    // Sanitise inputs
    const safeName    = name.trim().slice(0, 100);
    const safeEmail   = email.trim().slice(0, 200);
    const safeSubject = subject.trim().slice(0, 200);
    const safeMessage = message.trim().slice(0, 5000);

    const escapeHtml = (str = "") =>
      String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const htmlName    = escapeHtml(safeName);
    const htmlEmail   = escapeHtml(safeEmail);
    const htmlSubject = escapeHtml(safeSubject);
    const htmlMessage = escapeHtml(safeMessage);

    await sendEmail({
      to:      process.env.CONTACT_EMAIL || process.env.RESEND_TEST_TO || "abdulwajid845433@gmail.com",
      subject: `[HireFlow Contact] ${safeSubject} — from ${safeName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#18181b;color:#fff;padding:32px;border-radius:16px;">
          <h2 style="color:#818cf8;margin-bottom:24px;">New Contact Message</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#a1a1aa;width:100px;">Name</td><td style="padding:8px 0;color:#fff;font-weight:600;">${htmlName}</td></tr>
            <tr><td style="padding:8px 0;color:#a1a1aa;">Email</td><td style="padding:8px 0;"><a href="mailto:${htmlEmail}" style="color:#818cf8;">${htmlEmail}</a></td></tr>
            <tr><td style="padding:8px 0;color:#a1a1aa;">Subject</td><td style="padding:8px 0;color:#fff;">${htmlSubject}</td></tr>
          </table>
          <hr style="border-color:#27272a;margin:24px 0;" />
          <p style="color:#a1a1aa;font-size:13px;margin-bottom:8px;">Message:</p>
          <div style="background:#27272a;border-radius:8px;padding:16px;color:#e4e4e7;line-height:1.7;white-space:pre-wrap;">${htmlMessage}</div>
          <p style="margin-top:24px;font-size:12px;color:#52525b;">
            Sent from HireFlow contact form · Reply directly to <a href="mailto:${htmlEmail}" style="color:#818cf8;">${htmlEmail}</a>
          </p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Contact email failed:", error.message);
    return res.status(500).json({ success: false, message: "Failed to send message. Please try again." });
  }
});

export default router;
