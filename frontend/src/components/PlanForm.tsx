"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";

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
  { value: "no_preference", label: "No Preference" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
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

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="label">Goal</label>
          <select name="goal" value={form.goal} onChange={handleChange} className="input">
            {goals.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Age</label>
          <input type="number" name="age" value={form.age} onChange={handleChange} required min={10} max={100} className="input" />
        </div>

        <div>
          <label className="label">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} className="input">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="label">Height (cm)</label>
          <input type="number" name="height_cm" value={form.height_cm} onChange={handleChange} required min={50} max={300} className="input" />
        </div>

        <div>
          <label className="label">Weight (kg)</label>
          <input type="number" name="weight_kg" value={form.weight_kg} onChange={handleChange} required min={20} max={500} className="input" />
        </div>

        <div>
          <label className="label">Activity Level</label>
          <select name="activity_level" value={form.activity_level} onChange={handleChange} className="input">
            {activityLevels.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Diet Preference</label>
          <select name="diet_preference" value={form.diet_preference} onChange={handleChange} className="input">
            {dietPreferences.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Workout Days / Week</label>
          <input type="number" min={1} max={7} name="workout_days_per_week" value={form.workout_days_per_week} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="label">Workout Duration (min)</label>
          <input type="number" min={10} max={300} name="workout_duration_minutes" value={form.workout_duration_minutes} onChange={handleChange} className="input" />
        </div>
      </div>

      <div>
        <label className="label">Allergies (comma separated)</label>
        <input type="text" name="allergies" value={form.allergies} onChange={handleChange} placeholder="e.g., peanuts, dairy, gluten" className="input" />
      </div>

      <div>
        <label className="label">Medical Conditions (comma separated)</label>
        <input type="text" name="medical_conditions" value={form.medical_conditions} onChange={handleChange} placeholder="e.g., asthma, diabetes" className="input" />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" name="yoga_interest" checked={form.yoga_interest} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
        <label className="text-sm text-gray-700 dark:text-gray-300">Include Yoga in my plan</label>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Generating AI Plan..." : "Generate My Plan"}
      </button>
    </form>
  );
}
