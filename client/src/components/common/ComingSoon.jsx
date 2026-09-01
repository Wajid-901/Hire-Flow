import { BsRocket } from "react-icons/bs";

const ComingSoon = ({ 
  title = "Coming Soon", 
  description = "This feature is under development and will be available soon.",
  icon: Icon = BsRocket
}) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 mb-6">
          <Icon className="text-4xl text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">
          {title}
        </h2>
        <p className="text-neutral-400 leading-relaxed mb-6">
          {description}
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/30 border border-indigo-500/20">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
          <span className="text-sm font-medium text-indigo-300">
            Under Development
          </span>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
