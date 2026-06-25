"use client";
import React, { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { ShinyText } from "@/components/reactbits/text-animations/ShinyText";
import { Scale, Flame, Calendar, Trash2, LineChart, ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

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

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    let user = "default";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload && payload.sub) user = payload.sub;
    } catch (e) {}
    setUsername(user);

    // Fetch weight logs
    const weightKey = `healthify_weight_logs_${user}`;
    const storedLogs = JSON.parse(localStorage.getItem(weightKey) || "[]");
    // Sort chronologically
    const sorted = storedLogs.sort(
      (a: WeightLog, b: WeightLog) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setLogs(sorted);

    // Fetch streak
    const streakKey = `healthify_streaks_${user}`;
    setStreak(Number(localStorage.getItem(streakKey) || "0"));
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

  // Graph calculations
  const maxWeight = logs.length > 0 ? Math.max(...logs.map((l) => l.weight)) : 100;
  const minWeight = logs.length > 0 ? Math.min(...logs.map((l) => l.weight)) : 50;
  const weightRange = maxWeight - minWeight === 0 ? 10 : maxWeight - minWeight;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Progress <ShinyText text="Tracker" />
        </h1>
        <p className="text-xs text-white/40">Monitor streaks and weight check-ins over time.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Overview widget cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <GlassCard spotlightColor="rgba(236, 72, 153, 0.15)" className="p-5 bg-white/[0.01] border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40">Latest Weight</h3>
            <div className="p-2.5 rounded-xl border border-pink-500/20 bg-pink-500/10 text-pink-400">
              <Scale className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white flex items-baseline gap-1">
              <span>{logs.length > 0 ? logs[logs.length - 1].weight : "--"}</span>
              <span className="text-sm font-bold text-white/60">kg</span>
            </div>
            <p className="text-[10px] text-white/30 font-semibold mt-1">
              {logs.length > 0
                ? `Logged on ${new Date(logs[logs.length - 1].date).toLocaleDateString()}`
                : "No weight check-ins registered"}
            </p>
          </div>
        </GlassCard>

        <GlassCard spotlightColor="rgba(249, 115, 22, 0.15)" className="p-5 bg-white/[0.01] border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40">Current Streak</h3>
            <div className="p-2.5 rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
              <Flame className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white flex items-baseline gap-1">
              <span>{streak}</span>
              <span className="text-sm font-bold text-white/60">days</span>
            </div>
            <p className="text-[10px] text-white/30 font-semibold mt-1">Keep logging daily to increase it!</p>
          </div>
        </GlassCard>

        <GlassCard spotlightColor="rgba(139, 92, 246, 0.15)" className="p-5 bg-white/[0.01] border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40">Weight Delta</h3>
            <div className="p-2.5 rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
              <LineChart className="h-5 w-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white flex items-baseline gap-1">
              <span>
                {logs.length > 1
                  ? (logs[logs.length - 1].weight - logs[0].weight).toFixed(1)
                  : "0.0"}
              </span>
              <span className="text-sm font-bold text-white/60">kg</span>
            </div>
            <p className="text-[10px] text-white/30 font-semibold mt-1">Total delta since first logged entry</p>
          </div>
        </GlassCard>
      </div>

      {/* Main Graph & Logger Section */}
      <div className="grid gap-6 md:grid-cols-12 items-start">
        {/* Graph */}
        <div className="md:col-span-8">
          <GlassCard className="p-6 bg-white/[0.01] border-white/5 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
              <LineChart className="h-4 w-4 text-violet-400" /> Weight Timeline
            </h3>

            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-2.5">
                <div className="p-3 rounded-full bg-white/[0.02] border border-white/5 text-white/20">
                  <LineChart className="h-6 w-6" />
                </div>
                <p className="text-xs text-white/40 max-w-[200px]">Log your weight to see your progress curve.</p>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {/* CSS Line graph bar segments */}
                <div className="relative h-48 border-b border-white/[0.08] flex items-end justify-between px-4 pb-2 gap-4">
                  {logs.map((log, idx) => {
                    // Scale weight between min and max
                    const scaledHeight = ((log.weight - minWeight) / weightRange) * 80 + 10;
                    return (
                      <div key={log.id} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                        {/* Tooltip */}
                        <div className="absolute bottom-[105%] bg-[#12121a] border border-white/10 text-white text-[9px] font-bold py-1 px-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-lg">
                          {log.weight} kg
                        </div>
                        {/* Dot indicator */}
                        <div
                          style={{ bottom: `${scaledHeight}%` }}
                          className="absolute w-2.5 h-2.5 rounded-full bg-pink-500 border border-white transition-all group-hover:scale-125 shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                        />
                        {/* Small background column indicator for mouse hover guidance */}
                        <div className="w-full h-full hover:bg-white/[0.02] rounded-t-lg transition-colors cursor-pointer" />
                        <span className="text-[9px] text-white/30 font-bold mt-2.5">
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
          <GlassCard className="p-6 bg-white/[0.01] border-white/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
              <Scale className="h-4 w-4 text-pink-400" /> Log Weight Check-in
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

      {/* Historical logs table */}
      {logs.length > 0 && (
        <GlassCard className="p-6 bg-white/[0.01] border-white/5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-white/40" /> Historical Weights
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-white/30 font-bold">
                  <th className="py-2">Date Logged</th>
                  <th className="py-2">Weight Value</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {logs.slice().reverse().map((log) => (
                  <tr key={log.id} className="text-white/70">
                    <td className="py-2.5 font-semibold">
                      {new Date(log.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-2.5 font-extrabold text-white">{log.weight} kg</td>
                    <td className="py-2.5 text-right">
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
        </GlassCard>
      )}
    </div>
  );
}
