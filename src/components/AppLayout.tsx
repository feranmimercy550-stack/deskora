"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard, Users, FileText, Receipt,
  CreditCard, Package, Calendar, BarChart3, Bot,
  Settings, Quote, Bell, Menu, X, Plus,
  Home, MoreHorizontal, LogOut, User, Camera
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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const fetchProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [{ data: profile }, { data: notifs }] = await Promise.all([
      supabase.from("profiles").select("full_name, business_name, avatar_url").eq("id", user.id).single(),
      supabase.from("notifications").select("id", { count: "exact" }).eq("user_id", user.id).eq("read", false),
    ]);
    if (profile) {
      setProfileName((profile as any).full_name || "Risely User");
      setProfileBusiness((profile as any).business_name || "My Business");
      if ((profile as any).avatar_url) setProfileImage((profile as any).avatar_url);
    }
    setUnreadCount((notifs as any)?.length || 0);
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = urlData.publicUrl + `?t=${Date.now()}`;
      await supabase.from("profiles").update({ avatar_url: url } as any).eq("id", user.id);
      setProfileImage(url);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const firstName = profileName.split(" ")[0];
  const initial = firstName.charAt(0).toUpperCase();

  const AvatarDisplay = ({ size = "sm" }: { size?: "sm" | "lg" }) => {
    const cls = size === "lg" ? "w-14 h-14 text-base" : "w-8 h-8 text-xs";
    return profileImage ? (
      <img src={profileImage} alt={firstName} className={`${cls} rounded-full object-cover shrink-0 border-2 border-primary/20`} />
    ) : (
      <div className={`${cls} bg-primary rounded-full flex items-center justify-center text-white font-bold shrink-0`}>
        {initial}
      </div>
    );
  };

  const SidebarContent = () => (
    <aside className="w-64 bg-sidebar flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-sidebar-border">
        <Link href="/dashboard" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 hover:opacity-80 transition">
          <img src="/favicon.png" alt="Risely" className="w-8 h-8 rounded-lg" />
          <span className="text-sidebar-foreground font-bold text-lg">RISELY</span>
        </Link>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {sidebarLinks.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === link.href ? "bg-primary text-white" : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}>
            <link.icon className="w-4 h-4 shrink-0" />
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Profile */}
      <div className="px-3 py-4 border-t border-sidebar-border" ref={profileMenuRef}>
        <button onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-sidebar-accent transition text-left">
          <AvatarDisplay />
          <div className="flex-1 min-w-0">
            <p className="text-sidebar-foreground text-sm font-medium truncate">{profileName}</p>
            <p className="text-sidebar-foreground/50 text-xs truncate">{profileBusiness}</p>
          </div>
          <MoreHorizontal className="w-4 h-4 text-sidebar-foreground/40 shrink-0" />
        </button>

        {/* Profile dropdown — opens UPWARD */}
        {showProfileMenu && (
          <div className="absolute bottom-24 left-3 right-3 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
            {/* Profile header */}
            <div className="p-4 bg-primary/5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <AvatarDisplay size="lg" />
                  <button
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition">
                    <Camera className="w-3 h-3 text-white" />
                  </button>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{profileName}</p>
                  <p className="text-xs text-muted-foreground truncate">{profileBusiness}</p>
                  {uploading && <p className="text-xs text-primary mt-0.5">Uploading photo...</p>}
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>

            {/* Menu items */}
            <div className="p-1">
              <Link href="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-accent transition">
                <User className="w-4 h-4 text-muted-foreground" />
                Profile Settings
              </Link>
              <Link href="/notifications"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-accent transition">
                <Bell className="w-4 h-4 text-muted-foreground" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-auto bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{unreadCount}</span>
                )}
              </Link>
              <button onClick={handleSignOut}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-accent transition w-full text-left">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0 relative">
        <SidebarContent />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 z-10 shadow-2xl relative">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 border-b border-border bg-card shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-accent transition shrink-0">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <Link href="/dashboard" className="md:hidden shrink-0">
              <img src="/favicon.png" alt="Risely" className="w-7 h-7 rounded-lg" />
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-base md:text-xl font-bold text-foreground truncate">{title}</h1>
              {subtitle && <p className="text-muted-foreground text-xs hidden md:block truncate">{subtitle}</p>}
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
            <button onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <AvatarDisplay />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto pb-20 md:pb-0">
          {children}
        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-card/95 backdrop-blur-sm border-t border-border z-40 safe-area-pb">
          <div className="flex items-center justify-around px-1 py-1">
            {bottomNavLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition ${pathname === link.href ? "text-primary" : "text-muted-foreground"
                  }`}>
                <link.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            ))}
            <Link href="/invoices" className="flex flex-col items-center gap-0.5 px-3 py-2">
              <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center -mt-7 shadow-lg shadow-primary/30">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground mt-0.5">New</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
