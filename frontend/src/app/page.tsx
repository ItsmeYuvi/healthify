"use client";
import React from "react";
import Link from "next/link";
import { Dumbbell, Flame, Heart, Salad, Sparkles, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { TiltedCard } from "@/components/TiltedCard";
import { BlurText } from "@/components/BlurText";
import { GradientText } from "@/components/GradientText";
import { StarBorder } from "@/components/StarBorder";

export default function HomePage() {
  return (
    <div className="space-y-24 pb-16 pt-8">
      {/* Hero Section */}
      <div className="text-center py-16 px-4 max-w-5xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/10 px-4 py-1.5 text-xs font-bold text-cyan-400 mb-8 shadow-glass-sm animate-pulse">
          <Flame className="h-4 w-4 text-cyan-400" />
          <span>AI-Powered Personal Trainer</span>
        </div>
        
        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl leading-[1.1] mb-8">
          <BlurText text="Precision Training & Indian Diet plans engineered by" animateBy="words" delay={0.05} />
          <span className="block mt-2">
            <GradientText colors={["#06b6d4", "#8b5cf6", "#ec4899", "#06b6d4"]} animationSpeed={5}>
              Gemini AI
            </GradientText>
          </span>
        </h1>
        
        <p className="max-w-2xl text-base md:text-lg text-white/50 leading-relaxed mb-10">
          Select your goal, specify your metrics, and let our intelligence design a custom exercise, yoga, and authentic Indian nutrition blueprint optimized for your body.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          <Link href="/login" className="inline-block w-full sm:w-auto">
            <StarBorder color="#06b6d4" speed="3.5s" className="w-full sm:w-auto">
              Start Free Consultation
            </StarBorder>
          </Link>
          <Link href="/login" className="btn-secondary text-base font-semibold px-8 py-3 w-full sm:w-auto flex items-center justify-center">
            Access Dashboard
          </Link>
        </div>
      </div>

      {/* Core Features */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Custom-Engineered Wellness Schemes
          </h2>
          <p className="text-sm text-white/40 max-w-md mx-auto">
            Everything you need for muscle building, endurance, yoga, and customized Indian meal plans.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <TiltedCard rotateAmplitude={12} scaleOnHover={1.03}>
            <GlassCard spotlightColor="rgba(6, 182, 212, 0.08)" borderGlowColor="rgba(6, 182, 212, 0.3)" className="h-full">
              <Dumbbell className="mb-5 h-9 w-9 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Precision Workouts</h3>
              <p className="mt-3 text-sm text-white/50 leading-relaxed">
                AI-generated routines customized to your height, weight, gender, and experience. Workouts scale dynamically as your strength develops.
              </p>
            </GlassCard>
          </TiltedCard>
          
          <TiltedCard rotateAmplitude={12} scaleOnHover={1.03}>
            <GlassCard spotlightColor="rgba(139, 92, 246, 0.08)" borderGlowColor="rgba(139, 92, 246, 0.3)" className="h-full">
              <Heart className="mb-5 h-9 w-9 text-violet-400" />
              <h3 className="text-lg font-bold text-white">Indian Diet Localizations</h3>
              <p className="mt-3 text-sm text-white/50 leading-relaxed">
                Tailored Indian recipes (including roti, paneer, dal, sabzi, curries, poha, idlis) meeting your exact target macronutrients and calorie requirements.
              </p>
            </GlassCard>
          </TiltedCard>
          
          <TiltedCard rotateAmplitude={12} scaleOnHover={1.03}>
            <GlassCard spotlightColor="rgba(236, 72, 153, 0.08)" borderGlowColor="rgba(236, 72, 153, 0.3)" className="h-full">
              <Salad className="mb-5 h-9 w-9 text-pink-400" />
              <h3 className="text-lg font-bold text-white">Yoga & Active Recovery</h3>
              <p className="mt-3 text-sm text-white/50 leading-relaxed">
                Designed flows to improve flexibility and support muscle recovery. Rest days are automatically integrated to let your body repair.
              </p>
            </GlassCard>
          </TiltedCard>
        </div>
      </section>

      {/* Trust & Authentic Section */}
      <GlassCard spotlightColor="rgba(6, 182, 212, 0.05)" className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-white/[0.02]">
        <div className="space-y-6 max-w-xl text-left">
          <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
            Why Healthify stands as an authentic athlete portal
          </h3>
          <p className="text-sm text-white/50 leading-relaxed">
            Unlike static plans, Healthify uses advanced AI models to construct adaptive week-over-week schemes. Every program is dynamic, progressing as you build endurance.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-white/70">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>Adaptive weekly progressions</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>Full 7-day meal planning</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>Indian diet localizations</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>Obsidian sleek aesthetics</span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-black/[0.15] p-6 shadow-lg shrink-0 w-full md:w-80 text-center space-y-5 backdrop-blur-md">
          <Sparkles className="h-10 w-10 text-cyan-400 mx-auto" />
          <h4 className="font-bold text-white">Ready to change your lifestyle?</h4>
          <p className="text-xs text-white/40">Free consultation takes less than 2 minutes. Start mapping your fitness scheme today.</p>
          <Link href="/login" className="inline-block w-full">
            <StarBorder color="#06b6d4" speed="3.5s" className="w-full">
              Begin Consultation
            </StarBorder>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
