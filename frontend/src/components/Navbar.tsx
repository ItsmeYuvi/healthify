"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Dumbbell, Moon, Sun, User, LogOut, ChevronDown, Trash2, ShieldAlert } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";

interface UserInfo {
  email: string;
  fullName: string;
}

const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);

    if (token) {
      const payload = decodeToken(token);
      if (payload && payload.sub) {
        setUser({
          email: payload.sub,
          fullName: payload.sub.split('@')[0],
        });
      }

      axios
        .get(`${API_BASE_URL}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser({
            email: res.data.email,
            fullName: res.data.full_name,
          });
        })
        .catch((err) => {
          console.warn("[Navbar] Fetching user failed:", err.message);
          if (err.response?.status === 401) {
            localStorage.removeItem("access_token");
            setIsLoggedIn(false);
            setUser(null);
            router.push("/login");
          }
        });
    } else {
      setUser(null);
    }
  }, [pathname, router]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#avatar-dropdown-container")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setUser(null);
    setDropdownOpen(false);
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`${API_BASE_URL}/api/v1/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("access_token");
      setIsLoggedIn(false);
      setUser(null);
      setShowDeleteModal(false);
      router.push("/login");
    } catch (err) {
      console.error("[Navbar] Delete account failed:", err);
      alert("Failed to delete account. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

    return (
    <nav className="sticky top-4 z-50 mx-auto max-w-5xl rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 backdrop-blur-2xl shadow-glass-sm my-4">
      <div className="flex h-14 items-center justify-between">
        <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2 text-lg font-bold text-white transition-all hover:opacity-90">
          <Dumbbell className="h-5 w-5 text-cyan-400" />
          <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Healthify</span>
        </Link>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative" id="avatar-dropdown-container">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 focus:outline-none hover:opacity-90 select-none group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-cyan-450 font-bold text-xs">
                  {user ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : "U"}
                </div>
                <ChevronDown className="h-3 w-3 text-white/50 group-hover:text-white transition-colors" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-60 rounded-2xl border border-white/[0.08] bg-[#0d0d0f]/95 p-4 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="space-y-1 pb-3 border-b border-white/[0.08]">
                    <p className="text-sm font-bold text-white truncate">
                      {user ? user.fullName : "User"}
                    </p>
                    <p className="text-xs text-white/40 truncate">
                      {user ? user.email : "Loading..."}
                    </p>
                  </div>
                  <div className="pt-2 space-y-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push("/dashboard");
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/[0.05] hover:text-white transition-colors"
                    >
                      <User className="h-4 w-4 text-white/40" />
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setShowDeleteModal(true);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            !mounted ? null : (
              <Link href="/login" className="flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white transition-colors">
                <User className="h-4 w-4" />
                Login
              </Link>
            )
          )}

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg p-1.5 text-white/50 hover:bg-white/[0.05] hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Global Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c0c0e]/95 p-6 shadow-2xl backdrop-blur-3xl animate-in fade-in zoom-in duration-200">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-red-500/5 blur-3xl pointer-events-none" />
            
            <div className="relative space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mx-auto">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-extrabold text-white">Delete Healthify Account?</h3>
                <p className="text-xs text-white/50 px-2 leading-relaxed">
                  This action is permanent. All your credentials, custom fitness blueprints, and diet progression schemes will be deleted forever.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs font-semibold text-white/80 hover:bg-white/[0.05] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 rounded-xl bg-red-650 hover:bg-red-600 px-4 py-2.5 text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.99] disabled:opacity-55"
                >
                  {deleting ? (
                    <>
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Confirm Delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
