import { BsGearFill, BsBellFill, BsShieldFill, BsGlobe, BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import ChangePasswordForm from "../../components/settings/ChangePasswordForm";

const SettingsPage = () => {
  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-1">
          Settings
        </h1>
        <p className="text-sm sm:text-lg text-neutral-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Security Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BsShieldFill className="text-indigo-500" />
            <h2 className="text-xl font-bold text-white">Security</h2>
          </div>
          <ChangePasswordForm />
        </div>

        {/* Notifications - Coming Soon */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BsBellFill className="text-indigo-500" />
            <h2 className="text-xl font-bold text-white">Notifications</h2>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-center py-8">
              Notification preferences coming soon
            </p>
          </div>
        </div>

        {/* Preferences - Coming Soon */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BsGearFill className="text-indigo-500" />
            <h2 className="text-xl font-bold text-white">Preferences</h2>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-center py-8">
              App preferences coming soon (theme, language, timezone)
            </p>
          </div>
        </div>

        {/* Privacy */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BsGlobe className="text-indigo-500" />
            <h2 className="text-xl font-bold text-white">Privacy & Legal</h2>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm mb-5">
              Review our policies to understand how we handle your data.
            </p>
            <div className="space-y-3">
              <Link
                to="/privacy-policy"
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all group"
              >
                <div>
                  <p className="text-sm font-semibold text-white">Privacy Policy</p>
                  <p className="text-xs text-zinc-500 mt-0.5">How we collect, store and use your data</p>
                </div>
                <BsArrowRight className="text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </Link>
              <Link
                to="/terms"
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all group"
              >
                <div>
                  <p className="text-sm font-semibold text-white">Terms of Service</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Rules and guidelines for using HireFlow</p>
                </div>
                <BsArrowRight className="text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </Link>
              <Link
                to="/about"
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all group"
              >
                <div>
                  <p className="text-sm font-semibold text-white">About HireFlow</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Our story, values and tech stack</p>
                </div>
                <BsArrowRight className="text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default SettingsPage;
