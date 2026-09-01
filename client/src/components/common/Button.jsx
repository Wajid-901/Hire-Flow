import { clsx } from "clsx";

const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  icon: Icon,
  isLoading = false,
  ...props 
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50",
    secondary: "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white",
    outline: "border border-white/10 hover:border-white/20 text-white hover:bg-white/5",
    ghost: "text-neutral-400 hover:text-white hover:bg-white/5",
    danger: "bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400",
    success: "bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/30 text-emerald-400",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {Icon && <Icon className="text-lg" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
