"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { Sparkles, AlertCircle, Dumbbell, Calendar, Heart, ShieldAlert } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { StarBorder } from "@/components/StarBorder";

const goals = [
  { value: "fat_loss", label: "Fat Loss" },
  { value: "weight_gain", label: "Weight Gain" },
  { value: "muscle_build", label: "Muscle Build" },
  { value: "endurance", label: "Endurance" },
  { value: "flexibility", label: "Flexibility" },
  { value: "general_health", label: "General Health" },
];

const activityLevels = [
  { value: "sedentary", label: "Sedentary" },
  { value: "lightly_active", label: "Lightly Active" },
  { value: "moderately_active", label: "Moderately Active" },
  { value: "very_active", label: "Very Active" },
  { value: "super_active", label: "Super Active" },
];

const dietPreferences = [
  { value: "no_preference", label: "No Preference (Any Indian Diet)" },
  { value: "vegetarian", label: "Vegetarian (Pure Veg)" },
  { value: "vegan", label: "Vegan" },
  { value: "keto", label: "Keto Diet" },
  { value: "paleo", label: "Paleo Diet" },
  { value: "halal", label: "Halal" },
  { value: "gluten_free", label: "Gluten Free" },
];

export function PlanForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [form, setForm] = useState({
    goal: "fat_loss",
    age: "",
    gender: "male",
    height_cm: "",
    weight_kg: "",
    activity_level: "moderately_active",
    diet_preference: "no_preference",
    allergies: "",
    medical_conditions: "",
    workout_days_per_week: 3,
    workout_duration_minutes: 45,
    yoga_interest: false,
  });

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    setAuthChecked(true);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("You are not logged in. Please sign in first.");
      setLoading(false);
      router.push("/login");
      return;
    }

    try {
      const payload = {
        ...form,
        age: Number(form.age),
        height_cm: Number(form.height_cm),
        weight_kg: Number(form.weight_kg),
        allergies: form.allergies.split(",").map((s) => s.trim()).filter(Boolean),
        medical_conditions: form.medical_conditions.split(",").map((s) => s.trim()).filter(Boolean),
      };

      const headers = { Authorization: `Bearer ${token}` };

      // Step 1: Create profile
      const profileRes = await axios.post(`${API_BASE_URL}/api/v1/plans/profile`, payload, { headers });
      const profileId = profileRes.data.id;

      // Step 2: Generate AI plan
      const generateRes = await axios.post(
        `${API_BASE_URL}/api/v1/plans/generate`,
        { profile_id: profileId },
        { headers }
      );

      console.log("Plan generated:", generateRes.data);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Plan generation error:", err);
      const status = err.response?.status;
      const detail = err.response?.data?.detail;
      const message = err.message;

      if (status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("access_token");
        setTimeout(() => router.push("/login"), 2000);
      } else if (status === 500) {
        setError(detail || "Server error. The AI service may be temporarily unavailable. Please try again.");
      } else if (status === 422) {
        setError("Invalid form data. Please check all fields and try again.");
      } else if (message === "Network Error") {
        setError("Cannot connect to server. Please check your internet connection.");
      } else {
        setError(detail || message || "Failed to generate plan. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6 text-white pb-10">
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400">
          <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <GlassCard spotlightColor="rgba(6, 182, 212, 0.08)" borderGlowColor="rgba(6, 182, 212, 0.25)" className="shadow-md p-8 space-y-6">
        <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 h-48 w-48 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 relative">
          <div>
            <label className="label">Goal Target</label>
            <select
              name="goal"
              value={form.goal}
              onChange={handleChange}
              className="input bg-[#0c0c0e]/95 border-white/10"
            >
              {goals.map((g) => (
                <option key={g.value} value={g.value} className="bg-[#0c0c0e] text-white">{g.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Age (years)</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              required
              min={10}
              max={100}
              placeholder="e.g., 25"
              className="input"
            />
          </div>

          <div>
            <label className="label">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="input bg-[#0c0c0e]/95 border-white/10"
            >
              <option value="male" className="bg-[#0c0c0e] text-white">Male</option>
              <option value="female" className="bg-[#0c0c0e] text-white">Female</option>
              <option value="other" className="bg-[#0c0c0e] text-white">Other</option>
            </select>
          </div>

          <div>
            <label className="label">Height (cm)</label>
            <input
              type="number"
              name="height_cm"
              value={form.height_cm}
              onChange={handleChange}
              required
              min={50}
              max={300}
              placeholder="e.g., 175"
              className="input"
            />
          </div>

          <div>
            <label className="label">Weight (kg)</label>
            <input
              type="number"
              name="weight_kg"
              value={form.weight_kg}
              onChange={handleChange}
              required
              min={20}
              max={500}
              placeholder="e.g., 70"
              className="input"
            />
          </div>

          <div>
            <label className="label">Activity Level</label>
            <select
              name="activity_level"
              value={form.activity_level}
              onChange={handleChange}
              className="input bg-[#0c0c0e]/95 border-white/10"
            >
              {activityLevels.map((a) => (
                <option key={a.value} value={a.value} className="bg-[#0c0c0e] text-white">{a.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Diet Preference</label>
            <select
              name="diet_preference"
              value={form.diet_preference}
              onChange={handleChange}
              className="input bg-[#0c0c0e]/95 border-white/10"
            >
              {dietPreferences.map((d) => (
                <option key={d.value} value={d.value} className="bg-[#0c0c0e] text-white">{d.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label block mb-2">
              Workout Days / Week
            </label>
            <div className="flex gap-1.5 mt-1">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, workout_days_per_week: day }))}
                  className={`flex-1 h-9 rounded-xl font-bold border transition-all text-xs flex items-center justify-center ${
                    form.workout_days_per_week === day
                      ? "bg-gradient-to-r from-cyan-500 to-violet-500 border-transparent text-white shadow-glass-glow scale-[1.03]"
                      : "bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="label">
                Workout Duration
              </label>
              <span className="text-[11px] font-extrabold text-cyan-400 bg-white/[0.04] px-2.5 py-0.5 rounded-lg border border-white/10">
                {form.workout_duration_minutes} mins
              </span>
            </div>
            <div className="space-y-1.5 mt-1.5">
              <input
                type="range"
                min="15"
                max="120"
                step="5"
                name="workout_duration_minutes"
                value={form.workout_duration_minutes}
                onChange={handleChange}
                className="w-full h-1 rounded-lg bg-white/10 appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              />
              <div className="flex justify-between text-[9px] text-white/30 px-0.5 font-bold uppercase tracking-wider">
                <span>15m Express</span>
                <span>45m Standard</span>
                <span>60m Intense</span>
                <span>120m Extreme</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2 relative">
          <div>
            <label className="label">Allergies (comma separated)</label>
            <input
              type="text"
              name="allergies"
              value={form.allergies}
              onChange={handleChange}
              placeholder="e.g., peanuts, dairy, gluten (leave blank if none)"
              className="input"
            />
          </div>

          <div>
            <label className="label">Medical Conditions (comma separated)</label>
            <input
              type="text"
              name="medical_conditions"
              value={form.medical_conditions}
              onChange={handleChange}
              placeholder="e.g., asthma, diabetes, hypertension (leave blank if none)"
              className="input"
            />
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <input
              type="checkbox"
              name="yoga_interest"
              id="yoga_interest"
              checked={form.yoga_interest}
              onChange={handleChange}
              className="h-4.5 w-4.5 rounded border-white/10 bg-white/[0.02] text-cyan-500 focus:ring-cyan-500/20 cursor-pointer"
            />
            <label htmlFor="yoga_interest" className="text-xs font-semibold text-white/70 cursor-pointer flex items-center gap-1.5 select-none hover:text-white transition-colors">
              <Heart className="h-4 w-4 text-rose-500 animate-pulse" />
              Include Indian Yoga & Pranayama in my blueprint
            </label>
          </div>
        </div>

        <StarBorder color="#06b6d4" speed="3.5s" className="w-full mt-6" type="submit" disabled={loading}>
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Consulting Gemini AI & Drafting Blueprint...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
              <span>Draft Custom Athlete Scheme</span>
            </div>
          )}
        </StarBorder>
      </GlassCard>
    </form>
  );
}
