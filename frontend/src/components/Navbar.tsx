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
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-emerald-600 dark:text-emerald-450">
          <Dumbbell className="h-6 w-6" />
          <span>Healthify</span>
        </Link>

        <div className="flex items-center gap-4">
          {isLoggedIn && (
            <>
              <Link href="/dashboard" className="text-sm font-semibold text-gray-700 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-450">
                Dashboard
              </Link>
              <Link href="/plan" className="text-sm font-semibold text-gray-700 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-450">
                Plan
              </Link>
            </>
          )}

          {isLoggedIn && user ? (
            <div className="relative" id="avatar-dropdown-container">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 focus:outline-none hover:opacity-90 select-none group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                  {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-gray-950 dark:text-gray-400 dark:group-hover:text-white transition-colors" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-60 rounded-2xl border border-gray-250 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-gray-900 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="space-y-1 pb-3 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="pt-2 space-y-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push("/dashboard");
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-350 dark:hover:bg-gray-800 transition-colors"
                    >
                      <User className="h-4 w-4 text-gray-400" />
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setShowDeleteModal(true);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
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
              <Link href="/login" className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-450">
                <User className="h-5 w-5" />
                Login
              </Link>
            )
          )}

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Global Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm dark:bg-black/60">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 animate-in fade-in zoom-in duration-200">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />
            
            <div className="relative space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 mx-auto">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Delete Healthify Account?</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 px-2 leading-relaxed">
                  This action is permanent. All your credentials, custom fitness blueprints, and diet progression schemes will be deleted forever.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2.5 text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.99] disabled:opacity-55"
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
