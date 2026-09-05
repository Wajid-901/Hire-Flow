import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsEnvelopeFill, BsGithub, BsCheckCircleFill, BsArrowLeft } from "react-icons/bs";
import Logo from "../components/common/Logo";
import PublicNavbar from "../components/common/PublicNavbar";
import axiosInstance from "../api/axiosInstance";
import useAuth from "../hooks/useAuth";

const Footer = () => (
  <footer className="border-t border-white/5 bg-[#09090B] py-10">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <Logo size={26} />
      <div className="flex items-center gap-6 text-sm text-neutral-500">
        <Link to="/about"          className="hover:text-white transition-colors">About</Link>
        <Link to="/contact"        className="hover:text-white transition-colors">Contact</Link>
        <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
        <Link to="/terms"          className="hover:text-white transition-colors">Terms</Link>
      </div>
      <p className="text-sm text-neutral-600">&copy; {new Date().getFullYear()} HireFlow</p>
    </div>
  </footer>
);

const inputClass = "w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";
const labelClass = "block text-sm font-medium text-zinc-300 mb-1.5";

// Simple but effective email format check
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const ContactPage = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]               = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading]         = useState(false);
  const [sent, setSent]               = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [emailError, setEmailError]   = useState(""); // inline email validation

  // NEW FEATURE: Auto-fill name + email for logged-in users
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name:  prev.name  || user.name  || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Real-time email validation feedback
    if (name === "email") {
      setEmailError(value && !EMAIL_RE.test(value) ? "Please enter a valid email address." : "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side email guard before hitting the server
    if (!EMAIL_RE.test(form.email.trim())) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setSubmitError("");
    try {
      const res = await axiosInstance.post("/contact", form);
      if (res.data.success) {
        setSent(true);
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <PublicNavbar />

      {/* Back button */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors group"
        >
          <BsArrowLeft className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>
      </div>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <span className="inline-block bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
          Get in touch
        </span>
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          We'd love to hear<br />from you
        </h1>
        <p className="text-neutral-400 leading-relaxed">
          Have a question, found a bug, or want to suggest a feature? Send us a message and we'll get back to you as soon as possible.
        </p>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-5 gap-10">

        {/* Left — contact info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#18181B] border border-white/5 rounded-2xl p-6 space-y-5">
            <h3 className="font-bold text-white text-lg">Contact info</h3>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                <BsEnvelopeFill className="text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-0.5">Email</p>
                <a href="mailto:abdulwajid845433@gmail.com" className="text-sm text-neutral-400 hover:text-indigo-400 transition-colors break-all">
                  abdulwajid845433@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                <BsGithub className="text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-0.5">GitHub</p>
                <a href="https://github.com/Wajid-901" target="_blank" rel="noreferrer" className="text-sm text-neutral-400 hover:text-indigo-400 transition-colors">
                  github.com/Wajid-901
                </a>
              </div>
            </div>
          </div>

          <div className="bg-[#18181B] border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-3">Response time</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              We typically respond within <span className="text-white font-medium">24–48 hours</span> on weekdays.
              For urgent issues, include "URGENT" in your subject line.
            </p>
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-3">Found a bug?</h3>
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">
              Please include your browser, OS, and the steps to reproduce it. Screenshots are always helpful.
            </p>
            <a
              href="https://github.com/Wajid-901/Hire-Flow/issues"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Open a GitHub issue &rarr;
            </a>
          </div>
        </div>

        {/* Right — form */}
        <div className="md:col-span-3">
          {sent ? (
            <div className="bg-[#18181B] border border-white/5 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <BsCheckCircleFill className="text-emerald-500 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-white">Message sent!</h3>
              <p className="text-neutral-400">Thanks for reaching out. We will get back to you within 24-48 hours.</p>
              <button
                onClick={() => {
                  setSent(false);
                  // Keep name/email pre-filled for the next message, clear content only
                  setForm((prev) => ({ ...prev, subject: "", message: "" }));
                  setSubmitError("");
                }}
                className="mt-2 px-6 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm font-medium hover:bg-zinc-700 transition-all"
              >
                Send another message
              </button>
            </div>
          ) : (
            <div className="bg-[#18181B] border border-white/5 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-1">Send a message</h3>
              {user && (
                <p className="text-xs text-indigo-400 mb-5">
                  Signed in as <span className="font-semibold">{user.email}</span> — your details are pre-filled.
                </p>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Email Address
                      {user ? (
                        <span className="ml-1.5 text-[10px] font-normal text-zinc-400 bg-zinc-700/50 border border-zinc-600 px-1.5 py-0.5 rounded-full">
                          🔒 locked
                        </span>
                      ) : null}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={user ? undefined : handleChange}
                      readOnly={!!user}
                      className={`${inputClass} ${
                        emailError ? "border-red-500 focus:ring-red-500" : ""
                      } ${user ? "opacity-70 cursor-not-allowed select-none" : ""}`}
                    />
                    {emailError && (
                      <p className="mt-1.5 text-xs text-red-400">{emailError}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Subject</label>
                  <select
                    name="subject"
                    value={form.subject}
                    required
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select a topic</option>
                    <option>General inquiry</option>
                    <option>Bug report</option>
                    <option>Feature request</option>
                    <option>Account issue</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Message</label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    placeholder="Tell us more..."
                    value={form.message}
                    onChange={handleChange}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {submitError && (
                  <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !!emailError}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
