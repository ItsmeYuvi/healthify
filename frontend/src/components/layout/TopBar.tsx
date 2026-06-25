"use client";
import React, { useEffect, useState } from "react";
import { Search, Bell, User, LogOut, Moon, Sun, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { cn } from "@/lib/utils";

interface TopBarProps {
  collapsed: boolean;
}

interface Notification {
  id: number;
  title: string;
  text: string;
  read: boolean;
  time: string;
}

export function TopBar({ collapsed }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  const [userName, setUserName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("healthify_user_fullname") || "User";
    }
    return "User";
  });
  const [userEmail, setUserEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("healthify_user_email") || "";
    }
    return "";
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Welcome to Healthify 🌟",
      text: "Your premium Quiet Luxury wellness dashboard is active.",
      read: false,
      time: "Just now",
    },
    {
      id: 2,
      title: "AI Blueprint Completed ⚡",
      text: "Gemini AI has engineered your custom weekly workouts and meals.",
      read: false,
      time: "2 hours ago",
    },
    {
      id: 3,
      title: "Streak Active! 🔥",
      text: "You have started a logging streak. Keep consistency high!",
      read: false,
      time: "Today",
    },
  ]);

  const hasUnread = notifications.some((n) => !n.read);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      axios
        .get(`${API_BASE_URL}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUserName(res.data.full_name);
          setUserEmail(res.data.email);
          localStorage.setItem("healthify_user_fullname", res.data.full_name);
          localStorage.setItem("healthify_user_email", res.data.email);
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#topbar-avatar-dropdown")) {
        setDropdownOpen(false);
      }
      if (!target.closest("#topbar-bell-dropdown")) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("healthify_user_fullname");
    localStorage.removeItem("healthify_user_email");
    window.dispatchEvent(new Event("storage"));
    router.push("/login");
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 border-b border-white/[0.04] bg-[#0c0c0c]/80 backdrop-blur-md flex items-center justify-between px-6 transition-all duration-300 left-0",
        collapsed ? "md:left-20" : "md:left-64"
      )}
    >
      {/* Search Input */}
      <div className="relative max-w-xs w-full hidden sm:block">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
        <input
          type="text"
          placeholder="Search metrics or recipes..."
          className="w-full rounded-2xl bg-[#141414] border border-white/[0.04] pl-9 pr-4 py-2 text-xs outline-none focus:border-luxury-gold/45 focus:ring-1 focus:ring-luxury-gold/20 transition-all text-white placeholder-white/30"
        />
      </div>
      <div className="sm:hidden" />

      {/* Right Tools */}
      <div className="flex items-center gap-4">
        {/* Theme Toggler */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-xl p-2 text-white/50 hover:bg-white/[0.04] hover:text-white transition-colors cursor-pointer"
        >
          {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Notification Bell Dropdown Container */}
        <div className="relative" id="topbar-bell-dropdown">
          <button
            onClick={() => setBellOpen(!bellOpen)}
            className="rounded-xl p-2 text-white/50 hover:bg-white/[0.04] hover:text-white transition-colors cursor-pointer relative"
          >
            <Bell className="h-4.5 w-4.5" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-luxury-gold animate-pulse border border-[#0c0c0c]" />
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/[0.04] bg-[#141414] p-4 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.04] mb-3">
                <span className="text-xs font-semibold text-white">Notifications</span>
                {hasUnread && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] font-bold text-luxury-gold hover:text-luxury-gold/80 hover:underline flex items-center gap-0.5"
                  >
                    <Check className="h-3 w-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin text-left">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      "p-2.5 rounded-xl border transition-all text-left",
                      notif.read
                        ? "bg-transparent border-transparent opacity-60"
                        : "bg-luxury-gold/5 border-luxury-gold/25"
                    )}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-semibold text-[11px] text-white leading-tight">
                        {notif.title}
                      </h4>
                      <span className="text-[9px] text-white/30 whitespace-nowrap">
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/50 mt-1 leading-relaxed font-light">
                      {notif.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" id="topbar-avatar-dropdown">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-luxury-gold text-obsidian-base font-bold text-xs hover:opacity-90 select-none cursor-pointer"
          >
            {userName.charAt(0).toUpperCase()}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/[0.04] bg-[#141414] p-3.5 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150 z-50 text-left">
              <div className="space-y-1 pb-3 border-b border-white/[0.04]">
                <p className="text-sm font-semibold text-white truncate">{userName}</p>
                <p className="text-[10px] text-white/40 truncate">{userEmail}</p>
              </div>
              <div className="pt-2 space-y-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push("/profile");
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-white/70 hover:bg-white/[0.05] hover:text-white transition-colors cursor-pointer"
                >
                  <User className="h-4 w-4 text-white/40" />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
export default TopBar;
