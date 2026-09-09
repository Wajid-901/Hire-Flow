import { useState, useRef, useEffect, useCallback } from "react";
import {
  BsCloudUploadFill,
  BsFileEarmarkPdfFill,
  BsFileEarmarkWordFill,
  BsFileEarmarkTextFill,
  BsTrash,
  BsDownload,
  BsCheckCircleFill,
  BsArrowClockwise,
} from "react-icons/bs";
import PageContainer from "../../components/layout/PageContainer";
import {
  uploadResume,
  getResumes,
  deleteResume,
  downloadResume,
} from "../../api/resumeApi";

const ALLOWED_MIMETYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const ALLOWED_EXT = [".pdf", ".doc", ".docx", ".txt"];

const FileIcon = ({ type }) => {
  if (type === "application/pdf")
    return <BsFileEarmarkPdfFill className="text-rose-400 text-2xl" />;
  if (type?.includes("word"))
    return <BsFileEarmarkWordFill className="text-indigo-400 text-2xl" />;
  return <BsFileEarmarkTextFill className="text-zinc-400 text-2xl" />;
};

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ResumePage = () => {
  const [resumes, setResumes]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [dragging, setDragging]     = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [error, setError]           = useState("");
  const [downloading, setDownloading] = useState(null); // id of file being downloaded
  const inputRef = useRef(null);

  // ─── Fetch resumes from server ────────────────────────────────────────────
  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getResumes();
      setResumes(data.data || []);
    } catch {
      setError("Failed to load resumes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  // ─── Upload ───────────────────────────────────────────────────────────────
  const handleFiles = async (incoming) => {
    setError("");
    const files = Array.from(incoming);

    for (const file of files) {
      if (!ALLOWED_MIMETYPES.includes(file.type)) {
        setError(`"${file.name}" is not a supported format. Use PDF, DOC, DOCX, or TXT.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" exceeds the 5 MB limit.`);
        return;
      }
    }

    setUploading(true);
    try {
      for (const file of files) {
        await uploadResume(file);
      }
      await fetchResumes();
    } catch (err) {
      setError(err?.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      // Reset file input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // ─── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await deleteResume(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch {
      setError("Failed to delete resume.");
    }
  };

  // ─── Download ─────────────────────────────────────────────────────────────
  const handleDownload = async (resume) => {
    setDownloading(resume._id);
    try {
      await downloadResume(resume._id, resume.originalName);
    } catch {
      setError("Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-1">Resume Manager</h1>
        <p className="text-sm sm:text-lg text-neutral-400">Store and manage your resume versions in one place</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload zone */}
        <div className="lg:col-span-2 space-y-5">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && inputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 sm:p-14 text-center cursor-pointer transition-all
              ${dragging
                ? "border-indigo-500 bg-indigo-500/10 scale-[1.01]"
                : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-500 hover:bg-zinc-900"
              } ${uploading ? "pointer-events-none opacity-70" : ""}`}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ALLOWED_EXT.join(",")}
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${dragging ? "bg-indigo-500/20 scale-110" : "bg-zinc-800"}`}>
              {uploading
                ? <BsArrowClockwise className="text-3xl text-indigo-400 animate-spin" />
                : <BsCloudUploadFill className={`text-3xl ${dragging ? "text-indigo-400" : "text-zinc-400"}`} />
              }
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {uploading ? "Uploading…" : dragging ? "Drop your resume here" : "Upload your resume"}
            </h3>
            <p className="text-sm text-zinc-400 mb-3">
              Drag &amp; drop or <span className="text-indigo-400 font-medium">browse files</span>
            </p>
            <p className="text-xs text-zinc-600">PDF, DOC, DOCX, TXT — max 5 MB</p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* File list */}
          {loading ? (
            <div className="rounded-2xl border border-white/5 bg-[#18181B] p-8 text-center">
              <BsArrowClockwise className="text-2xl text-zinc-500 animate-spin mx-auto mb-2" />
              <p className="text-sm text-zinc-500">Loading resumes…</p>
            </div>
          ) : resumes.length > 0 ? (
            <div className="rounded-2xl border border-white/5 bg-[#18181B] overflow-hidden shadow-xl">
              <div className="px-5 py-4 border-b border-white/5">
                <h3 className="font-bold text-white">Uploaded Resumes ({resumes.length})</h3>
              </div>
              <div className="divide-y divide-white/5">
                {resumes.map((r) => (
                  <div key={r._id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors group">
                    <FileIcon type={r.mimetype} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{r.originalName}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-zinc-500">{formatSize(r.size)}</span>
                        <span className="text-xs text-zinc-600">·</span>
                        <span className="text-xs text-zinc-500">
                          Added {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDownload(r)}
                        disabled={downloading === r._id}
                        className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
                        title="Download"
                      >
                        {downloading === r._id
                          ? <BsArrowClockwise className="animate-spin" />
                          : <BsDownload />
                        }
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Remove"
                      >
                        <BsTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-[#18181B] p-8 text-center">
              <p className="text-sm text-zinc-500">No resumes uploaded yet. Drop a file above to get started.</p>
            </div>
          )}
        </div>

        {/* Tips sidebar */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-white/5 bg-[#18181B] p-5 shadow-xl">
            <h3 className="font-bold text-white mb-4">Resume Tips</h3>
            <div className="space-y-3">
              {[
                "Tailor your resume keywords to each job description",
                "Keep it to 1 page for under 5 years experience",
                "Use action verbs: built, led, designed, improved",
                "Quantify achievements: 'increased by 30%'",
                "Save as PDF to preserve formatting",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <BsCheckCircleFill className="text-emerald-500 text-sm shrink-0 mt-0.5" />
                  <p className="text-sm text-zinc-300">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#18181B] p-5 shadow-xl">
            <h3 className="font-bold text-white text-sm mb-3">Supported Formats</h3>
            <div className="space-y-2">
              {[
                { ext: "PDF",  icon: <BsFileEarmarkPdfFill  className="text-rose-400" />,   note: "Recommended" },
                { ext: "DOCX", icon: <BsFileEarmarkWordFill className="text-indigo-400" />, note: "Microsoft Word" },
                { ext: "DOC",  icon: <BsFileEarmarkWordFill className="text-indigo-400" />, note: "Legacy Word" },
                { ext: "TXT",  icon: <BsFileEarmarkTextFill className="text-zinc-400" />,   note: "Plain text" },
              ].map((f) => (
                <div key={f.ext} className="flex items-center gap-2">
                  {f.icon}
                  <span className="text-sm font-medium text-white">.{f.ext}</span>
                  <span className="text-xs text-zinc-500 ml-auto">{f.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ResumePage;
