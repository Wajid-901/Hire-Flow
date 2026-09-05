import { useNavigate } from "react-router-dom";
import { BsArrowRight, BsGeoAlt } from "react-icons/bs";

// Keys match the backend enum exactly (capital-first)
const statusStyles = {
  Applied: {
    bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20", dot: "bg-indigo-400",
  },
  Interview: {
    bg: "bg-amber-500/10",  text: "text-amber-400",  border: "border-amber-500/20",  dot: "bg-amber-400",
  },
  Offer: {
    bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-400",
  },
  Rejected: {
    bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", dot: "bg-rose-400",
  },
};

const fallback = {
  bg: "bg-zinc-800", text: "text-zinc-400", border: "border-zinc-700", dot: "bg-zinc-400",
};

const RecentApplications = ({ applications = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-white/5 bg-[#18181B] p-6 shadow-xl">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Recent Applications</h2>
          <p className="mt-1 text-sm text-neutral-400">Latest updates from your job search</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/dashboard/applications")}
          className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-neutral-300 transition-all hover:bg-white/5 hover:text-white hover:border-white/20"
        >
          View all <BsArrowRight />
        </button>
      </div>

      <div className="space-y-3">
        {applications.length > 0 ? (
          applications.map((item) => {
            const style = statusStyles[item.status] || fallback;
            return (
              <div
                key={item.id}
                onClick={() => navigate("/dashboard/applications")}
                className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#1C1C1C] p-4 transition-all hover:border-white/10 hover:bg-[#232323] cursor-pointer"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Company initial avatar */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-sm shrink-0">
                      {item.company?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">
                        {item.company}
                      </h3>
                      <p className="text-sm text-neutral-400 truncate">{item.role}</p>
                      <div className="flex items-center gap-3 text-xs text-neutral-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <BsGeoAlt className="shrink-0" />
                          {item.location}
                        </span>
                        <span>·</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border whitespace-nowrap ${style.bg} ${style.text} ${style.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {item.status}
                    </span>
                    {item.interviewDate && (
                      <span className="text-[11px] font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                        📅 {new Date(item.interviewDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 bg-[#1C1C1C] px-4 py-12 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm font-medium text-white mb-1">No applications yet</p>
            <p className="text-xs text-neutral-500">Start tracking your job applications here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentApplications;
