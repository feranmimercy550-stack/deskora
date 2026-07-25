"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard, Users, FileText, Receipt,
  CreditCard, Package, Calendar, BarChart3, Bot,
  Settings, Quote, Bell, Menu, X, Plus,
  Home, MoreHorizontal
} from "lucide-react";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Customers", href: "/customers" },
  { icon: FileText, label: "Invoices", href: "/invoices" },
  { icon: Quote, label: "Quotes", href: "/quotes" },
  { icon: Receipt, label: "Expenses", href: "/expenses" },
  { icon: CreditCard, label: "Payments", href: "/payments" },
  { icon: Package, label: "Products & Services", href: "/products" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: Bot, label: "AI Assistant", href: "/ai-assistant" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const bottomNavLinks = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: FileText, label: "Invoices", href: "/invoices" },
  { icon: Users, label: "Clients", href: "/customers" },
  { icon: MoreHorizontal, label: "More", href: "/settings" },
];

type Props = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export default function AppLayout({ children, title, subtitle, action }: Props) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileName, setProfileName] = useState("Risely User");
  const [profileBusiness, setProfileBusiness] = useState("My Business");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      const authResponse = await supabase.auth.getUser();
      const user = authResponse.data.user;
      if (!user) return;

      const [profileRes, notifRes] = await Promise.all([
        supabase.from("profiles").select("full_name, business_name").eq("id", user.id).single(),
        supabase.from("notifications").select("id").eq("user_id", user.id).eq("read", false),
      ]) as any[];

      if (profileRes?.data) {
        setProfileName(profileRes.data.full_name || "Risely User");
        setProfileBusiness(profileRes.data.business_name || "My Business");
      }
      setUnreadCount(notifRes?.data?.length || 0);
    };
    fetchProfile();
  }, []);

  const firstName = profileName.split(" ")[0];
  const initial = firstName.charAt(0).toUpperCase();

  const Sidebar = () => (
    <aside className="w-64 bg-sidebar flex flex-col py-6 px-4 h-full">
      <div className="flex items-center justify-between px-2 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-sidebar-foreground font-bold text-lg">RISELY</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-sidebar-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {sidebarLinks.map((link) => (
          <Link key={link.href} href={link.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === link.href
                ? "bg-primary text-white"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            }`}>
            <link.icon className="w-4 h-4 shrink-0" />
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3 px-2 pt-4 border-t border-sidebar-border">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sidebar-foreground text-sm font-medium truncate">{profileName}</p>
          <p className="text-sidebar-foreground/60 text-xs truncate">{profileBusiness}</p>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 z-10">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-accent transition">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-foreground">{title}</h1>
              {subtitle && <p className="text-muted-foreground text-xs md:text-sm hidden md:block">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            {action}
            <Link href="/notifications" className="relative p-2 rounded-lg hover:bg-accent transition">
              <Bell className="w-5 h-5 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link href="/settings">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-90">
                {initial}
              </div>
            </Link>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border z-40">
          <div className="flex items-center justify-around px-2 py-2">
            {bottomNavLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}>
                <link.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            ))}
            <Link href="/invoices"
              className="flex flex-col items-center gap-1 px-4 py-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center -mt-6 shadow-lg">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground mt-1">New</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}