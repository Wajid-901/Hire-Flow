import { useState, useEffect } from "react";
import { BsGlobe, BsCheckLg } from "react-icons/bs";

const TIMEZONES = [
  { value: "UTC",                    label: "UTC — Coordinated Universal Time" },
  { value: "America/New_York",       label: "UTC−5/−4 — New York (ET)" },
  { value: "America/Chicago",        label: "UTC−6/−5 — Chicago (CT)" },
  { value: "America/Denver",         label: "UTC−7/−6 — Denver (MT)" },
  { value: "America/Los_Angeles",    label: "UTC−8/−7 — Los Angeles (PT)" },
  { value: "America/Sao_Paulo",      label: "UTC−3 — São Paulo (BRT)" },
  { value: "Europe/London",          label: "UTC+0/+1 — London (GMT/BST)" },
  { value: "Europe/Paris",           label: "UTC+1/+2 — Paris (CET)" },
  { value: "Europe/Moscow",          label: "UTC+3 — Moscow (MSK)" },
  { value: "Asia/Dubai",             label: "UTC+4 — Dubai (GST)" },
  { value: "Asia/Karachi",           label: "UTC+5 — Karachi (PKT)" },
  { value: "Asia/Kolkata",           label: "UTC+5:30 — India (IST)" },
  { value: "Asia/Dhaka",             label: "UTC+6 — Dhaka (BST)" },
  { value: "Asia/Bangkok",           label: "UTC+7 — Bangkok (ICT)" },
  { value: "Asia/Shanghai",          label: "UTC+8 — China (CST)" },
  { value: "Asia/Tokyo",             label: "UTC+9 — Tokyo (JST)" },
  { value: "Australia/Sydney",       label: "UTC+10/+11 — Sydney (AEST)" },
];

const LS_KEY = "hireflow_timezone";

export const getUserTimezone = () =>
  localStorage.getItem(LS_KEY) || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

const AppPreferences = () => {
  const [timezone, setTimezone]   = useState(getUserTimezone);
  const [saved, setSaved]         = useState(false);

  // Detect browser timezone as default label
  const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const handleSave = () => {
    localStorage.setItem(LS_KEY, timezone);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    // Dispatch a custom event so other components can react to the change
    window.dispatchEvent(new CustomEvent("hireflow:timezone-changed", { detail: { timezone } }));
  };

  // Pre-select browser timezone if no preference saved yet
  useEffect(() => {
    if (!localStorage.getItem(LS_KEY)) {
      const matchedTz = TIMEZONES.find((t) => t.value === browserTz);
      if (matchedTz) setTimezone(browserTz);
    }
  }, [browserTz]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
        <BsGlobe className="text-indigo-400 text-sm" />
        <p className="text-sm font-semibold text-white">Date & Time</p>
      </div>

      <div className="px-5 py-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
            Timezone
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            {/* Show browser default at top if not in list */}
            {!TIMEZONES.find((t) => t.value === browserTz) && (
              <option value={browserTz}>{browserTz} (browser default)</option>
            )}
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
          <p className="text-xs text-zinc-500 mt-1.5">
            Used for displaying dates in analytics and calendar views
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div />
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
          >
            {saved ? (
              <>
                <BsCheckLg />
                Saved
              </>
            ) : (
              "Save preferences"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppPreferences;
