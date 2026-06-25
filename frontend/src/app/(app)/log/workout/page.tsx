"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlassButton } from "@/components/ui/GlassButton";
import { Plus, Trash2, Dumbbell, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";

interface ExerciseLog {
  name: string;
  sets: number;
  reps: string;
  weight?: number;
}

const PRESET_GROUPS = [
  { name: "Bench Press", sets: 3, reps: "10", category: "Strength", image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=300&q=80" },
  { name: "Deadlift", sets: 3, reps: "8", category: "Conditioning", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80" },
  { name: "Goblet Squats", sets: 3, reps: "12", category: "Lower Body", image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=300&q=80" },
  { name: "Plank Hold", sets: 3, reps: "60s", category: "Core", image: "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?auto=format&fit=crop&w=300&q=80" },
  { name: "Sun Salutation", sets: 3, reps: "5 flows", category: "Restorative", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=300&q=80" },
  { name: "Interval Running", sets: 1, reps: "20 mins", category: "Cardio", image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=300&q=80" },
];

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

  const handleAddPreset = (preset: typeof PRESET_GROUPS[0]) => {
    setExercises((prev) => {
      if (prev.length === 1 && prev[0].name === "") {
        return [{ name: preset.name, sets: preset.sets, reps: preset.reps, weight: 0 }];
      }
      return [...prev, { name: preset.name, sets: preset.sets, reps: preset.reps, weight: 0 }];
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
    
    let lastLoggedDate = "";
    if (logs.length > 1) {
      const secondLast = logs[logs.length - 2];
      lastLoggedDate = new Date(secondLast.date).toDateString();
    }

    if (lastLoggedDate === today) {
      // Already logged today
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
        <div className="h-14 w-14 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold">
          <CheckCircle2 className="h-8 w-8 animate-bounce" />
        </div>
        <h2 className="text-xl font-serif text-white">Workout Logged</h2>
        <p className="text-xs text-white/40">Your physical culture logs are locked in. Returning to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header link */}
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-white/50 hover:text-luxury-gold transition-colors text-xs font-semibold group uppercase tracking-widest">
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Audit Dashboard
        </Link>
      </div>

      <div className="space-y-1.5 text-left">
        <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-medium">Bespoke Session Logger</span>
        <h1 className="text-3xl md:text-4xl font-serif text-white font-light">
          Log <span className="italic text-luxury-gold">Movement Session</span>
        </h1>
        <p className="text-xs text-white/40 font-light">Record the specific conditioning parameters and sets executed today.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400 text-left">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="glass-surface bg-[#141414] border-white/[0.04] p-6 md:p-8 space-y-8 rounded-3xl text-left">
          
          {/* Form Input for Name */}
          <div className="space-y-2">
            <label className="glass-label">Workout Name</label>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="e.g., Upper Body Strength"
              className="glass-input"
              required
            />
          </div>

          {/* Quick Presets Panel */}
          <div className="space-y-3">
            <label className="glass-label">Quick Presets</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRESET_GROUPS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleAddPreset(preset)}
                  className="relative overflow-hidden rounded-2xl h-16 border border-white/[0.04] bg-[#1a1a1a] p-3 text-left group transition-all duration-350 hover:border-luxury-gold/30 hover:-translate-y-0.5"
                >
                  <img
                    src={preset.image}
                    alt={preset.name}
                    className="absolute inset-0 object-cover w-full h-full opacity-10 group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/80 to-transparent pointer-events-none" />
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-medium">{preset.category}</span>
                    <span className="text-xs font-semibold text-white truncate">{preset.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Exercise items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-luxury-gold flex items-center gap-1.5">
                <Dumbbell className="h-4 w-4 text-luxury-gold" />
                Exercise List
              </h3>
              <button
                type="button"
                onClick={addExercise}
                className="text-[10px] font-semibold text-luxury-gold hover:text-luxury-goldHover flex items-center gap-1 bg-luxury-gold/10 border border-luxury-gold/25 px-3 py-1.5 rounded-xl transition-all"
              >
                <Plus className="h-3.5 w-3.5" /> Add Exercise
              </button>
            </div>

            <div className="space-y-4">
              {exercises.map((ex, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl border border-white/[0.03] bg-white/[0.01] space-y-4 relative group"
                >
                  {exercises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="absolute top-4 right-4 text-white/30 hover:text-red-400 p-1.5 rounded-xl hover:bg-red-500/10 transition-colors"
                      title="Remove Exercise"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}

                  <div className="text-[9px] uppercase tracking-widest text-white/30 font-medium">Exercise 0{index + 1}</div>

                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-white/40 block">Exercise Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Bench Press"
                        value={ex.name}
                        onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                        className="glass-input"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-white/40 block">Sets</label>
                      <input
                        type="number"
                        placeholder="Sets"
                        value={ex.sets || ""}
                        min={1}
                        onChange={(e) => handleExerciseChange(index, "sets", e.target.value)}
                        className="glass-input"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-white/40 block">Reps</label>
                      <input
                        type="text"
                        placeholder="e.g. 10"
                        value={ex.reps}
                        onChange={(e) => handleExerciseChange(index, "reps", e.target.value)}
                        className="glass-input"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1 sm:w-1/2">
                    <label className="text-[9px] uppercase tracking-widest text-white/40 block">Load (optional)</label>
                    <input
                      type="number"
                      placeholder="Weight in kg"
                      value={ex.weight || ""}
                      onChange={(e) => handleExerciseChange(index, "weight", e.target.value)}
                      className="glass-input"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end pt-4 border-t border-white/[0.04] gap-3">
            <Link href="/dashboard">
              <GlassButton variant="outline" className="text-xs px-6 py-2.5">
                Cancel
              </GlassButton>
            </Link>
            <GlassButton variant="primary" type="submit" className="text-xs px-6 py-2.5">
              Save Log
            </GlassButton>
          </div>
        </div>
      </form>
    </div>
  );
}
