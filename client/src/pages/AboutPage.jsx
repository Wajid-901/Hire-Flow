import { Link } from "react-router-dom";
import PublicNavbar from "../components/common/PublicNavbar";
import Logo from "../components/common/Logo";
import {
  BsLightningFill, BsShieldFill, BsHeartFill,
  BsPeopleFill, BsArrowRight, BsGithub, BsLinkedin,
} from "react-icons/bs";

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

const values = [
  { icon: <BsLightningFill className="text-indigo-400 text-xl" />, title: "Built for speed", body: "We obsess over performance. Every interaction should feel instant — no loading spinners, no waiting around." },
  { icon: <BsShieldFill    className="text-emerald-400 text-xl" />, title: "Privacy first",   body: "Your job search data is yours. We never sell it, share it, or use it for advertising. Ever." },
  { icon: <BsHeartFill     className="text-rose-400    text-xl" />, title: "Free forever",    body: "We believe everyone deserves powerful career tools. HireFlow is completely free — no hidden tiers." },
  { icon: <BsPeopleFill    className="text-amber-400   text-xl" />, title: "Made for students", body: "Built by a student who felt the pain of messy spreadsheets during job hunts. We get it." },
];

const AboutPage = () => (
  <div className="min-h-screen bg-[#09090B] text-white">
    <PublicNavbar />

    {/* Hero */}
    <section className="max-w-4xl mx-auto px-6 py-24 text-center">
      <span className="inline-block bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
        Our Story
      </span>
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
        Built by a student,<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          for every job seeker
        </span>
      </h1>
      <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
        HireFlow started from a simple frustration — tracking 50+ job applications in a Google Sheet
        was chaotic. There had to be a better way.
      </p>
    </section>

    {/* Story */}
    <section className="max-w-3xl mx-auto px-6 pb-20">
      <div className="bg-[#18181B] border border-white/5 rounded-2xl p-8 md:p-12 space-y-5">
        <p className="text-neutral-300 leading-relaxed">
          During the job search grind, it became clear that most people were managing their entire
          career opportunity pipeline inside a spreadsheet — forgetting follow-up dates, losing track
          of which version of a resume they sent, and having no idea what their actual success rate was.
        </p>
        <p className="text-neutral-300 leading-relaxed">
          HireFlow was built to fix that. A purpose-built dashboard that turns the chaos of job hunting
          into something organised, visual, and actionable. Track every application, see your pipeline
          in real time, and finally understand how your job search is actually performing.
        </p>
        <p className="text-neutral-300 leading-relaxed">
          We keep it free forever because we believe access to good career tools should not depend on
          your bank balance. Whether you're applying to your first internship or making a mid-career
          pivot, HireFlow is here for you.
        </p>
      </div>
    </section>

    {/* Values */}
    <section className="max-w-7xl mx-auto px-6 pb-24">
      <h2 className="text-3xl font-bold text-center mb-12">What we stand for</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {values.map((v) => (
          <div key={v.title} className="bg-[#18181B] border border-white/5 rounded-2xl p-6 flex gap-5">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              {v.icon}
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">{v.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{v.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Tech stack */}
    <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
      <h2 className="text-3xl font-bold mb-4">What it's built with</h2>
      <p className="text-neutral-400 mb-10">A modern, production-grade stack — the same tools used at top tech companies.</p>
      <div className="flex flex-wrap justify-center gap-3">
        {["React 18","Node.js","Express","MongoDB Atlas","JWT Auth","Tailwind CSS","Recharts","Nodemailer","Vercel","Render"].map((t) => (
          <span key={t} className="bg-white/5 border border-white/10 text-neutral-300 text-sm px-4 py-2 rounded-full">
            {t}
          </span>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
      <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-12">
        <h2 className="text-3xl font-bold mb-4">Ready to take control of your job search?</h2>
        <p className="text-neutral-400 mb-8">Free forever. No credit card. No catch.</p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
        >
          Start for free <BsArrowRight />
        </Link>
      </div>
    </section>

    <Footer />
  </div>
);

export default AboutPage;




