import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsEnvelopeFill, BsGithub, BsCheckCircleFill, BsArrowLeft } from "react-icons/bs";
import Logo from "../components/common/Logo";
import PublicNavbar from "../components/common/PublicNavbar";
import axiosInstance from "../api/axiosInstance";

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

const ContactPage = () => {
  const [form, setForm]             = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading]       = useState(false);
  const [sent, setSent]             = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
                onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); setSubmitError(""); }}
                className="mt-2 px-6 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm font-medium hover:bg-zinc-700 transition-all"
              >
                Send another message
              </button>
            </div>
          ) : (
            <div className="bg-[#18181B] border border-white/5 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Send a message</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Subject</label>
                  <select
                    value={form.subject}
                    required
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
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
                    required
                    rows={6}
                    placeholder="Tell us more..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
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
                  disabled={loading}
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
