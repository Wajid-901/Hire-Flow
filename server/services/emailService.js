import { Resend } from "resend";

// Resend client — initialised once, reused for every send
// API key comes from RESEND_API_KEY environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * sendEmail({ to, subject, html })
 *
 * Sends an email via Resend.
 * In development without a RESEND_API_KEY, logs the email to console instead.
 */
const sendEmail = async ({ to, subject, html }) => {
  // Fallback: if no API key is set, log to console (dev mode)
  if (!process.env.RESEND_API_KEY) {
    console.log("─────────────────────────────────────────");
    console.log("📧 [DEV] Email not sent — no RESEND_API_KEY");
    console.log(`   To:      ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log("─────────────────────────────────────────");
    return { id: "dev-mode" };
  }

  const from = process.env.RESEND_FROM || "HireFlow <onboarding@resend.dev>";

  const { data, error } = await resend.emails.send({ from, to, subject, html });

  if (error) {
    console.error("❌ Resend error:", error);
    throw new Error(error.message);
  }

  console.log(`📧 Email sent to ${to} — ID: ${data.id}`);
  return data;
};

export default sendEmail;
