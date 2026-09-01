import { BsGearFill, BsBellFill, BsShieldFill, BsGlobe } from "react-icons/bs";
import PageContainer from "../../components/layout/PageContainer";
import ChangePasswordForm from "../../components/settings/ChangePasswordForm";

const SettingsPage = () => {
  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
          Settings
        </h1>
        <p className="text-lg text-neutral-400">
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

        {/* Privacy - Coming Soon */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BsGlobe className="text-indigo-500" />
            <h2 className="text-xl font-bold text-white">Privacy</h2>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-center py-8">
              Privacy settings and data export coming soon
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default SettingsPage;
