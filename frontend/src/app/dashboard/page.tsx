"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { Dumbbell, Salad, User, AlertCircle, ArrowRight, Sparkles, TrendingUp, LogOut, Trash2, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface Plan {
  id: string;
  plan_name: string;
  goal: string;
  duration_weeks: number;
  week_number?: number;
  created_at: string;
  daily_plans: any[];
}

interface UserInfo {
  email: string;
  fullName: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch user info
    axios
      .get(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser({
          email: res.data.email,
          fullName: res.data.full_name,
          createdAt: res.data.created_at || new Date().toISOString(),
        });
      })
      .catch((err) => {
        console.warn("[Dashboard] /auth/me failed:", err.message);
      });

    // Fetch plans
    axios
      .get(`${API_BASE_URL}/api/v1/plans/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPlans(res.data))
      .catch((err) => {
        const status = err.response?.status;
        if (status === 401) {
          localStorage.removeItem("access_token");
          router.push("/login");
        } else {
          setError("Failed to load plans. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
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
      router.push("/login");
    } catch (err: any) {
      console.error("[Dashboard] Delete account failed:", err);
      setError(err.response?.data?.detail || "Failed to delete account. Please try again.");
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute h-12 w-12 animate-ping rounded-full border border-emerald-500/30 opacity-75" />
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 relative text-gray-900 dark:text-gray-100">
      {/* Top Header Section */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 p-8 shadow-sm dark:border-gray-800 dark:from-gray-900/50 dark:via-gray-955 dark:to-gray-900/50 dark:shadow-md">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Elite Performance Hub</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl flex items-center gap-3">
              <User className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              My Workspace
            </h1>
            {user && (
              <p className="text-gray-600 dark:text-gray-400 max-w-xl text-sm md:text-base leading-relaxed">
                Welcome back, <span className="font-semibold text-emerald-600 dark:text-emerald-400">{user.fullName}</span>. Track your progressions, plan diets, and monitor workouts.
              </p>
            )}
          </div>
          <Link href="/plan" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/10 hover:scale-[1.02] transition-transform active:scale-[0.99]">
            + Generate Elite Plan
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-650 dark:text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Main Workspace Grid: Profile Card on left, Plans on right */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Profile & Stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card space-y-6 relative overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -left-16 -bottom-16 h-32 w-32 rounded-full bg-teal-500/10 blur-3xl" />

            <div className="relative space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-xl">
                  {user ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold truncate">
                    {user ? user.fullName : "Athlete Profile"}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user ? user.email : "Syncing credentials..."}
                  </p>
                </div>
              </div>

              <div className="border-y border-gray-100 dark:border-gray-800/80 py-4 space-y-3">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Registration Date</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-200">
                    {user ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "—"}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Custom Blueprints</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-200">
                    {plans.length}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-950 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-250 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
                >
                  <LogOut className="h-4.5 w-4.5 text-gray-400" />
                  Logout
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-100 px-4 py-2.5 text-sm font-semibold text-red-650 dark:border-red-900/30 dark:bg-red-950/10 dark:text-red-405 dark:hover:bg-red-950/20 transition-colors"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Schemes */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-450" />
              Active Planning Schemes
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Showing {plans.length} plan{plans.length !== 1 ? 's' : ''}</span>
          </div>

          {plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-350 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/10 py-20 text-center space-y-4">
              <div className="rounded-2xl bg-gray-150 dark:bg-gray-900 p-4 border border-gray-250 dark:border-gray-800">
                <Dumbbell className="h-10 w-10 text-gray-450 dark:text-gray-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold">No Schemes Drafted</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm px-4">
                  You do not have any active health schemes. Let Gemini AI engineer a personalized program.
                </p>
              </div>
              <Link href="/plan" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">
                Engineering Board →
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {plans.map((plan) => {
                const workoutDaysCount = plan.daily_plans?.filter(dp => dp.exercises && dp.exercises.length > 0).length || 3;
                const weekNum = plan.week_number || 1;

                return (
                  <div
                    key={plan.id}
                    onClick={() => router.push(`/plan/${plan.id}`)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-emerald-500/40 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/40 dark:hover:border-emerald-500/40 dark:hover:shadow-lg cursor-pointer"
                  >
                    <div className="absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-full" />
                    
                    <div className="space-y-4">
                      {/* Header badges */}
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                          Week {weekNum}
                        </span>
                        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                          {plan.duration_weeks} week block
                        </span>
                      </div>

                      {/* Title */}
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-450 transition-colors leading-tight">
                          {plan.plan_name}
                        </h3>
                        <p className="text-xs capitalize text-gray-500 dark:text-gray-400">
                          Goal: {plan.goal.replace(/_/g, " ")}
                        </p>
                      </div>

                      {/* Meta stats */}
                      <div className="grid grid-cols-2 gap-3 border-y border-gray-100 dark:border-gray-800/80 py-3 text-xs text-gray-750 dark:text-gray-305">
                        <div className="flex items-center gap-2">
                          <Dumbbell className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{workoutDaysCount} Workout Days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Salad className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                          <span>7-Day Diet Plan</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-5 flex items-center justify-between text-xs">
                      <span className="text-gray-400 dark:text-gray-500">
                        Created {new Date(plan.created_at).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-350 transition-colors">
                        Enter Scheme
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal Overlay */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm dark:bg-black/60">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gray-250 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 animate-in fade-in zoom-in duration-200">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-red-500/10 blur-3xl" />
            
            <div className="relative space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-900/30 text-red-650 dark:text-red-400 mx-auto">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-extrabold">Delete Healthify Account?</h3>
                <p className="text-xs text-gray-550 dark:text-gray-400 px-2 leading-relaxed">
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
                  className="flex-1 rounded-xl bg-red-600 hover:bg-red-550 px-4 py-2.5 text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/10 active:scale-[0.99] disabled:opacity-55"
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
    </div>
  );
}
