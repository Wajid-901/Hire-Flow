/**
 * HireFlow Logo — SVG mark + wordmark, all inline SVG (crisp at any size).
 *
 * Props:
 *   size      – number: height in px of the mark (wordmark scales proportionally). default 32
 *   showText  – bool: show the "HireFlow" wordmark next to the mark. default true
 *   className – extra classes on the wrapper <div>
 *   textClass – override wordmark text classes
 *
 * The mark is a stylised "H" whose crossbar becomes a right-pointing
 * chevron arrow — symbolising forward movement through a hiring pipeline.
 * Colours use the project's indigo→purple gradient.
 */
const Logo = ({ size = 32, showText = true, className = "", textClass = "" }) => {
  const markSize = size;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* ── Mark ── */}
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hf-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="hf-arrow-grad" x1="0" y1="0" x2="40" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A5B4FC" />
            <stop offset="100%" stopColor="#C4B5FD" />
          </linearGradient>
        </defs>

        {/* Rounded square background */}
        <rect width="40" height="40" rx="10" fill="url(#hf-grad)" />

        {/* Left vertical bar of H */}
        <rect x="8" y="9" width="5.5" height="22" rx="2.5" fill="white" />

        {/* Right vertical bar of H */}
        <rect x="26.5" y="9" width="5.5" height="22" rx="2.5" fill="white" />

        {/* Crossbar arrow — chevron pointing right */}
        {/* Horizontal shaft */}
        <rect x="13.5" y="18.5" width="13" height="3" rx="1.5" fill="url(#hf-arrow-grad)" />
        {/* Arrowhead */}
        <path
          d="M24 14.5 L31.5 20 L24 25.5"
          stroke="url(#hf-arrow-grad)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* ── Wordmark ── */}
      {showText && (
        <span
          className={`font-bold tracking-tight leading-none ${textClass}`}
          style={{ fontSize: markSize * 0.6, letterSpacing: "-0.02em" }}
        >
          <span className="text-white">Hire</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Flow
          </span>
        </span>
      )}
    </div>
  );
};

export default Logo;
