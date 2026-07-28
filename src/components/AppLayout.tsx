"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard, Users, FileText, Receipt,
  CreditCard, Package, Calendar, BarChart3, Bot,
  Settings, Quote, Bell, Menu, X, Plus,
  Home, MoreHorizontal, LogOut, User
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
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileName, setProfileName] = useState("Risely User");
  const [profileBusiness, setProfileBusiness] = useState("My Business");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const authResponse = await supabase.auth.getUser();
      const user = authResponse.data.user;
      if (!user) return;

      const [profileRes, notifRes] = await Promise.all([
        supabase.from("profiles").select("full_name, business_name, avatar_url").eq("id", user.id).single(),
        supabase.from("notifications").select("id").eq("user_id", user.id).eq("read", false),
      ]) as any[];

      if (profileRes?.data) {
        setProfileName(profileRes.data.full_name || "Risely User");
        setProfileBusiness(profileRes.data.business_name || "My Business");
        if (profileRes.data.avatar_url) setProfileImage(profileRes.data.avatar_url);
      }
      setUnreadCount(notifRes?.data?.length || 0);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const authResponse = await supabase.auth.getUser();
      const user = authResponse.data.user;
      if (!user) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
      const avatarUrl = urlData.publicUrl;

      await supabase.from("profiles").update({ avatar_url: avatarUrl } as any).eq("id", user.id);
      setProfileImage(avatarUrl);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const firstName = profileName.split(" ")[0];
  const initial = firstName.charAt(0).toUpperCase();

  const Avatar = ({ size = "sm" }: { size?: "sm" | "lg" }) => {
    const sizeClass = size === "lg" ? "w-12 h-12 text-sm" : "w-8 h-8 text-xs";
    return profileImage ? (
      <img src={profileImage} alt={firstName}
        className={`${sizeClass} rounded-full object-cover shrink-0`} />
    ) : (
      <div className={`${sizeClass} bg-primary rounded-full flex items-center justify-center text-white font-bold shrink-0`}>
        {initial}
      </div>
    );
  };

  const Sidebar = () => (
    <aside className="w-64 bg-sidebar flex flex-col py-6 px-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between px-2 mb-8">
        <Link href="/dashboard" onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-sidebar-foreground font-bold text-lg">RISELY</span>
        </Link>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-sidebar-foreground p-1">
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

      {/* Profile at bottom of sidebar */}
      <div className="pt-4 border-t border-sidebar-border">
        <div ref={profileMenuRef} className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition w-full text-left">
            <Avatar />
            <div className="flex-1 min-w-0">
              <p className="text-sidebar-foreground text-sm font-medium truncate">{profileName}</p>
              <p className="text-sidebar-foreground/60 text-xs truncate">{profileBusiness}</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-card border border-border rounded-xl shadow-lg py-1 z-50">
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar size="lg" />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-[10px] hover:opacity-90">
                      +
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{profileName}</p>
                    <p className="text-xs text-muted-foreground">{profileBusiness}</p>
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*"
                  onChange={handleImageUpload} className="hidden" />
                {uploadingImage && (
                  <p className="text-xs text-primary mt-2">Uploading...</p>
                )}
              </div>
              <Link href="/settings" onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition">
                <User className="w-4 h-4" /> Profile Settings
              </Link>
              <button onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-accent transition w-full text-left">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
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
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-accent transition shrink-0">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <Link href="/dashboard" className="md:hidden shrink-0">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">R</span>
              </div>
            </Link>
            <div className="min-w-0">
              <h1 className="text-base md:text-xl font-bold text-foreground truncate">{title}</h1>
              {subtitle && <p className="text-muted-foreground text-xs md:text-sm hidden md:block">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
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
              <Avatar />
            </Link>
          </div>
        </div>

        {/* Page Content — scrollable */}
        <div className="flex-1 overflow-auto pb-20 md:pb-0">
          {children}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border z-40">
          <div className="flex items-center justify-around px-2 py-2">
            {bottomNavLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}>
                <link.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            ))}
            <Link href="/invoices"
              className="flex flex-col items-center gap-1 px-3 py-2">
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