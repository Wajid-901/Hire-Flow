import { useState, useRef, useEffect } from "react";
import {
  BsCloudUploadFill,
  BsFileEarmarkPdfFill,
  BsFileEarmarkWordFill,
  BsFileEarmarkTextFill,
  BsTrash,
  BsDownload,
  BsCheckCircleFill,
  BsExclamationCircle,
} from "react-icons/bs";
import PageContainer from "../../components/layout/PageContainer";

const ALLOWED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const ALLOWED_EXT = [".pdf", ".doc", ".docx", ".txt"];
const LS_KEY = "hireflow_resume_metadata";

const FileIcon = ({ type }) => {
  if (type === "application/pdf")  return <BsFileEarmarkPdfFill  className="text-rose-400 text-2xl" />;
  if (type.includes("word"))       return <BsFileEarmarkWordFill className="text-indigo-400 text-2xl" />;
  return <BsFileEarmarkTextFill className="text-zinc-400 text-2xl" />;
};

const formatSize = (bytes) => {
  if (bytes < 1024)          return `${bytes} B`;
  if (bytes < 1024 * 1024)   return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ResumePage = () => {
  const [files, setFiles]       = useState([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError]       = useState("");
  const inputRef = useRef(null);

  // Load persisted metadata on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      // Restore metadata records without actual File blobs (url will be null until re-uploaded)
      setFiles(saved.map((m) => ({ ...m, file: null, url: null })));
    } catch {
      // ignore corrupt storage
    }
  }, []);

  // Persist metadata whenever files change
  useEffect(() => {
    const metadata = files.map(({ id, name, size, type, addedAt }) => ({
      id, name, size, type, addedAt,
    }));
    localStorage.setItem(LS_KEY, JSON.stringify(metadata));
  }, [files]);

  const addFiles = (incoming) => {
    setError("");
    const valid = [];
    Array.from(incoming).forEach((f) => {
      if (!ALLOWED.includes(f.type)) {
        setError(`"${f.name}" is not a supported format. Use PDF, DOC, DOCX, or TXT.`);
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        setError(`"${f.name}" exceeds the 5 MB limit.`);
        return;
      }
      if (files.find((x) => x.name === f.name)) return;
      valid.push({
        id:      Date.now() + Math.random(),
        file:    f,
        name:    f.name,
        size:    f.size,
        type:    f.type,
        addedAt: new Date().toISOString(),
        url:     URL.createObjectURL(f),
      });
    });
    setFiles((prev) => [...prev, ...valid]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleRemove = (id) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((f) => f.id !== id);
    });
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
            onClick={() => inputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 sm:p-14 text-center cursor-pointer transition-all
              ${dragging ? "border-indigo-500 bg-indigo-500/10 scale-[1.01]" : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-500 hover:bg-zinc-900"}`}
          >
            <input ref={inputRef} type="file" accept={ALLOWED_EXT.join(",")} multiple className="hidden"
              onChange={(e) => addFiles(e.target.files)} />
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${dragging ? "bg-indigo-500/20 scale-110" : "bg-zinc-800"}`}>
              <BsCloudUploadFill className={`text-3xl ${dragging ? "text-indigo-400" : "text-zinc-400"}`} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{dragging ? "Drop your resume here" : "Upload your resume"}</h3>
            <p className="text-sm text-zinc-400 mb-3">Drag & drop or <span className="text-indigo-400 font-medium">browse files</span></p>
            <p className="text-xs text-zinc-600">PDF, DOC, DOCX, TXT — max 5 MB</p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          {files.length > 0 && (
            <div className="rounded-2xl border border-white/5 bg-[#18181B] overflow-hidden shadow-xl">
              <div className="px-5 py-4 border-b border-white/5">
                <h3 className="font-bold text-white">Uploaded Resumes ({files.length})</h3>
              </div>
              <div className="divide-y divide-white/5">
                {files.map((f) => (
                  <div key={f.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors group">
                    <FileIcon type={f.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{f.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-zinc-500">{formatSize(f.size)}</span>
                        <span className="text-xs text-zinc-600">·</span>
                        <span className="text-xs text-zinc-500">
                          Added {new Date(f.addedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        {/* Show warning if file needs re-upload (no blob url) */}
                        {!f.url && (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                            <BsExclamationCircle className="text-xs" />
                            Re-upload to download
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      {f.url && (
                        <a href={f.url} download={f.name}
                          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all" title="Download">
                          <BsDownload />
                        </a>
                      )}
                      <button onClick={() => handleRemove(f.id)}
                        className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Remove">
                        <BsTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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

          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🤖</span>
              <h3 className="font-bold text-white text-sm">AI Resume Review</h3>
            </div>
            <p className="text-sm text-zinc-400 mb-4">AI-powered resume scoring and ATS compatibility analysis is coming in the next update.</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-xs font-semibold text-indigo-300">Coming Soon</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#18181B] p-5 shadow-xl">
            <h3 className="font-bold text-white text-sm mb-3">Supported Formats</h3>
            <div className="space-y-2">
              {[
                { ext: "PDF",  icon: <BsFileEarmarkPdfFill  className="text-rose-400" />,  note: "Recommended" },
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
