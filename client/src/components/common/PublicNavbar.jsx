import { Link } from "react-router-dom";
import Logo from "./Logo";
import useAuth from "../../hooks/useAuth";

const PublicNavbar = () => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#09090B]/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/"><Logo size={30} /></Link>
        <div className="flex items-center gap-4 sm:gap-6">
          {!loading && (
            isAuthenticated ? (
              <Link
                to="/dashboard"
                className="text-sm font-semibold px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm text-neutral-400 hover:text-white transition-colors">Log in</Link>
                <Link to="/register" className="text-sm font-semibold px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all">Get Started</Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
