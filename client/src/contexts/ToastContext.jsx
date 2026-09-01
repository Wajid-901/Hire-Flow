import { createContext, useCallback, useContext, useRef, useState } from "react";
import {
  BsCheckCircleFill,
  BsXCircleFill,
  BsInfoCircleFill,
  BsExclamationTriangleFill,
  BsX,
} from "react-icons/bs";

// ─── context ─────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

// ─── config ──────────────────────────────────────────────────────────────────
const STYLES = {
  success: {
    bar:   "bg-emerald-500",
    icon:  <BsCheckCircleFill className="text-emerald-400 text-lg shrink-0" />,
    ring:  "ring-emerald-500/20",
    bg:    "bg-zinc-900",
  },
  error: {
    bar:   "bg-rose-500",
    icon:  <BsXCircleFill className="text-rose-400 text-lg shrink-0" />,
    ring:  "ring-rose-500/20",
    bg:    "bg-zinc-900",
  },
  info: {
    bar:   "bg-indigo-500",
    icon:  <BsInfoCircleFill className="text-indigo-400 text-lg shrink-0" />,
    ring:  "ring-indigo-500/20",
    bg:    "bg-zinc-900",
  },
  warning: {
    bar:   "bg-amber-500",
    icon:  <BsExclamationTriangleFill className="text-amber-400 text-lg shrink-0" />,
    ring:  "ring-amber-500/20",
    bg:    "bg-zinc-900",
  },
};

// ─── single toast item ────────────────────────────────────────────────────────
const ToastItem = ({ toast, onRemove }) => {
  const s = STYLES[toast.type] || STYLES.info;

  return (
    <div
      className={`relative flex items-start gap-3 w-full max-w-sm rounded-xl border border-white/10
        ring-1 ${s.ring} ${s.bg} px-4 py-3.5 shadow-2xl shadow-black/40
        animate-in slide-in-from-right-5 fade-in duration-300`}
    >
      {/* Coloured left bar */}
      <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${s.bar}`} />

      {s.icon}

      <div className="flex-1 min-w-0 ml-1">
        {toast.title && (
          <p className="text-sm font-semibold text-white leading-tight">{toast.title}</p>
        )}
        {toast.message && (
          <p className={`text-sm text-zinc-400 leading-snug ${toast.title ? "mt-0.5" : ""}`}>
            {toast.message}
          </p>
        )}
      </div>

      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 p-0.5 rounded-md text-zinc-500 hover:text-white transition-colors"
      >
        <BsX className="text-base" />
      </button>
    </div>
  );
};

// ─── provider ────────────────────────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const remove = useCallback((id) => {
    clearTimeout(timers.current[id]);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((type, message, options = {}) => {
    const id       = `toast-${Date.now()}-${Math.random()}`;
    const duration = options.duration ?? 4000;

    setToasts((prev) => [...prev.slice(-4), { id, type, message, title: options.title }]);

    if (duration > 0) {
      timers.current[id] = setTimeout(() => remove(id), duration);
    }
    return id;
  }, [remove]);

  // Convenience methods
  const toast = {
    success: (msg, opts) => add("success", msg, opts),
    error:   (msg, opts) => add("error",   msg, opts),
    info:    (msg, opts) => add("info",    msg, opts),
    warning: (msg, opts) => add("warning", msg, opts),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Portal-style fixed container — bottom-right */}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// ─── hook ─────────────────────────────────────────────────────────────────────
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};
