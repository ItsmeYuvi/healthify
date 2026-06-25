"use client";
import React, { useEffect, useState } from "react";
import { StatCard } from "./StatCard";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";

interface StatsGridProps {
  plansCount: number;
}

export function StatsGrid({ plansCount }: StatsGridProps) {
  const [stats, setStats] = useState({
    streak: 0,
    workouts: 0,
    calories: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    let username = "default";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload && payload.sub) username = payload.sub;
    } catch (e) {}

    // 1. Fetch total workouts logged in localStorage
    const workoutsKey = `healthify_workout_logs_${username}`;
    const loggedWorkouts = JSON.parse(localStorage.getItem(workoutsKey) || "[]");
    const totalWorkouts = loggedWorkouts.length;

    // 2. Fetch calories logged this week
    const mealsKey = `healthify_meal_logs_${username}`;
    const loggedMeals = JSON.parse(localStorage.getItem(mealsKey) || "[]");
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyCalories = loggedMeals
      .filter((m: any) => new Date(m.date) >= oneWeekAgo)
      .reduce((sum: number, m: any) => sum + (m.calories || 0), 0);

    // 3. Fetch streak
    const streakKey = `healthify_streaks_${username}`;
    const currentStreak = Number(localStorage.getItem(streakKey) || "0");

    setStats({
      streak: currentStreak,
      workouts: totalWorkouts,
      calories: weeklyCalories,
    });
  }, [plansCount]);

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      <StatCard
        title="Current Streak"
        value={stats.streak}
        suffix=" days"
        iconName="Flame"
        color="rose"
        subtext="Keep active daily"
      />
      <StatCard
        title="Total Workouts"
        value={stats.workouts}
        suffix=" sessions"
        iconName="Dumbbell"
        color="violet"
        subtext="Logged workouts history"
      />
      <StatCard
        title="Calories (Week)"
        value={stats.calories}
        suffix=" kcal"
        iconName="Utensils"
        color="teal"
        subtext="Nutrition intake this week"
      />
      <StatCard
        title="Active Plans"
        value={plansCount}
        suffix=" plans"
        iconName="ClipboardList"
        color="amber"
        subtext="Your customized blueprints"
      />
    </div>
  );
}
export default StatsGrid;
