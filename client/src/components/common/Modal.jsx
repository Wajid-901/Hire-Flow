import { useEffect } from "react";
import { BsX } from "react-icons/bs";

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
};

const Modal = ({ isOpen = false, title = "", children, onClose, size = "md" }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape" && onClose) onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    /* Backdrop — centres the card, does NOT scroll */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6"
      onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
    >
      {/*
        Card:
        - max-h = 90vh so it never overflows the screen
        - flex flex-col so header is fixed and body scrolls independently
        - overflow-hidden clips the rounded corners on the scrollable child
      */}
      <div
        className={`flex flex-col w-full ${sizeClasses[size]} max-h-[90vh] rounded-2xl border border-white/10 bg-[#18181B] shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — never scrolls */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4 shrink-0">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
            aria-label="Close modal"
          >
            <BsX className="text-2xl" />
          </button>
        </div>

        {/* Body — this part scrolls when content is taller than the card */}
        <div className="overflow-y-auto flex-1 px-6 py-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
