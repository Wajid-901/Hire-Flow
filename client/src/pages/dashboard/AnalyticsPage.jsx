import { useState, useEffect, useMemo } from "react";
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { BsBriefcaseFill, BsChatDotsFill, BsTrophyFill, BsXCircleFill, BsArrowUp, BsArrowDown } from "react-icons/bs";
import PageContainer from "../../components/layout/PageContainer";
import Loader from "../../components/common/Loader";
import { getApplications } from "../../api/applicationsApi";

// ─── colour tokens ───────────────────────────────────────────────────────────
const COLORS = {
  Applied:   "#6366F1",
  Interview: "#F59E0B",
  Offer:     "#10B981",
  Rejected:  "#F43F5E",
};

// ─── Custom Recharts tooltip ─────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 shadow-2xl">
      {label && <p className="text-xs text-zinc-400 mb-2">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} className="text-sm font-semibold" style={{ color: p.color || p.fill }}>
          {p.name}: <span className="text-white">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

// ─── stat card ───────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, Icon, color, trend }) => (
  <div className={`rounded-2xl border bg-[#18181B] p-5 shadow-xl ${color.border}`}>
    <div className="flex items-start justify-between gap-3 mb-3">
      <p className="text-sm text-zinc-400">{label}</p>
      <div className={`flex items-center justify-center w-9 h-9 rounded-xl ${color.icon}`}>
        <Icon className="text-base" />
      </div>
    </div>
    <p className="text-4xl font-bold text-white tabular-nums mb-1">{value}</p>
    <div className="flex items-center gap-2">
      <p className="text-xs text-zinc-500">{sub}</p>
      {trend !== undefined && trend !== null && (
        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${trend >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
          {trend >= 0 ? <BsArrowUp /> : <BsArrowDown />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
  </div>
);

// ─── section wrapper ─────────────────────────────────────────────────────────
const ChartCard = ({ title, subtitle, children }) => (
  <div className="rounded-2xl border border-white/5 bg-[#18181B] p-6 shadow-xl">
    <div className="mb-5">
      <h3 className="text-lg font-bold text-white">{title}</h3>
      {subtitle && <p className="text-sm text-zinc-400 mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </div>
);

// ─── main page ───────────────────────────────────────────────────────────────
const AnalyticsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

  useEffect(() => {
    getApplications()
      .then((r) => setApplications(r.data || []))
      .catch(() => setError("Failed to load analytics data."))
      .finally(() => setLoading(false));
  }, []);

  // ── derived data ─────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total      = applications.length;
    const interviews = applications.filter((a) => a.status === "Interview").length;
    const offers     = applications.filter((a) => a.status === "Offer").length;
    const rejected   = applications.filter((a) => a.status === "Rejected").length;
    const successRate = total > 0 ? Math.round((offers / total) * 100) : 0;
    const interviewRate = total > 0 ? Math.round((interviews / total) * 100) : 0;
    return { total, interviews, offers, rejected, successRate, interviewRate };
  }, [applications]);

  // Status distribution for Pie chart
  const pieData = useMemo(() => [
    { name: "Applied",   value: applications.filter((a) => a.status === "Applied").length },
    { name: "Interview", value: stats.interviews },
    { name: "Offer",     value: stats.offers },
    { name: "Rejected",  value: stats.rejected },
  ].filter((d) => d.value > 0), [applications, stats]);

  // Applications per month (last 6 months) for Area chart
  const monthlyData = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        Applied:   0,
        Interview: 0,
        Offer:     0,
        Rejected:  0,
      });
    }
    applications.forEach((app) => {
      const d = new Date(app.appliedDate || app.createdAt);
      const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      const slot = months.find((m) => m.month === key);
      if (slot) slot[app.status] = (slot[app.status] || 0) + 1;
    });
    return months;
  }, [applications]);

  // Applications per weekday for Bar chart
  const weekdayData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    applications.forEach((a) => {
      counts[new Date(a.appliedDate || a.createdAt).getDay()]++;
    });
    return days.map((label, i) => ({ label, count: counts[i] }));
  }, [applications]);

  // Top companies by application count
  const topCompanies = useMemo(() => {
    const map = {};
    applications.forEach((a) => {
      if (a.companyName) map[a.companyName] = (map[a.companyName] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }, [applications]);

  if (loading) {
    return (
      <PageContainer>
        <Loader size="lg" fullScreen={false} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-1">Analytics</h1>
        <p className="text-lg text-neutral-400">
          Insights from your {applications.length} tracked application{applications.length !== 1 ? "s" : ""}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Applications"
          value={stats.total}
          sub="All time"
          Icon={BsBriefcaseFill}
          color={{ border: "border-indigo-500/20", icon: "bg-indigo-500/15 text-indigo-400" }}
        />
        <StatCard
          label="Interviews"
          value={stats.interviews}
          sub={`${stats.interviewRate}% conversion`}
          Icon={BsChatDotsFill}
          color={{ border: "border-amber-500/20", icon: "bg-amber-500/15 text-amber-400" }}
        />
        <StatCard
          label="Offers"
          value={stats.offers}
          sub={`${stats.successRate}% success rate`}
          Icon={BsTrophyFill}
          color={{ border: "border-emerald-500/20", icon: "bg-emerald-500/15 text-emerald-400" }}
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          sub="Keep going!"
          Icon={BsXCircleFill}
          color={{ border: "border-rose-500/20", icon: "bg-rose-500/15 text-rose-400" }}
        />
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#18181B] p-20 text-center shadow-xl">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-white mb-2">No data yet</h3>
          <p className="text-zinc-400">Add some applications to see your analytics.</p>
        </div>
      ) : (
        <>
          {/* Row 1: Area chart (monthly trend) + Pie (status) */}
          <div className="grid gap-6 lg:grid-cols-3 mb-6">
            <div className="lg:col-span-2">
              <ChartCard title="Applications Over Time" subtitle="Monthly breakdown by status (last 6 months)">
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      {Object.entries(COLORS).map(([key, col]) => (
                        <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={col} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={col} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }} />
                    {Object.entries(COLORS).map(([key, col]) => (
                      <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={col}
                        strokeWidth={2}
                        fill={`url(#grad-${key})`}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <div>
              <ChartCard title="Status Distribution" subtitle="Current breakdown">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={COLORS[entry.name]} opacity={0.9} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {pieData.map((d) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[d.name] }} />
                      <span className="text-xs text-zinc-400">{d.name}</span>
                      <span className="text-xs font-bold text-white ml-auto">{d.value}</span>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>
          </div>

          {/* Row 2: Bar chart (weekday) + Top companies */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Applications by Day of Week" subtitle="When you apply most often">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weekdayData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Applications" radius={[6, 6, 0, 0]}>
                    {weekdayData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.count > 0 ? "#6366F1" : "#27272a"}
                        opacity={entry.count > 0 ? 0.85 : 1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Top Companies" subtitle="Most applied-to companies">
              {topCompanies.length > 0 ? (
                <div className="space-y-3 mt-1">
                  {topCompanies.map((c, i) => {
                    const pct = Math.round((c.count / stats.total) * 100);
                    return (
                      <div key={c.name}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-indigo-500/15 text-indigo-400 text-xs font-bold flex items-center justify-center">
                              {c.name.charAt(0).toUpperCase()}
                            </span>
                            <span className="text-sm font-medium text-white truncate max-w-[160px]">{c.name}</span>
                          </div>
                          <span className="text-sm font-bold text-zinc-300 tabular-nums">{c.count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-zinc-500 py-8 text-center">No company data yet</p>
              )}
            </ChartCard>
          </div>
        </>
      )}
    </PageContainer>
  );
};

export default AnalyticsPage;
