"use client";
import React, { useEffect, useState } from "react";
import { Search, Bell, User, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { cn } from "@/lib/utils";

interface TopBarProps {
  collapsed: boolean;
}

export function TopBar({ collapsed }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");

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
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.dispatchEvent(new Event("storage"));
    router.push("/login");
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 border-b border-white/[0.08] bg-white/[0.02] backdrop-blur-md flex items-center justify-between px-6 transition-all duration-300 left-0",
        collapsed ? "md:left-20" : "md:left-64"
      )}
    >
      {/* Search Input */}
      <div className="relative max-w-xs w-full hidden sm:block">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
        <input
          type="text"
          placeholder="Search metrics or recipes..."
          className="w-full rounded-full bg-white/[0.03] border border-white/10 pl-9 pr-4 py-2 text-xs outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 transition-all text-white placeholder-white/30"
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

        {/* Notification Bell */}
        <div className="relative">
          <button className="rounded-xl p-2 text-white/50 hover:bg-white/[0.04] hover:text-white transition-colors cursor-pointer">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent animate-pulse" />
          </button>
        </div>

        {/* User Dropdown */}
        <div className="relative" id="topbar-avatar-dropdown">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-white font-bold text-xs hover:opacity-90 select-none cursor-pointer"
          >
            {userName.charAt(0).toUpperCase()}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/[0.08] bg-[#0c0c0e]/95 p-3.5 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
              <div className="space-y-1 pb-3 border-b border-white/[0.08]">
                <p className="text-sm font-bold text-white truncate">{userName}</p>
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
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-danger hover:bg-danger/10 transition-colors cursor-pointer"
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
