import { useState, useEffect, useMemo } from "react";
import { BsChevronLeft, BsChevronRight, BsCalendar3, BsBriefcaseFill } from "react-icons/bs";
import PageContainer from "../../components/layout/PageContainer";
import Loader from "../../components/common/Loader";
import { getApplications } from "../../api/applicationsApi";

const STATUS_COLOR = {
  Applied:   "bg-indigo-500",
  Interview: "bg-amber-500",
  Offer:     "bg-emerald-500",
  Rejected:  "bg-rose-500",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const CalendarPage = () => {
  const today   = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selected, setSelected]         = useState(null); // { day, apps[] }

  useEffect(() => {
    getApplications()
      .then((r) => setApplications(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Map "YYYY-MM-DD" → [app, app, …]
  const appsByDate = useMemo(() => {
    const map = {};
    applications.forEach((app) => {
      const d = new Date(app.appliedDate || app.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(app);
    });
    return map;
  }, [applications]);

  // Build calendar grid
  const { cells, prevMonth, nextMonth } = useMemo(() => {
    const first = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev  = new Date(year, month, 0).getDate();

    const cells = [];
    // Leading filler days from previous month
    for (let i = first - 1; i >= 0; i--) {
      cells.push({ day: daysInPrev - i, current: false, future: false });
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      cells.push({
        day: d,
        current: true,
        isToday: dateObj.toDateString() === today.toDateString(),
        key: `${year}-${month}-${d}`,
      });
    }
    // Trailing filler days
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, current: false, future: true });
    }

    return {
      cells,
      prevMonth: () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); },
      nextMonth: () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); },
    };
  }, [year, month]);

  // Upcoming applications in this month
  const thisMonthApps = useMemo(() =>
    applications
      .filter((a) => {
        const d = new Date(a.appliedDate || a.createdAt);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .sort((a, b) => new Date(a.appliedDate || a.createdAt) - new Date(b.appliedDate || b.createdAt)),
    [applications, year, month]
  );

  if (loading) return <PageContainer><Loader size="lg" fullScreen={false} /></PageContainer>;

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-1">Calendar</h1>
        <p className="text-sm sm:text-lg text-neutral-400">Your application timeline at a glance</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Calendar ── */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#18181B] p-4 sm:p-6 shadow-xl">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {MONTHS[month]} {year}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <BsChevronLeft />
              </button>
              <button
                onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <BsChevronRight />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[10px] sm:text-xs font-semibold text-zinc-500 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell, idx) => {
              const apps = cell.current ? (appsByDate[cell.key] || []) : [];
              const isSelected = selected && cell.current && selected.day === cell.day && selected.month === month;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (!cell.current) return;
                    setSelected(
                      isSelected ? null : { day: cell.day, month, apps }
                    );
                  }}
                  disabled={!cell.current}
                  className={`relative flex flex-col items-center rounded-xl p-1 sm:p-1.5 min-h-[40px] sm:min-h-[52px] transition-all
                    ${!cell.current ? "opacity-20 cursor-default" : "hover:bg-white/5 cursor-pointer"}
                    ${cell.isToday ? "ring-2 ring-indigo-500 bg-indigo-500/10" : ""}
                    ${isSelected ? "bg-indigo-500/20 ring-2 ring-indigo-400" : ""}
                  `}
                >
                  <span className={`text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 ${
                    cell.isToday ? "text-indigo-400" : cell.current ? "text-white" : "text-zinc-600"
                  }`}>
                    {cell.day}
                  </span>
                  {/* Up to 3 status dots */}
                  <div className="flex gap-0.5 flex-wrap justify-center">
                    {apps.slice(0, 3).map((app, i) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${STATUS_COLOR[app.status] || "bg-zinc-500"}`}
                      />
                    ))}
                    {apps.length > 3 && (
                      <span className="text-[9px] text-zinc-400 font-bold">+{apps.length - 3}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected day detail */}
          {selected && selected.apps.length > 0 && (
            <div className="mt-5 pt-5 border-t border-white/5">
              <p className="text-sm font-semibold text-zinc-300 mb-3">
                {MONTHS[selected.month]} {selected.day} — {selected.apps.length} application{selected.apps.length !== 1 ? "s" : ""}
              </p>
              <div className="space-y-2">
                {selected.apps.map((app) => (
                  <div key={app._id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-zinc-800/60">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_COLOR[app.status] || "bg-zinc-500"}`} />
                    <span className="font-semibold text-white text-sm truncate">{app.companyName}</span>
                    <span className="text-zinc-400 text-sm truncate">{app.jobRole}</span>
                    <span className="ml-auto text-xs text-zinc-500">{app.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selected && selected.apps.length === 0 && (
            <div className="mt-5 pt-5 border-t border-white/5">
              <p className="text-sm text-zinc-500 text-center py-2">No applications on this date</p>
            </div>
          )}
        </div>

        {/* ── Sidebar: this month ── */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-[#18181B] p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <BsCalendar3 className="text-indigo-400" />
              <h3 className="font-bold text-white text-base">{MONTHS[month]}</h3>
              <span className="ml-auto text-xs font-semibold text-zinc-500">
                {thisMonthApps.length} app{thisMonthApps.length !== 1 ? "s" : ""}
              </span>
            </div>

            {thisMonthApps.length > 0 ? (
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {thisMonthApps.map((app) => (
                  <div key={app._id} className="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                    <div className={`w-1.5 h-full min-h-[32px] rounded-full shrink-0 mt-0.5 ${STATUS_COLOR[app.status] || "bg-zinc-500"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{app.companyName}</p>
                      <p className="text-xs text-zinc-400 truncate">{app.jobRole}</p>
                    </div>
                    <span className="text-xs text-zinc-500 shrink-0 mt-0.5">
                      {new Date(app.appliedDate || app.createdAt).getDate()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <BsBriefcaseFill className="text-3xl text-zinc-700 mx-auto mb-2" />
                <p className="text-sm text-zinc-500">No applications this month</p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="rounded-2xl border border-white/5 bg-[#18181B] p-4 shadow-xl">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Legend</p>
            <div className="space-y-2">
              {Object.entries(STATUS_COLOR).map(([label, cls]) => (
                <div key={label} className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${cls}`} />
                  <span className="text-sm text-zinc-300">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default CalendarPage;
