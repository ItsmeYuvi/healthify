"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { Dumbbell, Salad, User, AlertCircle, ArrowRight, Sparkles, TrendingUp, Trash2 } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { TiltedCard } from "@/components/TiltedCard";
import { BlurText } from "@/components/BlurText";
import { GradientText } from "@/components/GradientText";
import { StarBorder } from "@/components/StarBorder";

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
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning 🌅");
    else if (hour < 17) setGreeting("Good afternoon 🌤️");
    else setGreeting("Good evening 🌙");
  }, []);

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
          <div className="absolute h-12 w-12 animate-ping rounded-full border border-cyan-500/30 opacity-75" />
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 text-white">
      {/* Top Header Section */}
      <GlassCard spotlightColor="rgba(6, 182, 212, 0.08)" borderGlowColor="rgba(6, 182, 212, 0.25)" className="p-8">
        <div className="relative space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1 text-xs font-semibold text-cyan-400 border border-white/10 shadow-glass-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Elite Performance Hub</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl flex items-center gap-3 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                <User className="h-8 w-8 text-cyan-400" />
                My Workspace
              </h1>
              {userName && (
                <p className="text-white/50 max-w-xl text-sm md:text-base leading-relaxed">
                  <BlurText text={greeting} animateBy="words" delay={0.02} />,{" "}
                  <GradientText colors={["#06b6d4", "#8b5cf6"]} className="font-semibold">{userName}</GradientText>. Track your progressions, plan diets, and monitor workouts.
                </p>
              )}
            </div>
            <Link href="/plan" className="shrink-0 self-start md:self-center">
              <StarBorder color="#06b6d4" speed="3.5s">
                + Generate Elite Plan
              </StarBorder>
            </Link>
          </div>

          {/* Glassmorphic Stats Widget */}
          {plans.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-white/[0.08]">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Active Schemes</span>
                <div className="mt-1 text-2xl font-extrabold text-cyan-400">{plans.length}</div>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Weekly Workouts</span>
                <div className="mt-1 text-2xl font-extrabold text-violet-400">
                  {plans.reduce((sum, p) => sum + (p.daily_plans?.filter(dp => dp.exercises?.length > 0).length || 0), 0)} Days
                </div>
              </div>
              <div className="col-span-2 md:col-span-1 rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Primary Focus</span>
                <div className="mt-1 text-lg font-extrabold truncate text-white/80">
                  {(() => {
                    const goals = plans.map(p => p.goal);
                    const mostCommon = goals.sort((a,b) =>
                      goals.filter(v => v===a).length - goals.filter(v => v===b).length
                    ).pop();
                    return goalNames[mostCommon || ""] || "None";
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Main Workspace Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/[0.08] pb-4 gap-4">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            Active Planning Schemes
          </h2>
          <span className="text-xs text-white/40 font-semibold">
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
                    ? "bg-gradient-to-r from-cyan-500 to-violet-500 border-transparent text-white shadow-glass-glow"
                    : "bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                {goalNames[goal] || goal.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>
        )}

        {filteredPlans.length === 0 ? (
          <GlassCard spotlight={false} className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="rounded-2xl bg-white/[0.04] p-4 border border-white/10">
              <Dumbbell className="h-10 w-10 text-white/40" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No Schemes Found</h3>
              <p className="text-sm text-white/40 max-w-sm px-4">
                No health schemes match your active filter. Change the filter or generate a new program.
              </p>
            </div>
            {plans.length === 0 && (
              <Link href="/plan">
                <StarBorder color="#06b6d4" speed="3.5s">
                  Engineering Board →
                </StarBorder>
              </Link>
            )}
          </GlassCard>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPlans.map((plan) => {
              const workoutDaysCount = plan.daily_plans?.filter((dp) => dp.exercises && dp.exercises.length > 0).length || 0;
              const weekNum = plan.week_number || 1;

              return (
                <TiltedCard key={plan.id} rotateAmplitude={8} scaleOnHover={1.02} className="h-full">
                  <GlassCard
                    onClick={() => router.push(`/plan/${plan.id}`)}
                    spotlightColor="rgba(6, 182, 212, 0.08)"
                    borderGlowColor="rgba(6, 182, 212, 0.25)"
                    className="hover:shadow-lg cursor-pointer flex flex-col justify-between h-full group"
                  >
                    {/* Sliding red overlay for deletion confirmation */}
                    <div
                      className={`absolute -inset-6 bg-red-950/95 border border-red-500/20 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center text-white transition-all duration-300 ease-out ${
                        deleteConfirmId === plan.id
                          ? "translate-y-0 opacity-100"
                          : "-translate-y-full opacity-0 pointer-events-none"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="h-8 w-8 text-white mb-2 animate-bounce" />
                      <h4 className="text-base font-bold text-white mb-1">Delete this scheme?</h4>
                      <p className="text-xs text-white/40 mb-4 max-w-[200px]">
                        This action cannot be undone.
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(plan.id);
                          }}
                          className="rounded-lg bg-red-500 px-4 py-2 text-xs font-bold text-white hover:bg-red-600 transition-colors shadow-sm"
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(null);
                          }}
                          className="rounded-lg border border-white/20 bg-transparent px-4 py-2 text-xs font-bold text-white hover:bg-white/10 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                    <div className="absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-300 group-hover:w-full" />
                    
                    <div className="space-y-4">
                      {/* Header badges */}
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full bg-white/[0.04] border border-white/10 px-2.5 py-0.5 text-[11px] font-bold text-cyan-400">
                          Week {weekNum}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium text-white/40">
                            {plan.duration_weeks} wk
                          </span>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(plan.id);
                            }}
                            className="rounded-lg p-1 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-white/10"
                            title="Delete Plan"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold group-hover:text-cyan-400 transition-colors leading-tight">
                          {plan.plan_name}
                        </h3>
                        <p className="text-xs text-white/40">
                          Goal: <span className="font-semibold text-cyan-400">{goalNames[plan.goal] || plan.goal.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                        </p>
                      </div>

                      {/* Meta stats */}
                      <div className="grid grid-cols-2 gap-3 border-y border-white/[0.08] py-3 text-xs text-white/60">
                        <div className="flex items-center gap-2">
                          <Dumbbell className="h-4 w-4 text-cyan-400" />
                          <span>{workoutDaysCount} Workout Days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Salad className="h-4 w-4 text-violet-400" />
                          <span>7-Day Diet Plan</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-5 flex items-center justify-between text-xs">
                      <span className="text-white/30">
                        Created {new Date(plan.created_at).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                        Enter Scheme
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </GlassCard>
                </TiltedCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
