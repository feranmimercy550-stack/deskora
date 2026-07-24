"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Users, FileText, Receipt,
  CreditCard, Package, Calendar, BarChart3, Bot,
  Settings, Plus, Quote, ChevronLeft, ChevronRight
} from "lucide-react";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Customers", href: "/customers" },
  { icon: FileText, label: "Invoices", href: "/invoices" },
  { icon: Quote, label: "Quotes", href: "/quotes" },
  { icon: Receipt, label: "Expenses", href: "/expenses" },
  { icon: CreditCard, label: "Payments", href: "/payments" },
  { icon: Package, label: "Products & Services", href: "/products" },
  { icon: Calendar, label: "Calendar", href: "/calendar", active: true },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: Bot, label: "AI Assistant", href: "/ai-assistant" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

export default function CalendarPage() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="w-64 bg-sidebar flex flex-col py-6 px-4 shrink-0">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-sidebar-foreground font-bold text-lg">RISELY</span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {sidebarLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${link.active ? "bg-primary text-white" : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}>
              <link.icon className="w-4 h-4 shrink-0" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 px-2 pt-4 border-t border-sidebar-border">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">R</div>
          <div>
            <p className="text-sidebar-foreground text-sm font-medium">Risely User</p>
            <p className="text-sidebar-foreground/60 text-xs">My Business</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-8 py-4 border-b border-border bg-card">
          <div>
            <h1 className="text-xl font-bold text-foreground">Calendar</h1>
            <p className="text-muted-foreground text-sm">Manage your schedule and important dates.</p>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition">
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>

        <div className="px-8 py-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">{MONTHS[month]} {year}</h2>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-2 hover:bg-accent rounded-lg transition">
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>
                <button onClick={() => setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1))}
                  className="px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-lg hover:opacity-90 transition">
                  Today
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-accent rounded-lg transition">
                  <ChevronRight className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(d => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => (
                <div key={i}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm cursor-pointer transition ${day === null ? "" :
                    isToday(day) ? "bg-primary text-white font-bold" :
                      "hover:bg-accent text-foreground"
                    }`}>
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}