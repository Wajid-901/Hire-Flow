import { Link } from "react-router-dom";
import PublicNavbar from "../components/common/PublicNavbar";
import Logo from "../components/common/Logo";

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

const Section = ({ id, title, children }) => (
  <section id={id} className="mb-10">
    <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-white/5">{title}</h2>
    <div className="space-y-3 text-neutral-400 leading-relaxed text-[15px]">{children}</div>
  </section>
);

const LAST_UPDATED = "January 1, 2026";

const PrivacyPolicyPage = () => (
  <div className="min-h-screen bg-[#09090B] text-white">
    <PublicNavbar />

    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <span className="inline-block bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
          Legal
        </span>
        <h1 className="text-4xl font-bold tracking-tight mb-3">Privacy Policy</h1>
        <p className="text-neutral-500 text-sm">Last updated: {LAST_UPDATED}</p>
      </div>

      {/* Summary callout */}
      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 mb-10">
        <p className="text-emerald-400 font-semibold mb-2">TL;DR â€” The short version</p>
        <p className="text-neutral-300 text-sm leading-relaxed">
          We collect only what we need to run the service. We never sell your data to anyone.
          We don't use third-party advertising. You can delete your account and all data at any time.
        </p>
      </div>

      <Section id="information-we-collect" title="1. Information We Collect">
        <p><strong className="text-white">Account information:</strong> When you register, we collect your name, email address, and a bcrypt-hashed version of your password. We never store your password in plain text.</p>
        <p><strong className="text-white">Application data:</strong> Job application details you enter â€” company name, role, status, notes, salary ranges, and related information. This data belongs entirely to you.</p>
        <p><strong className="text-white">Usage information:</strong> We may collect basic information about how you use the service (pages visited, features used) to improve the product. We do not track you across other websites.</p>
      </Section>

      <Section id="how-we-use" title="2. How We Use Your Information">
        <p>We use the information we collect exclusively to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide, maintain, and improve the HireFlow service</li>
          <li>Authenticate your account and keep it secure</li>
          <li>Send transactional emails (password reset links, welcome emails)</li>
          <li>Respond to your support requests</li>
          <li>Monitor for security incidents and prevent abuse</li>
        </ul>
        <p>We will never use your data to serve targeted advertisements or sell it to third parties.</p>
      </Section>

      <Section id="data-storage" title="3. Data Storage and Security">
        <p>Your data is stored in MongoDB Atlas, a cloud database hosted on AWS infrastructure. All data is encrypted at rest and in transit using industry-standard TLS/SSL.</p>
        <p>Passwords are hashed using bcrypt with 10 salt rounds before storage. Password reset tokens are SHA-256 hashed before being stored in the database â€” even we cannot read them.</p>
        <p>We implement rate limiting, security headers via Helmet.js, and CORS restrictions to protect the API from common attacks.</p>
      </Section>

      <Section id="data-sharing" title="4. Data Sharing">
        <p>We do not sell, rent, or share your personal data with third parties except in these limited circumstances:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-white">Service providers:</strong> We use MongoDB Atlas (database), Render (server hosting), and Gmail SMTP (email delivery). These providers only receive data necessary to perform their services.</li>
          <li><strong className="text-white">Legal requirements:</strong> We may disclose data if required by law or to protect the rights and safety of our users.</li>
        </ul>
      </Section>

      <Section id="your-rights" title="5. Your Rights">
        <p>You have full control over your data:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong className="text-white">Access:</strong> You can view all your data from the dashboard at any time.</li>
          <li><strong className="text-white">Export:</strong> You can export your application data as a CSV from the Applications page.</li>
          <li><strong className="text-white">Correction:</strong> You can update your name and password from the Profile and Settings pages.</li>
          <li><strong className="text-white">Deletion:</strong> You can request account deletion by contacting us. All your data will be permanently deleted within 30 days.</li>
        </ul>
      </Section>

      <Section id="cookies" title="6. Cookies and Local Storage">
        <p>HireFlow uses <strong className="text-white">localStorage</strong> in your browser to store your authentication token (JWT). This is required for the application to function â€” without it, you would be logged out on every page refresh.</p>
        <p>We do not use third-party cookies or tracking cookies of any kind.</p>
      </Section>

      <Section id="childrens-privacy" title="7. Children's Privacy">
        <p>HireFlow is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.</p>
      </Section>

      <Section id="changes" title="8. Changes to This Policy">
        <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the "Last updated" date at the top of this page. Continued use of the service after changes constitutes acceptance of the updated policy.</p>
      </Section>

      <Section id="contact" title="9. Contact Us">
        <p>If you have any questions about this Privacy Policy or your data, please contact us:</p>
        <div className="bg-[#18181B] border border-white/5 rounded-xl p-5 mt-3">
          <p className="text-white font-medium mb-1">HireFlow</p>
          <p>Email: <a href="mailto:abdulwajid845433@gmail.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">abdulwajid845433@gmail.com</a></p>
          <p>Or use the <Link to="/contact" className="text-indigo-400 hover:text-indigo-300 transition-colors">Contact page</Link></p>
        </div>
      </Section>
    </div>

    <Footer />
  </div>
);

export default PrivacyPolicyPage;



