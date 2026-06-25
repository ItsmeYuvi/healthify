import { Dumbbell, Flame, Heart, Salad, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { SpotlightCard } from "@/components/SpotlightCard";
import { AuroraBackground } from "@/components/AuroraBackground";

export default function HomePage() {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <AuroraBackground className="text-center py-20 px-4">
        <div className="relative inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/30 px-4 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-6">
          <Flame className="h-4 w-4 animate-pulse" />
          <span>AI-Powered Personal Trainer</span>
        </div>
        
        <h1 className="relative max-w-4xl text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl mx-auto leading-[1.1] mb-6">
          Precision Training & Indian Diet plans engineered by
          <span className="shiny-text"> Gemini AI</span>
        </h1>
        
        <p className="max-w-2xl text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mx-auto mb-8">
          Select your goal, specify your metrics, and let our intelligence design a custom exercise, yoga, and authentic Indian nutrition blueprint optimized for your body.
        </p>
        
        <div className="relative flex flex-col sm:flex-row gap-4 w-full justify-center max-w-xs sm:max-w-none mx-auto">
          <Link href="/login" className="btn-primary text-base font-semibold px-8 py-3.5 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform">
            Start Free Consultation
          </Link>
          <Link href="/login" className="btn-secondary text-base font-semibold px-8 py-3.5 hover:scale-[1.02] transition-transform">
            Access Dashboard
          </Link>
        </div>
      </AuroraBackground>

      {/* Core Features */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Custom-Engineered Wellness Schemes
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Everything you need for muscle building, endurance, yoga, and customized Indian meal plans.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <SpotlightCard className="hover:scale-[1.01] transition-transform">
            <Dumbbell className="mb-4 h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Precision Workouts</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              AI-generated routines customized to your height, weight, gender, and experience. Workouts scale dynamically as your strength develops.
            </p>
          </SpotlightCard>
          
          <SpotlightCard className="hover:scale-[1.01] transition-transform">
            <Heart className="mb-4 h-8 w-8 text-teal-600 dark:text-teal-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Indian Diet Localizations</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Tailored Indian recipes (including roti, paneer, dal, sabzi, curries, poha, idlis) meeting your exact target macronutrients and calorie requirements.
            </p>
          </SpotlightCard>
          
          <SpotlightCard className="hover:scale-[1.01] transition-transform">
            <Salad className="mb-4 h-8 w-8 text-orange-500 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Yoga & Active Recovery</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Designed flows to improve flexibility and support muscle recovery. Rest days are automatically integrated to let your body repair.
            </p>
          </SpotlightCard>
        </div>
      </section>

      {/* Trust & Authentic Section */}
      <SpotlightCard spotlightColor="rgba(20, 184, 166, 0.08)" className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="space-y-4 max-w-xl text-left">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Why Healthify stands as an authentic athlete portal
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Unlike static plans, Healthify uses advanced AI models to construct adaptive week-over-week schemes. Every program is dynamic, progressing as you build endurance.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Adaptive weekly progressions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Full 7-day meal planning</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Indian diet localizations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Obsidian sleek aesthetics</span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-850 p-6 shadow-md shrink-0 w-full md:w-80 text-center space-y-4 backdrop-blur-md">
          <Sparkles className="h-10 w-10 text-emerald-500 mx-auto" />
          <h4 className="font-bold text-gray-900 dark:text-white">Ready to change your lifestyle?</h4>
          <p className="text-xs text-gray-500">Free consultation takes less than 2 minutes. Start mapping your fitness scheme today.</p>
          <Link href="/login" className="btn-primary w-full inline-block text-sm py-2.5">
            Begin Consultation
          </Link>
        </div>
      </SpotlightCard>
    </div>
  );
}
