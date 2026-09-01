import { Link } from "react-router-dom";
import { BsHouseFill, BsGrid, BsArrowLeft } from "react-icons/bs";

const NotFoundPage = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#09090B] px-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px]"></div>
      
      <div className="relative z-10 max-w-2xl text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="inline-block relative">
            <div className="text-[180px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 leading-none">
              404
            </div>
            <div className="absolute inset-0 text-[180px] font-bold text-white/5 blur-2xl leading-none">
              404
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Oops! Page not found
          </h1>
          
          <p className="text-lg text-neutral-400 max-w-lg mx-auto">
            The page you're looking for seems to have wandered off. Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all hover:-translate-y-0.5"
          >
            <BsHouseFill className="text-lg" />
            Back to Home
          </Link>

          <Link
            to="/dashboard"
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 px-6 py-3 text-base font-semibold text-white transition-all hover:-translate-y-0.5"
          >
            <BsGrid className="text-lg" />
            Go to Dashboard
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-sm text-neutral-500">
            Need help? {" "}
            <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Contact support
            </a>
            {" "} or {" "}
            <button onClick={() => window.history.back()} className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors inline-flex items-center gap-1">
              <BsArrowLeft />
              go back
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
