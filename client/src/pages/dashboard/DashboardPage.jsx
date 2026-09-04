import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsPlus, BsArrowRight, BsLightningFill } from "react-icons/bs";
import StatsCard from "../../components/dashboard/StatsCard";
import RecentApplications from "../../components/dashboard/RecentApplications";
import ProgressCard from "../../components/dashboard/ProgressCard";
import ActivityChart from "../../components/dashboard/ActivityChart";
import PageContainer from "../../components/layout/PageContainer";
import { DashboardSkeleton } from "../../components/common/Skeleton";
import useAuth from "../../hooks/useAuth";
import { getApplications } from "../../api/applicationsApi";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // BUG-08: declare fetchApplications BEFORE the useEffect that calls it
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await getApplications();
      setApplications(response.data || []);
    } catch (err) {
      setError("Failed to load applications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Stats derived from real data — status values are capital-first (backend enum)
  const stats = {
    total:      applications.length,
    interviews: applications.filter((a) => a.status === "Interview").length,
    offers:     applications.filter((a) => a.status === "Offer").length,
    rejected:   applications.filter((a) => a.status === "Rejected").length,
  };

  const statsCards = [
    {
      title:    "Total Applications",
      value:    stats.total.toString(),
      subtitle: "Across all companies",
      tone:     "blue",
    },
    {
      title:    "Interviews",
      value:    stats.interviews.toString(),
      subtitle: "Scheduled or completed",
      tone:     "green",
    },
    {
      title:    "Offers",
      value:    stats.offers.toString(),
      subtitle: "Currently in progress",
      tone:     "amber",
    },
    {
      title:    "Rejected",
      value:    stats.rejected.toString(),
      subtitle: "Closed applications",
      tone:     "rose",
    },
  ];

  // Last 4 applications sorted by date
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4)
    .map((app) => ({
      id:       app._id,
      company:  app.companyName,
      role:     app.jobRole,
      location: app.location || "Not specified",
      date:     new Date(app.appliedDate || app.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day:   "numeric",
      }),
      status: app.status || "Applied",
    }));

  // Activity bars — count apps per weekday over last 7 days
  const activityData = (() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    applications.forEach((app) => {
      const d = new Date(app.appliedDate || app.createdAt);
      if (d >= cutoff) counts[d.getDay()]++;
    });
    // Rotate so today is last
    const today = new Date().getDay();
    const ordered = [];
    for (let i = 1; i <= 7; i++) {
      const idx = (today + i) % 7;
      ordered.push({ label: days[idx], value: counts[idx] });
    }
    return ordered;
  })();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <PageContainer>
        <DashboardSkeleton />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Welcome */}
      <div className="mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-1">
              {getGreeting()}, {user?.name?.split(" ")[0] || "there"}! 👋
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-neutral-400">
              {applications.length > 0
                ? "Here's what's happening with your job search today."
                : "Start tracking your job applications to see insights here."}
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard/applications")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all hover:-translate-y-0.5 text-sm sm:text-base w-full sm:w-auto"
          >
            <BsPlus className="text-xl" />
            Add Application
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {statsCards.map((s) => (
          <StatsCard key={s.title} title={s.title} value={s.value} subtitle={s.subtitle} tone={s.tone} />
        ))}
      </section>

      {applications.length > 0 ? (
        <>
          {/* Main grid */}
          <section className="grid gap-6 lg:grid-cols-3 mb-8">
            <div className="lg:col-span-2">
              <RecentApplications applications={recentApplications} />
            </div>

            <div className="space-y-6">
              <ProgressCard
                total={stats.total}
                applied={stats.total}
                interviewing={stats.interviews}
                offers={stats.offers}
              />

              {/* Quick Actions */}
              <div className="rounded-2xl border border-white/5 bg-[#18181B] p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <BsLightningFill className="text-indigo-400 text-xl" />
                  <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
                </div>
                <p className="text-sm text-neutral-400 mb-6">Shortcuts for your hiring workflow.</p>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/dashboard/applications")}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5"
                  >
                    <BsPlus className="text-lg" />
                    Add Application
                  </button>

                  <button
                    onClick={() => navigate("/dashboard/resume")}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20"
                  >
                    Upload Resume
                  </button>

                  <button
                    onClick={() => navigate("/dashboard/analytics")}
                    className="w-full flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400 transition-all hover:bg-emerald-500/20"
                  >
                    <span>View Analytics</span>
                    <BsArrowRight />
                  </button>
                </div>
              </div>

              {/* Tip */}
              <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-600/10 to-indigo-600/5 p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💡</span>
                  <h3 className="font-semibold text-white">Quick Tip</h3>
                </div>
                <p className="text-sm text-neutral-300 mb-4">
                  Keep your application status updated to get accurate insights and never miss a follow-up opportunity!
                </p>
                <button
                  onClick={() => navigate("/dashboard/applications")}
                  className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                >
                  View Applications <BsArrowRight />
                </button>
              </div>
            </div>
          </section>

          {/* Activity chart */}
          <section>
            <ActivityChart data={activityData} />
          </section>
        </>
      ) : (
        /* Empty state */
        <div className="rounded-2xl border border-white/5 bg-[#18181B] p-8 sm:p-16 text-center shadow-xl">
          <div className="max-w-md mx-auto">
            <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">🚀</div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Start Your Job Search Journey</h3>
            <p className="text-sm sm:text-base text-neutral-400 mb-6 sm:mb-8">
              Add your first job application to start tracking your progress and get insights.
            </p>
            <button
              onClick={() => navigate("/dashboard/applications")}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all hover:-translate-y-0.5 text-sm sm:text-base"
            >
              <BsPlus className="text-xl" />
              Add Your First Application
            </button>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default DashboardPage;
