"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { Dumbbell, Salad, User, AlertCircle, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
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

export default function DashboardPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");

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

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center bg-slate-950">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute h-12 w-12 animate-ping rounded-full border border-emerald-500/30 opacity-75" />
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-10">
      {/* Top Header Section */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-8 shadow-2xl">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Elite Performance Hub</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl flex items-center gap-3">
              <User className="h-8 w-8 text-emerald-500" />
              My Workspace
            </h1>
            {userName && (
              <p className="text-slate-400 max-w-xl text-sm md:text-base">
                Welcome back, <span className="font-semibold text-emerald-400">{userName}</span>. Track your progressions, plan diets, and monitor workouts.
              </p>
            )}
          </div>
          <Link href="/plan" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-emerald-500 hover:shadow-emerald-900/20 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
            + Generate Elite Plan
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Main Workspace Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            Active Planning Schemes
          </h2>
          <span className="text-xs text-slate-400 font-medium">Showing {plans.length} plan{plans.length !== 1 ? 's' : ''}</span>
        </div>

        {plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 py-20 text-center space-y-4">
            <div className="rounded-full bg-slate-900 p-4 border border-slate-800">
              <Dumbbell className="h-10 w-10 text-slate-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">No Schemes Drafted</h3>
              <p className="text-sm text-slate-400 max-w-sm">
                You do not have any active health schemes. Let Gemini AI engineer a personalized program.
              </p>
            </div>
            <Link href="/plan" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-800 hover:text-white">
              Engineering Board →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const workoutDaysCount = plan.daily_plans?.filter(dp => dp.exercises && dp.exercises.length > 0).length || 3;
              const hasMeals = plan.daily_plans?.some(dp => dp.meals && dp.meals.length > 0) || true;
              const weekNum = plan.week_number || 1;

              return (
                <div
                  key={plan.id}
                  onClick={() => router.push(`/plan/${plan.id}`)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl transition-all duration-300 hover:border-emerald-500/40 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-emerald-950/20 cursor-pointer"
                >
                  <div className="absolute top-0 right-0 h-[2px] w-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-full" />
                  
                  <div className="space-y-4">
                    {/* Header badges */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                        Week {weekNum}
                      </span>
                      <span className="text-xs text-slate-400">
                        {plan.duration_weeks} week block
                      </span>
                    </div>

                    {/* Title */}
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight">
                        {plan.plan_name}
                      </h3>
                      <p className="text-xs capitalize text-slate-400">
                        Goal: {plan.goal.replace(/_/g, " ")}
                      </p>
                    </div>

                    {/* Meta stats */}
                    <div className="grid grid-cols-2 gap-3 border-y border-slate-800/80 py-3 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Dumbbell className="h-4 w-4 text-emerald-500" />
                        <span>{workoutDaysCount} Workout Days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Salad className="h-4 w-4 text-teal-500" />
                        <span>7-Day Diet Plan</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-5 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Created {new Date(plan.created_at).toLocaleDateString()}
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
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
