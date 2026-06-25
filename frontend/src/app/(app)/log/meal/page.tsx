"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassSelect } from "@/components/ui/GlassSelect";
import { Utensils, ArrowLeft, ShieldCheck, CheckCircle2, ShieldAlert, Heart } from "lucide-react";
import { ShinyText } from "@/components/reactbits/text-animations/ShinyText";

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
        <h2 className="text-lg font-extrabold text-white">Meal Logged!</h2>
        <p className="text-xs text-white/40">Your nutritional metrics have been recorded. Returning to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Header link */}
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-xs font-bold group">
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Dashboard
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Log <ShinyText text="Nutrition Meal" />
        </h1>
        <p className="text-xs text-white/40">Record food portions, calories, and macronutrient balances.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <GlassCard className="p-6 md:p-8 space-y-6 bg-white/[0.01] border-white/5">
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
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1">
              <Utensils className="h-3.5 w-3.5 text-teal-400" /> Macronutrient Split (Optional)
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
            <div className="p-4 rounded-xl border border-white/5 bg-[#09090f]/20 space-y-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-white/30">Macro Preview</span>
              <div className="flex gap-4 text-xs font-bold text-white/60">
                {protein && <div>P: <span className="text-orange-400">{protein}g</span></div>}
                {carbs && <div>C: <span className="text-teal-400">{carbs}g</span></div>}
                {fats && <div>F: <span className="text-amber-400">{fats}g</span></div>}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-white/[0.06] gap-3">
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
