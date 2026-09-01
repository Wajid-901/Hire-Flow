// Keys match the backend enum exactly (capital-first)
const statusStyles = {
  Applied: {
    bg:     "bg-indigo-500/10",
    text:   "text-indigo-400",
    border: "border-indigo-500/20",
    dot:    "bg-indigo-400",
  },
  Interview: {
    bg:     "bg-amber-500/10",
    text:   "text-amber-400",
    border: "border-amber-500/20",
    dot:    "bg-amber-400",
  },
  Offer: {
    bg:     "bg-emerald-500/10",
    text:   "text-emerald-400",
    border: "border-emerald-500/20",
    dot:    "bg-emerald-400",
  },
  Rejected: {
    bg:     "bg-rose-500/10",
    text:   "text-rose-400",
    border: "border-rose-500/20",
    dot:    "bg-rose-400",
  },
};

const fallback = {
  bg:     "bg-zinc-800",
  text:   "text-zinc-400",
  border: "border-zinc-700",
  dot:    "bg-zinc-400",
};

const StatusBadge = ({ status = "Applied" }) => {
  const style = statusStyles[status] || fallback;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
