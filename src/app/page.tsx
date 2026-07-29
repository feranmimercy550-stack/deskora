"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import { ChevronRight, ArrowRight, Menu, X } from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [demoOpen, setDemoOpen] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const features = [
    {
      title: "Smart Invoicing",
      description: "Create, send and track invoices in seconds. Get paid faster with automated reminders.",
      icon: "📄",
    },
    {
      title: "AI Assistant",
      description: "Write proposals, reply to clients, generate captions and summarize your business  just by asking.",
      icon: "🤖",
    },
    {
      title: "Customer Management",
      description: "Keep every client's history, notes, and payment records in one clean place.",
      icon: "👥",
    },
    {
      title: "Payment Tracking",
      description: "Log payments, track what's owed and get notified the moment a client pays.",
      icon: "💰",
    },
    {
      title: "Business Reports",
      description: "See your revenue, expenses, profit and top customers at a glance  no spreadsheets needed.",
      icon: "📊",
    },
    {
      title: "Automation",
      description: "Set rules that run your business while you sleep. Overdue invoice? Reminder sent automatically.",
      icon: "⚡",
    },
  ];

  const stats = [
    { value: "10k+", label: "Businesses" },
    { value: "50+", label: "Countries" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <main className="bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-white/10">
        <div className="px-4 md:px-8 py-4 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <img src="/favicon.png" alt="Risely" className="w-8 h-8" />
            <span className="font-bold text-lg tracking-tight">Risely</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            {["Features", "Pricing", "About", "Contact"].map((item) => (
              <motion.div key={item} whileHover={{ y: -2 }}>
                <Link href={`#${item.toLowerCase()}`} className="text-white/70 hover:text-white transition">
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden md:block text-sm text-white/70 hover:text-white transition"
            >
              Login
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/register"
                className="text-sm px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 transition"
              >
                Get Started
              </Link>
            </motion.div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-white/10 rounded">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-slate-900/90 backdrop-blur border-t border-white/10 px-4 py-4 space-y-3"
            >
              {["Features", "Pricing", "About", "Contact"].map((item) => (
                <Link key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white/70 hover:text-white">
                  {item}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative pt-20 md:pt-0 px-4 md:px-6 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 w-fit mx-auto mb-8"
          >
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            <span className="text-xs font-medium text-purple-200">AI-Powered Business OS</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-bold leading-tight mb-6">
            Run Your Business.{" "}
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-blue-400 bg-clip-text text-transparent animate-pulse">
              Smarter. Faster. Easier.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Risely helps freelancers and small businesses manage customers, invoices, payments, and growth all in one intelligent platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.button
              onClick={() => setDemoOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/20 text-white/80 px-8 py-4 rounded-xl font-semibold hover:bg-white/5 hover:border-white/40 transition"
            >
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-white/40 text-xs md:text-sm">
            {[
              "✓ All-in-one Platform",
              "✓ AI Assistant",
              "✓ Secure & Reliable",
            ].map((badge) => (
              <motion.div key={badge} whileHover={{ x: 5 }} className="flex items-center gap-2">
                {badge}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2">
            <motion.div className="w-1 h-2 bg-purple-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-4 md:px-8 py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 md:px-8 py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything your business needs</h2>
            <p className="text-white/50 text-lg">One platform. Every tool. Zero overwhelm.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
                className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition cursor-pointer"
              >
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-4 md:px-8 py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, honest pricing</h2>
            <p className="text-white/50 text-lg">Start free. Upgrade when you're ready.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                plan: "Free",
                price: "$0",
                features: ["1 business", "50 customers", "10 invoices/mo", "Basic CRM"],
                cta: "Get Started",
                highlight: false,
              },
              {
                plan: "Starter",
                price: "$9",
                features: ["Unlimited customers", "Unlimited invoices", "Appointments", "Basic AI"],
                cta: "Start Free Trial",
                highlight: false,
              },
              {
                plan: "Professional",
                price: "$29",
                features: ["AI website builder", "CRM Pro", "Marketing suite", "WhatsApp automation"],
                cta: "Most Popular",
                highlight: true,
              },
              {
                plan: "Business",
                price: "$69",
                features: ["Inventory", "HR & Payroll", "API access", "Unlimited team"],
                cta: "Start Free Trial",
                highlight: false,
              },
            ].map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className={`rounded-2xl p-8 border transition ${
                  tier.highlight
                    ? "bg-gradient-to-br from-purple-600 to-purple-700 border-purple-500 shadow-2xl shadow-purple-500/50"
                    : "bg-white/5 border-white/10 hover:border-purple-500/50"
                }`}
              >
                <h3 className="font-bold text-xl mb-2">{tier.plan}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className={`text-sm mb-1 ${tier.highlight ? "text-white/70" : "text-white/40"}`}>/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f, j) => (
                    <li key={j} className={`text-sm flex items-center gap-2 ${tier.highlight ? "text-white/90" : "text-white/60"}`}>
                      <span className={tier.highlight ? "text-white" : "text-purple-400"}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/register"
                    className={`block text-center py-3 rounded-xl text-sm font-semibold transition ${
                      tier.highlight
                        ? "bg-white text-purple-600 hover:shadow-lg hover:shadow-white/20"
                        : "bg-purple-600 text-white hover:opacity-90"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-8 py-24 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to transform your business?
          </h2>
          <p className="text-white/60 text-lg mb-10">
            Join thousands of freelancers and businesses already using Risely to work smarter, not harder.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition"
            >
              Get Started Free — No Credit Card Required <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 md:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
            <div className="flex items-center gap-3">
              <img src="/favicon.png" alt="Risely" className="w-8 h-8" />
              <span className="font-bold text-white">Risely</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-white/50">
              {["Features", "Pricing", "About", "Contact"].map((item) => (
                <Link key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition">
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div className="text-center text-white/40 text-sm pt-8">
            <p>© 2026 Risely. All rights reserved. AI-Powered Business Operating System for Freelancers and Small Businesses.</p>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      <AnimatePresence>
        {demoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setDemoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden max-w-2xl w-full"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Risely Demo</h2>
                <button
                  onClick={() => setDemoOpen(false)}
                  className="text-white/60 hover:text-white transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="aspect-video bg-black flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-0 h-0 border-l-8 border-l-transparent border-r-0 border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1" style={{
                      borderLeft: '8px solid transparent',
                      borderRight: '0px solid',
                      borderTop: '6px solid transparent',
                      borderBottom: '6px solid transparent',
                      marginLeft: '4px'
                    }}>
                      <div className="w-0 h-0" style={{
                        borderLeft: '10px solid white',
                        borderTop: '6px solid transparent',
                        borderBottom: '6px solid transparent',
                      }}></div>
                    </div>
                  </div>
                  <p className="text-white/60 mb-4">Demo video coming soon</p>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition text-sm"
                  >
                    Get Started Now
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
