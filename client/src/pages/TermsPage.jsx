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

const TermsPage = () => (
  <div className="min-h-screen bg-[#09090B] text-white">
    <PublicNavbar />

    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <span className="inline-block bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
          Legal
        </span>
        <h1 className="text-4xl font-bold tracking-tight mb-3">Terms of Service</h1>
        <p className="text-neutral-500 text-sm">Last updated: {LAST_UPDATED}</p>
      </div>

      {/* Summary */}
      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 mb-10">
        <p className="text-indigo-400 font-semibold mb-2">The short version</p>
        <p className="text-neutral-300 text-sm leading-relaxed">
          Use HireFlow responsibly, don't abuse it, and you're welcome to use it for free as long as you like.
          We can suspend accounts that violate these terms.
        </p>
      </div>

      <Section id="acceptance" title="1. Acceptance of Terms">
        <p>By accessing or using HireFlow ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
        <p>These terms apply to all users of HireFlow, including visitors, registered users, and contributors.</p>
      </Section>

      <Section id="description" title="2. Description of Service">
        <p>HireFlow is a web-based job application tracking platform that allows users to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Create and manage a personal account</li>
          <li>Track job applications through a customisable pipeline</li>
          <li>View analytics and insights about their job search</li>
          <li>Export their data in CSV format</li>
          <li>Receive email notifications related to their account</li>
        </ul>
        <p>The Service is provided free of charge with no premium tiers.</p>
      </Section>

      <Section id="accounts" title="3. User Accounts">
        <p>To use HireFlow, you must create an account with a valid email address and a password. You are responsible for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Maintaining the confidentiality of your account credentials</li>
          <li>All activity that occurs under your account</li>
          <li>Notifying us immediately of any unauthorised use of your account</li>
        </ul>
        <p>You may only create one account per person. Creating accounts for others without their permission is prohibited.</p>
      </Section>

      <Section id="acceptable-use" title="4. Acceptable Use">
        <p>You agree not to use HireFlow to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Violate any applicable local, national, or international law or regulation</li>
          <li>Transmit any unsolicited or unauthorised advertising or promotional material</li>
          <li>Attempt to gain unauthorised access to any part of the Service or its related systems</li>
          <li>Upload or transmit viruses or any other malicious code</li>
          <li>Interfere with or disrupt the integrity or performance of the Service</li>
          <li>Scrape, crawl, or otherwise extract data from the Service in bulk</li>
          <li>Impersonate any person or entity</li>
        </ul>
      </Section>

      <Section id="your-data" title="5. Your Data">
        <p>You retain full ownership of all data you enter into HireFlow. By using the Service, you grant HireFlow a limited, non-exclusive licence to store, process, and display your data solely for the purpose of providing the Service to you.</p>
        <p>We will not use your data for any purpose other than operating and improving the Service. We will never sell your data to third parties.</p>
        <p>If you delete your account, your data will be permanently deleted within 30 days.</p>
      </Section>

      <Section id="availability" title="6. Service Availability">
        <p>We aim to keep HireFlow available 24/7, but we cannot guarantee uninterrupted access. The Service may be temporarily unavailable due to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Scheduled maintenance</li>
          <li>Infrastructure issues beyond our control</li>
          <li>Server cold starts on our free hosting tier (typically 30—60 seconds)</li>
        </ul>
        <p>We will endeavour to minimise disruptions and notify users of significant planned maintenance.</p>
      </Section>

      <Section id="disclaimer" title="7. Disclaimer of Warranties">
        <p>HireFlow is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>The Service will be error-free or uninterrupted</li>
          <li>The Service will meet your specific requirements</li>
          <li>Any errors in the Service will be corrected</li>
        </ul>
        <p>HireFlow is a free service. Your use of it is entirely at your own risk.</p>
      </Section>

      <Section id="limitation-of-liability" title="8. Limitation of Liability">
        <p>To the maximum extent permitted by applicable law, HireFlow and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, data, or goodwill — arising from your use of or inability to use the Service.</p>
      </Section>

      <Section id="termination" title="9. Termination">
        <p>We reserve the right to suspend or terminate your account immediately, without notice, if you violate these Terms of Service.</p>
        <p>You may also terminate your account at any time by contacting us. Upon termination, your data will be deleted in accordance with our Privacy Policy.</p>
      </Section>

      <Section id="changes" title="10. Changes to Terms">
        <p>We may modify these Terms of Service at any time. We will notify you of significant changes by updating the "Last updated" date. Your continued use of the Service after changes constitutes acceptance of the new terms.</p>
      </Section>

      <Section id="governing-law" title="11. Governing Law">
        <p>These Terms of Service shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.</p>
      </Section>

      <Section id="contact" title="12. Contact">
        <p>If you have any questions about these Terms, please contact us:</p>
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

export default TermsPage;




