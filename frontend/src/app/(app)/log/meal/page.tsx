"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlassButton } from "@/components/ui/GlassButton";
import { Utensils, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";

const PRESET_GROUPS = [
  { name: "Protein Oatmeal", type: "breakfast", calories: "420", protein: "25", carbs: "50", fats: "10", category: "Breakfast", image: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&w=300&q=80" },
  { name: "Avocado Salmon Bowl", type: "lunch", calories: "580", protein: "35", carbs: "40", fats: "22", category: "Executive Lunch", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80" },
  { name: "Paneer Quinoa Salad", type: "lunch", calories: "480", protein: "22", carbs: "45", fats: "18", category: "Gourmet Vegetarian", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80" },
  { name: "Dal Rice & Curd", type: "dinner", calories: "440", protein: "16", carbs: "65", fats: "10", category: "Authentic Comfort", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80" },
  { name: "Boiled Eggs (3)", type: "breakfast", calories: "230", protein: "18", carbs: "2", fats: "15", category: "Protein Kick", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=300&q=80" },
  { name: "Almond & Walnut Mix", type: "snack", calories: "180", protein: "5", carbs: "6", fats: "15", category: "Snacks", image: "https://images.unsplash.com/photo-1596721526436-1c25143a5323?auto=format&fit=crop&w=300&q=80" },
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

  const handleSelectPreset = (preset: typeof PRESET_GROUPS[0]) => {
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
        <div className="h-14 w-14 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold">
          <CheckCircle2 className="h-8 w-8 animate-bounce" />
        </div>
        <h2 className="text-xl font-serif text-white">Meal Logged</h2>
        <p className="text-xs text-white/40">Your nutritional metrics have been recorded. Returning to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Header link */}
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-white/50 hover:text-luxury-gold transition-colors text-xs font-semibold group uppercase tracking-widest">
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Audit Dashboard
        </Link>
      </div>

      <div className="space-y-1.5 text-left">
        <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-medium">Bespoke Diet Audits</span>
        <h1 className="text-3xl md:text-4xl font-serif text-white font-light">
          Log <span className="italic text-luxury-gold">Nutritional Meal</span>
        </h1>
        <p className="text-xs text-white/40 font-light">Record energy intake details, macro properties, and portion checks.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400 text-left">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="glass-surface p-6 md:p-8 space-y-6 rounded-3xl text-left">
          
          {/* Quick Presets Panel */}
          <div className="space-y-3">
            <label className="glass-label">Curated Presets</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRESET_GROUPS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="relative overflow-hidden rounded-2xl h-16 border border-[#00D4FF]/12 bg-[#0C1A26]/80 p-3 text-left group transition-all duration-350 hover:border-accent/35 hover:shadow-[0_0_15px_rgba(0,212,255,0.1)] hover:-translate-y-0.5"
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

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="glass-label">Meal Title</label>
              <input
                type="text"
                name="mealName"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="e.g. Avocado Toast & Poached Eggs"
                className="glass-input"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="glass-label">Meal Phase</label>
              <select
                name="mealType"
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="glass-select"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="glass-label">Energy Level (Calories in kcal)</label>
            <input
              type="number"
              name="calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="e.g. 450"
              className="glass-input"
              required
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-luxury-gold flex items-center gap-1.5 border-b border-[#00D4FF]/12 pb-2">
              <Utensils className="h-4 w-4 text-luxury-gold" /> Macro Splits
            </h3>
            <div className="grid gap-4 grid-cols-3">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-white/40 block">Protein (g)</label>
                <input
                  type="number"
                  name="protein"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder="e.g. 25"
                  className="glass-input"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-white/40 block">Carbs (g)</label>
                <input
                  type="number"
                  name="carbs"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  placeholder="e.g. 40"
                  className="glass-input"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-white/40 block">Fats (g)</label>
                <input
                  type="number"
                  name="fats"
                  value={fats}
                  onChange={(e) => setFats(e.target.value)}
                  placeholder="e.g. 12"
                  className="glass-input"
                />
              </div>
            </div>
          </div>

          {/* Quick macro visualizer */}
          {(protein || carbs || fats) && (
            <div className="p-4 rounded-2xl border border-[#00D4FF]/10 bg-white/[0.01] space-y-1">
              <span className="text-[9px] font-semibold uppercase tracking-widest text-white/30">Macro Preview</span>
              <div className="flex gap-4 text-xs font-semibold text-white/60">
                {protein && <div>Protein: <span className="text-luxury-gold">{protein}g</span></div>}
                {carbs && <div>Carbs: <span className="text-white/80">{carbs}g</span></div>}
                {fats && <div>Fats: <span className="text-white/40">{fats}g</span></div>}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end pt-4 border-t border-[#00D4FF]/12 gap-3">
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
