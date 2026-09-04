import { Link } from "react-router-dom";
import {
  BsCheckCircleFill,
  BsBarChartFill,
  BsCalendar3,
  BsFileEarmarkText,
  BsRobot,
  BsStarFill,
  BsArrowRight,
  BsList,
  BsX
} from "react-icons/bs";
import { useState } from "react";
import Logo from "../components/common/Logo";
import useAuth from "../hooks/useAuth";

const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  const features = [
    {
      icon: <BsBarChartFill className="text-2xl" />,
      title: "Smart Tracking",
      description: "Track all your applications in one place with powerful filtering and search capabilities."
    },
    {
      icon: <BsRobot className="text-2xl" />,
      title: "AI Assistant",
      description: "Get personalized interview prep, resume tips, and career advice powered by AI."
    },
    {
      icon: <BsCalendar3 className="text-2xl" />,
      title: "Interview Calendar",
      description: "Never miss an interview with smart scheduling and automated reminders."
    },
    {
      icon: <BsFileEarmarkText className="text-2xl" />,
      title: "Resume Manager",
      description: "Store multiple resume versions and track which one you sent to each company."
    },
    {
      icon: <BsBarChartFill className="text-2xl" />,
      title: "Analytics Dashboard",
      description: "Visualize your job search progress with insightful charts and metrics."
    },
    {
      icon: <BsCheckCircleFill className="text-2xl" />,
      title: "Status Updates",
      description: "Keep track of application stages from submission to offer acceptance."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description: "Sign up for free in seconds. No credit card required, ever."
    },
    {
      number: "02",
      title: "Add Applications",
      description: "Quickly log your job applications with company details and status."
    },
    {
      number: "03",
      title: "Track & Manage",
      description: "Monitor progress, schedule interviews, and stay organized effortlessly."
    },
    {
      number: "04",
      title: "Land Your Dream Job",
      description: "Use insights and AI assistance to optimize your job search strategy."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer at Google",
      initials: "SJ",
      color: "from-indigo-500 to-purple-600",
      quote: "HireFlow helped me organise my job search and land my dream role at Google. The clean dashboard gave me full visibility over every application."
    },
    {
      name: "Michael Chen",
      role: "Product Manager at Meta",
      initials: "MC",
      color: "from-emerald-500 to-teal-600",
      quote: "Tracking 50+ applications was overwhelming until I found HireFlow. The analytics helped me identify patterns and sharpen my approach."
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer at Apple",
      initials: "ER",
      color: "from-rose-500 to-pink-600",
      quote: "The status tracking and search features ensured I never lost track of an opportunity. Absolutely essential for any serious job seeker!"
    },
  ];

  const faqs = [
    {
      question: "Is HireFlow really free?",
      answer: "Yes! HireFlow is 100% free for students and job seekers. We believe everyone deserves access to powerful career tools."
    },
    {
      question: "Do I need to install anything?",
      answer: "No installation needed. HireFlow is a web application that works in any modern browser on desktop or mobile."
    },
    {
      question: "How secure is my data?",
      answer: "We take security seriously. All data is encrypted and stored securely. We never share your information with third parties."
    },
    {
      question: "Can I import existing applications?",
      answer: "Yes! You can manually add applications or import them in bulk. We're working on automatic import features too."
    },
    {
      question: "Is there a limit on applications?",
      answer: "No limits! Track as many applications as you need. Our free plan includes unlimited applications, storage, and features."
    },
    {
      question: "Can I access HireFlow on mobile?",
      answer: "Absolutely! HireFlow is fully responsive and works great on smartphones and tablets."
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-white font-sans">
      {/* Background Glow Effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#09090B]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={isAuthenticated ? "/dashboard" : "/"}>
              <Logo size={32} />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {!loading && (
                isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="text-sm font-semibold px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all hover:-translate-y-0.5"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-sm font-medium text-white hover:text-indigo-400 transition-colors"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="text-sm font-semibold px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all hover:-translate-y-0.5"
                    >
                      Get Started Free
                    </Link>
                  </>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-lg p-2 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {mobileMenuOpen ? <BsX className="text-2xl" /> : <BsList className="text-2xl" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-400 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-400 hover:text-white transition-colors">How It Works</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-400 hover:text-white transition-colors">Testimonials</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-neutral-400 hover:text-white transition-colors">FAQ</a>
              <div className="pt-4 border-t border-white/5 space-y-3">
                {!loading && (
                  isAuthenticated ? (
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold"
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link to="/login" className="block text-center py-2 text-white hover:text-indigo-400 transition-colors">
                        Log in
                      </Link>
                      <Link to="/register" className="block text-center py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold">
                        Get Started Free
                      </Link>
                    </>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 md:pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/30 border border-indigo-500/20 mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-sm font-medium text-indigo-300">
              🎉 100% Free for Students & Job Seekers
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
            Track every opportunity.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
              Land your dream job.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            HireFlow brings clarity to your job search. Organize applications, ace interviews with AI coaching, and land the role you deserve — completely free, forever.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="group flex items-center gap-2 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5"
              >
                Go to Dashboard
                <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                to="/register"
                className="group flex items-center gap-2 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5"
              >
                Start Tracking for Free
                <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            
            <a
              href="#features"
              className="flex items-center gap-2 text-base font-semibold text-white bg-white/5 hover:bg-white/10 px-8 py-4 rounded-xl transition-all border border-white/10 hover:border-white/20"
            >
              See How It Works
            </a>
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <BsCheckCircleFill className="text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <BsCheckCircleFill className="text-emerald-500" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <BsCheckCircleFill className="text-emerald-500" />
              <span>10,000+ users</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Powerful features designed to streamline your job search and help you land offers faster.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl border border-white/5 bg-[#18181B] hover:bg-[#1C1C1C] transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-neutral-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-20 px-6 bg-gradient-to-b from-transparent via-indigo-950/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get started in minutes
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Four simple steps to transform your job search experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-2xl font-bold mb-4 shadow-lg shadow-indigo-600/30">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-neutral-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-indigo-600/50 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Loved by job seekers everywhere
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Join thousands who have landed their dream jobs with HireFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-white/5 bg-[#18181B] hover:border-white/10 transition-all hover:-translate-y-1"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <BsStarFill key={i} className="text-amber-400 text-sm" />
                  ))}
                </div>
                <p className="text-neutral-300 mb-6 leading-relaxed text-sm">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  {/* Gradient initial avatar */}
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{testimonial.name}</p>
                    <p className="text-xs text-neutral-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 py-20 px-6 bg-gradient-to-b from-transparent via-purple-950/5 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-neutral-400">
              Everything you need to know about HireFlow.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group p-6 rounded-2xl border border-white/5 bg-[#18181B] hover:bg-[#1C1C1C] transition-all"
              >
                <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-white">
                  {faq.question}
                  <BsArrowRight className="text-neutral-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-4 text-neutral-400 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl border border-white/5 bg-gradient-to-br from-indigo-950/20 to-purple-950/20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to land your dream job?
            </h2>
            <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
              Join thousands of successful job seekers using HireFlow to organize their search and land amazing opportunities.
            </p>
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-2 text-lg font-semibold px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all hover:-translate-y-0.5"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
              <BsArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Logo size={28} />
              </div>
              <p className="text-neutral-400 mb-4 max-w-sm">
                The ultimate job application tracker. Organize your job search, track applications, and land your dream role — completely free.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><Link to="/about"          className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact"        className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms"          className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
            <p>&copy; {new Date().getFullYear()} HireFlow. All rights reserved.</p>
            <p>Made with ❤️ for job seekers worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
