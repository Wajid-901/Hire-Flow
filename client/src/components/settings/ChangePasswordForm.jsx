import { useState } from 'react';
import { BsLock, BsCheckCircle } from 'react-icons/bs';
import Button from '../common/Button';
import Input from '../common/Input';
import axiosInstance from '../../api/axiosInstance';
import { useToast } from '../../contexts/ToastContext';

const ChangePasswordForm = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        toast.success('Password changed successfully');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Change Password</h2>
        <p className="text-zinc-400 text-sm">
          Update your password to keep your account secure
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorMessage message={error} />}
        
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-start gap-3">
            <BsCheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-emerald-500 font-medium">Password changed successfully!</p>
              <p className="text-emerald-500/80 text-sm mt-1">
                Your password has been updated. Please use your new password for future logins.
              </p>
            </div>
          </div>
        )}

        <Input
          label="Current Password"
          type="password"
          name="currentPassword"
          placeholder="Enter current password"
          value={formData.currentPassword}
          onChange={handleChange}
          required
          icon={<BsLock />}
        />

        <Input
          label="New Password"
          type="password"
          name="newPassword"
          placeholder="Enter new password"
          value={formData.newPassword}
          onChange={handleChange}
          required
          icon={<BsLock />}
        />

        <Input
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          icon={<BsLock />}
        />

        {formData.newPassword && (
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <p className="text-xs text-zinc-400 mb-2">Password strength:</p>
            <div className="space-y-1">
              <div className={`text-xs ${formData.newPassword.length >= 6 ? 'text-emerald-500' : 'text-zinc-500'}`}>
                {formData.newPassword.length >= 6 ? '✓' : '○'} At least 6 characters
              </div>
              <div className={`text-xs ${formData.newPassword !== formData.currentPassword && formData.newPassword ? 'text-emerald-500' : 'text-zinc-500'}`}>
                {formData.newPassword !== formData.currentPassword && formData.newPassword ? '✓' : '○'} Different from current password
              </div>
              <div className={`text-xs ${formData.newPassword === formData.confirmPassword && formData.newPassword ? 'text-emerald-500' : 'text-zinc-500'}`}>
                {formData.newPassword === formData.confirmPassword && formData.newPassword ? '✓' : '○'} Passwords match
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              });
              setError('');
              setSuccess(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
