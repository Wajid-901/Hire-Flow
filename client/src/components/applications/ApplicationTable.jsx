import { BsEye, BsPencil, BsTrash, BsGeoAlt, BsCalendarEvent, BsFlagFill } from "react-icons/bs";
import StatusBadge from "./StatusBadge";

const priorityColor = {
  High:   "text-rose-400 bg-rose-500/10 border-rose-500/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Low:    "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

const ApplicationTable = ({
  applications = [],
  onEdit,
  onDelete,
  selectedApplications = [],
  onSelectionChange,
}) => {
  const handleSelectAll = (e) => {
    onSelectionChange(e.target.checked ? applications.map((a) => a._id) : []);
  };

  const handleSelectOne = (id) => {
    onSelectionChange(
      selectedApplications.includes(id)
        ? selectedApplications.filter((x) => x !== id)
        : [...selectedApplications, id]
    );
  };

  const isAllSelected =
    applications.length > 0 && selectedApplications.length === applications.length;

  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[#18181B] shadow-xl overflow-hidden">
        <div className="px-6 py-20 text-center">
          <div className="text-5xl mb-3">&#128301;</div>
          <p className="font-medium text-white">No applications found</p>
          <p className="text-sm text-neutral-500 mt-1">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* MOBILE: card list (hidden on sm+) */}
      <div className="sm:hidden space-y-3">
        {/* Select-all bar */}
        {onSelectionChange && applications.length > 0 && (
          <div className="flex items-center gap-3 px-1">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded bg-zinc-800 border-zinc-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
            />
            <span className="text-xs text-zinc-400">
              {selectedApplications.length > 0
                ? `${selectedApplications.length} selected`
                : "Select all"}
            </span>
          </div>
        )}

        {applications.map((app) => (
          <div
            key={app._id}
            className={`rounded-2xl border bg-[#18181B] p-4 shadow-lg transition-colors
              ${selectedApplications.includes(app._id) ? "border-indigo-500/40 bg-indigo-500/5" : "border-white/5"}`}
          >
            {/* Top row: checkbox + company + status */}
            <div className="flex items-start gap-3 mb-3">
              {onSelectionChange && (
                <input
                  type="checkbox"
                  checked={selectedApplications.includes(app._id)}
                  onChange={() => handleSelectOne(app._id)}
                  className="w-4 h-4 rounded bg-zinc-800 border-zinc-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 mt-0.5 shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm font-bold text-white shrink-0">
                      {app.companyName?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{app.companyName}</p>
                      <p className="text-xs text-zinc-400 truncate">{app.jobRole}</p>
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              </div>
            </div>

            {/* Meta row: location - date - priority */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 mb-3 pl-7">
              {app.location && (
                <span className="flex items-center gap-1">
                  <BsGeoAlt className="shrink-0" />
                  {app.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <BsCalendarEvent className="shrink-0" />
                {new Date(app.appliedDate || app.createdAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })}
              </span>
              {app.priority && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${priorityColor[app.priority] || priorityColor.Medium}`}>
                  <BsFlagFill className="text-[9px]" />
                  {app.priority}
                </span>
              )}
            </div>

            {/* Actions row */}
            <div className="flex items-center gap-2 pl-7">
              <button
                type="button"
                onClick={() => onEdit && onEdit(app)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold hover:bg-indigo-500/20 transition-all"
              >
                <BsPencil />
                Edit
              </button>
              {app.jobLink && (
                <button
                  type="button"
                  onClick={() => window.open(app.jobLink, "_blank")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300 text-xs font-semibold hover:bg-white/10 transition-all"
                >
                  <BsEye />
                  View
                </button>
              )}
              <button
                type="button"
                onClick={() => onDelete && onDelete(app._id)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-all"
              >
                <BsTrash />
              </button>
            </div>
          </div>
        ))}

        {/* Footer count */}
        <p className="text-xs text-zinc-500 text-center pt-1">
          {applications.length} application{applications.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* DESKTOP: full table (hidden on mobile) */}
      <div className="hidden sm:block rounded-2xl border border-white/5 bg-[#18181B] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-5 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded bg-zinc-800 border-zinc-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">Company</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">Role</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 hidden md:table-cell">Location</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 hidden lg:table-cell">Applied</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400 hidden lg:table-cell">Priority</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400">Status</th>
                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-neutral-400">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {applications.map((app) => (
                <tr
                  key={app._id}
                  className={`group transition-colors hover:bg-white/[0.02] ${
                    selectedApplications.includes(app._id) ? "bg-indigo-500/5" : ""
                  }`}
                >
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selectedApplications.includes(app._id)}
                      onChange={() => handleSelectOne(app._id)}
                      className="w-4 h-4 rounded bg-zinc-800 border-zinc-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 text-base shrink-0 font-bold text-white">
                        {app.companyName?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <span className="font-semibold text-white truncate max-w-[140px]">{app.companyName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-white truncate max-w-[160px]">{app.jobRole}</p>
                    {app.workType && <p className="text-xs text-neutral-500 mt-0.5">{app.workType}</p>}
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-sm text-neutral-400">
                      <BsGeoAlt className="text-neutral-500 shrink-0" />
                      <span className="truncate max-w-[120px]">{app.location || "—"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-sm text-neutral-400">
                      <BsCalendarEvent className="text-neutral-500 shrink-0" />
                      {new Date(app.appliedDate || app.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    {app.priority && (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${priorityColor[app.priority] || priorityColor.Medium}`}>
                        <BsFlagFill className="text-[10px]" />
                        {app.priority}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={app.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" onClick={() => window.open(app.jobLink, "_blank")} disabled={!app.jobLink} title="View listing"
                        className="rounded-lg p-2 text-neutral-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-25 disabled:cursor-not-allowed">
                        <BsEye className="text-base" />
                      </button>
                      <button type="button" onClick={() => onEdit && onEdit(app)} title="Edit"
                        className="rounded-lg p-2 text-neutral-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
                        <BsPencil className="text-base" />
                      </button>
                      <button type="button" onClick={() => onDelete && onDelete(app._id)} title="Delete"
                        className="rounded-lg p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <BsTrash className="text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-white/5 px-6 py-4">
          <p className="text-sm text-neutral-400">
            Showing <span className="font-medium text-white">{applications.length}</span>{" "}
            application{applications.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </>
  );
};

export default ApplicationTable;

