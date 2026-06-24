import { Dumbbell, Flame, Heart, Salad } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center space-y-6 text-center py-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
          <Flame className="h-4 w-4" />
          <span>AI-Powered Personal Trainer</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Your Personalized
          <span className="text-primary-600 dark:text-primary-400"> Fitness</span> &
          <span className="text-primary-600 dark:text-primary-400"> Nutrition</span> Plan
        </h1>
        <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Select your goal, input your metrics, and let Gemini AI craft a custom exercise, yoga, and meal plan tailored just for you.
        </p>
        <div className="flex gap-4">
          <Link href="/login" className="btn-primary text-lg px-6 py-3">
            Get Started
          </Link>
          <Link href="/login" className="btn-secondary text-lg px-6 py-3">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card">
          <Dumbbell className="mb-4 h-8 w-8 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold">Custom Workouts</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            AI-generated exercise routines based on your goal, fitness level, and available equipment.
          </p>
        </div>
        <div className="card">
          <Heart className="mb-4 h-8 w-8 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold">Yoga & Flexibility</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Optional daily yoga flows tailored to your experience level and recovery needs.
          </p>
        </div>
        <div className="card">
          <Salad className="mb-4 h-8 w-8 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold">Smart Nutrition</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Personalized meal plans with macros, calories, and ingredients that match your diet preference.
          </p>
        </div>
      </section>
    </div>
  );
}
