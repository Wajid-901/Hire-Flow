// ─── shared layout wrapper ───────────────────────────────────────────────────
const layout = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>HireFlow</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
      background-color: #09090b;
      color: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    a { color: inherit; text-decoration: none; }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
    style="background-color:#09090b; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
          style="max-width:560px;">

          <!-- Logo / Header -->
          <tr>
            <td style="padding-bottom:32px;" align="center">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="
                    background: linear-gradient(135deg,#6366f1,#8b5cf6);
                    border-radius:12px;
                    width:40px; height:40px;
                    text-align:center; vertical-align:middle;
                    display:inline-block;
                  ">
                    <span style="color:#fff;font-size:20px;font-weight:800;line-height:40px;padding:0 10px;">H</span>
                  </td>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                      Hire<span style="color:#818cf8;">Flow</span>
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="
              background-color:#18181b;
              border:1px solid rgba(255,255,255,0.08);
              border-radius:20px;
              padding:40px 36px;
            ">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:28px;text-align:center;">
              <p style="font-size:12px;color:#52525b;line-height:1.6;">
                You're receiving this email because an account exists with this address on HireFlow.<br/>
                If you didn't request this, you can safely ignore it.<br/><br/>
                &copy; ${new Date().getFullYear()} HireFlow. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ─── Password Reset template ─────────────────────────────────────────────────
export const passwordResetTemplate = ({ name, resetUrl, expiryMinutes = 60 }) => ({
  subject: "Reset your HireFlow password",
  html: layout(`
    <!-- Icon -->
    <div style="text-align:center;margin-bottom:28px;">
      <div style="
        display:inline-flex;align-items:center;justify-content:center;
        width:60px;height:60px;border-radius:16px;
        background:rgba(99,102,241,0.12);
        border:1px solid rgba(99,102,241,0.25);
        font-size:28px;
      ">🔐</div>
    </div>

    <!-- Heading -->
    <h1 style="font-size:24px;font-weight:700;color:#ffffff;text-align:center;
      margin-bottom:12px;letter-spacing:-0.5px;">
      Reset your password
    </h1>

    <!-- Subtext -->
    <p style="font-size:15px;color:#a1a1aa;text-align:center;line-height:1.6;margin-bottom:32px;">
      Hi ${name || "there"}, we received a request to reset the password for your HireFlow account.
      Click the button below to choose a new password.
    </p>

    <!-- CTA Button -->
    <div style="text-align:center;margin-bottom:32px;">
      <a href="${resetUrl}"
        style="
          display:inline-block;
          background:linear-gradient(135deg,#6366f1,#8b5cf6);
          color:#ffffff;
          font-size:15px;
          font-weight:600;
          padding:14px 36px;
          border-radius:12px;
          letter-spacing:0.01em;
          text-decoration:none;
        ">
        Reset Password
      </a>
    </div>

    <!-- Expiry notice -->
    <p style="font-size:13px;color:#71717a;text-align:center;margin-bottom:28px;">
      This link expires in <strong style="color:#a1a1aa;">${expiryMinutes} minutes</strong>.
      After that you'll need to request a new one.
    </p>

    <!-- Divider -->
    <div style="border-top:1px solid rgba(255,255,255,0.06);margin-bottom:24px;"></div>

    <!-- Fallback URL -->
    <p style="font-size:12px;color:#52525b;line-height:1.7;">
      If the button doesn't work, copy and paste this URL into your browser:<br/>
      <a href="${resetUrl}" style="color:#6366f1;word-break:break-all;">${resetUrl}</a>
    </p>
  `),
});

// ─── Welcome / registration template ────────────────────────────────────────
export const welcomeTemplate = ({ name }) => ({
  subject: "Welcome to HireFlow 🎉",
  html: layout(`
    <div style="text-align:center;margin-bottom:28px;">
      <div style="font-size:48px;">🚀</div>
    </div>

    <h1 style="font-size:24px;font-weight:700;color:#ffffff;text-align:center;
      margin-bottom:12px;letter-spacing:-0.5px;">
      Welcome to HireFlow, ${name || "there"}!
    </h1>

    <p style="font-size:15px;color:#a1a1aa;text-align:center;line-height:1.6;margin-bottom:32px;">
      Your account is ready. Start tracking your job applications, stay organised,
      and land your dream role — completely free.
    </p>

    <div style="text-align:center;margin-bottom:32px;">
      <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/dashboard"
        style="
          display:inline-block;
          background:linear-gradient(135deg,#6366f1,#8b5cf6);
          color:#ffffff;
          font-size:15px;
          font-weight:600;
          padding:14px 36px;
          border-radius:12px;
          text-decoration:none;
        ">
        Go to Dashboard
      </a>
    </div>

    <div style="
      background:rgba(99,102,241,0.06);
      border:1px solid rgba(99,102,241,0.15);
      border-radius:12px;
      padding:20px 24px;
    ">
      <p style="font-size:13px;font-weight:600;color:#818cf8;margin-bottom:10px;">
        What you can do with HireFlow:
      </p>
      <ul style="font-size:13px;color:#a1a1aa;line-height:2;padding-left:16px;margin:0;">
        <li>Track every job application in one place</li>
        <li>Filter, search and sort your applications instantly</li>
        <li>Visualise your job search funnel with analytics</li>
        <li>Export your data to CSV any time</li>
      </ul>
    </div>
  `),
});
