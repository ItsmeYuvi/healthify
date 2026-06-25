"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassSelect } from "@/components/ui/GlassSelect";
import { Sparkles, ArrowLeft, ArrowRight, ShieldAlert, Dumbbell, Salad, Heart, Scale } from "lucide-react";

const GOALS = [
  { value: "fat_loss", label: "Fat Loss", desc: "Burn calories and trim excess fat" },
  { value: "weight_gain", label: "Weight Gain", desc: "Increase lean mass and bulk up" },
  { value: "muscle_build", label: "Muscle Build", desc: "Build strength and hypertrophy" },
  { value: "endurance", label: "Endurance", desc: "Improve performance parameters" },
  { value: "flexibility", label: "Flexibility", desc: "Enhance range of motion & mobility" },
  { value: "general_health", label: "General Health", desc: "Maintain overall metabolic balance" },
];

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary", desc: "Desk bound, little to no physical movements" },
  { value: "lightly_active", label: "Lightly Active", desc: "Light activity or walking 1-3 days/week" },
  { value: "moderately_active", label: "Moderately Active", desc: "Moderate training 3-5 days/week" },
  { value: "very_active", label: "Very Active", desc: "Heavy exercise/movement 6-7 days/week" },
  { value: "super_active", label: "Super Active", desc: "Highly active physical occupation or daily training" },
];

const DIET_PREFERENCES = [
  { value: "no_preference", label: "No Preference", desc: "Standard macro-balanced diet plan" },
  { value: "vegetarian", label: "Vegetarian", desc: "Lacto-ovo vegetarian Indian recipes" },
  { value: "vegan", label: "Vegan", desc: "100% plant-based clean recipes" },
  { value: "keto", label: "Keto Diet", desc: "High fat, low carbohydrate ketogenic balance" },
  { value: "paleo", label: "Paleo Diet", desc: "Whole foods base, zero refined carbs" },
  { value: "gluten_free", label: "Gluten Free", desc: "Zero wheat, barley, or gluten ingredients" },
];

