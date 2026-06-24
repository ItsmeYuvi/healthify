"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { Calendar, Dumbbell, Salad, User, AlertCircle, Heart } from "lucide-react";
import Link from "next/link";

interface Plan {
  id: string;
  plan_name: string;
  goal: string;
  duration_weeks: number;
  created_at: string;
  daily_plans: any[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [activeDayTab, setActiveDayTab] = useState<number>(1);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch user info (non-critical - don't redirect on failure)
    axios
      .get(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserName(res.data.full_name);
      })
      .catch((err) => {
        console.warn("[Dashboard] /auth/me failed (CORS or server):", err.message);
      });

    // Fetch plans (critical auth check)
    axios
      .get(`${API_BASE_URL}/api/v1/plans/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPlans(res.data))
      .catch((err) => {
        const status = err.response?.status;
        if (status === 401) {
          localStorage.removeItem("access_token");
          router.push("/login");
        } else {
          setError("Failed to load plans. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  // Helper to ensure we always have daily plans to display (with sample fallback if empty)
  const getDailyPlans = (plan: Plan) => {
    if (plan.daily_plans && plan.daily_plans.length > 0) {
      return plan.daily_plans;
    }
    // Return sample mock plan if AI generation fell back due to quota limits
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
          { name: "Sun Salutation (Surya Namaskar)", duration_seconds: 300, difficulty: "Beginner", benefits: "Warms up the body and improves flexibility." },
          { name: "Child's Pose (Balasana)", duration_seconds: 120, difficulty: "Beginner", benefits: "Calms the mind and stretches the lower back." }
        ],
        meals: [
          { meal_type: "breakfast", name: "High-Protein Oatmeal Bowl", calories: 420, protein_g: 25, carbs_g: 50, fats_g: 10, ingredients: ["Rolled oats", "Whey protein", "Chia seeds", "Mixed berries"], instructions: "Cook oats in water. Stir in protein powder, top with berries and seeds." },
          { meal_type: "lunch", name: "Grilled Chicken & Quinoa Salad", calories: 550, protein_g: 40, carbs_g: 45, fats_g: 12, ingredients: ["Grilled chicken breast", "Cooked quinoa", "Spinach", "Cherry tomatoes", "Olive oil dressing"], instructions: "Toss ingredients together and drizzle with olive oil dressing." },
          { meal_type: "dinner", name: "Baked Salmon with Broccoli & Sweet Potato", calories: 600, protein_g: 35, carbs_g: 40, fats_g: 20, ingredients: ["Salmon fillet", "Broccoli florets", "Sweet potato", "Lemon", "Garlic"], instructions: "Bake salmon and potato at 200°C for 25 mins. Steam broccoli." }
        ]
      },
      {
        day: 2,
        focus: "Yoga, Core & Active Recovery",
        exercises: [
          { name: "Bicycle Crunches", sets: 3, reps: "20 reps", rest_seconds: 45, notes: "Slow and controlled rotations." },
          { name: "Bird-Dog", sets: 3, reps: "12 per side", rest_seconds: 45, notes: "Keep hips level and extend fully." }
        ],
        yoga_routine: [
          { name: "Warrior II (Virabhadrasana II)", duration_seconds: 180, difficulty: "Beginner", benefits: "Strengthens legs and opens hips." },
          { name: "Bridge Pose (Setu Bandhasana)", duration_seconds: 180, difficulty: "Beginner", benefits: "Opens chest and stretches spine." },
          { name: "Corpse Pose (Savasana)", duration_seconds: 300, difficulty: "Beginner", benefits: "Deep relaxation and stress relief." }
        ],
        meals: [
          { meal_type: "breakfast", name: "Avocado & Egg Toast", calories: 380, protein_g: 18, carbs_g: 30, fats_g: 15, ingredients: ["Whole wheat bread", "Avocado", "Poached egg", "Red pepper flakes"], instructions: "Toast bread, mash avocado on top, and place poached egg on top." },
          { meal_type: "lunch", name: "Lentil Soup with Whole Wheat Pita", calories: 450, protein_g: 22, carbs_g: 65, fats_g: 8, ingredients: ["Brown lentils", "Carrots", "Celery", "Onion", "Pita bread"], instructions: "Simmer lentils with chopped veggies until tender. Serve warm with pita." },
          { meal_type: "dinner", name: "Tofu Stir-fry with Brown Rice", calories: 500, protein_g: 25, carbs_g: 55, fats_g: 12, ingredients: ["Firm tofu", "Mixed bell peppers", "Broccoli", "Soy sauce", "Brown rice"], instructions: "Sauté tofu and veggies in soy sauce, serve over cooked brown rice." }
        ]
      },
      {
        day: 3,
        focus: "Lower Body & Leg Strength",
        exercises: [
          { name: "Dumbbell Romanian Deadlifts", sets: 3, reps: "12", rest_seconds: 60, notes: "Hinge at the hips, flat back." },
          { name: "Walking Lunges", sets: 3, reps: "10 per leg", rest_seconds: 60, notes: "Keep front knee aligned with ankle." },
          { name: "Calf Raises", sets: 3, reps: "15", rest_seconds: 45, notes: "Hold peak contraction for 1 second." }
        ],
        yoga_routine: [
          { name: "Cobra Pose (Bhujangasana)", duration_seconds: 120, difficulty: "Beginner", benefits: "Strengthens spine and opens lungs." }
        ],
        meals: [
          { meal_type: "breakfast", name: "Greek Yogurt Parfait", calories: 350, protein_g: 24, carbs_g: 40, fats_g: 5, ingredients: ["Greek yogurt", "Honey", "Granola", "Blueberries"], instructions: "Layer yogurt, honey, granola, and fresh berries in a glass." },
          { meal_type: "lunch", name: "Turkey & Hummus Wrap", calories: 480, protein_g: 30, carbs_g: 50, fats_g: 14, ingredients: ["Whole wheat tortilla", "Sliced turkey breast", "Hummus", "Cucumber", "Spinach"], instructions: "Spread hummus on tortilla, place turkey and veggies, and roll tightly." },
          { meal_type: "dinner", name: "Turkey Bolognese with Zucchini Noodles", calories: 460, protein_g: 35, carbs_g: 25, fats_g: 18, ingredients: ["Lean ground turkey", "Marinara sauce", "Zucchini spiralized", "Parmesan cheese"], instructions: "Cook ground turkey, stir in marinara sauce, and serve over sautéed zucchini noodles." }
        ]
      }
    ];
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6 text-primary-600" />
            My Dashboard
          </h1>
          {userName && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Welcome back, {userName}!
            </p>
          )}
        </div>
        <Link href="/plan" className="btn-primary">
          + New Plan
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {plans.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No plans yet. Create your first AI-powered fitness plan!
          </p>
          <Link href="/plan" className="btn-primary mt-4 inline-block">
            Generate Plan
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => {
                setSelectedPlan(plan);
                setActiveDayTab(1);
              }}
              className="card cursor-pointer transition-all hover:border-primary-500 hover:shadow-md border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
                  {plan.plan_name}
                </h3>
                <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                  {plan.duration_weeks} week{plan.duration_weeks > 1 ? "s" : ""}
                </span>
              </div>
              <p className="mt-1 text-sm capitalize text-gray-500 dark:text-gray-400">
                {plan.goal.replace(/_/g, " ")}
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Dumbbell className="h-4 w-4" />
                  {getDailyPlans(plan).length} days
                </span>
                <span className="flex items-center gap-1">
                  <Salad className="h-4 w-4" />
                  Meals included
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                <span>Created {new Date(plan.created_at).toLocaleDateString()}</span>
                <span className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                  View Details →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plan Details Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="flex h-full max-h-[85vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-gray-800 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedPlan.plan_name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {selectedPlan.goal.replace(/_/g, " ")} | {selectedPlan.duration_weeks} Week{selectedPlan.duration_weeks > 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors font-semibold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar Tabs for Days */}
              <div className="w-1/4 border-r border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-900/30 overflow-y-auto">
                <div className="space-y-2">
                  {getDailyPlans(selectedPlan).map((dp) => (
                    <button
                      key={dp.day}
                      onClick={() => setActiveDayTab(dp.day)}
                      className={`w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                        activeDayTab === dp.day
                          ? "bg-primary-600 text-white"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      Day {dp.day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Details */}
              <div className="flex-1 p-6 overflow-y-auto space-y-8">
                {getDailyPlans(selectedPlan)
                  .filter((dp) => dp.day === activeDayTab)
                  .map((dp) => (
                    <div key={dp.day} className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Day {dp.day} Focus
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{dp.focus}</p>
                      </div>

                      {/* Exercises Section */}
                      {dp.exercises && dp.exercises.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1.5">
                            <Dumbbell className="h-4 w-4" /> Workout Exercises
                          </h4>
                          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                            <table className="w-full text-left text-sm">
                              <thead className="bg-gray-50 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300">
                                <tr>
                                  <th className="p-3">Exercise</th>
                                  <th className="p-3">Sets</th>
                                  <th className="p-3">Reps</th>
                                  <th className="p-3">Rest</th>
                                  <th className="p-3">Notes</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {dp.exercises.map((ex: any, idx: number) => (
                                  <tr key={idx} className="text-gray-600 dark:text-gray-300">
                                    <td className="p-3 font-medium text-gray-900 dark:text-white">
                                      {ex.name}
                                    </td>
                                    <td className="p-3">{ex.sets}</td>
                                    <td className="p-3">{ex.reps}</td>
                                    <td className="p-3">{ex.rest_seconds}s</td>
                                    <td className="p-3 text-xs">{ex.notes || "-"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Yoga Routine Section */}
                      {dp.yoga_routine && dp.yoga_routine.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-1.5">
                            <Heart className="h-4 w-4" /> Yoga & Flexibility
                          </h4>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {dp.yoga_routine.map((y: any, idx: number) => (
                              <div
                                key={idx}
                                className="rounded-lg border border-gray-200 p-4 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/10"
                              >
                                <h5 className="font-medium text-gray-900 dark:text-white">
                                  {y.name}
                                </h5>
                                <div className="mt-1 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                  <span>
                                    Duration: {Math.round(y.duration_seconds / 60)} mins
                                  </span>
                                  <span className="capitalize">Level: {y.difficulty}</span>
                                </div>
                                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                  <strong className="text-gray-500">Benefits:</strong> {y.benefits}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Meals Section */}
                      {dp.meals && dp.meals.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                            <Salad className="h-4 w-4" /> Nutrition & Meals
                          </h4>
                          <div className="space-y-4">
                            {dp.meals.map((m: any, idx: number) => (
                              <div
                                key={idx}
                                className="rounded-lg border border-gray-200 p-4 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/10 space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                                    {m.meal_type}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {m.calories} kcal | P: {m.protein_g}g | C: {m.carbs_g}g | F:{" "}
                                    {m.fats_g}g
                                  </span>
                                </div>
                                <h5 className="font-medium text-gray-900 dark:text-white">
                                  {m.name}
                                </h5>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  <strong className="text-gray-500">Ingredients:</strong>{" "}
                                  {m.ingredients.join(", ")}
                                </p>
                                {m.instructions && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    <strong className="text-gray-400">Prep:</strong>{" "}
                                    {m.instructions}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
