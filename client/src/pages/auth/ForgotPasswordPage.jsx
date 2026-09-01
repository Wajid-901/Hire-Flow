import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsEnvelope, BsArrowLeft } from 'react-icons/bs';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ErrorMessage from '../../components/common/ErrorMessage';
import axiosInstance from '../../api/axiosInstance';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      
      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BsEnvelope className="w-8 h-8 text-emerald-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
            <p className="text-zinc-400 mb-6">
              We've sent a password reset link to <span className="text-white font-medium">{email}</span>
            </p>
            
            <p className="text-sm text-zinc-500 mb-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <Link to="/login">
              <Button variant="secondary" className="w-full">
                <BsArrowLeft className="mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-zinc-400">
              No worries! Enter your email and we'll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <ErrorMessage message={error} />}

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<BsEnvelope />}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center"
              >
                <BsArrowLeft className="mr-1" />
                Back to Login
              </Link>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-zinc-500 text-sm">
            Remember your password?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
