import { useState, useEffect } from "react";
import {
  BsPencil, BsCheckLg, BsXLg, BsPersonFill,
  BsEnvelopeFill, BsShieldFill, BsCalendarFill,
} from "react-icons/bs";
import PageContainer from "../../components/layout/PageContainer";
import useAuth from "../../hooks/useAuth";
import axiosInstance from "../../api/axiosInstance";
import { getApplications } from "../../api/applicationsApi";

// ─── tiny helpers ───────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, children }) => (
  <div>
    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
      <Icon className="text-zinc-500" />
      {label}
    </p>
    {children}
  </div>
);

const StatPill = ({ label, value, color }) => (
  <div className={`flex-1 min-w-[100px] rounded-2xl border p-4 text-center ${color}`}>
    <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
    <p className="text-xs text-zinc-400">{label}</p>
  </div>
);

// ─── component ──────────────────────────────────────────────────────────────
const ProfilePage = () => {
  const { user, login } = useAuth();

  const [editing, setEditing]   = useState(false);
  const [name, setName]         = useState(user?.name || "");
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  // Application stats
  const [stats, setStats] = useState({ total: null, interviews: null, offers: null });

  useEffect(() => {
    getApplications()
      .then((res) => {
        const apps = res.data || [];
        setStats({
          total:      apps.length,
          interviews: apps.filter((a) => a.status === "Interview").length,
          offers:     apps.filter((a) => a.status === "Offer").length,
        });
      })
      .catch(() => {}); // silently fail — stats are optional
  }, []);

  // Reset local state whenever we open the edit form
  const startEditing = () => {
    setName(user?.name || "");
    setError("");
    setSuccess("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setError("");
  };

  const handleSave = async () => {
    if (!name.trim()) { setError("Name cannot be empty."); return; }
    if (name.trim() === user?.name) { setEditing(false); return; }

    setSaving(true);
    setError("");
    try {
      const res = await axiosInstance.patch("/auth/me", { name: name.trim() });
      if (res.data.success) {
        // Refresh the user stored in context so header & sidebar update too
        login({ user: res.data.data, token: localStorage.getItem("token") });
        setSuccess("Name updated successfully!");
        setEditing(false);
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update name.");
    } finally {
      setSaving(false);
    }
  };

  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  return (
    <PageContainer>
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-1">Profile</h1>
        <p className="text-lg text-neutral-400">Your account information</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Left column: identity card ── */}
        <div className="lg:col-span-1 space-y-6">
          {/* Avatar + name card */}
          <div className="rounded-2xl border border-white/5 bg-[#18181B] p-6 shadow-xl text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-indigo-500/20">
                {initial}
              </div>
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#18181B]" />
            </div>

            {/* Name — editable inline */}
            {editing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Your full name"
                  autoFocus
                />
                {error && <p className="text-xs text-red-400">{error}</p>}
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
                  >
                    <BsCheckLg />
                    {saving ? "Saving…" : "Save"}
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium border border-zinc-700 transition-all"
                  >
                    <BsXLg />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white mb-0.5">{user?.name || "User"}</h2>
                <p className="text-sm text-zinc-400 mb-4">{user?.email || "—"}</p>

                {success && (
                  <p className="text-xs text-emerald-400 mb-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                    {success}
                  </p>
                )}

                <button
                  onClick={startEditing}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <BsPencil className="text-xs" />
                  Edit Name
                </button>
              </>
            )}
          </div>

          {/* Role / member badge */}
          <div className="rounded-2xl border border-white/5 bg-[#18181B] p-5 shadow-xl space-y-4">
            <Field label="Role" icon={BsShieldFill}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium capitalize">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                {user?.role || "user"}
              </span>
            </Field>

            <Field label="Member since" icon={BsCalendarFill}>
              <p className="text-sm text-white font-medium">{joinDate}</p>
            </Field>

            <Field label="Account status" icon={BsShieldFill}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </Field>
          </div>
        </div>

        {/* ── Right column: details & stats ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account details read-only card */}
          <div className="rounded-2xl border border-white/5 bg-[#18181B] p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-5">Account Details</h3>

            <div className="space-y-5">
              <Field label="Full name" icon={BsPersonFill}>
                <p className="text-base text-white font-medium">{user?.name || "—"}</p>
              </Field>

              <div className="border-t border-white/5" />

              <Field label="Email address" icon={BsEnvelopeFill}>
                <p className="text-base text-white font-medium">{user?.email || "—"}</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Email cannot be changed at this time
                </p>
              </Field>
            </div>
          </div>

          {/* Quick stats card — no API call, just visual */}
          <div className="rounded-2xl border border-white/5 bg-[#18181B] p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2">Account Stats</h3>
            <p className="text-sm text-zinc-400 mb-5">
              Head to the{" "}
              <a href="/dashboard/applications" className="text-indigo-400 hover:underline">
                Applications
              </a>{" "}
              page for detailed tracking.
            </p>

            <div className="flex flex-wrap gap-3">
              <StatPill
                label="Total Applications"
                value={stats.total === null ? "…" : stats.total}
                color="border-indigo-500/20 bg-indigo-500/5"
              />
              <StatPill
                label="Interviews"
                value={stats.interviews === null ? "…" : stats.interviews}
                color="border-amber-500/20 bg-amber-500/5"
              />
              <StatPill
                label="Offers"
                value={stats.offers === null ? "…" : stats.offers}
                color="border-emerald-500/20 bg-emerald-500/5"
              />
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 shadow-xl">
            <h3 className="text-lg font-bold text-red-400 mb-1">Danger Zone</h3>
            <p className="text-sm text-zinc-400 mb-4">
              These actions are irreversible. Please be certain.
            </p>
            <button
              disabled
              className="px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold cursor-not-allowed opacity-50"
              title="Coming soon"
            >
              Delete Account
            </button>
            <p className="text-xs text-zinc-600 mt-2">Account deletion coming soon</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
