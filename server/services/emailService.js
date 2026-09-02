import { Resend } from "resend";

/**
 * sendEmail({ to, subject, html })
 *
 * In production without a verified domain, Resend only allows sending
 * to the account owner email. We use RESEND_TEST_TO to redirect all
 * emails to your own address during testing/demo.
 *
 * To send to real users: verify a domain at resend.com/domains
 * and remove RESEND_TEST_TO from your environment variables.
 */
const sendEmail = async ({ to, subject, html }) => {
  // No API key — silently log in development
  if (!process.env.RESEND_API_KEY) {
    console.log("─────────────────────────────────────────");
    console.log("📧 [DEV] No RESEND_API_KEY — email not sent");
    console.log(`   To:      ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log("─────────────────────────────────────────");
    return { id: "dev-mode" };
  }

  // Redirect all emails to RESEND_TEST_TO when set (Resend free tier restriction)
  const recipient = process.env.RESEND_TEST_TO || to;
  let finalSubject = subject;

  if (process.env.RESEND_TEST_TO && process.env.RESEND_TEST_TO !== to) {
    console.log(`📧 [TEST MODE] Redirecting email from ${to} → ${recipient}`);
    finalSubject = `[for: ${to}] ${subject}`;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from   = process.env.RESEND_FROM || "HireFlow <onboarding@resend.dev>";

  const { data, error } = await resend.emails.send({
    from,
    to:      recipient,
    subject: finalSubject,
    html,
  });

  if (error) {
    console.error("❌ Resend error:", error);
    throw new Error(`Resend failed: ${error.message} (status: ${error.statusCode})`);
  }

  console.log(`📧 Email sent to ${recipient} — ID: ${data.id}`);
  return data;
};

export default sendEmail;
