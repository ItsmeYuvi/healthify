"use client";
import React, { useEffect, useState } from "react";
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
      <div className="glass-surface p-6 flex flex-col justify-center items-center h-[280px]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
      </div>
    );
  }

  return (
    <div className="glass-surface p-6 flex flex-col justify-between h-full space-y-6">
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-luxury-gold flex items-center gap-2">
          <Scale className="h-4 w-4 text-luxury-gold" />
          Today's Audit
        </h3>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
            <p className="text-xs text-[#7A9BB5] max-w-[200px]">You haven't logged any active sessions or nutrition entries today.</p>
            <div className="flex gap-2">
              <Link href="/log/workout">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-3 py-1.5 rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all cursor-pointer">
                  <PlusCircle className="h-3 w-3" /> Log active
                </span>
              </Link>
              <Link href="/log/meal">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-3 py-1.5 rounded-lg bg-transparent text-white border border-accent/20 hover:bg-accent/10 transition-all cursor-pointer">
                  <PlusCircle className="h-3 w-3" /> Log diet
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-2xl border border-[#00D4FF]/10 bg-white/[0.01]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg border ${
                      item.type === "workout"
                        ? "text-accent border-accent/20 bg-accent/10"
                        : item.type === "meal"
                        ? "text-white/60 border-[#00D4FF]/15 bg-white/5"
                        : "text-white/40 border-[#00D4FF]/10 bg-white/[0.02]"
                    }`}
                  >
                    {item.type === "workout" && <Dumbbell className="h-4 w-4" />}
                    {item.type === "meal" && <Utensils className="h-4 w-4" />}
                    {item.type === "weight" && <Scale className="h-4 w-4" />}
                  </div>
                  <div>
                    <h4 className="font-serif text-xs text-white font-medium">{item.title}</h4>
                    <p className="text-[10px] text-[#7A9BB5] mt-0.5 leading-snug">{item.subtitle}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-white/30">{item.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TodaySummary;
