const ActivityChart = ({
  title    = "Application Activity",
  subtitle = "Applications submitted over the last 7 days",
  data     = [],
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-2xl border border-white/5 bg-[#18181B] p-6 shadow-xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm text-neutral-400">{subtitle}</p>
      </div>

      <div className="flex h-56 items-end gap-2 sm:gap-3">
        {data.map((item) => {
          const heightPct = Math.max((item.value / maxValue) * 100, item.value > 0 ? 8 : 3);

          return (
            <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
              {/* Bar + tooltip */}
              <div className="relative flex h-44 w-full items-end justify-center group cursor-default">
                {/* Hover tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-lg bg-zinc-800 border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-10">
                  <p className="text-xs font-semibold text-white">
                    {item.value} {item.value === 1 ? "app" : "apps"}
                  </p>
                </div>

                {/* Bar */}
                <div
                  className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ease-out relative overflow-hidden
                    ${item.value > 0
                      ? "bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.3)]"
                      : "bg-white/5 group-hover:bg-white/10"
                    }`}
                  style={{ height: `${heightPct}%` }}
                >
                  {item.value > 0 && (
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>

              {/* Label + count */}
              <div className="text-center">
                <p className={`text-xs font-semibold tabular-nums ${item.value > 0 ? "text-white" : "text-zinc-600"}`}>
                  {item.value}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityChart;
