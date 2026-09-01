import StatusBadge from "./StatusBadge";

const ApplicationCard = ({ application }) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {application.company}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{application.role}</p>
        </div>

        <StatusBadge status={application.status} />
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-500">Location</span>
          <span className="font-medium text-slate-700">
            {application.location}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-500">Applied On</span>
          <span className="font-medium text-slate-700">
            {application.date}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-500">Stage</span>
          <span className="font-medium text-slate-700">
            {application.stage}
          </span>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          View
        </button>

        <button
          type="button"
          className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Edit
        </button>
      </div>
    </article>
  );
};

export default ApplicationCard;