"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassSelect } from "@/components/ui/GlassSelect";
import { Utensils, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import { ShinyText } from "@/components/reactbits/text-animations/ShinyText";

const PRESET_MEALS = [
  { name: "Protein Oatmeal", type: "breakfast", calories: "420", protein: "25", carbs: "50", fats: "10" },
  { name: "Paneer Roti Roll", type: "lunch", calories: "480", protein: "22", carbs: "45", fats: "18" },
  { name: "Chicken Rice Salad", type: "lunch", calories: "510", protein: "38", carbs: "40", fats: "12" },
  { name: "Dal Rice & Curd", type: "dinner", calories: "440", protein: "16", carbs: "65", fats: "10" },
  { name: "Whey Protein Shake", type: "snack", calories: "210", protein: "26", carbs: "5", fats: "3" },
  { name: "Boiled Eggs (3)", type: "breakfast", calories: "230", protein: "18", carbs: "2", fats: "15" },
  { name: "Almonds & Walnut Mix", type: "snack", calories: "180", protein: "5", carbs: "6", fats: "15" },
];

export default function LogMealPage() {
  const router = useRouter();
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState("breakfast");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");

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

  const handleSelectPreset = (preset: typeof PRESET_MEALS[0]) => {
    setMealName(preset.name);
    setMealType(preset.type);
    setCalories(preset.calories);
    setProtein(preset.protein);
    setCarbs(preset.carbs);
    setFats(preset.fats);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!mealName.trim() || !calories) {
      setError("Please fill out the meal name and calorie values.");
      return;
    }

    const mealsKey = `healthify_meal_logs_${username}`;
    const logs = JSON.parse(localStorage.getItem(mealsKey) || "[]");

    const newLog = {
      id: Math.random().toString(36).substring(2, 9),
      name: mealName,
      meal_type: mealType,
      calories: Number(calories),
      protein_g: Number(protein) || 0,
      carbs_g: Number(carbs) || 0,
      fats_g: Number(fats) || 0,
      date: new Date().toISOString(),
    };

    logs.push(newLog);
    localStorage.setItem(mealsKey, JSON.stringify(logs));

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
        <h2 className="text-lg font-extrabold text-zinc-800 dark:text-white">Meal Logged!</h2>
        <p className="text-xs text-zinc-450 dark:text-white/40">Your nutritional metrics have been recorded. Returning to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Header link */}
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-zinc-500 dark:text-white/50 hover:text-zinc-800 dark:hover:text-white transition-colors text-xs font-bold group">
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Dashboard
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-850 dark:text-white">
          Log <ShinyText text="Nutrition Meal" />
        </h1>
        <p className="text-xs text-zinc-500 dark:text-white/40">Record food portions, calories, and macronutrient balances.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <GlassCard className="p-6 md:p-8 space-y-6 bg-white/[0.01] border-zinc-200 dark:border-white/5">
          {/* Quick Presets Panel */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-white/40">Quick Presets</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_MEALS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="text-[10px] font-bold px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/5 bg-zinc-100 dark:bg-white/[0.01] hover:bg-teal-500/10 dark:hover:bg-teal-500/10 text-zinc-700 dark:text-white/60 hover:text-teal-650 dark:hover:text-teal-400 transition-all cursor-pointer"
                >
                  + {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <GlassInput
                label="Meal Name"
                name="mealName"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="e.g. Scrambled eggs & Toast"
                required
              />
            </div>
            <div>
              <GlassSelect
                label="Meal Type"
                name="mealType"
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                options={[
                  { value: "breakfast", label: "Breakfast" },
                  { value: "lunch", label: "Lunch" },
                  { value: "dinner", label: "Dinner" },
                  { value: "snack", label: "Snack" },
                ]}
              />
            </div>
          </div>

          <GlassInput
            label="Calories (kcal)"
            type="number"
            name="calories"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="e.g., 450"
            required
          />

          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 dark:text-white/40 flex items-center gap-1">
              <Utensils className="h-3.5 w-3.5 text-teal-500 dark:text-teal-400" /> Macronutrient Split (Optional)
            </h3>
            <div className="grid gap-4 grid-cols-3">
              <GlassInput
                label="Protein (g)"
                type="number"
                name="protein"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="e.g. 25"
              />
              <GlassInput
                label="Carbs (g)"
                type="number"
                name="carbs"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="e.g. 40"
              />
              <GlassInput
                label="Fats (g)"
                type="number"
                name="fats"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
                placeholder="e.g. 12"
              />
            </div>
          </div>

          {/* Quick macro visualizer */}
          {(protein || carbs || fats) && (
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#09090f]/20 space-y-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-white/30">Macro Preview</span>
              <div className="flex gap-4 text-xs font-bold text-zinc-700 dark:text-white/60">
                {protein && <div>P: <span className="text-orange-500">{protein}g</span></div>}
                {carbs && <div>C: <span className="text-teal-500">{carbs}g</span></div>}
                {fats && <div>F: <span className="text-amber-500">{fats}g</span></div>}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-white/[0.06] gap-3">
            <Link href="/dashboard">
              <GlassButton variant="outline" className="text-xs font-bold">
                Cancel
              </GlassButton>
            </Link>
            <GlassButton variant="teal" type="submit" className="text-xs font-bold">
              Save Log
            </GlassButton>
          </div>
        </GlassCard>
      </form>
    </div>
  );
}
