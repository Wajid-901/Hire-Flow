import express from "express";
import sendEmail from "../services/emailService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    await sendEmail({
      to:      process.env.CONTACT_EMAIL || process.env.RESEND_TEST_TO || "abdulwajid845433@gmail.com",
      subject: `[HireFlow Contact] ${subject} — from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#18181b;color:#fff;padding:32px;border-radius:16px;">
          <h2 style="color:#818cf8;margin-bottom:24px;">New Contact Message</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#a1a1aa;width:100px;">Name</td><td style="padding:8px 0;color:#fff;font-weight:600;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#a1a1aa;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#818cf8;">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#a1a1aa;">Subject</td><td style="padding:8px 0;color:#fff;">${subject}</td></tr>
          </table>
          <hr style="border-color:#27272a;margin:24px 0;" />
          <p style="color:#a1a1aa;font-size:13px;margin-bottom:8px;">Message:</p>
          <div style="background:#27272a;border-radius:8px;padding:16px;color:#e4e4e7;line-height:1.7;white-space:pre-wrap;">${message}</div>
          <p style="margin-top:24px;font-size:12px;color:#52525b;">
            Sent from HireFlow contact form · Reply directly to <a href="mailto:${email}" style="color:#818cf8;">${email}</a>
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
