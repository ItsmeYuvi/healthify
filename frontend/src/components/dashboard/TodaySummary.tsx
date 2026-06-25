"use client";
import React, { useEffect, useState } from "react";
import { GlassCard } from "../ui/GlassCard";
import { GlassBadge } from "../ui/GlassBadge";
import { Dumbbell, Utensils, Scale, PlusCircle } from "lucide-react";
import Link from "next/link";

interface LoggedItem {
  id: string;
  type: "workout" | "meal" | "weight";
  title: string;
  subtitle: string;
  value?: string | number;
  time: string;
}

export function TodaySummary() {
  const [items, setItems] = useState<LoggedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    let username = "default";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload && payload.sub) username = payload.sub;
    } catch (e) {}

    const todayStr = new Date().toDateString();

    // Fetch workouts
    const workoutsKey = `healthify_workout_logs_${username}`;
    const loggedWorkouts = JSON.parse(localStorage.getItem(workoutsKey) || "[]");
    const todayWorkouts = loggedWorkouts.filter(
      (w: any) => new Date(w.date).toDateString() === todayStr
    );

    // Fetch meals
    const mealsKey = `healthify_meal_logs_${username}`;
    const loggedMeals = JSON.parse(localStorage.getItem(mealsKey) || "[]");
    const todayMeals = loggedMeals.filter(
      (m: any) => new Date(m.date).toDateString() === todayStr
    );

    // Fetch weight logs
    const weightKey = `healthify_weight_logs_${username}`;
    const loggedWeights = JSON.parse(localStorage.getItem(weightKey) || "[]");
    const todayWeights = loggedWeights.filter(
      (w: any) => new Date(w.date || w.timestamp).toDateString() === todayStr
    );

    // Map logs to LoggedItem structure
    const mapped: LoggedItem[] = [];

    todayWorkouts.forEach((w: any) => {
      mapped.push({
        id: w.id || `w-${w.date}`,
        type: "workout",
        title: w.name || "Workout Session",
        subtitle: `${w.exercises?.length || 0} exercises`,
        time: new Date(w.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    });

    todayMeals.forEach((m: any) => {
      mapped.push({
        id: m.id || `m-${m.date}`,
        type: "meal",
        title: m.name || "Meal",
        subtitle: `${m.calories || 0} kcal`,
        time: new Date(m.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    });

    todayWeights.forEach((w: any) => {
      mapped.push({
        id: w.id || `wt-${w.date || w.timestamp}`,
        type: "weight",
        title: "Weight Checked",
        subtitle: `${w.weight || 0} kg`,
        time: new Date(w.date || w.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    });

    setItems(mapped.sort((a, b) => b.time.localeCompare(a.time)));
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <GlassCard className="p-6 bg-white/[0.01] border-white/5 flex flex-col justify-center items-center h-[260px]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 bg-white/[0.01] border-white/5 flex flex-col h-full justify-between">
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white/40 flex items-center gap-2">
          <Scale className="h-4 w-4 text-pink-400" />
          Today's Activity
        </h3>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
            <p className="text-xs text-white/40 max-w-[200px]">You haven't logged any workouts, meals, or weight logs today.</p>
            <div className="flex gap-2">
              <Link href="/log/workout">
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/30 transition-colors cursor-pointer">
                  <PlusCircle className="h-3.5 w-3.5" /> Log Workout
                </span>
              </Link>
              <Link href="/log/meal">
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 hover:bg-teal-500/30 transition-colors cursor-pointer">
                  <PlusCircle className="h-3.5 w-3.5" /> Log Meal
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.01]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg border ${
                      item.type === "workout"
                        ? "text-violet-400 border-violet-500/20 bg-violet-500/10"
                        : item.type === "meal"
                        ? "text-teal-400 border-teal-500/20 bg-teal-500/10"
                        : "text-pink-400 border-pink-500/20 bg-pink-500/10"
                    }`}
                  >
                    {item.type === "workout" && <Dumbbell className="h-4 w-4" />}
                    {item.type === "meal" && <Utensils className="h-4 w-4" />}
                    {item.type === "weight" && <Scale className="h-4 w-4" />}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-white">{item.title}</h4>
                    <p className="text-[10px] text-white/40 mt-0.5 leading-snug">{item.subtitle}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-white/30">{item.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
}

export default TodaySummary;
