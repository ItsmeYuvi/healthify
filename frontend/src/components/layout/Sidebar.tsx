"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShinyText } from "../reactbits/text-animations/ShinyText";
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
        "fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out border-r border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur-2xl flex flex-col justify-between hidden md:flex",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div>
        {/* Top Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 dark:border-white/[0.08]">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-violet-500 dark:text-violet-400 animate-pulse" />
              <ShinyText text="Healthify" className="text-xl font-bold tracking-tight" />
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="mx-auto">
              <Dumbbell className="h-6 w-6 text-violet-500 dark:text-violet-400" />
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-1 text-zinc-400 dark:text-white/40 hover:bg-zinc-100 dark:hover:bg-white/[0.05] hover:text-zinc-800 dark:hover:text-white transition-colors cursor-pointer"
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
                  "flex items-center gap-3.5 rounded-xl px-4.5 py-3 text-sm font-semibold select-none transition-all duration-300 border",
                  isActive
                    ? "bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.15)] dark:bg-violet-500/5"
                    : "border-transparent text-zinc-500 dark:text-white/60 hover:bg-zinc-100 dark:hover:bg-white/[0.04] hover:text-zinc-800 dark:hover:text-white"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="transition-opacity">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile */}
      <div className="p-4 border-t border-zinc-200 dark:border-white/[0.08]">
        {!collapsed && (
          <div className="flex items-center justify-between gap-3 mb-3 bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-2xl p-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400 font-bold text-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-zinc-800 dark:text-white truncate max-w-[120px]">{userName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-zinc-400 dark:text-white/40 hover:text-red-500 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
        {collapsed && (
          <button
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 text-zinc-400 dark:text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all mx-auto cursor-pointer"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        )}
      </div>
    </aside>
  );
}
export default Sidebar;
