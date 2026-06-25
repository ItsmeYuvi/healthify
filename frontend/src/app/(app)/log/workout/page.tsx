"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { Plus, Trash2, Dumbbell, ArrowLeft, ShieldCheck, CheckCircle2, ShieldAlert } from "lucide-react";
import { ShinyText } from "@/components/reactbits/text-animations/ShinyText";

interface ExerciseLog {
  name: string;
  sets: number;
  reps: string;
  weight?: number;
}

export default function LogWorkoutPage() {
  const router = useRouter();
  const [workoutName, setWorkoutName] = useState("Daily Workout");
  const [exercises, setExercises] = useState<ExerciseLog[]>([
    { name: "", sets: 3, reps: "10", weight: 0 },
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [username, setUsername] = useState("default");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload && payload.sub) setUsername(payload.sub);
    } catch (e) {}
  }, [router]);

  const addExercise = () => {
    setExercises((prev) => [...prev, { name: "", sets: 3, reps: "10", weight: 0 }]);
  };

  const removeExercise = (index: number) => {
    if (exercises.length === 1) return;
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index: number, field: keyof ExerciseLog, value: any) => {
    setExercises((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: field === "sets" || field === "weight" ? Number(value) : value,
      };
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate
    const invalid = exercises.some((ex) => !ex.name.trim() || ex.sets <= 0 || !ex.reps.trim());
    if (invalid) {
      setError("Please fill out all exercise names, sets, and reps.");
      return;
    }

    const workoutsKey = `healthify_workout_logs_${username}`;
    const logs = JSON.parse(localStorage.getItem(workoutsKey) || "[]");

    const newLog = {
      id: Math.random().toString(36).substring(2, 9),
      name: workoutName,
      date: new Date().toISOString(),
      exercises: exercises,
    };

    logs.push(newLog);
    localStorage.setItem(workoutsKey, JSON.stringify(logs));

    // Handle streaks
    const streakKey = `healthify_streaks_${username}`;
    const currentStreak = Number(localStorage.getItem(streakKey) || "0");
    const today = new Date().toDateString();
    
    // Check last logged workout date
    let lastLoggedDate = "";
    if (logs.length > 1) {
      // Get the second to last log
      const secondLast = logs[logs.length - 2];
      lastLoggedDate = new Date(secondLast.date).toDateString();
    }

    if (lastLoggedDate === today) {
      // Already logged today, keep streak
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if (lastLoggedDate === yesterdayStr) {
        localStorage.setItem(streakKey, String(currentStreak + 1));
      } else {
        localStorage.setItem(streakKey, "1");
      }
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="h-14 w-14 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
          <CheckCircle2 className="h-8 w-8 animate-bounce" />
        </div>
        <h2 className="text-lg font-extrabold text-white">Workout Logged!</h2>
        <p className="text-xs text-white/40">Your daily progression is locked in. Returning to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header link */}
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-xs font-bold group">
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Dashboard
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Log <ShinyText text="Workout Session" />
        </h1>
        <p className="text-xs text-white/40">Record the specific sets and reps completed during your session.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <GlassCard className="p-6 md:p-8 space-y-6 bg-white/[0.01] border-white/5">
          <GlassInput
            label="Workout Session Name"
            name="workoutName"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="e.g., Pull Hypertrophy, Chest focus"
            required
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                <Dumbbell className="h-4 w-4 text-violet-400" />
                Exercise List
              </h3>
              <button
                type="button"
                onClick={addExercise}
                className="text-[10px] font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1.5 rounded-lg transition-all"
              >
                <Plus className="h-3.5 w-3.5" /> Add Exercise
              </button>
            </div>

            <div className="space-y-3.5">
              {exercises.map((ex, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-white/5 bg-[#09090f]/30 space-y-3 relative group"
                >
                  {exercises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="absolute top-3 right-3 text-white/30 hover:text-red-400 p-1 rounded hover:bg-red-500/10 transition-colors"
                      title="Remove Exercise"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}

                  <div className="text-[10px] font-bold text-white/30">EXERCISE 0{index + 1}</div>

                  <div className="grid gap-3 sm:grid-cols-4">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Exercise Name (e.g. Bench Press)"
                        value={ex.name}
                        onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                        className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#09090e]/50 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Sets"
                        value={ex.sets || ""}
                        min={1}
                        onChange={(e) => handleExerciseChange(index, "sets", e.target.value)}
                        className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#09090e]/50 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Reps (e.g. 10, 8-12)"
                        value={ex.reps}
                        onChange={(e) => handleExerciseChange(index, "reps", e.target.value)}
                        className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#09090e]/50 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Load / Weight in kg (optional)"
                      value={ex.weight || ""}
                      onChange={(e) => handleExerciseChange(index, "weight", e.target.value)}
                      className="w-full sm:w-1/2 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#09090e]/50 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/[0.06] gap-3">
            <Link href="/dashboard">
              <GlassButton variant="outline" className="text-xs font-bold">
                Cancel
              </GlassButton>
            </Link>
            <GlassButton variant="violet" type="submit" className="text-xs font-bold">
              Save Log
            </GlassButton>
          </div>
        </GlassCard>
      </form>
    </div>
  );
}
