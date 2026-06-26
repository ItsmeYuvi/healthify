"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ClipboardList, Dumbbell, Salad, LineChart, User, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("healthify_user_fullname") || "User";
    }
    return "User";
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      axios
        .get(`${API_BASE_URL}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUserName(res.data.full_name);
          localStorage.setItem("healthify_user_fullname", res.data.full_name);
          localStorage.setItem("healthify_user_email", res.data.email);
        })
        .catch(() => {});
    }
  }, [pathname]);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Plans", href: "/plans", icon: ClipboardList },
    { label: "Log Workout", href: "/log/workout", icon: Dumbbell },
    { label: "Log Meal", href: "/log/meal", icon: Salad },
    { label: "Progress", href: "/progress", icon: LineChart },
    { label: "Profile", href: "/profile", icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("healthify_user_fullname");
    localStorage.removeItem("healthify_user_email");
    window.dispatchEvent(new Event("storage"));
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out border-r border-[#00D4FF]/12 bg-[#050A0F] flex flex-col justify-between hidden md:flex",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div>
        {/* Top Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-[#00D4FF]/12">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="font-sans font-bold text-luxury-gold text-xl tracking-[0.15em] uppercase">Healthify</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="mx-auto">
              <span className="font-sans font-bold text-luxury-gold text-lg uppercase">H</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-xl p-1.5 text-white/40 hover:bg-white/[0.04] hover:text-white transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5 px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3.5 rounded-xl px-4.5 py-3 text-xs font-semibold select-none transition-all duration-300 border",
                  isActive
                    ? "bg-accent/5 border-accent/30 text-accent shadow-[0_0_15px_rgba(0,212,255,0.15)]"
                    : "border-transparent text-white/60 hover:bg-[#00D4FF]/5 hover:text-[#00D4FF]"
                )}
              >
                <Icon className={cn("h-4.5 w-4.5 shrink-0", isActive ? "text-accent" : "text-white/60")} />
                {!collapsed && <span className="transition-opacity">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile */}
      <div className="p-4 border-t border-[#00D4FF]/12">
        {!collapsed && (
          <div className="flex items-center justify-between gap-3 mb-3 bg-[#0C1A26]/80 border border-[#00D4FF]/10 rounded-2xl p-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/15 text-accent font-bold text-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-white truncate max-w-[120px]">{userName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/40 hover:text-danger transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
        {collapsed && (
          <button
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.01] border border-[#00D4FF]/10 text-white/40 hover:text-danger hover:bg-danger/10 transition-all mx-auto cursor-pointer"
            title="Logout"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        )}
      </div>
    </aside>
  );
}
export default Sidebar;
