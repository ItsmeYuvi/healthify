"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassSelect } from "@/components/ui/GlassSelect";
import { User, ShieldAlert, CheckCircle2, Key, Trash2, ArrowLeft, Settings, Sparkles } from "lucide-react";
import Link from "next/link";

const GOALS = [
  { value: "fat_loss", label: "Fat Loss" },
  { value: "weight_gain", label: "Weight Gain" },
  { value: "muscle_build", label: "Muscle Build" },
  { value: "endurance", label: "Endurance" },
  { value: "flexibility", label: "Flexibility" },
  { value: "general_health", label: "General Health" },
];

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary" },
  { value: "lightly_active", label: "Lightly Active" },
  { value: "moderately_active", label: "Moderately Active" },
  { value: "very_active", label: "Very Active" },
  { value: "super_active", label: "Super Active" },
];

const DIET_PREFERENCES = [
  { value: "no_preference", label: "No Preference" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
  { value: "gluten_free", label: "Gluten Free" },
];

export default function ProfileSettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get("onboarding") === "true";

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // User auth details
  const [userMe, setUserMe] = useState({ full_name: "", email: "" });

  // Profile forms details
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

  useEffect(() => {
    fetchProfileAndMe();
  }, []);

  const fetchProfileAndMe = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    try {
      // 1. Fetch user me details
      const meRes = await axios.get(`${API_BASE_URL}/api/v1/auth/me`, { headers });
      setUserMe(meRes.data);

      // 2. Fetch profile metrics
      const profileRes = await axios.get(`${API_BASE_URL}/api/v1/plans/profile`, { headers });
      if (profileRes.data) {
        const data = profileRes.data;
        setForm({
          goal: data.goal || "fat_loss",
          age: data.age ? String(data.age) : "",
          gender: data.gender || "male",
          height_cm: data.height_cm ? String(data.height_cm) : "",
          weight_kg: data.weight_kg ? String(data.weight_kg) : "",
          activity_level: data.activity_level || "moderately_active",
          diet_preference: data.diet_preference || "no_preference",
          allergies: data.allergies ? data.allergies.join(", ") : "",
          medical_conditions: data.medical_conditions ? data.medical_conditions.join(", ") : "",
          workout_days_per_week: data.workout_days_per_week || 3,
          workout_duration_minutes: data.workout_duration_minutes || 45,
          yoga_interest: !!data.yoga_interest,
        });
      }
    } catch (err: any) {
      console.warn("[ProfileSettings] failed to load profile data (might be empty/404):", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setError("");
    setSuccess(false);

    const token = localStorage.getItem("access_token");
    if (!token) return;

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

      await axios.post(`${API_BASE_URL}/api/v1/plans/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(true);
      if (isOnboarding) {
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err: any) {
      console.error("[ProfileSettings] save error", err);
      setError("Failed to save profile metrics. Please check values.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 text-left">
      {/* Header link (hide in onboarding step to force completion) */}
      {!isOnboarding && (
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-white/50 hover:text-luxury-gold transition-colors text-xs font-semibold uppercase tracking-widest group">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Audit Dashboard
          </Link>
        </div>
      )}

      {isOnboarding ? (
        <div className="p-5 border border-luxury-gold/20 bg-luxury-gold/5 flex items-start gap-4 rounded-3xl">
          <div className="p-3 rounded-2xl bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20 shrink-0">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-semibold text-white text-base">Complete Onboarding Profile</h3>
            <p className="text-xs text-white/40 leading-relaxed font-light">
              We couldn't find a health profile for you. Please enter your physical metrics below to finalize your account and access the workspace.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-medium">Executive Suite</span>
          <h1 className="text-3xl md:text-5xl font-serif text-white font-light tracking-tight">
            Athlete <span className="italic text-luxury-gold">Profile</span>
          </h1>
          <p className="text-xs text-white/40 font-light">Adjust your training baseline and account parameters.</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-2xl border border-luxury-gold/20 bg-luxury-gold/5 p-4 text-xs text-luxury-gold">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Profile metrics saved successfully! {isOnboarding && "Redirecting..."}</span>
        </div>
      )}

      {/* Account Info Details (from /auth/me) */}
      {!isOnboarding && (
        <div className="glass-surface bg-[#141414] border-white/[0.04] p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-luxury-gold flex items-center gap-1.5 border-b border-white/[0.04] pb-2">
            <Settings className="h-4 w-4 text-luxury-gold" /> Account Settings
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div>
              <span className="text-white/40 block mb-0.5 uppercase tracking-wider text-[9px] font-bold">Full Name</span>
              <span className="font-semibold text-white text-sm">{userMe.full_name || "Athlete"}</span>
            </div>
            <div>
              <span className="text-white/40 block mb-0.5 uppercase tracking-wider text-[9px] font-bold">Email Address</span>
              <span className="font-semibold text-white text-sm">{userMe.email || "No Email"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Profile Metrics Form */}
      <form onSubmit={handleSave}>
        <div className="glass-surface bg-[#141414] border-white/[0.04] p-6 md:p-8 space-y-6 rounded-3xl">
          <h3 className="text-xs font-bold uppercase tracking-widest text-luxury-gold flex items-center gap-1.5 border-b border-white/[0.04] pb-2">
            <User className="h-4 w-4 text-luxury-gold" /> Physical Metrics
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <GlassSelect
              label="Fitness Goal"
              name="goal"
              value={form.goal}
              onChange={handleChange}
              options={GOALS}
            />
            <GlassInput
              label="Age (years)"
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="e.g. 26"
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
            <GlassSelect
              label="Activity Level"
              name="activity_level"
              value={form.activity_level}
              onChange={handleChange}
              options={ACTIVITY_LEVELS}
            />
            <GlassInput
              label="Height (cm)"
              type="number"
              name="height_cm"
              value={form.height_cm}
              onChange={handleChange}
              placeholder="e.g. 176"
              required
            />
            <GlassInput
              label="Weight (kg)"
              type="number"
              name="weight_kg"
              value={form.weight_kg}
              onChange={handleChange}
              placeholder="e.g. 72"
              required
            />
            <GlassSelect
              label="Dietary Preference"
              name="diet_preference"
              value={form.diet_preference}
              onChange={handleChange}
              options={DIET_PREFERENCES}
            />
            <GlassInput
              label="Workout Days / Week"
              type="number"
              min={1}
              max={7}
              name="workout_days_per_week"
              value={form.workout_days_per_week}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <GlassInput
              label="Allergies (comma separated)"
              name="allergies"
              value={form.allergies}
              onChange={handleChange}
              placeholder="e.g. peanuts (or blank)"
            />
            <GlassInput
              label="Medical Conditions"
              name="medical_conditions"
              value={form.medical_conditions}
              onChange={handleChange}
              placeholder="e.g. asthma (or blank)"
            />
          </div>

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
                Integrate Indian yoga/mobility routines inside generated blueprints.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/[0.04] gap-3">
            {!isOnboarding && (
              <GlassButton type="button" variant="outline" onClick={handleLogout} className="text-xs font-bold text-red-400 border-red-500/10 hover:bg-red-500/5">
                Sign Out
              </GlassButton>
            )}
            <GlassButton variant="primary" type="submit" disabled={saveLoading} className="text-xs font-semibold px-6 py-2.5 shadow-[0_0_15px_rgba(197,168,128,0.15)]">
              {saveLoading ? "Saving..." : isOnboarding ? "Complete Profile" : "Save Changes"}
            </GlassButton>
          </div>
        </div>
      </form>

      {/* Danger Zone */}
      {!isOnboarding && (
        <div className="glass-surface bg-red-950/[0.02] border-red-500/10 p-6 rounded-3xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
            <Trash2 className="h-4 w-4" /> Danger Zone
          </h3>
          <p className="text-[10px] text-white/40 leading-relaxed font-light">
            Logging out clears your session but keeps weight and workout logs stored in your browser. Clearing browser local storage will delete your historical workouts.
          </p>
          <div>
            <GlassButton
              variant="outline"
              type="button"
              onClick={() => {
                if (confirm("Are you sure you want to clear your local logs? This deletes all your logged workouts/meals/weight history.")) {
                  const token = localStorage.getItem("access_token");
                  let localUsername = "default";
                  if (token) {
                    try {
                      const payload = JSON.parse(atob(token.split(".")[1]));
                      if (payload && payload.sub) localUsername = payload.sub;
                    } catch (e) {}
                  }
                  localStorage.removeItem(`healthify_workout_logs_${localUsername}`);
                  localStorage.removeItem(`healthify_meal_logs_${localUsername}`);
                  localStorage.removeItem(`healthify_weight_logs_${localUsername}`);
                  localStorage.removeItem(`healthify_water_logs_${localUsername}`);
                  localStorage.removeItem(`healthify_streaks_${localUsername}`);
                  alert("Local health logs deleted.");
                  window.location.reload();
                }
              }}
              className="text-xs font-bold text-red-400 border-red-500/10 hover:bg-red-500/10"
            >
              Clear Local History logs
            </GlassButton>
          </div>
        </div>
      )}
    </div>
  );
}
