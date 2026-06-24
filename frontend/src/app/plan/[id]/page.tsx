"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { Dumbbell, Salad, User, AlertCircle, Sparkles, Heart, ArrowLeft, Calendar, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

interface Plan {
  id: string;
  plan_name: string;
  goal: string;
  duration_weeks: number;
  week_number?: number;
  created_at: string;
  daily_plans: any[];
}

export default function PlanDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDay, setActiveDay] = useState<number>(1);
  const [nextWeekLoading, setNextWeekLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/v1/plans/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPlan(res.data);
      })
      .catch((err) => {
        console.error("[PlanDetails] Error fetching plan:", err);
        setError("Failed to load plan details. The plan might not exist or there is a connection issue.");
      })
      .finally(() => setLoading(false));
  }, [params.id, router]);

  const handleGenerateNextWeek = async () => {
    if (!plan) return;
    setNextWeekLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/plans/${plan.id}/next-week`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("Generated next week plan:", res.data);
      router.push(`/plan/${res.data.id}`);
    } catch (err: any) {
      console.error("[PlanDetails] Error generating next week:", err);
      const detail = err.response?.data?.detail;
      setError(detail || "Failed to generate next week's plan. Gemini AI may be rate-limited. Please try again.");
    } finally {
      setNextWeekLoading(false);
    }
  };

  // Helper to ensure we always have 7 daily plans to display (with sample fallback if empty or partial)
  const getDailyPlans = (currentPlan: Plan) => {
    if (currentPlan.daily_plans && currentPlan.daily_plans.length > 0) {
      return currentPlan.daily_plans;
    }
    // Return sample mock plan with 7 days meals and 3 days workouts if fallback
    return [
      {
        day: 1,
        focus: "Full Body Strength & Conditioning",
        exercises: [
          { name: "Goblet Squats", sets: 3, reps: "12-15", rest_seconds: 60, notes: "Focus on depth and keep chest proud." },
          { name: "Dumbbell Chest Press", sets: 3, reps: "10-12", rest_seconds: 60, notes: "Control the descent." },
          { name: "Bent-Over Dumbbell Rows", sets: 3, reps: "12", rest_seconds: 60, notes: "Squeeze shoulder blades at the top." },
          { name: "Plank Hold", sets: 3, reps: "45 seconds", rest_seconds: 45, notes: "Maintain a straight line from head to heels." }
        ],
        yoga_routine: [
          { name: "Sun Salutation (Surya Namaskar)", duration_seconds: 300, difficulty: "Beginner", benefits: "Warms up the body and improves flexibility." }
        ],
        meals: [
          { meal_type: "breakfast", name: "High-Protein Oatmeal Bowl", calories: 420, protein_g: 25, carbs_g: 50, fats_g: 10, ingredients: ["Rolled oats", "Whey protein", "Mixed berries"], instructions: "Cook oats in water, stir in protein, top with berries." },
          { meal_type: "lunch", name: "Grilled Chicken & Quinoa Salad", calories: 550, protein_g: 40, carbs_g: 45, fats_g: 12, ingredients: ["Chicken breast", "Quinoa", "Spinach", "Tomatoes"], instructions: "Toss ingredients and dress with olive oil." },
          { meal_type: "dinner", name: "Baked Salmon with Sweet Potato", calories: 600, protein_g: 35, carbs_g: 40, fats_g: 20, ingredients: ["Salmon", "Broccoli", "Sweet potato"], instructions: "Bake salmon and potato. Steam broccoli." }
        ]
      },
      {
        day: 2,
        focus: "Active Recovery & Core Alignment",
        exercises: [],
        yoga_routine: [
          { name: "Child's Pose (Balasana)", duration_seconds: 120, difficulty: "Beginner", benefits: "Stretches the lower back." },
          { name: "Cat-Cow Stretch", duration_seconds: 180, difficulty: "Beginner", benefits: "Warms up the spine." }
        ],
        meals: [
          { meal_type: "breakfast", name: "Greek Yogurt Parfait", calories: 350, protein_g: 24, carbs_g: 40, fats_g: 5, ingredients: ["Greek yogurt", "Honey", "Granola", "Blueberries"], instructions: "Layer ingredients in a glass." },
          { meal_type: "lunch", name: "Lentil Soup with Whole Wheat Pita", calories: 450, protein_g: 22, carbs_g: 65, fats_g: 8, ingredients: ["Lentils", "Carrots", "Onion", "Pita"], instructions: "Simmer lentils and veggies until tender." },
          { meal_type: "dinner", name: "Tofu Stir-fry with Brown Rice", calories: 500, protein_g: 25, carbs_g: 55, fats_g: 12, ingredients: ["Tofu", "Bell peppers", "Soy sauce", "Brown rice"], instructions: "Stir-fry tofu and veggies, serve over rice." }
        ]
      },
      {
        day: 3,
        focus: "Lower Body Strength & Glute Power",
        exercises: [
          { name: "Dumbbell Romanian Deadlifts", sets: 3, reps: "12", rest_seconds: 60, notes: "Hinge at the hips, flat back." },
          { name: "Walking Lunges", sets: 3, reps: "10 per leg", rest_seconds: 60, notes: "Keep front knee aligned with ankle." },
          { name: "Calf Raises", sets: 3, reps: "15", rest_seconds: 45, notes: "Hold peak contraction for 1 second." }
        ],
        yoga_routine: [],
        meals: [
          { meal_type: "breakfast", name: "Avocado & Egg Toast", calories: 380, protein_g: 18, carbs_g: 30, fats_g: 15, ingredients: ["Toast", "Avocado", "Egg"], instructions: "Mash avocado on toast, top with egg." },
          { meal_type: "lunch", name: "Turkey & Hummus Wrap", calories: 480, protein_g: 30, carbs_g: 50, fats_g: 14, ingredients: ["Tortilla", "Turkey", "Hummus", "Spinach"], instructions: "Spread hummus, lay turkey and wrap." },
          { meal_type: "dinner", name: "Turkey Bolognese with Zucchini Noodles", calories: 460, protein_g: 35, carbs_g: 25, fats_g: 18, ingredients: ["Ground turkey", "Marinara", "Zucchini"], instructions: "Sauté turkey, add marinara, serve over noodles." }
        ]
      },
      {
        day: 4,
        focus: "Rest & Hydration Day",
        exercises: [],
        yoga_routine: [],
        meals: [
          { meal_type: "breakfast", name: "Protein Shake & Banana", calories: 320, protein_g: 26, carbs_g: 35, fats_g: 4, ingredients: ["Whey protein", "Milk", "Banana"], instructions: "Blend together." },
          { meal_type: "lunch", name: "Quinoa Veggie Bowl", calories: 410, protein_g: 16, carbs_g: 55, fats_g: 10, ingredients: ["Quinoa", "Edamame", "Cucumbers", "Tahini"], instructions: "Mix quinoa with chopped veggies and tahini." },
          { meal_type: "dinner", name: "Grilled Chicken Breast with Steamed Asparagus", calories: 420, protein_g: 38, carbs_g: 10, fats_g: 12, ingredients: ["Chicken breast", "Asparagus", "Olive oil"], instructions: "Grill chicken. Steam asparagus with salt and oil." }
        ]
      },
      {
        day: 5,
        focus: "Upper Body Hypertrophy & Arms",
        exercises: [
          { name: "Dumbbell Overhead Shoulder Press", sets: 3, reps: "10-12", rest_seconds: 60, notes: "Press straight up, control down." },
          { name: "Pushups (to failure)", sets: 3, reps: "Max reps", rest_seconds: 60, notes: "Keep body rigid." },
          { name: "Dumbbell Hammer Curls", sets: 3, reps: "12", rest_seconds: 45, notes: "Keep elbows pinned to sides." }
        ],
        yoga_routine: [
          { name: "Downward Facing Dog (Adho Mukha Svanasana)", duration_seconds: 120, difficulty: "Beginner", benefits: "Stretches shoulders." }
        ],
        meals: [
          { meal_type: "breakfast", name: "Scrambled Eggs & Fruit Bowl", calories: 390, protein_g: 22, carbs_g: 25, fats_g: 18, ingredients: ["Eggs", "Olive oil", "Apple", "Orange"], instructions: "Scramble eggs in oil. Serve with fruit." },
          { meal_type: "lunch", name: "Tuna Salad Salad", calories: 430, protein_g: 32, carbs_g: 15, fats_g: 16, ingredients: ["Canned tuna", "Lettuce", "Olive oil", "Mayo"], instructions: "Mix tuna with mayo and serve over lettuce." },
          { meal_type: "dinner", name: "Sirloin Steak with Broccoli", calories: 580, protein_g: 45, carbs_g: 12, fats_g: 24, ingredients: ["Steak", "Broccoli", "Butter"], instructions: "Pan-sear steak in butter. Steam broccoli." }
        ]
      },
      {
        day: 6,
        focus: "Passive Recovery & Light Stretching",
        exercises: [],
        yoga_routine: [
          { name: "Cobra Pose (Bhujangasana)", duration_seconds: 120, difficulty: "Beginner", benefits: "Opens the chest." }
        ],
        meals: [
          { meal_type: "breakfast", name: "Chiapudding", calories: 310, protein_g: 10, carbs_g: 30, fats_g: 12, ingredients: ["Chia seeds", "Almond milk", "Honey"], instructions: "Mix and soak overnight." },
          { meal_type: "lunch", name: "Hummus & Pita Plate with Cucumber", calories: 390, protein_g: 14, carbs_g: 50, fats_g: 11, ingredients: ["Hummus", "Pita", "Cucumber", "Feta"], instructions: "Serve hummus with sliced cucumber and warm pita." },
          { meal_type: "dinner", name: "Baked Cod with Asparagus", calories: 400, protein_g: 35, carbs_g: 15, fats_g: 10, ingredients: ["Cod fillet", "Asparagus", "Lemon"], instructions: "Bake cod with lemon slices. Roast asparagus." }
        ]
      },
      {
        day: 7,
        focus: "Weekly Rest & Reset",
        exercises: [],
        yoga_routine: [],
        meals: [
          { meal_type: "breakfast", name: "Protein Waffles", calories: 410, protein_g: 25, carbs_g: 45, fats_g: 8, ingredients: ["Protein waffle mix", "Blueberries", "Maple syrup"], instructions: "Make waffles, top with berries." },
          { meal_type: "lunch", name: "Turkey Breast Sandwich", calories: 460, protein_g: 32, carbs_g: 42, fats_g: 10, ingredients: ["Sliced turkey", "Whole wheat bread", "Lettuce", "Mustard"], instructions: "Assemble sandwich." },
          { meal_type: "dinner", name: "Vegetable Lentil Curry", calories: 480, protein_g: 20, carbs_g: 65, fats_g: 8, ingredients: ["Lentils", "Curry paste", "Spinach", "Basmati rice"], instructions: "Cook lentils in curry paste, stir in spinach, serve with rice." }
        ]
      }
    ];
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute h-12 w-12 animate-ping rounded-full border border-emerald-500/30 opacity-75" />
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error && !plan) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold">Error Loading Scheme</h2>
        <p className="text-slate-400 text-sm max-w-md text-center">{error}</p>
        <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-5 py-2.5 text-sm font-semibold hover:bg-slate-850">
          <ArrowLeft className="h-4 w-4" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  const currentPlan = plan!;
  const dailyPlans = getDailyPlans(currentPlan);
  const activeDayPlan = dailyPlans.find((dp) => dp.day === activeDay) || dailyPlans[0];
  
  // Calculate day stats
  const isWorkoutDay = activeDayPlan.exercises && activeDayPlan.exercises.length > 0;
  const isYogaDay = activeDayPlan.yoga_routine && activeDayPlan.yoga_routine.length > 0;
  const totalCalories = activeDayPlan.meals?.reduce((sum: number, m: any) => sum + (m.calories || 0), 0) || 0;
  const totalProtein = activeDayPlan.meals?.reduce((sum: number, m: any) => sum + (m.protein_g || 0), 0) || 0;
  const totalCarbs = activeDayPlan.meals?.reduce((sum: number, m: any) => sum + (m.carbs_g || 0), 0) || 0;
  const totalFats = activeDayPlan.meals?.reduce((sum: number, m: any) => sum + (m.fats_g || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold border border-slate-800 bg-slate-900/30 px-3 py-1.5 rounded-full">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Authentic Athlete Blueprint</span>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-8 shadow-2xl">
        <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -left-24 -bottom-24 h-48 w-48 rounded-full bg-teal-500/5 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                Week {currentPlan.week_number || 1}
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                7-Day Health Blueprint
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              {currentPlan.plan_name}
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl capitalize">
              Program Goal: {currentPlan.goal.replace(/_/g, " ")} | Tailored diet and exercise regime.
            </p>
          </div>

          <button
            onClick={handleGenerateNextWeek}
            disabled={nextWeekLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
          >
            {nextWeekLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Engineering Week {(currentPlan.week_number || 1) + 1}...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                <span>Generate Week {(currentPlan.week_number || 1) + 1} Plan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Day Navigation & Macro Summary */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
              Days Schedule
            </h3>
            <div className="grid grid-cols-4 gap-2 lg:grid-cols-1 lg:gap-3">
              {dailyPlans.map((dp) => {
                const isDPWorkout = dp.exercises && dp.exercises.length > 0;
                return (
                  <button
                    key={dp.day}
                    onClick={() => setActiveDay(dp.day)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                      activeDay === dp.day
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/20"
                        : "text-slate-300 hover:bg-slate-900 border border-transparent hover:border-slate-800"
                    }`}
                  >
                    <span>Day {dp.day}</span>
                    <span className={`hidden lg:inline-flex rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      isDPWorkout 
                        ? (activeDay === dp.day ? "bg-emerald-500 text-white" : "bg-emerald-900/30 text-emerald-400")
                        : (activeDay === dp.day ? "bg-emerald-700 text-white" : "bg-slate-800 text-slate-400")
                    }`}>
                      {isDPWorkout ? "Workout" : "Rest"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Macro Target panel */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
                Daily Macro Target
              </h3>
              <span className="text-xs text-emerald-400 font-bold">{totalCalories} kcal</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Protein</span>
                  <span className="font-semibold text-slate-200">{Math.round(totalProtein)}g</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min(100, (totalProtein / 180) * 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Carbohydrates</span>
                  <span className="font-semibold text-slate-200">{Math.round(totalCarbs)}g</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: `${Math.min(100, (totalCarbs / 250) * 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Fats</span>
                  <span className="font-semibold text-slate-200">{Math.round(totalFats)}g</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${Math.min(100, (totalFats / 80) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-9 space-y-8">
          {/* Day Focus Header */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Day {activeDay} Focus</span>
              <h2 className="text-xl font-extrabold text-white">{activeDayPlan.focus}</h2>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-xs font-semibold text-slate-300">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span>{isWorkoutDay ? "Active Exercise Load" : "Active Muscle Repair"}</span>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Workout & Yoga Panel (Left side of detail grid) */}
            <div className="space-y-8">
              {!isWorkoutDay && !isYogaDay ? (
                /* Rest Day Card */
                <div className="rounded-2xl border border-slate-850 bg-slate-900/10 p-8 text-center flex flex-col items-center justify-center space-y-4 h-full min-h-[300px]">
                  <div className="rounded-full bg-slate-900 p-4 border border-slate-800 text-teal-400">
                    <Heart className="h-10 w-10 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">Active Recovery Day</h3>
                    <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
                      No heavy workout scheduled. Focus on hydration, mobility, stretching, and letting your muscle fibers rebuild stronger.
                    </p>
                  </div>
                </div>
              ) : (
                /* Exercises and/or Yoga */
                <div className="space-y-6">
                  {/* Exercises */}
                  {isWorkoutDay && (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 space-y-4">
                      <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-850 pb-2">
                        <Dumbbell className="h-5 w-5 text-emerald-500" />
                        Workout Routine
                      </h3>
                      <div className="space-y-4">
                        {activeDayPlan.exercises.map((ex: any, idx: number) => (
                          <div key={idx} className="rounded-xl border border-slate-850 bg-slate-900/40 p-4 space-y-2 hover:border-slate-800 transition-colors">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-white text-sm">{ex.name}</h4>
                              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30">
                                {ex.sets} x {ex.reps}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-slate-400">
                              <span>Rest: <strong className="text-slate-300">{ex.rest_seconds}s</strong></span>
                            </div>
                            {ex.notes && (
                              <p className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
                                <span className="font-semibold text-slate-300">Coach:</span> {ex.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Yoga */}
                  {isYogaDay && (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 space-y-4">
                      <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-850 pb-2">
                        <Heart className="h-5 w-5 text-teal-500" />
                        Yoga & Mobility Routine
                      </h3>
                      <div className="space-y-4">
                        {activeDayPlan.yoga_routine.map((y: any, idx: number) => (
                          <div key={idx} className="rounded-xl border border-slate-850 bg-slate-900/40 p-4 space-y-2 hover:border-slate-800 transition-colors">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-white text-sm">{y.name}</h4>
                              <span className="text-[10px] font-bold uppercase text-teal-400 bg-teal-950/40 px-2 py-0.5 rounded border border-teal-900/30">
                                {y.difficulty}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400">
                              Duration: <strong className="text-slate-300">{Math.round(y.duration_seconds / 60)} mins</strong>
                            </div>
                            <p className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
                              <span className="font-semibold text-slate-300">Benefits:</span> {y.benefits}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Diet & Nutrition Panel (Right side of detail grid) */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 space-y-4 h-full">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-850 pb-2">
                <Salad className="h-5 w-5 text-orange-500" />
                Nutrition Planner
              </h3>
              <div className="space-y-4">
                {activeDayPlan.meals?.map((m: any, idx: number) => (
                  <div key={idx} className="rounded-xl border border-slate-850 bg-slate-900/40 p-4 space-y-2 hover:border-slate-800 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded border border-orange-900/30">
                        {m.meal_type}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{m.calories} kcal</span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{m.name}</h4>
                    <p className="text-xs text-slate-400">
                      <strong className="text-slate-300">Macros:</strong> P: {m.protein_g}g | C: {m.carbs_g}g | F: {m.fats_g}g
                    </p>
                    <p className="text-xs text-slate-400">
                      <strong className="text-slate-300">Ingredients:</strong> {m.ingredients?.join(", ")}
                    </p>
                    {m.instructions && (
                      <div className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
                        <span className="font-semibold text-slate-300">Prep:</span> {m.instructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
