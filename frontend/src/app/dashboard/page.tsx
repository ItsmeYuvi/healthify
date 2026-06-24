"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { Dumbbell, Salad, User, AlertCircle, ArrowRight, Sparkles, TrendingUp, Trash2 } from "lucide-react";
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

const goalNames: Record<string, string> = {
  all: "All Goals",
  fat_loss: "Fat Loss",
  weight_gain: "Weight Gain",
  muscle_build: "Muscle Build",
  endurance: "Endurance",
  flexibility: "Flexibility",
  general_health: "General Health"
};

export default function DashboardPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [activeGoal, setActiveGoal] = useState("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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
        setUserName(res.data.full_name);
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

  const confirmDelete = async (id: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/v1/plans/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
    } catch (err: any) {
      console.error("[Dashboard] Delete plan failed:", err);
      setError("Failed to delete the plan. Please try again.");
    }
  };

  const sortedPlans = [...plans].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const uniqueGoals = ["all", ...Array.from(new Set(plans.map((p) => p.goal)))];

  const filteredPlans = activeGoal === "all"
    ? sortedPlans
    : sortedPlans.filter((p) => p.goal === activeGoal);

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
    <div className="max-w-5xl mx-auto space-y-8 pb-12 text-gray-900 dark:text-gray-100">
      {/* Top Header Section */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50 p-8 shadow-sm dark:border-gray-800 dark:from-gray-900/50 dark:via-gray-950 dark:to-gray-900/50 dark:shadow-md">
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
            {userName && (
              <p className="text-gray-600 dark:text-gray-400 max-w-xl text-sm md:text-base leading-relaxed">
                Welcome back, <span className="font-semibold text-emerald-600 dark:text-emerald-400">{userName}</span>. Track your progressions, plan diets, and monitor workouts.
              </p>
            )}
          </div>
          <Link href="/plan" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/10 hover:scale-[1.02] transition-transform active:scale-[0.99]">
            + Generate Elite Plan
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Main Workspace Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4 gap-4">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Active Planning Schemes
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
            Showing {filteredPlans.length} plan{filteredPlans.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Goal Filter Pills */}
        {plans.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2">
            {uniqueGoals.map((goal) => (
              <button
                key={goal}
                onClick={() => setActiveGoal(goal)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all ${
                  activeGoal === goal
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/25"
                    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-850"
                }`}
              >
                {goalNames[goal] || goal.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>
        )}

        {filteredPlans.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/10 py-20 text-center space-y-4">
            <div className="rounded-2xl bg-gray-100 dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800">
              <Dumbbell className="h-10 w-10 text-gray-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold">No Schemes Found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm px-4">
                No health schemes match your active filter. Change the filter or generate a new program.
              </p>
            </div>
            {plans.length === 0 && (
              <Link href="/plan" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">
                Engineering Board →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPlans.map((plan) => {
              const workoutDaysCount = plan.daily_plans?.filter((dp) => dp.exercises && dp.exercises.length > 0).length || 0;
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
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                          {plan.duration_weeks} wk
                        </span>
                        
                        {/* Inline Delete Confirmation */}
                        {deleteConfirmId === plan.id ? (
                          <div 
                            className="flex items-center gap-1 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/40 px-1.5 py-0.5 rounded text-[10px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="font-bold text-red-600 dark:text-red-400">Del?</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDelete(plan.id);
                              }}
                              className="font-bold text-white bg-red-600 px-1.5 py-0.5 rounded hover:bg-red-700"
                            >
                              Yes
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmId(null);
                              }}
                              className="font-bold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(plan.id);
                            }}
                            className="rounded-lg p-1 text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
                            title="Delete Plan"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                        {plan.plan_name}
                      </h3>
                      <p className="text-xs capitalize text-gray-500 dark:text-gray-400">
                        Goal: {plan.goal.replace(/_/g, " ")}
                      </p>
                    </div>

                    {/* Meta stats */}
                    <div className="grid grid-cols-2 gap-3 border-y border-gray-100 dark:border-gray-800/80 py-3 text-xs text-gray-700 dark:text-gray-300">
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
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
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
  );
}
