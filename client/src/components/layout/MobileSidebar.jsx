import { NavLink } from "react-router-dom";
import { 
  BsX,
  BsGrid, 
  BsBriefcaseFill, 
  BsBarChartFill, 
  BsCalendar3, 
  BsFileEarmarkText, 
  BsPersonFill, 
  BsGearFill,
  BsBoxArrowRight
} from "react-icons/bs";
import useAuth from "../../hooks/useAuth";
import Logo from "../common/Logo";

const navigationItems = [
  { path: "/dashboard", label: "Dashboard", icon: BsGrid },
  { path: "/dashboard/applications", label: "Applications", icon: BsBriefcaseFill },
  { path: "/dashboard/analytics", label: "Analytics", icon: BsBarChartFill },
  { path: "/dashboard/calendar", label: "Calendar", icon: BsCalendar3 },
  { path: "/dashboard/resume", label: "Resume", icon: BsFileEarmarkText },
  { path: "/dashboard/profile", label: "Profile", icon: BsPersonFill },
  { path: "/dashboard/settings", label: "Settings", icon: BsGearFill },
];

const MobileSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#09090B] border-r border-white/5 lg:hidden transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
          <Logo size={32} />
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <BsX className="text-2xl" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                        : "text-neutral-400 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <Icon className="text-lg" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="border-t border-white/5 p-4">
          <button
            type="button"
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-neutral-400 transition-all hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20"
          >
            <BsBoxArrowRight className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;
