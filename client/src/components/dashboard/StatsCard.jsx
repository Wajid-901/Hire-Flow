import {
  BsBriefcaseFill,
  BsChatDotsFill,
  BsTrophyFill,
  BsXCircleFill,
} from "react-icons/bs";

const toneConfig = {
  blue: {
    bg:     "bg-gradient-to-br from-indigo-500/10 to-indigo-600/5",
    border: "border-indigo-500/20",
    text:   "text-indigo-400",
    icon:   "bg-indigo-500/15 text-indigo-400",
    glow:   "shadow-[0_0_24px_rgba(99,102,241,0.12)]",
    Icon:   BsBriefcaseFill,
  },
  green: {
    bg:     "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5",
    border: "border-emerald-500/20",
    text:   "text-emerald-400",
    icon:   "bg-emerald-500/15 text-emerald-400",
    glow:   "shadow-[0_0_24px_rgba(16,185,129,0.12)]",
    Icon:   BsChatDotsFill,
  },
  amber: {
    bg:     "bg-gradient-to-br from-amber-500/10 to-amber-600/5",
    border: "border-amber-500/20",
    text:   "text-amber-400",
    icon:   "bg-amber-500/15 text-amber-400",
    glow:   "shadow-[0_0_24px_rgba(245,158,11,0.12)]",
    Icon:   BsTrophyFill,
  },
  rose: {
    bg:     "bg-gradient-to-br from-rose-500/10 to-rose-600/5",
    border: "border-rose-500/20",
    text:   "text-rose-400",
    icon:   "bg-rose-500/15 text-rose-400",
    glow:   "shadow-[0_0_24px_rgba(244,63,94,0.12)]",
    Icon:   BsXCircleFill,
  },
};

const StatsCard = ({ title, value, subtitle, tone = "blue" }) => {
  const cfg = toneConfig[tone] || toneConfig.blue;
  const { Icon } = cfg;

  return (
    <div
      className={`group relative rounded-2xl border bg-[#18181B] p-6 overflow-hidden
        ${cfg.border} ${cfg.glow} shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      {/* Background orb */}
      <div
        className={`absolute -right-10 -top-10 w-36 h-36 rounded-full blur-3xl opacity-40
          group-hover:opacity-60 transition-opacity ${cfg.bg}`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-400 mb-3">{title}</p>
          <h3 className="text-4xl font-bold tracking-tight text-white mb-1 tabular-nums">
            {value}
          </h3>
          <p className="text-sm text-zinc-500 truncate">{subtitle}</p>
        </div>

        <div className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${cfg.icon}`}>
          <Icon className="text-lg" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
