import { useState, useEffect } from "react";

// Status values match the backend enum exactly (capital first letter)
const statusOptions = [
  { value: "Applied", label: "Applied" },
  { value: "Interview", label: "Interview" },
  { value: "Offer", label: "Offer" },
  { value: "Rejected", label: "Rejected" },
];

const workTypeOptions = [
  { value: "", label: "Not specified" },
  { value: "Remote", label: "Remote" },
  { value: "Hybrid", label: "Hybrid" },
  { value: "On-site", label: "On-site" },
];

const priorityOptions = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

const labelClass = "block text-sm font-medium text-zinc-300 mb-1.5";

const toLocalDateInput = (dateVal) => {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const toDatetimeLocal = (dateVal) => {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const ApplicationForm = ({ application, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    jobRole: "",
    location: "",
    workType: "",
    status: "Applied",
    priority: "Medium",
    notes: "",
    jobLink: "",
    appliedDate: toLocalDateInput(new Date()),
    interviewDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (application) {
      setFormData({
        companyName: application.companyName || "",
        jobRole: application.jobRole || "",
        location: application.location || "",
        workType: application.workType || "",
        status: application.status || "Applied",
        priority: application.priority || "Medium",
        notes: application.notes || "",
        jobLink: application.jobLink || "",
        appliedDate:
          toLocalDateInput(application.appliedDate) ||
          toLocalDateInput(new Date()),
        interviewDate: application.interviewDate
          ? toDatetimeLocal(application.interviewDate)
          : "",
      });
    }
  }, [application]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "status") {
        return {
          ...prev,
          status: value,
          interviewDate: value === "Interview" ? prev.interviewDate : "",
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = { ...formData };

      if (payload.status !== "Interview") {
        payload.interviewDate = null;
      } else if (payload.interviewDate) {
        payload.interviewDate = new Date(payload.interviewDate).toISOString();
      } else {
        payload.interviewDate = null;
      }

      await onSubmit(payload);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save application. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>
            Company <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            placeholder="e.g. Google"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            Role <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="jobRole"
            value={formData.jobRole}
            onChange={handleChange}
            required
            placeholder="e.g. Frontend Engineer"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. San Francisco, CA"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Work Type</label>
          <select
            name="workType"
            value={formData.workType}
            onChange={handleChange}
            className={inputClass}
          >
            {workTypeOptions.map((o) => (
              <option key={o.value} value={o.value} className="bg-zinc-900">
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>
            Status <span className="text-red-400">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className={inputClass}
          >
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value} className="bg-zinc-900">
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={inputClass}
          >
            {priorityOptions.map((o) => (
              <option key={o.value} value={o.value} className="bg-zinc-900">
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(formData.status === "Interview" || formData.interviewDate) && (
        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-sm font-semibold text-indigo-300 flex items-center gap-1.5">
              <span>📅</span> Interview Date & Time
            </label>
            <span className="text-[11px] font-medium text-indigo-300/90 bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded-full">
              ⚡ Auto email reminders (24h & 1h prior)
            </span>
          </div>
          <input
            type="datetime-local"
            name="interviewDate"
            value={formData.interviewDate}
            onChange={handleChange}
            className={inputClass}
          />
          <p className="text-xs text-zinc-400">
            HireFlow will automatically send reminder emails to your registered
            Gmail 24 hours and 1 hour before the interview.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>
            Applied Date <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            name="appliedDate"
            value={formData.appliedDate}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Job Listing URL</label>
          <input
            type="url"
            name="jobLink"
            value={formData.jobLink}
            onChange={handleChange}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Recruiter name, referral, next steps…"
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 rounded-xl border border-zinc-700 bg-zinc-800 text-white font-medium transition-all hover:bg-zinc-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Saving…"
            : application
              ? "Update Application"
              : "Add Application"}
        </button>
      </div>
    </form>
  );
};

export default ApplicationForm;
