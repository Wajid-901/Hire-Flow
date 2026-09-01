import { useState, useEffect } from "react";

// Status values match the backend enum exactly (capital first letter)
const statusOptions = [
  { value: "Applied",   label: "Applied" },
  { value: "Interview", label: "Interview" },
  { value: "Offer",     label: "Offer" },
  { value: "Rejected",  label: "Rejected" },
];

const workTypeOptions = [
  { value: "",         label: "Not specified" },
  { value: "Remote",   label: "Remote" },
  { value: "Hybrid",   label: "Hybrid" },
  { value: "On-site",  label: "On-site" },
];

const priorityOptions = [
  { value: "Low",    label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High",   label: "High" },
];

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

const labelClass = "block text-sm font-medium text-zinc-300 mb-1.5";

const ApplicationForm = ({ application, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    jobRole:     "",
    location:    "",
    workType:    "",
    status:      "Applied",
    priority:    "Medium",
    notes:       "",
    jobLink:     "",
    appliedDate: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // Populate form when editing an existing application
  useEffect(() => {
    if (application) {
      setFormData({
        companyName: application.companyName || "",
        jobRole:     application.jobRole     || "",
        location:    application.location    || "",
        workType:    application.workType    || "",
        status:      application.status      || "Applied",
        priority:    application.priority    || "Medium",
        notes:       application.notes       || "",
        jobLink:     application.jobLink     || "",
        appliedDate: application.appliedDate
          ? new Date(application.appliedDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    }
  }, [application]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save application. Please try again.");
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

      {/* Row 1 – Company & Role */}
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

      {/* Row 2 – Location & Work Type */}
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

      {/* Row 3 – Status & Priority */}
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

      {/* Row 4 – Applied Date & Job Link */}
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

      {/* Notes */}
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

      {/* Actions */}
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
