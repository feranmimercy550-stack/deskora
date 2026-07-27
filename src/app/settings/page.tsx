"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AppLayout from "@/components/AppLayout";
import { currencies } from "@/lib/currency";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [form, setForm] = useState({
    full_name: "", business_name: "", email: "", currency: "NGN", country: "Nigeria",
  });
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "", confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const authResponse = await supabase.auth.getUser();
      const user = authResponse.data.user;
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setForm({
          full_name: (data as any).full_name || "",
          business_name: (data as any).business_name || "",
          email: (data as any).email || user.email || "",
          currency: (data as any).currency || "NGN",
          country: (data as any).country || "Nigeria",
        });
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const authResponse = await supabase.auth.getUser();
      const user = authResponse.data.user;
      if (!user) throw new Error("Not logged in");
      const { error } = await supabase.from("profiles").update({
        full_name: form.full_name,
        business_name: form.business_name,
        currency: form.currency,
        country: form.country,
      } as any).eq("id", user.id);
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword });
      if (error) throw error;
      setPasswordSuccess(true);
      setPasswordForm({ newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : "Failed to change password");
    } finally { setChangingPassword(false); }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <AppLayout
      title="Settings"
      subtitle="Manage your account and preferences."
    >
      <div className="px-4 md:px-8 py-6 max-w-2xl space-y-6">
        {/* Business Info */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold text-foreground text-lg mb-4">Business Information</h2>
          {success && (
            <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4">
              Settings saved successfully!
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
              <input type="text" value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Business Name</label>
              <input type="text" value={form.business_name}
                onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
              <input type="email" value={form.email} disabled
                className="w-full border border-input rounded-lg px-4 py-2.5 text-sm bg-muted text-muted-foreground cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Currency</label>
              <select value={form.currency}
                onChange={(e) => {
                  const selected = currencies.find(c => c.code === e.target.value);
                  setForm({ ...form, currency: e.target.value, country: selected?.country || form.country });
                }}
                className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.country})</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pt-4 border-t border-border mt-4">
            <button onClick={handleSave} disabled={saving}
              className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold text-foreground text-lg mb-4">Change Password</h2>
          {passwordError && (
            <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg mb-4">{passwordError}</div>
          )}
          {passwordSuccess && (
            <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4">
              Password changed successfully!
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
              <input type="password" value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Confirm New Password</label>
              <input type="password" value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full border border-input rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
            </div>
          </div>
          <div className="pt-4 border-t border-border mt-4">
            <button onClick={handlePasswordChange} disabled={changingPassword}
              className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
              {changingPassword ? "Changing..." : "Change Password"}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold text-foreground text-lg mb-4">Account</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Sign out</p>
              <p className="text-xs text-muted-foreground mt-0.5">Sign out of your Risely account</p>
            </div>
            <button onClick={handleSignOut}
              className="border border-border text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}