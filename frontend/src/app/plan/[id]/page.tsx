"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { Dumbbell, Salad, User, AlertCircle, Sparkles, Heart, ArrowLeft, Calendar, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { TiltedCard } from "@/components/TiltedCard";
import { BlurText } from "@/components/BlurText";
import { GradientText } from "@/components/GradientText";
import { StarBorder } from "@/components/StarBorder";

interface Plan {
  id: string;
  plan_name: string;
  goal: string;
  duration_weeks: number;
  week_number?: number;
  created_at: string;
  daily_plans: any[];
  weeks?: { id: string; week_number: number }[];
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
      <div className="flex h-screen items-center justify-center">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute h-12 w-12 animate-ping rounded-full border border-cyan-500/30 opacity-75" />
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error && !plan) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-white">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <h2 className="text-xl font-bold">Error Loading Scheme</h2>
        <p className="text-white/40 text-sm max-w-md text-center">{error}</p>
        <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-2.5 text-sm font-semibold hover:bg-white/[0.05] transition-colors">
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

  // Dynamic targets based on 30% protein, 45% carbs, 25% fats
  const targetProtein = Math.max(1, Math.round((totalCalories * 0.3) / 4));
  const targetCarbs = Math.max(1, Math.round((totalCalories * 0.45) / 4));
  const targetFats = Math.max(1, Math.round((totalCalories * 0.25) / 9));

  // Check if current week is the latest week generated so far
  const isLatestWeek = !currentPlan.weeks || currentPlan.weeks.length === 0 || 
    currentPlan.week_number === Math.max(...currentPlan.weeks.map(w => w.week_number));

  return (
    <div className="space-y-8 pb-12 text-white">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-semibold group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-2 text-xs text-white/40 font-semibold border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 rounded-full backdrop-blur-md">
          <ShieldCheck className="h-4 w-4 text-cyan-400" />
          <span>Authentic Athlete Blueprint</span>
        </div>
      </div>

      {/* Hero Header Section */}
      <GlassCard spotlightColor="rgba(6, 182, 212, 0.08)" borderGlowColor="rgba(6, 182, 212, 0.25)" className="p-8">
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-white/[0.04] border border-white/10 px-3 py-1 text-xs font-bold text-cyan-400 shadow-glass-sm">
                Week {currentPlan.week_number || 1}
              </span>
              <span className="text-xs text-white/40 font-medium flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                7-Day Health Blueprint
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              <BlurText text={currentPlan.plan_name} animateBy="words" />
            </h1>
            <p className="text-sm text-white/40 max-w-2xl capitalize">
              Program Goal: {currentPlan.goal.replace(/_/g, " ")} | Tailored diet and exercise regime.
            </p>
          </div>

          {isLatestWeek && (
            <div className="shrink-0 self-start md:self-center">
              <button onClick={handleGenerateNextWeek} disabled={nextWeekLoading} className="inline-block">
                <StarBorder color="#06b6d4" speed="3.5s">
                  {nextWeekLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Engineering Week {(currentPlan.week_number || 1) + 1}...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="h-4.5 w-4.5 text-cyan-400 animate-pulse" />
                      <span>Generate Week {(currentPlan.week_number || 1) + 1} Plan</span>
                    </div>
                  )}
                </StarBorder>
              </button>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Week Navigation Selector */}
      {currentPlan.weeks && currentPlan.weeks.length > 1 && (
        <div className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-4">
          {currentPlan.weeks.map((w) => (
            <Link
              key={w.id}
              href={`/plan/${w.id}`}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                currentPlan.id === w.id
                  ? "bg-gradient-to-r from-cyan-500 to-violet-500 border-transparent text-white shadow-glass-glow"
                  : "bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              Week {w.week_number}
            </Link>
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Day Navigation & Macro Summary */}
        <div className="lg:col-span-3 space-y-6">
          <GlassCard spotlight={false} className="p-5 space-y-4">
            <h3 className="text-xs font-bold tracking-wider text-white/40 uppercase">
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
                        ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-glass-glow"
                        : "text-white/60 hover:bg-white/[0.03] border border-transparent hover:border-white/10"
                    }`}
                  >
                    <span>Day {dp.day}</span>
                    <span className={`hidden lg:inline-flex rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      isDPWorkout 
                        ? (activeDay === dp.day ? "bg-cyan-500/30 text-cyan-200" : "bg-cyan-950/40 text-cyan-400 border border-cyan-500/20")
                        : (activeDay === dp.day ? "bg-white/15 text-white" : "bg-white/[0.04] text-white/40 border border-white/5")
                    }`}>
                      {isDPWorkout ? "Workout" : "Rest"}
                    </span>
                  </button>
                );
              })}
            </div>
          </GlassCard>

          {/* Macro Target panel */}
          <GlassCard spotlight={false} className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <h3 className="text-xs font-bold tracking-wider text-white/40 uppercase">
                Daily Macros
              </h3>
              <span className="text-xs text-cyan-400 font-bold">{totalCalories} kcal</span>
            </div>
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs text-white/40 mb-1">
                  <span>Protein</span>
                  <span className="font-semibold text-white/80">{Math.round(totalProtein)}g / {targetProtein}g</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-orange-450 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.5)]" style={{ width: `${Math.min(100, (totalProtein / targetProtein) * 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-white/40 mb-1">
                  <span>Carbohydrates</span>
                  <span className="font-semibold text-white/80">{Math.round(totalCarbs)}g / {targetCarbs}g</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]" style={{ width: `${Math.min(100, (totalCarbs / targetCarbs) * 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-white/40 mb-1">
                  <span>Fats</span>
                  <span className="font-semibold text-white/80">{Math.round(totalFats)}g / {targetFats}g</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.5)]" style={{ width: `${Math.min(100, (totalFats / targetFats) * 100)}%` }} />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-9 space-y-8">
          {/* Day Focus Header */}
          <GlassCard spotlightColor="rgba(6, 182, 212, 0.05)" className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Day {activeDay} Focus</span>
              <h2 className="text-xl font-extrabold tracking-tight text-white">{activeDayPlan.focus}</h2>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-xs font-semibold text-white/70">
              <Zap className="h-4 w-4 text-cyan-400 animate-pulse" />
              <span>{isWorkoutDay ? "Active Exercise Load" : "Active Muscle Repair"}</span>
            </div>
          </GlassCard>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Workout & Yoga Panel (Left side of detail grid) */}
            <div className="space-y-8">
              {!isWorkoutDay && !isYogaDay ? (
                /* Rest Day Card */
                <GlassCard spotlightColor="rgba(6, 182, 212, 0.05)" className="p-8 text-center flex flex-col items-center justify-center space-y-4 h-full min-h-[300px]">
                  <div className="rounded-full bg-white/[0.03] p-4 border border-white/10 text-cyan-400">
                    <Heart className="h-10 w-10 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">Active Recovery Day</h3>
                    <p className="text-sm text-white/40 max-w-xs mx-auto leading-relaxed">
                      No heavy workout scheduled. Focus on hydration, mobility, stretching, and letting your muscle fibers rebuild stronger.
                    </p>
                  </div>
                </GlassCard>
              ) : (
                /* Exercises and/or Yoga */
                <div className="space-y-6">
                  {/* Exercises */}
                  {isWorkoutDay && (
                    <GlassCard spotlightColor="rgba(6, 182, 212, 0.05)" className="p-6 space-y-4">
                      <h3 className="text-base font-bold flex items-center gap-2 border-b border-white/[0.08] pb-2 text-white">
                        <Dumbbell className="h-5 w-5 text-cyan-400" />
                        Workout Routine
                      </h3>
                      <div className="space-y-4">
                        {activeDayPlan.exercises.map((ex: any, idx: number) => (
                          <div key={idx} className="rounded-2xl border border-white/5 bg-white/[0.01] p-4 space-y-3 hover:border-white/10 transition-colors">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-sm text-white">{ex.name}</h4>
                              <span className="text-[11px] font-bold text-cyan-450 bg-cyan-950/40 px-2 py-0.5 rounded-lg border border-cyan-500/20">
                                {ex.sets} x {ex.reps}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-white/40">
                              <span>Rest: <strong className="text-white/80">{ex.rest_seconds}s</strong></span>
                              {ex.focus_area && <span className="bg-white/[0.04] px-2 py-0.5 rounded text-[10px] uppercase font-semibold text-white/60">Target: {ex.focus_area}</span>}
                            </div>
                            {ex.instruction && (
                              <p className="text-xs text-white/50 mt-1">
                                <span className="font-semibold text-white/70">How-to:</span> {ex.instruction}
                              </p>
                            )}
                            {ex.notes && (
                              <p className="text-xs text-cyan-300 bg-cyan-950/20 p-2.5 rounded-xl border border-cyan-500/20">
                                <span className="font-semibold text-cyan-400">Coach Note:</span> {ex.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  )}

                  {/* Yoga */}
                  {isYogaDay && (
                    <GlassCard spotlightColor="rgba(139, 92, 246, 0.05)" className="p-6 space-y-4">
                      <h3 className="text-base font-bold flex items-center gap-2 border-b border-white/[0.08] pb-2 text-white">
                        <Heart className="h-5 w-5 text-violet-400" />
                        Yoga & Mobility Routine
                      </h3>
                      <div className="space-y-4">
                        {activeDayPlan.yoga_routine.map((y: any, idx: number) => (
                          <div key={idx} className="rounded-2xl border border-white/5 bg-white/[0.01] p-4 space-y-3 hover:border-white/10 transition-colors">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-sm text-white">{y.name}</h4>
                              <span className="text-[10px] font-bold uppercase text-violet-400 bg-violet-950/40 px-2 py-0.5 rounded-lg border border-violet-500/20">
                                {y.difficulty}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-white/40">
                              <span>Duration: <strong className="text-white/80">{Math.round(y.duration_seconds / 60)} mins</strong></span>
                              {y.focus_area && <span className="bg-violet-950/20 px-2 py-0.5 rounded text-[10px] uppercase font-semibold text-violet-400">Focus: {y.focus_area}</span>}
                            </div>
                            {y.instruction && (
                              <p className="text-xs text-white/50 mt-1">
                                <span className="font-semibold text-white/70">Steps:</span> {y.instruction}
                              </p>
                            )}
                            {y.benefits && (
                              <p className="text-xs text-violet-350 bg-violet-955/20 p-2.5 rounded-xl border border-violet-500/20">
                                <span className="font-semibold text-violet-400">Benefits:</span> {y.benefits}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  )}
                </div>
              )}
            </div>

            {/* Diet & Nutrition Panel (Right side of detail grid) */}
            <GlassCard spotlightColor="rgba(236, 72, 153, 0.05)" className="p-6 space-y-4 h-full">
              <h3 className="text-base font-bold flex items-center gap-2 border-b border-white/[0.08] pb-2 text-white">
                <Salad className="h-5 w-5 text-pink-400" />
                Nutrition Planner
              </h3>
              <div className="space-y-4">
                {activeDayPlan.meals?.map((m: any, idx: number) => (
                  <div key={idx} className="rounded-2xl border border-white/5 bg-white/[0.01] p-4 space-y-2 hover:border-white/10 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 bg-pink-950/40 px-2 py-0.5 rounded-lg border border-pink-500/20">
                        {m.meal_type}
                      </span>
                      <span className="text-xs font-semibold text-white/40">{m.calories} kcal</span>
                    </div>
                    <h4 className="font-bold text-sm text-white">{m.name}</h4>
                    <p className="text-xs text-white/40">
                      <strong className="text-white/60">Macros:</strong> P: {m.protein_g}g | C: {m.carbs_g}g | F: {m.fats_g}g
                    </p>
                    <p className="text-xs text-white/40">
                      <strong className="text-white/60">Ingredients:</strong> {m.ingredients?.join(", ")}
                    </p>
                    {m.instructions && (
                      <div className="text-xs text-white/60 bg-[#050505]/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-semibold text-white/70">Prep:</span> {m.instructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
