import { useState, useEffect, useMemo } from "react";
import { BsPlus, BsFilter, BsSearch, BsX, BsDownload, BsTrash } from "react-icons/bs";
import ApplicationTable from "../../components/applications/ApplicationTable";
import PageContainer from "../../components/layout/PageContainer";
import { TableSkeleton } from "../../components/common/Skeleton";
import Modal from "../../components/common/Modal";
import ApplicationForm from "../../components/applications/ApplicationForm";
import { useToast } from "../../contexts/ToastContext";
import {
  getApplications, createApplication, updateApplication, deleteApplication,
} from "../../api/applicationsApi";

const ApplicationsPage = () => {
  const toast = useToast();
  const [applications, setApplications]             = useState([]);
  const [loading, setLoading]                       = useState(true);
  const [isModalOpen, setIsModalOpen]               = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [error, setError]                           = useState("");

  // Search / filter / sort
  const [searchQuery, setSearchQuery]           = useState("");
  const [statusFilter, setStatusFilter]         = useState("all");
  const [sortBy, setSortBy]                     = useState("newest");
  const [showFilters, setShowFilters]           = useState(false);
  const [selectedApplications, setSelectedApplications] = useState([]);

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await getApplications();
      setApplications(response.data || []);
    } catch {
      setError("Failed to load applications. Please try again.");
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleAddApplication = () => {
    setEditingApplication(null);
    setIsModalOpen(true);
  };

  const handleEditApplication = (app) => {
    setEditingApplication(app);
    setIsModalOpen(true);
  };

  const handleDeleteApplication = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await deleteApplication(id);
      setSelectedApplications((prev) => prev.filter((x) => x !== id));
      fetchApplications();
      toast.success("Application deleted");
    } catch {
      toast.error("Failed to delete application");
    }
  };

  const handleSubmitApplication = async (data) => {
    if (editingApplication) {
      await updateApplication(editingApplication._id, data);
      toast.success("Application updated", { title: data.companyName });
    } else {
      await createApplication(data);
      toast.success("Application added", { title: data.companyName });
    }
    setIsModalOpen(false);
    fetchApplications();
  };

  // ─── Filtering + sorting (client-side, instant) ───────────────────────────
  const filtered = useMemo(() => {
    let list = [...applications];

    // Search across companyName, jobRole, location
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.companyName?.toLowerCase().includes(q) ||
          a.jobRole?.toLowerCase().includes(q) ||
          a.location?.toLowerCase().includes(q)
      );
    }

    // Status (matches backend capital-first values)
    if (statusFilter !== "all") {
      list = list.filter((a) => a.status === statusFilter);
    }

    // Sort
    list.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.appliedDate || b.createdAt) - new Date(a.appliedDate || a.createdAt);
        case "oldest":
          return new Date(a.appliedDate || a.createdAt) - new Date(b.appliedDate || b.createdAt);
        case "company":
          return (a.companyName || "").localeCompare(b.companyName || "");
        case "status":
          return (a.status || "").localeCompare(b.status || "");
        default:
          return 0;
      }
    });

    return list;
  }, [applications, searchQuery, statusFilter, sortBy]);

  // Bulk delete
  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedApplications.length} application(s)?`)) return;
    try {
      await Promise.all(selectedApplications.map((id) => deleteApplication(id)));
      toast.success(`${selectedApplications.length} application${selectedApplications.length > 1 ? "s" : ""} deleted`);
      setSelectedApplications([]);
      fetchApplications();
    } catch {
      toast.error("Failed to delete some applications");
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filtered.length === 0) return;

    const rows = filtered.map((a) => ({
      Company:       a.companyName   || "",
      Role:          a.jobRole       || "",
      Location:      a.location      || "",
      "Work Type":   a.workType      || "",
      Status:        a.status        || "",
      Priority:      a.priority      || "",
      "Applied Date": new Date(a.appliedDate || a.createdAt).toLocaleDateString(),
      "Job URL":     a.jobLink       || "",
      Notes:         (a.notes || "").replace(/,/g, ";"),
    }));

    const headers = Object.keys(rows[0]).join(",");
    const body    = rows.map((r) => Object.values(r).map((v) => `"${v}"`).join(","));
    const csv     = [headers, ...body].join("\n");
    const url     = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a       = document.createElement("a");
    a.href        = url;
    a.download    = `hireflow-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="mb-6">
          <div className="h-9 w-48 bg-zinc-800 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
        </div>
        <TableSkeleton rows={6} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-1">Applications</h1>
          <p className="text-neutral-400">
            {filtered.length === applications.length
              ? `${applications.length} total`
              : `${filtered.length} of ${applications.length}`}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-all ${
              showFilters
                ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                : "border-white/10 bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            <BsFilter />
            Filters
          </button>

          <button
            onClick={handleAddApplication}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
          >
            <BsPlus className="text-xl" />
            Add Application
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by company, role, or location…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-10 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
          >
            <BsX className="text-xl" />
          </button>
        )}
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div className="mb-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="company">Company A–Z</option>
                <option value="status">Status</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Actions</label>
              <div className="flex gap-2">
                <button
                  onClick={handleExportCSV}
                  disabled={filtered.length === 0}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <BsDownload />
                  Export CSV
                </button>
                {selectedApplications.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all"
                  >
                    <BsTrash />
                    Delete ({selectedApplications.length})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk delete bar (visible when selection exists even without filters open) */}
      {selectedApplications.length > 0 && !showFilters && (
        <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <span className="text-sm text-indigo-400 font-medium">
            {selectedApplications.length} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all"
          >
            <BsTrash />
            Delete selected
          </button>
          <button
            onClick={() => setSelectedApplications([])}
            className="text-xs text-zinc-400 hover:text-white transition-colors ml-auto"
          >
            Clear selection
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <ApplicationTable
        applications={filtered}
        onEdit={handleEditApplication}
        onDelete={handleDeleteApplication}
        selectedApplications={selectedApplications}
        onSelectionChange={setSelectedApplications}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingApplication ? "Edit Application" : "Add New Application"}
      >
        <ApplicationForm
          application={editingApplication}
          onSubmit={handleSubmitApplication}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </PageContainer>
  );
};

export default ApplicationsPage;
