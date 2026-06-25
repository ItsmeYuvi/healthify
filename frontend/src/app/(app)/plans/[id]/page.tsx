"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { BlurText } from "@/components/reactbits/text-animations/BlurText";
import { StarBorder } from "@/components/reactbits/animations/StarBorder";
import { Dumbbell, Salad, Heart, ArrowLeft, Calendar, ShieldCheck, Zap, ShieldAlert, Clock, ChevronRight } from "lucide-react";

interface Plan {
  id: string;
  plan_name: string;
  goal: string;
  duration_weeks: number;
  week_number?: number;
  created_at: string;
  daily_plans: any[];
  weeks?: { id: string; week_number: number }[];
}

const GOAL_LABELS: Record<string, string> = {
  fat_loss: "Fat Loss",
  weight_gain: "Weight Gain",
  muscle_build: "Muscle Build",
  endurance: "Endurance",
  flexibility: "Flexibility",
  general_health: "General Health",
};

export default function PlanDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDay, setActiveDay] = useState<number>(1);
  const [nextWeekLoading, setNextWeekLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"exercises" | "diet" | "yoga">("exercises");

  useEffect(() => {
    fetchPlanDetails();
  }, [params.id]);

  const fetchPlanDetails = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/v1/plans/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPlan(res.data);
      })
      .catch((err) => {
        console.error("[PlanDetails] Error fetching plan:", err);
        setError("Failed to load plan details. The blueprint might not exist.");
      })
      .finally(() => setLoading(false));
  };

  const handleGenerateNextWeek = async () => {
    if (!plan) return;
    setNextWeekLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/plans/${plan.id}/next-week`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push(`/plans/${res.data.id}`);
    } catch (err: any) {
      console.error("[PlanDetails] Error generating next week:", err);
      const detail = err.response?.data?.detail;
      setError(detail || "Failed to generate next week's plan. Gemini AI may be busy.");
    } finally {
      setNextWeekLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  if (error && !plan) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-red-500" />
        <h2 className="text-lg font-bold">Failed to Load Blueprint</h2>
        <p className="text-xs text-white/40 max-w-sm text-center">{error}</p>
        <Link href="/plans">
          <GlassButton variant="outline" className="gap-2 text-xs font-bold mt-2">
            <ArrowLeft className="h-4 w-4" /> Return to Plans
          </GlassButton>
        </Link>
      </div>
    );
  }

  const currentPlan = plan!;
  const dailyPlans = currentPlan.daily_plans || [];
  const activeDayPlan = dailyPlans.find((dp) => dp.day === activeDay) || dailyPlans[0] || {
    day: activeDay,
    focus: "Rest & Active Recovery",
    exercises: [],
    yoga_routine: [],
    meals: [],
  };

  const hasWorkouts = activeDayPlan.exercises && activeDayPlan.exercises.length > 0;
  const hasYoga = activeDayPlan.yoga_routine && activeDayPlan.yoga_routine.length > 0;
  const hasMeals = activeDayPlan.meals && activeDayPlan.meals.length > 0;

  // Calculate day stats
  const totalCalories = activeDayPlan.meals?.reduce((sum: number, m: any) => sum + (m.calories || 0), 0) || 0;
  const totalProtein = activeDayPlan.meals?.reduce((sum: number, m: any) => sum + (m.protein_g || 0), 0) || 0;
  const totalCarbs = activeDayPlan.meals?.reduce((sum: number, m: any) => sum + (m.carbs_g || 0), 0) || 0;
  const totalFats = activeDayPlan.meals?.reduce((sum: number, m: any) => sum + (m.fats_g || 0), 0) || 0;

  const targetProtein = Math.max(1, Math.round((totalCalories * 0.3) / 4));
  const targetCarbs = Math.max(1, Math.round((totalCalories * 0.45) / 4));
  const targetFats = Math.max(1, Math.round((totalCalories * 0.25) / 9));

  // Check if current week is the latest week generated so far
  const isLatestWeek = !currentPlan.weeks || currentPlan.weeks.length === 0 || 
    currentPlan.week_number === Math.max(...currentPlan.weeks.map(w => w.week_number));

  return (
    <div className="space-y-8 pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/plans" className="inline-flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-xs font-bold group">
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Plans
        </Link>
        <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-bold border border-white/5 bg-white/[0.01] px-3 py-1.5 rounded-full">
          <ShieldCheck className="h-4 w-4 text-violet-400" />
          <span>Gemini Verified Athlete Program</span>
        </div>
      </div>

      {/* Hero Header */}
      <GlassCard spotlightColor="rgba(139, 92, 246, 0.1)" className="p-6 md:p-8 bg-white/[0.01] border-white/5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <GlassBadge variant="violet" className="font-bold text-[10px]">
                Week {currentPlan.week_number || 1}
              </GlassBadge>
              <span className="text-[10px] text-white/40 font-bold flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-violet-400" />
                7-Day Activity Blueprint
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
              <BlurText text={currentPlan.plan_name} />
            </h1>
            <p className="text-xs text-white/40 capitalize leading-relaxed">
              Goal: {GOAL_LABELS[currentPlan.goal] || currentPlan.goal.replace(/_/g, " ")} • Programmed for {currentPlan.duration_weeks} weeks duration.
            </p>
          </div>

          {isLatestWeek && (
            <div className="shrink-0">
              <button onClick={handleGenerateNextWeek} disabled={nextWeekLoading} className="inline-block">
                <StarBorder color="#8B5CF6" speed="3.5s" className="text-xs font-bold">
                  {nextWeekLoading ? (
                    <div className="flex items-center justify-center gap-2 px-1">
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Generating Week {(currentPlan.week_number || 1) + 1}...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 px-1">
                      <Zap className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                      <span>Generate Week {(currentPlan.week_number || 1) + 1}</span>
                    </div>
                  )}
                </StarBorder>
              </button>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Week Navigation Tabs */}
      {currentPlan.weeks && currentPlan.weeks.length > 1 && (
        <div className="flex flex-wrap gap-2 border-b border-white/[0.06] pb-4">
          {currentPlan.weeks.map((w) => (
            <Link
              key={w.id}
              href={`/plans/${w.id}`}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                currentPlan.id === w.id
                  ? "bg-violet-500 border-transparent text-white shadow-md"
                  : "bg-white/[0.01] border-white/5 text-white/60 hover:bg-white/[0.02]"
              }`}
            >
              Week {w.week_number}
            </Link>
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main split grid */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Day navigator & macro stats */}
        <div className="lg:col-span-3 space-y-6">
          <GlassCard className="p-4 bg-white/[0.01] border-white/5 space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40">Weekly Schedule</h3>
            <div className="grid grid-cols-4 gap-1.5 lg:grid-cols-1 lg:gap-2">
              {dailyPlans.map((dp) => {
                const isDPWorkout = dp.exercises && dp.exercises.length > 0;
                return (
                  <button
                    key={dp.day}
                    onClick={() => {
                      setActiveDay(dp.day);
                      // Switch tabs to relevant active tab if clicking day
                      if (dp.exercises && dp.exercises.length > 0) {
                        setActiveTab("exercises");
                      } else if (dp.meals && dp.meals.length > 0) {
                        setActiveTab("diet");
                      } else if (dp.yoga_routine && dp.yoga_routine.length > 0) {
                        setActiveTab("yoga");
                      }
                    }}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-bold border transition-all ${
                      activeDay === dp.day
                        ? "bg-violet-500 border-transparent text-white shadow-md"
                        : "bg-transparent border-transparent text-white/60 hover:bg-white/[0.02]"
                    }`}
                  >
                    <span>Day {dp.day}</span>
                    <span className={`hidden lg:inline-flex rounded px-1.5 py-0.5 text-[9px] font-bold ${
                      isDPWorkout 
                        ? (activeDay === dp.day ? "bg-white/20 text-white" : "bg-violet-500/10 text-violet-400 border border-violet-500/20")
                        : (activeDay === dp.day ? "bg-white/10 text-white/80" : "bg-white/[0.02] text-white/30 border border-white/5")
                    }`}>
                      {isDPWorkout ? "Workout" : "Rest"}
                    </span>
                  </button>
                );
              })}
            </div>
          </GlassCard>

          {/* Daily macros card */}
          {hasMeals && (
            <GlassCard className="p-4 bg-white/[0.01] border-white/5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40">Day {activeDay} Nutrition</h3>
                <span className="text-xs text-violet-400 font-extrabold">{totalCalories} kcal</span>
              </div>
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] text-white/40 mb-1">
                    <span>Protein</span>
                    <span className="font-semibold text-white/80">{Math.round(totalProtein)}g / {targetProtein}g</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min(100, (totalProtein / targetProtein) * 100)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-white/40 mb-1">
                    <span>Carbs</span>
                    <span className="font-semibold text-white/80">{Math.round(totalCarbs)}g / {targetCarbs}g</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${Math.min(100, (totalCarbs / targetCarbs) * 100)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-white/40 mb-1">
                    <span>Fats</span>
                    <span className="font-semibold text-white/80">{Math.round(totalFats)}g / {targetFats}g</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min(100, (totalFats / targetFats) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right Detail Panel */}
        <div className="lg:col-span-9 space-y-6">
          {/* Day Focus Bar */}
          <GlassCard className="p-4 bg-white/[0.01] border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider">Day 0{activeDay} Focus</span>
              <h2 className="text-base font-extrabold text-white">{activeDayPlan.focus}</h2>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-white/5 bg-white/[0.02] text-[10px] font-bold text-white/60">
              <Zap className="h-3.5 w-3.5 text-violet-400 animate-pulse" />
              <span>{hasWorkouts ? "Active training day" : "Muscular regeneration"}</span>
            </div>
          </GlassCard>

          {/* Module Selector tabs */}
          <div className="flex border-b border-white/[0.06] pb-0.5 gap-4">
            <button
              onClick={() => setActiveTab("exercises")}
              className={`pb-2.5 text-xs font-bold relative transition-colors ${
                activeTab === "exercises" ? "text-violet-400" : "text-white/40 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Dumbbell className="h-3.5 w-3.5" /> Workouts
              </span>
              {activeTab === "exercises" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("diet")}
              className={`pb-2.5 text-xs font-bold relative transition-colors ${
                activeTab === "diet" ? "text-violet-400" : "text-white/40 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Salad className="h-3.5 w-3.5" /> Nutrition Diet
              </span>
              {activeTab === "diet" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-full" />
              )}
            </button>
            {hasYoga && (
              <button
                onClick={() => setActiveTab("yoga")}
                className={`pb-2.5 text-xs font-bold relative transition-colors ${
                  activeTab === "yoga" ? "text-violet-400" : "text-white/40 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5" /> Yoga & Flow
                </span>
                {activeTab === "yoga" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-full" />
                )}
              </button>
            )}
          </div>

          {/* Tab Content Panels */}
          <div>
            {activeTab === "exercises" && (
              <div className="space-y-4">
                {!hasWorkouts ? (
                  <GlassCard className="p-8 text-center flex flex-col items-center justify-center space-y-3 bg-white/[0.01] border-white/5 min-h-[220px]">
                    <div className="p-3 rounded-full bg-white/[0.02] border border-white/5 text-violet-400">
                      <Heart className="h-6 w-6 animate-pulse" />
                    </div>
                    <h3 className="font-extrabold text-sm text-white">Active Recovery Day</h3>
                    <p className="text-xs text-white/40 max-w-xs leading-relaxed">
                      No heavy lifting scheduled today. Focus on flexibility, stretching, and nutritional recovery to heal muscle micro-tears.
                    </p>
                  </GlassCard>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {activeDayPlan.exercises.map((ex: any, idx: number) => (
                      <GlassCard key={idx} className="p-4 bg-white/[0.01] border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-sm text-white">{ex.name}</h4>
                          <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-lg">
                            {ex.sets} × {ex.reps}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-white/45">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-violet-400" /> Rest: {ex.rest_seconds}s
                          </span>
                          {ex.focus_area && <span className="uppercase bg-white/[0.03] px-1.5 py-0.5 rounded text-[8px] font-bold text-white/60">Target: {ex.focus_area}</span>}
                        </div>
                        {ex.instruction && (
                          <p className="text-xs text-white/50 leading-relaxed border-t border-white/[0.04] pt-2">
                            <span className="font-bold text-white/65">Instructions:</span> {ex.instruction}
                          </p>
                        )}
                        {ex.notes && (
                          <div className="text-xs text-violet-300 bg-violet-500/5 p-2 rounded-lg border border-violet-500/10 leading-relaxed">
                            <span className="font-bold text-violet-400">Coach Note:</span> {ex.notes}
                          </div>
                        )}
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "diet" && (
              <div className="space-y-4">
                {!hasMeals ? (
                  <GlassCard className="p-8 text-center flex flex-col items-center justify-center space-y-3 bg-white/[0.01] border-white/5 min-h-[220px]">
                    <div className="p-3 rounded-full bg-white/[0.02] border border-white/5 text-violet-400">
                      <Salad className="h-6 w-6" />
                    </div>
                    <h3 className="font-extrabold text-sm text-white">No Meal Plan Specified</h3>
                    <p className="text-xs text-white/40 max-w-xs leading-relaxed">
                      Meal planning is not generated for this rest day. Maintain a clean, whole-foods diet.
                    </p>
                  </GlassCard>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {activeDayPlan.meals.map((m: any, idx: number) => (
                      <GlassCard key={idx} className="p-4 bg-white/[0.01] border-white/5 space-y-3.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-lg">
                            {m.meal_type}
                          </span>
                          <span className="text-xs font-extrabold text-white/60">{m.calories} kcal</span>
                        </div>
                        <h4 className="font-extrabold text-sm text-white leading-tight">{m.name}</h4>
                        <div className="flex gap-3 text-[10px] text-white/40">
                          <div>P: <span className="font-bold text-white/65">{m.protein_g}g</span></div>
                          <div>C: <span className="font-bold text-white/65">{m.carbs_g}g</span></div>
                          <div>F: <span className="font-bold text-white/65">{m.fats_g}g</span></div>
                        </div>
                        {m.ingredients && m.ingredients.length > 0 && (
                          <p className="text-xs text-white/45 leading-relaxed">
                            <span className="font-bold text-white/65">Ingredients:</span> {m.ingredients.join(", ")}
                          </p>
                        )}
                        {m.instructions && (
                          <div className="text-xs text-white/50 bg-[#07070d]/30 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                            <span className="font-bold text-white/60">Preparation:</span> {m.instructions}
                          </div>
                        )}
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "yoga" && (
              <div className="space-y-4">
                {!hasYoga ? (
                  <GlassCard className="p-8 text-center flex flex-col items-center justify-center space-y-3 bg-white/[0.01] border-white/5 min-h-[220px]">
                    <div className="p-3 rounded-full bg-white/[0.02] border border-white/5 text-violet-400">
                      <Heart className="h-6 w-6" />
                    </div>
                    <h3 className="font-extrabold text-sm text-white">No Yoga Scheduled</h3>
                    <p className="text-xs text-white/40 max-w-xs leading-relaxed">
                      No traditional breathing or flexibility routine is scheduled for today.
                    </p>
                  </GlassCard>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {activeDayPlan.yoga_routine.map((y: any, idx: number) => (
                      <GlassCard key={idx} className="p-4 bg-white/[0.01] border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-sm text-white">{y.name}</h4>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded-lg">
                            {y.difficulty}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-white/45">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-pink-400" /> Duration: {Math.round(y.duration_seconds / 60)} mins
                          </span>
                        </div>
                        {y.instruction && (
                          <p className="text-xs text-white/50 leading-relaxed border-t border-white/[0.04] pt-2">
                            <span className="font-bold text-white/65">Steps:</span> {y.instruction}
                          </p>
                        )}
                        {y.benefits && (
                          <div className="text-xs text-pink-300 bg-pink-500/5 p-2 rounded-lg border border-pink-500/10 leading-relaxed">
                            <span className="font-bold text-pink-405">Benefits:</span> {y.benefits}
                          </div>
                        )}
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