export default function CreatePlanPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateStep1 = () => {
    if (!form.age || Number(form.age) < 10 || Number(form.age) > 100) {
      setError("Please specify a valid age between 10 and 100.");
      return false;
    }
    if (!form.height_cm || Number(form.height_cm) < 50 || Number(form.height_cm) > 300) {
      setError("Please enter a height between 50cm and 300cm.");
      return false;
    }
    if (!form.weight_kg || Number(form.weight_kg) < 20 || Number(form.weight_kg) > 500) {
      setError("Please enter a weight between 20kg and 500kg.");
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = {
        ...form,
        age: Number(form.age),
        height_cm: Number(form.height_cm),
        weight_kg: Number(form.weight_kg),
        workout_days_per_week: Number(form.workout_days_per_week),
        workout_duration_minutes: Number(form.workout_duration_minutes),
        allergies: form.allergies.split(",").map((s) => s.trim()).filter(Boolean),
        medical_conditions: form.medical_conditions.split(",").map((s) => s.trim()).filter(Boolean),
      };

      const headers = { Authorization: `Bearer ${token}` };

      // Step 1: Create or update profile metrics on backend
      const profileRes = await axios.post(`${API_BASE_URL}/api/v1/plans/profile`, payload, { headers });
      const profileId = profileRes.data.id;

      // Step 2: Trigger AI Generation
      await axios.post(
        `${API_BASE_URL}/api/v1/plans/generate`,
        { profile_id: profileId },
        { headers }
      );

      router.push("/dashboard");
    } catch (err: any) {
      console.error("[CreatePlan] error", err);
      const detail = err.response?.data?.detail;
      setError(detail || "Failed to generate program. Gemini AI might be rate limited. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 text-left">
      {/* Header link */}
      <div>
        <Link href="/plans" className="inline-flex items-center gap-1.5 text-white/50 hover:text-luxury-gold transition-colors text-xs font-semibold uppercase tracking-widest group">
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Blueprints Hub
        </Link>
      </div>

      {/* Progress Line */}
      <div className="flex items-center justify-between gap-4 px-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex flex-col gap-2">
            <div
              className={`h-1 rounded-full transition-all duration-500 ${
                s <= step ? "bg-luxury-gold shadow-[0_0_8px_rgba(197,168,128,0.25)]" : "bg-white/10"
              }`}
            />
            <span className={`text-[9px] font-bold uppercase tracking-widest ${s === step ? "text-luxury-gold" : "text-white/30"}`}>
              Step 0{s}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="glass-surface bg-[#141414] border-white/[0.04] p-12 text-center flex flex-col items-center justify-center space-y-6 rounded-3xl h-[400px]">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-2xl bg-luxury-gold/10 animate-pulse" />
            <div className="h-14 w-14 rounded-2xl border border-luxury-gold/30 bg-luxury-gold/10 flex items-center justify-center text-luxury-gold animate-spin">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-serif text-white font-light">Consulting Gemini AI Concierge</h3>
            <p className="text-xs text-white/40 max-w-xs font-light">
              Engineering your bespoke physical culture & culinary nutrition blueprint...
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="glass-surface bg-[#141414] border-white/[0.04] p-6 md:p-8 space-y-6 rounded-3xl">
              <div className="space-y-1.5 border-b border-white/[0.04] pb-4">
                <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-medium">Bespoke Wellness</span>
                <h2 className="text-xl font-serif text-white font-light flex items-center gap-2">
                  <Scale className="h-5 w-5 text-luxury-gold" />
                  Primary Goals & Metrics
                </h2>
                <p className="text-xs text-white/40 font-light">First, select your core aspiration and physical state.</p>
              </div>

              {/* Goal Grid */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Select Target Goal</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {GOALS.map((g) => (
                    <div
                      key={g.value}
                      onClick={() => setForm((prev) => ({ ...prev, goal: g.value }))}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                        form.goal === g.value
                          ? "bg-luxury-gold/5 border-luxury-gold/50 text-white shadow-sm"
                          : "bg-white/[0.01] border-white/[0.03] text-white/60 hover:bg-[#1c1c1c]"
                      }`}
                    >
                      <h4 className="font-semibold text-sm">{g.label}</h4>
                      <p className="text-[10px] text-white/40 mt-1 leading-snug font-light">{g.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Age, Gender, Height, Weight row */}
              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <GlassInput
                  label="Age (years)"
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="e.g., 26"
                  required
                />
                <GlassSelect
                  label="Gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                />
                <GlassInput
                  label="Height (cm)"
                  type="number"
                  name="height_cm"
                  value={form.height_cm}
                  onChange={handleChange}
                  placeholder="e.g., 176"
                  required
                />
                <GlassInput
                  label="Weight (kg)"
                  type="number"
                  name="weight_kg"
                  value={form.weight_kg}
                  onChange={handleChange}
                  placeholder="e.g., 72"
                  required
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-white/[0.04]">
                <GlassButton variant="primary" onClick={handleNext} className="gap-1 text-xs font-semibold px-6 py-2.5">
                  Next Step <ArrowRight className="h-3.5 w-3.5" />
                </GlassButton>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="glass-surface bg-[#141414] border-white/[0.04] p-6 md:p-8 space-y-6 rounded-3xl">
              <div className="space-y-1.5 border-b border-white/[0.04] pb-4">
                <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-medium">Bespoke Wellness</span>
                <h2 className="text-xl font-serif text-white font-light flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-luxury-gold" />
                  Activity & Diet Preferences
                </h2>
                <p className="text-xs text-white/40 font-light">Configure your routine constraints and calorie requirements.</p>
              </div>

              {/* Activity Level selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Select Activity Level</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {ACTIVITY_LEVELS.map((a) => (
                    <div
                      key={a.value}
                      onClick={() => setForm((prev) => ({ ...prev, activity_level: a.value }))}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                        form.activity_level === a.value
                          ? "bg-luxury-gold/5 border-luxury-gold/50 text-white shadow-sm"
                          : "bg-white/[0.01] border-white/[0.03] text-white/60 hover:bg-[#1c1c1c]"
                      }`}
                    >
                      <h4 className="font-semibold text-sm">{a.label}</h4>
                      <p className="text-[10px] text-white/40 mt-1 leading-snug font-light">{a.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diet preferences dropdown */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Dietary Preferences</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {DIET_PREFERENCES.map((d) => (
                    <div
                      key={d.value}
                      onClick={() => setForm((prev) => ({ ...prev, diet_preference: d.value }))}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                        form.diet_preference === d.value
                          ? "bg-luxury-gold/5 border-luxury-gold/50 text-white shadow-sm"
                          : "bg-white/[0.01] border-white/[0.03] text-white/60 hover:bg-[#1c1c1c]"
                      }`}
                    >
                      <h4 className="font-semibold text-sm">{d.label}</h4>
                      <p className="text-[10px] text-white/40 mt-1 leading-snug font-light">{d.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workout days per week (buttons row) */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Training Days / Week</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, workout_days_per_week: day }))}
                      className={`flex-1 h-10 rounded-xl font-bold border transition-all text-xs flex items-center justify-center cursor-pointer ${
                        form.workout_days_per_week === day
                          ? "bg-luxury-gold border-transparent text-obsidian-base shadow-sm scale-[1.02]"
                          : "bg-white/[0.01] border-white/[0.04] text-white/60 hover:bg-[#1c1c1c] hover:text-white"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Workout Duration Slider */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Target Workout Duration</label>
                  <span className="text-[10px] font-bold text-luxury-gold bg-luxury-gold/10 px-2.5 py-1 rounded-lg border border-luxury-gold/20">
                    {form.workout_duration_minutes} mins
                  </span>
                </div>
                <div className="space-y-1">
                  <input
                    type="range"
                    min="15"
                    max="120"
                    step="5"
                    name="workout_duration_minutes"
                    value={form.workout_duration_minutes}
                    onChange={handleChange}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-luxury-gold focus:outline-none"
                  />
                  <div className="flex justify-between text-[9px] text-white/30 font-bold uppercase tracking-wider">
                    <span>15m Express</span>
                    <span>45m Regular</span>
                    <span>60m Loaded</span>
                    <span>120m Elite</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-white/[0.04]">
                <GlassButton variant="outline" onClick={handleBack} className="gap-1 text-xs font-semibold px-6 py-2.5">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </GlassButton>
                <GlassButton variant="primary" onClick={handleNext} className="gap-1 text-xs font-semibold px-6 py-2.5">
                  Next Step <ArrowRight className="h-3.5 w-3.5" />
                </GlassButton>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="glass-surface bg-[#141414] border-white/[0.04] p-6 md:p-8 space-y-6 rounded-3xl">
              <div className="space-y-1.5 border-b border-white/[0.04] pb-4">
                <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-medium">Bespoke Wellness</span>
                <h2 className="text-xl font-serif text-white font-light flex items-center gap-2">
                  <Heart className="h-5 w-5 text-luxury-gold" />
                  Health Constraints & Finalize
                </h2>
                <p className="text-xs text-white/40 font-light">Specify details to keep the blueprint safe and functional.</p>
              </div>

              {/* Allergies & Conditions */}
              <div className="space-y-4">
                <GlassInput
                  label="Allergies (comma separated)"
                  name="allergies"
                  value={form.allergies}
                  onChange={handleChange}
                  placeholder="e.g., peanuts, shellfish, lactose (or leave blank)"
                />
                <GlassInput
                  label="Medical Conditions (comma separated)"
                  name="medical_conditions"
                  value={form.medical_conditions}
                  onChange={handleChange}
                  placeholder="e.g., lower back pain, asthma, diabetes (or leave blank)"
                />

                {/* Yoga Interest Toggle */}
                <div className="flex items-start gap-3 p-4 rounded-2xl border border-white/[0.04] bg-[#0c0c0c]/40">
                  <input
                    type="checkbox"
                    name="yoga_interest"
                    id="yoga_interest"
                    checked={form.yoga_interest}
                    onChange={handleChange}
                    className="h-4.5 w-4.5 rounded border-white/[0.04] bg-[#141414] text-luxury-gold accent-luxury-gold focus:ring-0 cursor-pointer mt-0.5"
                  />
                  <div>
                    <label htmlFor="yoga_interest" className="text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer select-none">
                      Include Traditional Yoga & Pranayama
                    </label>
                    <p className="text-[10px] text-white/40 mt-1 leading-snug font-light">
                      We'll integrate flexibility routines, breathing exercises, and yoga flows alongside your weight-lifting blueprints.
                    </p>
                  </div>
                </div>
              </div>

              {/* Review summary info */}
              <div className="p-4 rounded-2xl border border-white/[0.04] bg-[#0c0c0c]/40 space-y-2.5">
                <h4 className="text-[9px] font-bold uppercase tracking-wider text-white/30 border-b border-white/[0.04] pb-1.5">Blueprint Summary</h4>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  <div><span className="text-white/40">Goal:</span> <span className="font-semibold text-white/80">{GOALS.find((g) => g.value === form.goal)?.label}</span></div>
                  <div><span className="text-white/40">Activity:</span> <span className="font-semibold text-white/80">{ACTIVITY_LEVELS.find((a) => a.value === form.activity_level)?.label}</span></div>
                  <div><span className="text-white/40">Age / Gender:</span> <span className="font-semibold text-white/80">{form.age} yrs / {form.gender}</span></div>
                  <div><span className="text-white/40">Frequency:</span> <span className="font-semibold text-white/80">{form.workout_days_per_week} days/week</span></div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-white/[0.04]">
                <GlassButton variant="outline" onClick={handleBack} className="gap-1 text-xs font-semibold px-6 py-2.5">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </GlassButton>
                <GlassButton variant="primary" type="submit" className="gap-1.5 text-xs font-semibold px-6 py-2.5 shadow-[0_0_15px_rgba(197,168,128,0.15)]">
                  <Sparkles className="h-4 w-4 text-[#0c0c0c] fill-current animate-pulse" /> Generate Blueprint
                </GlassButton>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
