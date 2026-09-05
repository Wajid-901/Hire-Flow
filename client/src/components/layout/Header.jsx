import { useState } from "react";
import { BsBell, BsSearch, BsGearFill, BsList } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import MobileSidebar from "./MobileSidebar";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;

    navigate(`/dashboard/applications?search=${encodeURIComponent(q)}`);
    setIsMobileSearchOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/5 bg-[#09090B]/80 backdrop-blur-xl px-4 sm:px-8">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="lg:hidden rounded-xl p-2 text-neutral-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <BsList className="text-2xl" />
        </button>

        <div className="flex-1 max-w-2xl hidden sm:block">
          <form
            onSubmit={handleSearch}
            className={`relative transition-all duration-200 ${searchFocused ? "scale-[1.02]" : ""}`}
          >
            <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search applications, companies, or roles..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </form>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 ml-4 sm:ml-6">
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen((v) => !v)}
            className="sm:hidden rounded-xl p-2 text-neutral-400 hover:bg-white/5 hover:text-white transition-colors"
            aria-label="Search applications"
          >
            <BsSearch className="text-xl" />
          </button>

          <button
            type="button"
            className="relative rounded-xl p-2.5 transition-colors hover:bg-white/5 text-neutral-400 hover:text-white"
            aria-label="Notifications"
          >
            <BsBell className="text-xl" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#09090B]"></span>
          </button>

          <Link
            to="/dashboard/settings"
            className="hidden sm:block rounded-xl p-2.5 transition-colors hover:bg-white/5 text-neutral-400 hover:text-white"
            aria-label="Settings"
          >
            <BsGearFill className="text-xl" />
          </Link>

          <div className="hidden sm:block w-px h-8 bg-white/10"></div>

          <Link
            to="/dashboard/profile"
            className="flex items-center gap-3 rounded-xl p-2 pr-3 sm:pr-4 transition-colors hover:bg-white/5 group"
          >
            <div className="relative">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-sm sm:text-base font-bold text-white shadow-lg ring-2 ring-white/10">
                {userInitial}
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full ring-2 ring-[#09090B]"></div>
            </div>

            <div className="leading-tight hidden sm:block">
              <p className="font-semibold text-white text-sm group-hover:text-indigo-400 transition-colors">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-neutral-400">View profile</p>
            </div>
          </Link>
        </div>
      </header>

      {isMobileSearchOpen && (
        <div className="sm:hidden border-b border-white/5 bg-[#09090B]/95 px-4 py-3 backdrop-blur-xl">
          <form onSubmit={handleSearch} className="relative">
            <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search applications..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              autoFocus
            />
          </form>
        </div>
      )}

      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
    </>
  );
};

export default Header;