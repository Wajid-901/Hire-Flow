import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsEyeFill, BsEyeSlashFill, BsCheckCircleFill } from "react-icons/bs";
import useAuth from "../../hooks/useAuth";
import {
  register as registerApi,
  getCurrentUser,
  login,
} from "../../api/authApi";
import Logo from "../../components/common/Logo";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const registerResponse = await registerApi({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (registerResponse.success) {
        const loginResponse = await login({
          email: formData.email,
          password: formData.password,
        });

        if (loginResponse.success && loginResponse.token) {
          const userData = loginResponse.user || (await getCurrentUser()).data;

          loginContext({
            user: userData,
            token: loginResponse.token,
          });

          navigate("/dashboard");
        }
      } else {
        setError(
          registerResponse.message || "Registration failed. Please try again.",
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength =
    formData.password.length >= 8
      ? "strong"
      : formData.password.length >= 6
        ? "medium"
        : "weak";

  return (
    <div className="flex min-h-screen bg-[#09090B]">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-emerald-600/10 via-indigo-600/5 to-transparent border-r border-white/5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>

        <div className="relative z-10 flex flex-col justify-center px-16 max-w-2xl">
          <div className="mb-12">
            <Logo size={44} />
          </div>

          <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
            Start your journey to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
              career success
            </span>
          </h1>

          <p className="text-lg text-neutral-400 leading-relaxed mb-12">
            Join thousands of professionals who are landing their dream jobs
            with HireFlow&apos;s intelligent tracking system.
          </p>

          <div className="space-y-4">
            {[
              "Free forever for students",
              "Unlimited application tracking",
              "AI-powered resume analysis",
              "Interview preparation tools",
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-neutral-300"
              >
                <BsCheckCircleFill className="text-emerald-500 text-lg shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo size={32} />
          </div>

          <div className="glass-card rounded-2xl p-8 shadow-premium">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                Create your account
              </h2>
              <p className="text-neutral-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Full name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white mb-2"
                >
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

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white mb-2"
                >
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
                    {showPassword ? (
                      <BsEyeSlashFill size={18} />
                    ) : (
                      <BsEyeFill size={18} />
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2 flex gap-1">
                    <div
                      className={`h-1 flex-1 rounded-full ${
                        passwordStrength === "weak"
                          ? "bg-red-500"
                          : passwordStrength === "medium"
                            ? "bg-yellow-500"
                            : "bg-emerald-500"
                      }`}
                    ></div>
                    <div
                      className={`h-1 flex-1 rounded-full ${
                        passwordStrength === "medium" ||
                        passwordStrength === "strong"
                          ? passwordStrength === "medium"
                            ? "bg-yellow-500"
                            : "bg-emerald-500"
                          : "bg-white/10"
                      }`}
                    ></div>
                    <div
                      className={`h-1 flex-1 rounded-full ${
                        passwordStrength === "strong"
                          ? "bg-emerald-500"
                          : "bg-white/10"
                      }`}
                    ></div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <BsEyeSlashFill size={18} />
                    ) : (
                      <BsEyeFill size={18} />
                    )}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 w-4 h-4 rounded bg-white/5 border-white/10 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                />
                <span className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#18181B] text-neutral-400">Or</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-neutral-500">
                  Google Sign-In coming soon
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
