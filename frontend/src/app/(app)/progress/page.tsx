"use client";
import React, { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { ShinyText } from "@/components/reactbits/text-animations/ShinyText";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { Scale, Flame, Calendar, Trash2, LineChart, ShieldAlert, ArrowLeft, Droplet, Plus, Heart, UserCheck } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";

interface WeightLog {
  id: string;
  weight: number;
  date: string;
}

export default function ProgressTrackerPage() {
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [streak, setStreak] = useState(0);
  const [username, setUsername] = useState("default");
  const [error, setError] = useState("");
  
  // New metrics states
  const [profile, setProfile] = useState<any>(null);
  const [todayCalories, setTodayCalories] = useState(0);
  const [waterIntake, setWaterIntake] = useState(0); // in ml

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    let user = "default";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload && payload.sub) user = payload.sub;
    } catch (e) {}
    setUsername(user);

    const headers = { Authorization: `Bearer ${token}` };

    // 1. Fetch user metrics profile
    axios
      .get(`${API_BASE_URL}/api/v1/plans/profile`, { headers })
      .then((res) => setProfile(res.data))
      .catch(() => {});

    // 2. Fetch weight logs
    const weightKey = `healthify_weight_logs_${user}`;
    const storedLogs = JSON.parse(localStorage.getItem(weightKey) || "[]");
    const sorted = storedLogs.sort(
      (a: WeightLog, b: WeightLog) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setLogs(sorted);

    // 3. Fetch streak
    const streakKey = `healthify_streaks_${user}`;
    setStreak(Number(localStorage.getItem(streakKey) || "0"));

    // 4. Fetch calories logged today
    const todayStr = new Date().toDateString();
    const mealsKey = `healthify_meal_logs_${user}`;
    const loggedMeals = JSON.parse(localStorage.getItem(mealsKey) || "[]");
    const todayCal = loggedMeals
      .filter((m: any) => new Date(m.date).toDateString() === todayStr)
      .reduce((sum: number, m: any) => sum + (m.calories || 0), 0);
    setTodayCalories(todayCal);

    // 5. Fetch water logs today
    const waterKey = `healthify_water_logs_${user}`;
    const waterData = JSON.parse(localStorage.getItem(waterKey) || '{"date":"","amount":0}');
    if (waterData.date === todayStr) {
      setWaterIntake(waterData.amount);
    } else {
      // Reset water intake for a new day
      localStorage.setItem(waterKey, JSON.stringify({ date: todayStr, amount: 0 }));
      setWaterIntake(0);
    }
  }, []);

  const handleLogWeight = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!weight || Number(weight) <= 0 || Number(weight) > 500) {
      setError("Please enter a valid weight in kg.");
      return;
    }

    const weightKey = `healthify_weight_logs_${username}`;
    const stored = JSON.parse(localStorage.getItem(weightKey) || "[]");

    const newLog: WeightLog = {
      id: Math.random().toString(36).substring(2, 9),
      weight: Number(weight),
      date: new Date(date).toISOString(),
    };

    const updated = [...stored, newLog].sort(
      (a: WeightLog, b: WeightLog) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    localStorage.setItem(weightKey, JSON.stringify(updated));
    setLogs(updated);
    setWeight("");
  };

  const handleDeleteLog = (id: string) => {
    const weightKey = `healthify_weight_logs_${username}`;
    const updated = logs.filter((l) => l.id !== id);
    localStorage.setItem(weightKey, JSON.stringify(updated));
    setLogs(updated);
  };

  const handleWaterUpdate = (amount: number) => {
    const newAmount = Math.max(0, waterIntake + amount);
    setWaterIntake(newAmount);

    const todayStr = new Date().toDateString();
    const waterKey = `healthify_water_logs_${username}`;
    localStorage.setItem(waterKey, JSON.stringify({ date: todayStr, amount: newAmount }));
  };

  // Graph calculations
  const maxWeight = logs.length > 0 ? Math.max(...logs.map((l) => l.weight)) : 100;
  const minWeight = logs.length > 0 ? Math.min(...logs.map((l) => l.weight)) : 50;
  const weightRange = maxWeight - minWeight === 0 ? 10 : maxWeight - minWeight;

  // BMI calculations
  let bmi = 0;
  let bmiCategory = "Unknown";
  let bmiColor = "text-zinc-500";
  let bmiBadge = "secondary" as any;
  let idealWeightMin = 0;
  let idealWeightMax = 0;

  const currentWeight = logs.length > 0 ? logs[logs.length - 1].weight : (profile?.weight_kg || 0);
  const currentHeight = profile?.height_cm || 0;

  if (currentHeight > 0 && currentWeight > 0) {
    const heightM = currentHeight / 100;
    bmi = currentWeight / (heightM * heightM);
    idealWeightMin = 18.5 * heightM * heightM;
    idealWeightMax = 24.9 * heightM * heightM;

    if (bmi < 18.5) {
      bmiCategory = "Underweight";
      bmiColor = "text-amber-500";
      bmiBadge = "warning";
    } else if (bmi < 25) {
      bmiCategory = "Normal Weight";
      bmiColor = "text-teal-500";
      bmiBadge = "teal";
    } else if (bmi < 30) {
      bmiCategory = "Overweight";
      bmiColor = "text-orange-500";
      bmiBadge = "warning";
    } else {
      bmiCategory = "Obese";
      bmiColor = "text-red-500";
      bmiBadge = "danger";
    }
  }

  // TDEE/BMR calculations
  let bmr = 0;
  let tdee = 0;
  let targetCalories = 2000;

  if (profile) {
    const w = currentWeight || profile.weight_kg;
    const h = profile.height_cm;
    const a = profile.age;
    const isMale = profile.gender === "male";

    // Mifflin-St Jeor Formula
    if (isMale) {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      super_active: 1.9,
    };

    const multiplier = activityMultipliers[profile.activity_level] || 1.2;
    tdee = bmr * multiplier;

    if (profile.goal === "fat_loss") {
      targetCalories = tdee - 500;
    } else if (profile.goal === "weight_gain") {
      targetCalories = tdee + 300;
    } else if (profile.goal === "muscle_build") {
      targetCalories = tdee + 250;
    } else {
      targetCalories = tdee;
    }
    targetCalories = Math.round(targetCalories);
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-zinc-500 dark:text-white/50 hover:text-zinc-800 dark:hover:text-white transition-colors text-xs font-bold group mb-2">
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Progress & <ShinyText text="Biometrics" />
        </h1>
        <p className="text-xs text-zinc-500 dark:text-white/40">Enhanced tracking for weight logs, calorie targets, BMI, and hydration.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid Widgets */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Weight Card */}
        <GlassCard spotlightColor="rgba(236, 72, 153, 0.12)" className="p-5 bg-white/[0.01] border-zinc-200 dark:border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-550 dark:text-white/40">Latest Weight</h3>
            <div className="p-2.5 rounded-xl border border-pink-500/20 bg-pink-500/10 text-pink-500">
              <Scale className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-zinc-800 dark:text-white flex items-baseline gap-0.5">
              <span>{currentWeight || "--"}</span>
              <span className="text-xs font-bold text-zinc-500 dark:text-white/55">kg</span>
            </div>
            <p className="text-[9px] text-zinc-450 dark:text-white/30 font-semibold mt-1">
              {logs.length > 0
                ? `Updated ${new Date(logs[logs.length - 1].date).toLocaleDateString()}`
                : "Profile baseline metric"}
            </p>
          </div>
        </GlassCard>

        {/* Streak Card */}
        <GlassCard spotlightColor="rgba(249, 115, 22, 0.12)" className="p-5 bg-white/[0.01] border-zinc-200 dark:border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-550 dark:text-white/40">Current Streak</h3>
            <div className="p-2.5 rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-500">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-zinc-800 dark:text-white flex items-baseline gap-0.5">
              <span>{streak}</span>
              <span className="text-xs font-bold text-zinc-500 dark:text-white/55">days</span>
            </div>
            <p className="text-[9px] text-zinc-450 dark:text-white/30 font-semibold mt-1">Keep logging daily to lock in streak</p>
          </div>
        </GlassCard>

        {/* BMI Card */}
        <GlassCard spotlightColor="rgba(20, 184, 166, 0.12)" className="p-5 bg-white/[0.01] border-zinc-200 dark:border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-550 dark:text-white/40">Active BMI</h3>
            <div className="p-2.5 rounded-xl border border-teal-500/20 bg-teal-500/10 text-teal-500">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-zinc-800 dark:text-white flex items-baseline gap-1">
              <span>{bmi > 0 ? bmi.toFixed(1) : "--"}</span>
              {bmi > 0 && (
                <GlassBadge variant={bmiBadge} className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ml-1">
                  {bmiCategory}
                </GlassBadge>
              )}
            </div>
            <p className="text-[9px] text-zinc-450 dark:text-white/30 font-semibold mt-1">
              {idealWeightMin > 0 ? `Ideal: ${idealWeightMin.toFixed(0)}-${idealWeightMax.toFixed(0)} kg` : "Enter height in Profile"}
            </p>
          </div>
        </GlassCard>

        {/* Target weight Delta */}
        <GlassCard spotlightColor="rgba(139, 92, 246, 0.12)" className="p-5 bg-white/[0.01] border-zinc-200 dark:border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-550 dark:text-white/40">Weight Delta</h3>
            <div className="p-2.5 rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-550 dark:text-violet-400">
              <LineChart className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-zinc-800 dark:text-white flex items-baseline gap-0.5">
              <span>
                {logs.length > 1
                  ? (logs[logs.length - 1].weight - logs[0].weight).toFixed(1)
                  : "0.0"}
              </span>
              <span className="text-xs font-bold text-zinc-500 dark:text-white/55">kg</span>
            </div>
            <p className="text-[9px] text-zinc-450 dark:text-white/30 font-semibold mt-1">Difference since first registered log</p>
          </div>
        </GlassCard>
      </div>

      {/* Expanded Progress Features Grid */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Calorie Budget Tracker */}
        <div className="md:col-span-6">
          <GlassCard spotlightColor="rgba(20, 184, 166, 0.1)" className="p-6 bg-white/[0.01] border-zinc-200 dark:border-white/5 h-full space-y-5 flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-white/40 flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-teal-500" /> Calorie Balance (Today)
              </h3>
              <p className="text-[10px] text-zinc-400 dark:text-white/40">Calculated dynamic metabolic budget based on goal: <span className="font-bold text-teal-500 dark:text-teal-400">{profile?.goal ? profile.goal.replace("_", " ") : "general health"}</span></p>
            </div>

            <div className="grid grid-cols-2 gap-6 items-center">
              {/* Circular tracking visual */}
              <div className="relative flex items-center justify-center">
                <div className="w-28 h-28 rounded-full border-[10px] border-zinc-100 dark:border-white/5 flex flex-col justify-center items-center">
                  <span className="text-xs text-zinc-400 dark:text-white/35 font-bold uppercase tracking-wide">Remaining</span>
                  <span className="text-lg font-extrabold text-zinc-800 dark:text-white">
                    {Math.max(0, targetCalories - todayCalories)}
                  </span>
                  <span className="text-[9px] text-teal-550 dark:text-teal-400 font-bold">kcal</span>
                </div>
              </div>
              
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between border-b border-zinc-150 dark:border-white/5 pb-1">
                  <span className="text-zinc-500 dark:text-white/45">Target Budget:</span>
                  <span className="font-extrabold text-zinc-800 dark:text-white">{targetCalories} kcal</span>
                </div>
                <div className="flex justify-between border-b border-zinc-150 dark:border-white/5 pb-1">
                  <span className="text-zinc-500 dark:text-white/45">Meals Logged:</span>
                  <span className="font-extrabold text-zinc-800 dark:text-white">{todayCalories} kcal</span>
                </div>
                <div className="flex justify-between border-b border-zinc-150 dark:border-white/5 pb-1">
                  <span className="text-zinc-500 dark:text-white/45">Calculated BMR:</span>
                  <span className="font-extrabold text-zinc-650 dark:text-white/70">{bmr ? bmr.toFixed(0) : "--"} kcal</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-violet-500 rounded-full" 
                  style={{ width: `${Math.min(100, (todayCalories / targetCalories) * 100)}%` }} 
                />
              </div>
              <div className="flex justify-between text-[9px] text-zinc-400 dark:text-white/30 font-bold uppercase">
                <span>0% Consumed</span>
                <span>{todayCalories >= targetCalories ? "Goal Reached!" : `${Math.round((todayCalories / targetCalories) * 100)}%`}</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Water Intake Tracker */}
        <div className="md:col-span-6">
          <GlassCard spotlightColor="rgba(59, 130, 246, 0.1)" className="p-6 bg-white/[0.01] border-zinc-200 dark:border-white/5 h-full space-y-5 flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-white/40 flex items-center gap-1.5">
                <Droplet className="h-4 w-4 text-blue-500" /> Hydration Tracker (Daily Goal)
              </h3>
              <p className="text-[10px] text-zinc-400 dark:text-white/40">Track your daily water consumption to support metabolic rate.</p>
            </div>

            <div className="flex items-center justify-between gap-6 py-1">
              <div className="flex flex-col items-center gap-1">
                <div className="text-3xl font-extrabold text-zinc-800 dark:text-white flex items-baseline gap-0.5">
                  <span>{(waterIntake / 1000).toFixed(2)}</span>
                  <span className="text-sm font-bold text-zinc-450 dark:text-white/50">L</span>
                </div>
                <span className="text-[9px] font-bold text-zinc-400 dark:text-white/30 uppercase">Target: 3.00L</span>
              </div>

              {/* Water logging actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleWaterUpdate(250)}
                  className="p-3 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.02] hover:bg-blue-500/10 dark:hover:bg-blue-500/20 text-zinc-800 dark:text-white flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  <Plus className="h-4 w-4 text-blue-500" />
                  <span className="text-[9px] font-bold">+250ml</span>
                </button>
                <button
                  onClick={() => handleWaterUpdate(500)}
                  className="p-3 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.02] hover:bg-blue-500/10 dark:hover:bg-blue-500/20 text-zinc-800 dark:text-white flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  <Plus className="h-4 w-4 text-blue-500" />
                  <span className="text-[9px] font-bold">+500ml</span>
                </button>
                <button
                  onClick={() => handleWaterUpdate(-250)}
                  className="px-2.5 py-3 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.02] hover:bg-red-500/10 text-zinc-450 hover:text-red-500 cursor-pointer transition-all active:scale-95"
                  title="Remove 250ml"
                >
                  <span className="text-[10px] font-extrabold">-250</span>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-white/10 overflow-hidden relative">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse" 
                  style={{ width: `${Math.min(100, (waterIntake / 3000) * 100)}%` }} 
                />
              </div>
              <div className="flex justify-between text-[9px] text-zinc-400 dark:text-white/30 font-bold uppercase">
                <span>0L</span>
                <span>{waterIntake >= 3000 ? "Fully Hydrated! 💧" : `${Math.round((waterIntake / 3000) * 100)}%`}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Weight History Charts & Checkin */}
      <div className="grid gap-6 md:grid-cols-12 items-start">
        {/* Weight timeline graph */}
        <div className="md:col-span-8">
          <GlassCard className="p-6 bg-white/[0.01] border-zinc-200 dark:border-white/5 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-white/40 flex items-center gap-1.5">
              <LineChart className="h-4 w-4 text-violet-550 dark:text-violet-400" /> Weight Timeline
            </h3>

            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-2.5">
                <div className="p-3 rounded-full bg-zinc-100 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 text-zinc-450 dark:text-white/20">
                  <LineChart className="h-6 w-6" />
                </div>
                <p className="text-xs text-zinc-500 dark:text-white/40 max-w-[200px]">Log your weight to see progress curves.</p>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {/* CSS Line graph bar segments */}
                <div className="relative h-48 border-b border-zinc-200 dark:border-white/[0.08] flex items-end justify-between px-4 pb-2 gap-4">
                  {logs.map((log) => {
                    const scaledHeight = ((log.weight - minWeight) / weightRange) * 80 + 10;
                    return (
                      <div key={log.id} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                        {/* Tooltip */}
                        <div className="absolute bottom-[105%] bg-white dark:bg-[#12121a] border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-white text-[9px] font-bold py-1 px-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-lg">
                          {log.weight} kg
                        </div>
                        {/* Dot indicator */}
                        <div
                          style={{ bottom: `${scaledHeight}%` }}
                          className="absolute w-2.5 h-2.5 rounded-full bg-pink-500 border border-white dark:border-zinc-950 transition-all group-hover:scale-125 shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                        />
                        <div className="w-full h-full hover:bg-zinc-50 dark:hover:bg-white/[0.02] rounded-t-lg transition-colors cursor-pointer" />
                        <span className="text-[9px] text-zinc-400 dark:text-white/30 font-bold mt-2.5">
                          {new Date(log.date).toLocaleDateString("en-US", {
                            month: "narrow",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Logger checkin */}
        <div className="md:col-span-4">
          <GlassCard className="p-6 bg-white/[0.01] border-zinc-200 dark:border-white/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-white/40 flex items-center gap-1.5">
              <Scale className="h-4 w-4 text-pink-550 dark:text-pink-400" /> Log Weight Check-in
            </h3>
            <form onSubmit={handleLogWeight} className="space-y-4">
              <GlassInput
                label="Weight (kg)"
                type="number"
                step="0.1"
                name="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 71.5"
                required
              />
              <GlassInput
                label="Check-in Date"
                type="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <GlassButton variant="violet" type="submit" className="w-full text-xs font-bold">
                Log Weight
              </GlassButton>
            </form>
          </GlassCard>
        </div>
      </div>

      {/* Historical weight logs */}
      {logs.length > 0 && (
        <GlassCard className="p-6 bg-white/[0.01] border-zinc-200 dark:border-white/5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-white/40 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-zinc-400 dark:text-white/30" /> Historical Weights
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-white/[0.06] text-zinc-400 dark:text-white/30 font-bold">
                  <th className="py-2">Date Logged</th>
                  <th className="py-2">Weight Value</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 dark:divide-white/[0.04]">
                {logs.slice().reverse().map((log) => (
                  <tr key={log.id} className="text-zinc-650 dark:text-white/70">
                    <td className="py-2.5 font-semibold">
                      {new Date(log.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-2.5 font-extrabold text-zinc-800 dark:text-white">{log.weight} kg</td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="p-1 rounded text-zinc-400 dark:text-white/30 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
