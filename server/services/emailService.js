import nodemailer from "nodemailer";

const createTransporter = async () => {
  // Use Gmail (or any SMTP) if credentials are provided, regardless of NODE_ENV
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return {
      transporter: nodemailer.createTransport({
        host:   process.env.SMTP_HOST   || "smtp.gmail.com",
        port:   Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      }),
      isEthereal: false,
    };
  }

  // No SMTP credentials — use Ethereal fake inbox (dev only)
  console.log("⚠️  No SMTP credentials found. Using Ethereal test account.");
  const testAccount = await nodemailer.createTestAccount();

  return {
    transporter: nodemailer.createTransport({
      host:   "smtp.ethereal.email",
      port:   587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    }),
    isEthereal: true,
  };
};

const sendEmail = async ({ to, subject, html }) => {
  const { transporter, isEthereal } = await createTransporter();

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || '"HireFlow" <noreply@hireflow.app>',
    to,
    subject,
    html,
  });

  if (isEthereal) {
    console.log("📧 Email preview URL:", nodemailer.getTestMessageUrl(info));
  } else {
    console.log(`📧 Email sent to ${to} — Message ID: ${info.messageId}`);
  }

  return info;
};

export default sendEmail;
