"use client";
import React, { useEffect, useState } from "react";
import { GlassCard } from "../ui/GlassCard";
import { BarChart3 } from "lucide-react";

interface ChartDataPoint {
  label: string;
  workouts: number;
  calories: number;
  workoutHeight: number;
  calorieHeight: number;
}

export function WeeklyChart() {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [activeTab, setActiveTab] = useState<"calories" | "workouts">("calories");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    let username = "default";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload && payload.sub) username = payload.sub;
    } catch (e) {}

    const days: ChartDataPoint[] = [];
    const workoutsKey = `healthify_workout_logs_${username}`;
    const loggedWorkouts = JSON.parse(localStorage.getItem(workoutsKey) || "[]");

    const mealsKey = `healthify_meal_logs_${username}`;
    const loggedMeals = JSON.parse(localStorage.getItem(mealsKey) || "[]");

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();

      const workoutsCount = loggedWorkouts.filter(
        (w: any) => new Date(w.date).toDateString() === dateStr
      ).length;

      const dailyCal = loggedMeals
        .filter((m: any) => new Date(m.date).toDateString() === dateStr)
        .reduce((sum: number, m: any) => sum + (m.calories || 0), 0);

      const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });

      days.push({
        label: dayLabel,
        workouts: workoutsCount,
        calories: dailyCal,
        workoutHeight: 0,
        calorieHeight: 0,
      });
    }

    const maxCal = Math.max(...days.map((d) => d.calories), 2000);
    const maxWorkouts = Math.max(...days.map((d) => d.workouts), 3);

    const scaledDays = days.map((day) => ({
      ...day,
      calorieHeight: Math.min(Math.round((day.calories / maxCal) * 100), 100),
      workoutHeight: Math.min(Math.round((day.workouts / maxWorkouts) * 100), 100),
    }));

    setData(scaledDays);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <GlassCard className="p-6 bg-zinc-50/50 dark:bg-white/[0.01] border-zinc-200 dark:border-white/5 flex flex-col justify-center items-center h-[260px]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500/20 border-t-violet-500" />
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 bg-zinc-50/50 dark:bg-white/[0.01] border-zinc-200 dark:border-white/5 flex flex-col h-full justify-between">
      <div className="space-y-6">
        {/* Header and Toggles */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-white/40 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-teal-500 dark:text-teal-400" />
            Weekly Progress
          </h3>
          <div className="flex bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab("calories")}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors ${
                activeTab === "calories"
                  ? "bg-teal-650 dark:bg-teal-500 text-white shadow-sm"
                  : "text-zinc-500 dark:text-white/60 hover:text-zinc-800 dark:hover:text-white"
              }`}
            >
              Calories
            </button>
            <button
              onClick={() => setActiveTab("workouts")}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors ${
                activeTab === "workouts"
                  ? "bg-violet-650 dark:bg-violet-500 text-white shadow-sm"
                  : "text-zinc-500 dark:text-white/60 hover:text-zinc-800 dark:hover:text-white"
              }`}
            >
              Workouts
            </button>
          </div>
        </div>

        {/* Chart body */}
        <div className="relative pt-4">
          <div className="flex items-end justify-between h-[120px] gap-2">
            {data.map((day, idx) => {
              const activeVal = activeTab === "calories" ? day.calories : day.workouts;
              const activeHeight = activeTab === "calories" ? day.calorieHeight : day.workoutHeight;
              const barColor = activeTab === "calories" ? "bg-teal-500/30 border-teal-500/50 hover:bg-teal-500/50" : "bg-violet-500/30 border-violet-500/50 hover:bg-violet-500/50";
              const glowColor = activeTab === "calories" ? "rgba(20, 184, 166, 0.2)" : "rgba(139, 92, 246, 0.2)";

              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-[105%] bg-white dark:bg-[#12121a] border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-white text-[9px] font-bold py-1 px-2 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-xl">
                    {activeVal} {activeTab === "calories" ? "kcal" : "workout(s)"}
                  </div>

                  {/* Glassmorphic Bar */}
                  <div
                    style={{ height: `${Math.max(activeHeight, 8)}%` }}
                    className={`w-full rounded-t-lg border-t border-x transition-all duration-300 relative ${barColor}`}
                  >
                    {/* Glow effect on hover */}
                    <div
                      className="absolute inset-0 rounded-t-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                      style={{ boxShadow: `0 0 12px ${glowColor}` }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-405 dark:text-white/30 font-bold mt-2">{day.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default WeeklyChart;
