import Application from "../models/applicationModel.js";
import sendEmail from "./emailService.js";
import { interviewReminderTemplate } from "./emailTemplates.js";

const CHECK_INTERVAL_MS = 10 * 60 * 1000; // Check every 10 minutes

const formatInterviewDate = (date) => {
  try {
    return new Date(date).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return new Date(date).toUTCString();
  }
};

/**
 * Checks for upcoming interviews and dispatches 24h and 1h email reminders.
 */
export const checkAndSendReminders = async () => {
  try {
    const now = new Date();

    // ── 1. Interviews coming up in <= 65 minutes (1h reminder) ────────────
    const oneHourWindowEnd = new Date(now.getTime() + 65 * 60 * 1000);

    const appsFor1h = await Application.find({
      interviewDate: { $gt: now, $lte: oneHourWindowEnd },
      reminder1hSent: false,
      status: { $nin: ["Rejected"] },
    }).populate("user", "name email");

    for (const app of appsFor1h) {
      if (!app.user?.email) continue;

      try {
        const formatted = formatInterviewDate(app.interviewDate);
        const { subject, html } = interviewReminderTemplate({
          name: app.user.name,
          companyName: app.companyName,
          jobRole: app.jobRole,
          interviewDateFormatted: formatted,
          timeframeText: "in 1 hour",
        });

        await sendEmail({
          to: app.user.email,
          subject,
          html,
        });

        // Mark both 1h and 24h as sent so 24h never fires afterwards
        await Application.findByIdAndUpdate(app._id, {
          reminder1hSent: true,
          reminder24hSent: true,
        });

        console.log(`⏰ [Reminder] 1-hour reminder sent to ${app.user.email} for ${app.companyName}`);
      } catch (err) {
        console.error(`❌ [Reminder] Error sending 1h reminder for app ${app._id}:`, err.message);
      }
    }

    // ── 2. Interviews coming up in 1 to 25 hours (24h reminder) ───────────
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    const dayWindowEnd   = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const appsFor24h = await Application.find({
      interviewDate: { $gt: oneHourFromNow, $lte: dayWindowEnd },
      reminder24hSent: false,
      status: { $nin: ["Rejected"] },
    }).populate("user", "name email");

    for (const app of appsFor24h) {
      if (!app.user?.email) continue;

      try {
        const formatted = formatInterviewDate(app.interviewDate);
        const { subject, html } = interviewReminderTemplate({
          name: app.user.name,
          companyName: app.companyName,
          jobRole: app.jobRole,
          interviewDateFormatted: formatted,
          timeframeText: "in 24 hours",
        });

        await sendEmail({
          to: app.user.email,
          subject,
          html,
        });

        await Application.findByIdAndUpdate(app._id, {
          reminder24hSent: true,
        });

        console.log(`⏰ [Reminder] 24-hour reminder sent to ${app.user.email} for ${app.companyName}`);
      } catch (err) {
        console.error(`❌ [Reminder] Error sending 24h reminder for app ${app._id}:`, err.message);
      }
    }
  } catch (error) {
    console.error("❌ [Reminder] Error in checkAndSendReminders job:", error.message);
  }
};

/**
 * Starts the reminder background interval.
 */
export const startReminderService = () => {
  console.log("⏰ Interview reminder service initialized (checks every 10 min)");

  // Run initial check 5 seconds after startup
  setTimeout(() => {
    checkAndSendReminders();
  }, 5000);

  // Set recurring interval
  const intervalId = setInterval(checkAndSendReminders, CHECK_INTERVAL_MS);

  // Allow process to exit cleanly if needed
  if (intervalId.unref) {
    intervalId.unref();
  }

  return intervalId;
};

export default startReminderService;
