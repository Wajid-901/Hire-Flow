const Loader = ({ size = "md", fullScreen = false }) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const loader = (
    <div className="flex items-center justify-center gap-3">
      <div className={`${sizes[size]} border-indigo-600 border-t-transparent rounded-full animate-spin`}></div>
      {size === "lg" && <p className="text-sm font-medium text-neutral-400">Loading...</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090B]/80 backdrop-blur-sm">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className={`${sizes.lg} border-indigo-600 border-t-transparent rounded-full animate-spin`}></div>
          </div>
          <p className="text-lg font-semibold text-white mb-2">Loading HireFlow</p>
          <p className="text-sm text-neutral-400">Please wait a moment...</p>
        </div>
      </div>
    );
  }

  return loader;
};

export default Loader;
