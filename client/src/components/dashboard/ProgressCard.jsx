const ProgressCard = ({
  title = "Application Progress",
  total = 100,
  applied = 24,
  interviewing = 6,
  offers = 2,
}) => {
  const appliedPercent = Math.round((applied / total) * 100);
  const interviewingPercent = Math.round((interviewing / total) * 100);
  const offersPercent = Math.round((offers / total) * 100);

  const progressItems = [
    {
      label: "Applied",
      value: applied,
      percent: appliedPercent,
      color: "bg-indigo-500",
      glow: "shadow-[0_0_12px_rgba(99,102,241,0.6)]",
      icon: "📩"
    },
    {
      label: "Interviewing",
      value: interviewing,
      percent: interviewingPercent,
      color: "bg-amber-500",
      glow: "shadow-[0_0_12px_rgba(245,158,11,0.6)]",
      icon: "🎯"
    },
    {
      label: "Offers",
      value: offers,
      percent: offersPercent,
      color: "bg-emerald-500",
      glow: "shadow-[0_0_12px_rgba(16,185,129,0.6)]",
      icon: "✅"
    }
  ];

  return (
    <div className="rounded-2xl border border-white/5 bg-[#18181B] p-6 shadow-xl">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm text-neutral-400">
        Quick snapshot of where you stand
      </p>

      <div className="mt-6 space-y-5">
        {progressItems.map((item) => (
          <div key={item.label} className="group">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-neutral-300">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </span>
              <span className="text-neutral-500">
                <span className="font-semibold text-white">{item.value}</span> / {total}
              </span>
            </div>
            <div className="relative h-2.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className={`h-full rounded-full ${item.color} ${item.glow} transition-all duration-500 ease-out group-hover:scale-x-105 origin-left`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
            <div className="mt-1 text-right">
              <span className="text-xs font-semibold text-neutral-500">{item.percent}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Total Progress */}
      <div className="mt-6 pt-5 border-t border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-400">Success Rate</span>
          <span className="text-lg font-bold text-emerald-400">
            {offers > 0 ? Math.round((offers / applied) * 100) : 0}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
