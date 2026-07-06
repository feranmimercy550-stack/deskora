import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A1A] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="font-bold text-lg tracking-wide">DESKORA</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <Link href="#features" className="hover:text-white transition">Features</Link>
          <Link href="#pricing" className="hover:text-white transition">Pricing</Link>
          <Link href="#about" className="hover:text-white transition">About</Link>
          <Link href="#contact" className="hover:text-white transition">Contact</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/70 hover:text-white transition">
            Login
          </Link>
          <Link href="/register" className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition font-medium">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
        {/* Badge */}
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary text-xs font-medium px-4 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
          AI-Powered Business OS
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-4xl">
          Run Your Business.{" "}
          <span className="text-primary">Smarter.</span>{" "}
          <span className="text-primary">Faster.</span>{" "}
          <span className="text-primary">Easier.</span>
        </h1>

        {/* Subtext */}
        <p className="text-white/60 text-lg mt-6 max-w-xl leading-relaxed">
          Deskora helps freelancers and small businesses manage customers, invoices, payments, and growth  all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4 mt-10">
          <Link
            href="/register"
            className="bg-primary text-white px-7 py-3.5 rounded-xl font-semibold hover:opacity-90 transition text-sm"
          >
            Get Started Free
          </Link>
          <button className="flex items-center gap-2 border border-white/20 text-white/80 px-7 py-3.5 rounded-xl font-semibold hover:bg-white/5 transition text-sm">
            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[7px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
            </div>
            Watch Demo
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center gap-8 mt-14 text-white/40 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary/30 rounded flex items-center justify-center">
              <span className="text-primary text-[8px]">✓</span>
            </div>
            All-in-one Platform
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary/30 rounded flex items-center justify-center">
              <span className="text-primary text-[8px]">✓</span>
            </div>
            AI Assistant
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary/30 rounded flex items-center justify-center">
              <span className="text-primary text-[8px]">✓</span>
            </div>
            Secure & Reliable
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-8 py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Everything your business needs</h2>
          <p className="text-white/50 text-center mb-12 text-sm">One platform. Every tool. Zero overwhelm.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Smart Invoicing", desc: "Create, send and track invoices in seconds. Get paid faster with automated reminders.", icon: "📄" },
              { title: "AI Assistant", desc: "Write proposals, reply to clients, generate captions and summarize your business — just by asking.", icon: "🤖" },
              { title: "Customer Management", desc: "Keep every client's history, notes, and payment records in one clean place.", icon: "👥" },
              { title: "Payment Tracking", desc: "Log payments, track what's owed and get notified the moment a client pays.", icon: "💰" },
              { title: "Business Reports", desc: "See your revenue, expenses, profit and top customers at a glance — no spreadsheets needed.", icon: "📊" },
              { title: "Automation", desc: "Set rules that run your business while you sleep. Overdue invoice? Reminder sent automatically.", icon: "⚡" },
            ].map((feature) => (
              <div key={feature.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/40 transition">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-8 py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Simple, honest pricing</h2>
          <p className="text-white/50 text-center mb-12 text-sm">Start free. Upgrade when you're ready.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { plan: "Free", price: "₦0", period: "/month", features: ["3 invoices/month", "10 customers", "Limited AI", "Basic dashboard"], cta: "Get Started", highlight: false },
              { plan: "Starter", price: "₦5,000", period: "/month", features: ["Unlimited invoices", "Unlimited customers", "50 AI requests/day", "Reports"], cta: "Start Free Trial", highlight: true },
              { plan: "Business", price: "₦12,000", period: "/month", features: ["Unlimited AI", "Full reports", "Automation rules", "Priority support"], cta: "Start Free Trial", highlight: false },
            ].map((tier) => (
              <div key={tier.plan} className={`rounded-2xl p-6 border ${tier.highlight ? "bg-primary border-primary" : "bg-white/5 border-white/10"}`}>
                <h3 className="font-bold text-lg mb-1">{tier.plan}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className={`text-sm mb-1 ${tier.highlight ? "text-white/70" : "text-white/40"}`}>{tier.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className={`text-sm flex items-center gap-2 ${tier.highlight ? "text-white/90" : "text-white/60"}`}>
                      <span className="text-primary">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-2.5 rounded-xl text-sm font-semibold transition ${tier.highlight ? "bg-white text-primary hover:opacity-90" : "bg-primary text-white hover:opacity-90"}`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-10 text-center text-white/30 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">D</span>
          </div>
          <span className="font-bold text-white/60">DESKORA</span>
        </div>
        <p>AI-Powered Business Operating System for Freelancers and Small Businesses.</p>
        <p className="mt-2">© 2026 Deskora. All rights reserved.</p>
      </footer>
    </main>
  );
}