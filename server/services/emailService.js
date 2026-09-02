import { Resend } from "resend";

/**
 * sendEmail({ to, subject, html })
 *
 * Sends an email via Resend.
 * If RESEND_API_KEY is not set, logs the email to console instead of crashing.
 */
const sendEmail = async ({ to, subject, html }) => {
  // No API key — log to console instead of crashing the server
  if (!process.env.RESEND_API_KEY) {
    console.log("─────────────────────────────────────────");
    console.log("📧 [DEV] No RESEND_API_KEY — email not sent");
    console.log(`   To:      ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log("─────────────────────────────────────────");
    return { id: "dev-mode" };
  }

  // Lazy-initialize: create client only when key is available
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from   = process.env.RESEND_FROM || "HireFlow <onboarding@resend.dev>";

  const { data, error } = await resend.emails.send({ from, to, subject, html });

  if (error) {
    console.error("❌ Resend error:", error);
    throw new Error(error.message);
  }

  console.log(`📧 Email sent to ${to} — ID: ${data.id}`);
  return data;
};

export default sendEmail;
