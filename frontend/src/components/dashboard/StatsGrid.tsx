"use client";
import React, { useEffect, useState } from "react";
import { Flame, Sparkles, Trophy, Award, Heart } from "lucide-react";

interface StatsGridProps {
  plansCount: number;
}

export function StatsGrid({ plansCount }: StatsGridProps) {
  const [stats, setStats] = useState({
    streak: 0,
    workouts: 0,
    calories: 0,
  });

  const [vitalityScore, setVitalityScore] = useState(45);
  const [conciergeMsg, setConciergeMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    let username = "default";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload && payload.sub) username = payload.sub;
    } catch (e) {}

    // Fetch stats
    const workoutsKey = `healthify_workout_logs_${username}`;
    const loggedWorkouts = JSON.parse(localStorage.getItem(workoutsKey) || "[]");
    const totalWorkouts = loggedWorkouts.length;

    const mealsKey = `healthify_meal_logs_${username}`;
    const loggedMeals = JSON.parse(localStorage.getItem(mealsKey) || "[]");
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyCalories = loggedMeals
      .filter((m: any) => new Date(m.date) >= oneWeekAgo)
      .reduce((sum: number, m: any) => sum + (m.calories || 0), 0);

    const streakKey = `healthify_streaks_${username}`;
    const currentStreak = Number(localStorage.getItem(streakKey) || "0");

    setStats({
      streak: currentStreak,
      workouts: totalWorkouts,
      calories: weeklyCalories,
    });

    // Calculate executive vitality score (0-100)
    let score = 45;
    score += Math.min(25, currentStreak * 5);
    score += Math.min(20, totalWorkouts * 8);
    score += weeklyCalories > 0 ? 10 : 0;
    score += plansCount > 0 ? 10 : 0;
    const finalScore = Math.min(100, score);
    setVitalityScore(finalScore);

    // Formulate concierge advisory
    let msg = "";
    if (finalScore >= 85) {
      msg = "Exceptional momentum. Your current metabolic efficiency and consistency indexes are optimal. Today, the concierge recommends focused active recovery: a 20-minute slow stretching sequence paired with organic chamomile and lemon infusion.";
    } else if (currentStreak > 0 && totalWorkouts === 0) {
      msg = "Streak preserved. Your movement consistency is excellent, but training density remains light. We suggest activating one of your AI Blueprints today with a 30-minute endurance routine to stimulate aerobic conditioning.";
    } else if (weeklyCalories === 0) {
      msg = "Diagnostics complete. Your energy intake record is currently empty. To support cellular repair and muscle recovery, we advise recording an executive meal containing lean proteins and anti-inflammatory greens.";
    } else {
      msg = "Good morning. Biometrics indicate ready states for moderate activity. We suggest targeting 300 active kcal today and logging a high-quality hydration count to maximize focus and physical stamina.";
    }
    setConciergeMsg(msg);

  }, [plansCount]);

  // Circular ring variables
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (vitalityScore / 100) * circumference;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* ── BENTO 1: VITALITY SCORE (col-span-2) ── */}
      <div className="glass-surface lg:col-span-2 flex flex-col md:flex-row items-center justify-between gap-8 p-8 rounded-3xl relative overflow-hidden">
        <div className="space-y-4 max-w-md text-left z-10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-luxury-gold font-semibold">
            <Award className="h-4 w-4" /> Executive Biometrics
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-white leading-tight">
            Holistic <span className="italic text-luxury-gold">Vitality Index</span>
          </h2>
          <p className="text-sm text-[#7A9BB5] leading-relaxed">
            A single, comprehensive score of your metabolic compliance, active streaks, training consistency, and diet balance.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-[#00D4FF]/10">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider text-white/30 block">Active Streak</span>
              <span className="text-sm font-semibold text-white flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-accent fill-accent/10" /> {stats.streak} days
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider text-white/30 block">Workouts</span>
              <span className="text-sm font-semibold text-white">
                {stats.workouts} logged
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider text-white/30 block">Active Blueprints</span>
              <span className="text-sm font-semibold text-white">
                {plansCount} plans
              </span>
            </div>
          </div>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative shrink-0 flex items-center justify-center h-40 w-40 z-10">
          <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-white/[0.02]"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-accent transition-all duration-1000 ease-out"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-serif text-white font-light">{vitalityScore}</span>
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-medium mt-0.5">Index</span>
          </div>
        </div>
      </div>

      {/* ── BENTO 2: AI CONCIERGE (col-span-1) ── */}
      <div className="glass-surface p-8 rounded-3xl flex flex-col justify-between space-y-6 relative overflow-hidden">
        {/* Ambient warm glow in background */}
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <div className="space-y-3 z-10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-luxury-gold font-semibold">
            <Sparkles className="h-4 w-4" /> AI Concierge
          </div>
          <h3 className="text-xl font-serif text-white">Bespoke Wellness Advisory</h3>
        </div>

        <p className="text-xs text-white/70 leading-relaxed italic font-light z-10 border-l border-accent/30 pl-4 py-1">
          "{conciergeMsg}"
        </p>

        <div className="text-[10px] text-white/30 uppercase tracking-widest pt-2 border-t border-[#00D4FF]/10 z-10">
          Concierge Signature • Active Support
        </div>
      </div>
    </div>
  );
}
export default StatsGrid;
