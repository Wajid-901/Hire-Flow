import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import useAuth from "../../hooks/useAuth";
import { login, getCurrentUser } from "../../api/authApi";
import Logo from "../../components/common/Logo";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await login(formData);
      
      // The backend returns { success, message, token }
      if (response.success && response.token) {
        // Store token and get user info
        localStorage.setItem("token", response.token);
        
        // Get user info
        const userResponse = await getCurrentUser();
        
        // Call context login with user data
        loginContext({ 
          user: userResponse.data, 
          token: response.token 
        });
        
        navigate("/dashboard");
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#09090B]">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-transparent border-r border-white/5">
        {/* Animated Background Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 max-w-2xl">
          <div className="mb-12">
            <Logo size={44} />
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
            Welcome back to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              your career journey
            </span>
          </h1>
          
          <p className="text-lg text-neutral-400 leading-relaxed mb-12">
            Track applications, prepare for interviews, and land your dream job with AI-powered insights.
          </p>
          
          {/* Feature List */}
          <div className="space-y-4">
            {[
              "🎯 Smart application tracking",
              "🤖 AI-powered interview prep",
              "📊 Real-time analytics dashboard",
              "📅 Interview calendar management"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-neutral-300">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Logo size={32} />
          </div>

          {/* Form Card */}
          <div className="glass-card rounded-2xl p-8 shadow-premium">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                Sign in to your account
              </h2>
              <p className="text-neutral-400">
                Don't have an account?{" "}
                <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  Sign up
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <BsEyeSlashFill size={18} /> : <BsEyeFill size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded bg-white/5 border-white/10 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <span className="text-neutral-400 group-hover:text-white transition-colors">
                    Remember me
                  </span>
                </label>
                <Link to="/forgot-password" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#18181B] text-neutral-400">Or</span>
                </div>
              </div>

              {/* Google Login - Coming Soon */}
              <div className="text-center">
                <p className="text-sm text-neutral-500">
                  Google Sign-In coming soon
                </p>
              </div>
            </form>
          </div>

          {/* Footer Text */}
          <p className="mt-8 text-center text-sm text-neutral-500">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-neutral-400 hover:text-white transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy-policy" className="text-neutral-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
