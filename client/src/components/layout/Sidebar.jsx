import { NavLink } from "react-router-dom";
import { 
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

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="hidden lg:flex h-screen w-72 shrink-0 flex-col border-r border-white/5 bg-[#09090B]">
      {/* Logo */}
      <div className="flex items-center border-b border-white/5 px-6 py-5">
        <Logo size={34} />
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col p-4 overflow-y-auto">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                      : "text-neutral-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`text-lg shrink-0 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="border-t border-white/5 p-4">
        <button
          type="button"
          onClick={logout}
          className="group w-full flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-neutral-400 transition-all hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20"
        >
          <BsBoxArrowRight className="text-lg transition-transform group-hover:translate-x-0.5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;