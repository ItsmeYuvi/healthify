"use client";
import React, { useEffect, useState } from "react";
import { GlassButton } from "@/components/ui/GlassButton";
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
    } else if (bmi < 25) {
      bmiCategory = "Optimal";
    } else if (bmi < 30) {
      bmiCategory = "Overweight";
    } else {
      bmiCategory = "Obese";
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
      <div className="text-left">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-white/50 hover:text-luxury-gold transition-colors text-xs font-semibold group mb-2 uppercase tracking-widest">
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Audit Dashboard
        </Link>
        <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold font-medium block mt-2">Longevity Audits</span>
        <h1 className="text-3xl md:text-5xl font-serif text-white font-light tracking-tight mt-1">
          Diagnostics & <span className="italic text-luxury-gold">Biometrics</span>
        </h1>
        <p className="text-xs text-white/40 font-light mt-1">Audit metabolic deficits, weight timelines, and real-time hydration curves.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400 text-left">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid Widgets */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Weight Card */}
        <div className="glass-surface p-6 rounded-3xl flex flex-col justify-between h-32 text-left relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-luxury-gold">Current Weight</h3>
            <Scale className="h-4 w-4 text-white/30" />
          </div>
          <div>
            <div className="text-2xl font-serif text-white flex items-baseline gap-0.5 font-light">
              <span>{currentWeight || "--"}</span>
              <span className="text-xs font-sans text-white/40 ml-1">kg</span>
            </div>
            <p className="text-[9px] text-white/30 font-medium mt-1">
              {logs.length > 0
                ? `Logged ${new Date(logs[logs.length - 1].date).toLocaleDateString()}`
                : "Baseline target"}
            </p>
          </div>
        </div>

        {/* Streak Card */}
        <div className="glass-surface p-6 rounded-3xl flex flex-col justify-between h-32 text-left relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-luxury-gold">Active Streak</h3>
            <Flame className="h-4 w-4 text-white/30" />
          </div>
          <div>
            <div className="text-2xl font-serif text-white flex items-baseline gap-0.5 font-light">
              <span>{streak}</span>
              <span className="text-xs font-sans text-white/40 ml-1">days</span>
            </div>
            <p className="text-[9px] text-white/30 font-medium mt-1">Consecutive activity target</p>
          </div>
        </div>

        {/* BMI Card */}
        <div className="glass-surface p-6 rounded-3xl flex flex-col justify-between h-32 text-left relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-luxury-gold">Active BMI</h3>
            <UserCheck className="h-4 w-4 text-white/30" />
          </div>
          <div>
            <div className="text-2xl font-serif text-white flex items-baseline gap-1 font-light">
              <span>{bmi > 0 ? bmi.toFixed(1) : "--"}</span>
              {bmi > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[8px] bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/15 font-sans font-bold uppercase tracking-wider ml-1.5">
                  {bmiCategory}
                </span>
              )}
            </div>
            <p className="text-[9px] text-white/30 font-medium mt-1">
              {idealWeightMin > 0 ? `Ideal: ${idealWeightMin.toFixed(0)}-${idealWeightMax.toFixed(0)} kg` : "Baseline missing"}
            </p>
          </div>
        </div>

        {/* Weight Delta */}
        <div className="glass-surface p-6 rounded-3xl flex flex-col justify-between h-32 text-left relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-luxury-gold">Weight Delta</h3>
            <LineChart className="h-4 w-4 text-white/30" />
          </div>
          <div>
            <div className="text-2xl font-serif text-white flex items-baseline gap-0.5 font-light">
              <span>
                {logs.length > 1
                  ? (logs[logs.length - 1].weight - logs[0].weight).toFixed(1)
                  : "0.0"}
              </span>
              <span className="text-xs font-sans text-white/40 ml-1">kg</span>
            </div>
            <p className="text-[9px] text-white/30 font-medium mt-1">Net shift from first baseline audit</p>
          </div>
        </div>
      </div>

      {/* Expanded Progress Features Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Calorie Budget Tracker */}
        <div className="glass-surface p-6 rounded-3xl space-y-6 text-left flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-luxury-gold flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-luxury-gold" /> Metabolic Calorie Balance
            </h3>
            <p className="text-[10px] text-white/40">Dynamic metabolic deficit calculated for: <span className="text-luxury-gold font-semibold uppercase tracking-wider">{profile?.goal ? profile.goal.replace("_", " ") : "general health"}</span></p>
          </div>

          <div className="grid grid-cols-2 gap-6 items-center">
            {/* Circular tracking visual */}
            <div className="relative flex items-center justify-center">
              <div className="w-28 h-28 rounded-full border-[6px] border-white/[0.02] flex flex-col justify-center items-center">
                <span className="text-[9px] text-white/30 font-semibold uppercase tracking-widest">Remaining</span>
                <span className="text-2xl font-serif text-white font-light mt-0.5">
                  {Math.max(0, targetCalories - todayCalories)}
                </span>
                <span className="text-[9px] text-luxury-gold font-semibold uppercase tracking-widest mt-0.5">kcal</span>
              </div>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-[#00D4FF]/10 pb-1.5">
                <span className="text-white/45">Target Budget:</span>
                <span className="font-semibold text-white">{targetCalories} kcal</span>
              </div>
              <div className="flex justify-between border-b border-[#00D4FF]/10 pb-1.5">
                <span className="text-white/45">Diet Logged:</span>
                <span className="font-semibold text-white">{todayCalories} kcal</span>
              </div>
              <div className="flex justify-between border-b border-[#00D4FF]/10 pb-1.5">
                <span className="text-white/45">Calculated BMR:</span>
                <span className="font-semibold text-white/70">{bmr ? bmr.toFixed(0) : "--"} kcal</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="h-2 w-full rounded-lg bg-white/[0.02] overflow-hidden">
              <div 
                className="h-full bg-luxury-gold rounded-lg transition-all duration-500" 
                style={{ width: `${Math.min(100, (todayCalories / targetCalories) * 100)}%` }} 
              />
            </div>
            <div className="flex justify-between text-[9px] text-white/30 font-bold uppercase tracking-wider">
              <span>0% Consumed</span>
              <span>{todayCalories >= targetCalories ? "Limit Reached" : `${Math.round((todayCalories / targetCalories) * 100)}%`}</span>
            </div>
          </div>
        </div>

        {/* Water Intake Tracker */}
        <div className="glass-surface p-6 rounded-3xl space-y-6 text-left flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-luxury-gold flex items-center gap-1.5">
              <Droplet className="h-4 w-4 text-luxury-gold" /> Daily Hydration Audit
            </h3>
            <p className="text-[10px] text-white/40 font-light">Track daily fluid metrics to support energy levels and cellular clear rate.</p>
          </div>

          <div className="flex items-center justify-between gap-6 py-2">
            <div className="flex flex-col items-start gap-1">
              <div className="text-3xl font-serif text-white flex items-baseline gap-0.5 font-light">
                <span>{(waterIntake / 1000).toFixed(2)}</span>
                <span className="text-xs font-sans text-white/40 ml-1">L</span>
              </div>
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Target: 3.00 L</span>
            </div>

            {/* Water logging actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleWaterUpdate(250)}
                className="p-3 rounded-2xl border border-[#00D4FF]/12 bg-white/[0.01] hover:bg-luxury-gold/10 hover:border-accent/35 hover:shadow-[0_0_15px_rgba(0,212,255,0.1)] text-white flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 active:scale-95"
              >
                <Plus className="h-4 w-4 text-luxury-gold" />
                <span className="text-[9px] font-semibold text-luxury-gold uppercase tracking-wider">+250ml</span>
              </button>
              <button
                onClick={() => handleWaterUpdate(500)}
                className="p-3 rounded-2xl border border-[#00D4FF]/12 bg-white/[0.01] hover:bg-luxury-gold/10 hover:border-accent/35 hover:shadow-[0_0_15px_rgba(0,212,255,0.1)] text-white flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 active:scale-95"
              >
                <Plus className="h-4 w-4 text-luxury-gold" />
                <span className="text-[9px] font-semibold text-luxury-gold uppercase tracking-wider">+500ml</span>
              </button>
              <button
                onClick={() => handleWaterUpdate(-250)}
                className="px-3 py-3 rounded-2xl border border-[#00D4FF]/12 bg-white/[0.01] hover:bg-red-500/10 text-white/40 hover:text-red-400 cursor-pointer transition-all active:scale-95"
                title="Remove 250ml"
              >
                <span className="text-[10px] font-bold">-250</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="h-2 w-full rounded-lg bg-white/[0.02] overflow-hidden relative">
              <div 
                className="h-full bg-luxury-gold rounded-lg transition-all duration-500 shadow-[0_0_8px_rgba(197,168,128,0.2)]" 
                style={{ width: `${Math.min(100, (waterIntake / 3000) * 100)}%` }} 
              />
            </div>
            <div className="flex justify-between text-[9px] text-white/30 font-bold uppercase tracking-wider">
              <span>0 L</span>
              <span>{waterIntake >= 3000 ? "Fully Hydrated!" : `${Math.round((waterIntake / 3000) * 100)}%`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weight History Charts & Checkin */}
      <div className="grid gap-6 md:grid-cols-12 items-start">
        {/* Weight timeline graph */}
        <div className="md:col-span-8 glass-surface p-6 rounded-3xl space-y-6 text-left">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-luxury-gold flex items-center gap-1.5">
            <LineChart className="h-4 w-4 text-luxury-gold" /> Weight Timeline
          </h3>

          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-2.5">
              <div className="p-3 rounded-full bg-white/[0.01] border border-[#00D4FF]/12 text-white/20">
                <LineChart className="h-6 w-6" />
              </div>
              <p className="text-xs text-white/40 max-w-[200px]">Log your weight to see progress curves.</p>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="relative h-48 border-b border-white/[0.06] flex items-end justify-between px-4 pb-2 gap-4">
                {logs.map((log) => {
                  const scaledHeight = ((log.weight - minWeight) / weightRange) * 80 + 10;
                  return (
                    <div key={log.id} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                      {/* Tooltip */}
                      <div className="absolute bottom-[105%] bg-[#121212] border border-[#00D4FF]/15 text-white text-[9px] font-semibold py-1 px-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-lg">
                        {log.weight} kg
                      </div>
                      {/* Dot indicator */}
                      <div
                        style={{ bottom: `${scaledHeight}%` }}
                        className="absolute w-2.5 h-2.5 rounded-full bg-luxury-gold border border-[#0c0c0c] transition-all group-hover:scale-125 shadow-[0_0_8px_rgba(197,168,128,0.6)]"
                      />
                      <div className="w-full h-full hover:bg-white/[0.01] rounded-t-lg transition-colors cursor-pointer" />
                      <span className="text-[9px] text-white/30 font-semibold mt-2.5">
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
        </div>

        {/* Logger checkin */}
        <div className="md:col-span-4 glass-surface p-6 rounded-3xl space-y-4 text-left">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-luxury-gold flex items-center gap-1.5">
            <Scale className="h-4 w-4 text-luxury-gold" /> Check-in Baseline
          </h3>
          <form onSubmit={handleLogWeight} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-white/40 block">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                name="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 71.5"
                className="glass-input"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-white/40 block">Check-in Date</label>
              <input
                type="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="glass-input"
                required
              />
            </div>
            <GlassButton variant="primary" type="submit" className="w-full text-xs font-semibold mt-2">
              Log Weight
            </GlassButton>
          </form>
        </div>
      </div>

      {/* Historical weight logs */}
      {logs.length > 0 && (
        <div className="glass-surface p-6 rounded-3xl space-y-4 text-left">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-luxury-gold flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-luxury-gold" /> Historical Weights
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#00D4FF]/12 text-white/30 font-bold">
                  <th className="py-2.5">Date Logged</th>
                  <th className="py-2.5">Weight Value</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {logs.slice().reverse().map((log) => (
                  <tr key={log.id} className="text-white/70">
                    <td className="py-3 font-semibold">
                      {new Date(log.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 font-serif font-medium text-white">{log.weight} kg</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="p-1 rounded text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
        </div>
      )}
    </div>
  );
}
