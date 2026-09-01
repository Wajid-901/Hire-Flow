import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsEnvelope, BsArrowLeft, BsCheckCircleFill } from 'react-icons/bs';
import axiosInstance from '../../api/axiosInstance';

const ForgotPasswordPage = () => {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);
  const [slow, setSlow]       = useState(false); // shows "still working..." hint

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSlow(false);

    // After 8 seconds, show a hint that the server may be waking up
    const slowTimer = setTimeout(() => setSlow(true), 8000);

    try {
      const response = await axiosInstance.post(
        '/auth/forgot-password',
        { email },
        { timeout: 60000 } // 60 second timeout — Render cold starts can take ~30s
      );

      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('The server is taking too long to respond. Please try again in a moment.');
      } else {
        setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
      }
    } finally {
      clearTimeout(slowTimer);
      setLoading(false);
      setSlow(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BsCheckCircleFill className="text-3xl text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
            <p className="text-zinc-400 mb-2">
              We sent a password reset link to{' '}
              <span className="text-white font-medium">{email}</span>
            </p>
            <p className="text-sm text-zinc-500 mb-6">
              Didn't receive it? Check your spam folder or try again below.
            </p>
            <button
              onClick={() => { setSuccess(false); setError(''); }}
              className="w-full mb-3 py-3 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm font-medium hover:bg-zinc-700 transition-all"
            >
              Try a different email
            </button>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <BsArrowLeft />
              Back to Login
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
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BsEnvelope className="text-2xl text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-zinc-400 text-sm">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3">
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <BsEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {slow ? 'Server is waking up, please wait…' : 'Sending…'}
                </span>
              ) : (
                'Send Reset Link'
              )}
            </button>

            {slow && (
              <p className="text-xs text-zinc-500 text-center">
                Our server is starting up (free hosting cold start — takes ~30 seconds).
                Please don't close this page.
              </p>
            )}

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1"
              >
                <BsArrowLeft />
                Back to Login
              </Link>
            </div>
          </form>
        </div>

        <p className="text-center mt-6 text-zinc-500 text-sm">
          Remember your password?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
