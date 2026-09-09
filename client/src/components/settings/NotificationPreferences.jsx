import { useState, useEffect, useCallback } from "react";
import { BsBellFill, BsCheckLg } from "react-icons/bs";
import axiosInstance from "../../api/axiosInstance";
import useAuth from "../../hooks/useAuth";

const PREFS = [
  {
    key: "interviewReminder24h",
    label: "24-hour interview reminder",
    description: "Get an email the day before your scheduled interview",
  },
  {
    key: "interviewReminder1h",
    label: "1-hour interview reminder",
    description: "Get an email one hour before your scheduled interview",
  },
  {
    key: "emailOnStatusChange",
    label: "Application status updates",
    description: "Receive email notifications when you update an application status",
  },
];

const Toggle = ({ checked, onChange, disabled }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
      ${checked ? "bg-indigo-500" : "bg-zinc-700"}`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200
        ${checked ? "translate-x-5" : "translate-x-0"}`}
    />
  </button>
);

const NotificationPreferences = () => {
  const { user, login } = useAuth();
  const [prefs, setPrefs]     = useState({ emailOnStatusChange: true, interviewReminder24h: true, interviewReminder1h: true });
  const [saving, setSaving]   = useState(null); // key of the pref being saved
  const [saved, setSaved]     = useState(null); // key of recently saved pref
  const [error, setError]     = useState("");

  // Hydrate from user context
  useEffect(() => {
    if (user?.notifications) {
      setPrefs(user.notifications);
    }
  }, [user]);

  const handleToggle = useCallback(async (key, value) => {
    setError("");
    // Optimistic update
    setPrefs((prev) => ({ ...prev, [key]: value }));
    setSaving(key);

    try {
      const res = await axiosInstance.patch("/auth/me/notifications", { [key]: value });
      // Update auth context so the change persists across the session
      if (user) {
        login({ user: { ...user, notifications: res.data.data }, token: localStorage.getItem("token") });
      }
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    } catch {
      // Rollback on error
      setPrefs((prev) => ({ ...prev, [key]: !value }));
      setError("Failed to save preference. Please try again.");
    } finally {
      setSaving(null);
    }
  }, [user, login]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
        <BsBellFill className="text-indigo-400 text-sm" />
        <p className="text-sm font-semibold text-white">Email Notifications</p>
      </div>

      <div className="divide-y divide-zinc-800">
        {PREFS.map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {saved === key && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <BsCheckLg />
                  Saved
                </span>
              )}
              <Toggle
                checked={prefs[key] ?? true}
                onChange={(val) => handleToggle(key, val)}
                disabled={saving === key}
              />
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="px-5 py-3 bg-red-500/10 border-t border-red-500/20">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
};

export default NotificationPreferences;
