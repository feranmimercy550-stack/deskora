
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AppLayout from "@/components/AppLayout";
import { Bell, Check, Trash2 } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
};

const typeStyles: Record<string, string> = {
  info: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  error: "bg-red-100 text-red-700",
};

const typeIcons: Record<string, string> = {
  info: "💬", success: "✅", warning: "⚠️", error: "❌",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    const authResponse = await supabase.auth.getUser();
    const user = authResponse.data.user;
    if (!user) { setLoading(false); return; }
    const { data } = await supabase.from("notifications").select("*")
      .eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setNotifications(data);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true } as any).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = async () => {
    const authResponse = await supabase.auth.getUser();
    const user = authResponse.data.user;
    if (!user) return;
    await supabase.from("notifications").update({ read: true } as any).eq("user_id", user.id);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getSubtitle = () => {
    if (unreadCount === 0) return "All caught up!";
    if (unreadCount === 1) return "1 unread notification";
    return `${unreadCount} unread notifications`;
  };

  return (
    <AppLayout
      title="Notifications"
      subtitle={getSubtitle()}
      action={
        unreadCount > 0 ? (
          <button onClick={markAllAsRead}
            className="flex items-center gap-2 text-sm text-primary hover:underline">
            <Check className="w-4 h-4" /> Mark all read
          </button>
        ) : undefined
      }
    >
      <div className="px-4 md:px-8 py-6 max-w-3xl">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bell className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">No notifications yet</p>
            <p className="text-muted-foreground text-sm mt-1">
              You will see alerts here when invoices are paid and more.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id}
                className={"bg-card border rounded-xl p-4 flex items-start gap-4 transition " +
                  (n.read ? "border-border opacity-60" : "border-primary/30")}>
                <div className={"w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 " +
                  (typeStyles[n.type] || typeStyles.info)}>
                  {typeIcons[n.type] || "💬"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={"text-sm font-medium " + (n.read ? "text-muted-foreground" : "text-foreground")}>
                      {n.title}
                    </p>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {!n.read && (
                      <button onClick={() => markAsRead(n.id)}
                        className="text-xs text-primary hover:underline flex items-center gap-1">
                        <Check className="w-3 h-3" /> Mark as read
                      </button>
                    )}
                    <button onClick={() => deleteNotification(n.id)}
                      className="text-xs text-destructive hover:underline flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
                {!n.read && <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1"></div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
