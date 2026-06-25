"use client";
import React from "react";
import { GlassCard } from "../ui/GlassCard";
import { GlassIcon } from "../ui/GlassIcons";
import { GradientText } from "../reactbits/text-animations/GradientText";
import { ScrollReveal } from "../reactbits/text-animations/ScrollReveal";

export function FeaturesSection() {
  const features = [
    {
      icon: "Dumbbell" as const,
      color: "violet" as const,
      title: "AI Plans",
      description: "Custom fitness regimes engineered specifically for your body type, physical metrics, and progression goals.",
    },
    {
      icon: "Activity" as const,
      color: "violet" as const,
      title: "Workout Tracking",
      description: "Log your daily exercises, sets, reps, and durations, building a complete history of your strength development.",
    },
    {
      icon: "Utensils" as const,
      color: "teal" as const,
      title: "Nutrition Logging",
      description: "Track calories, protein, carbs, and fats. Access tailored Indian recipe guides optimized for your macros.",
    },
    {
      icon: "LineChart" as const,
      color: "amber" as const,
      title: "Progress Analytics",
      description: "Visualize weight transformations and body measurements over time, backed by streaks and log charts.",
    },
    {
      icon: "Heart" as const,
      color: "pink" as const,
      title: "Yoga Routines",
      description: "Traditional Indian yoga asanas and breathing pranayamas integrated dynamically to restore flexibility.",
    },
    {
      icon: "Target" as const,
      color: "rose" as const,
      title: "Personalized Goals",
      description: "Adaptive target selectors that recalculate macros and calorie limits as your performance evolves.",
    },
  ];

  return (
    <section id="features" className="py-24 px-6 relative z-10 max-w-6xl mx-auto space-y-16">
      <div className="text-center space-y-3">
        <ScrollReveal enableBlur={true} baseOpacity={0.1} baseRotation={1}>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tightest">Everything You Need</h2>
        </ScrollReveal>
        <p className="text-sm md:text-base text-white/40 max-w-md mx-auto">
          An all-in-one elite fitness studio designed to monitor, adapt, and accelerate your physical capabilities.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <ScrollReveal
            key={i}
            enableBlur={true}
            baseOpacity={0.05}
            baseRotation={2}
            className="h-full"
          >
            <GlassCard hoverable className="h-full flex flex-col justify-between items-start space-y-5">
              <div className="space-y-4">
                <GlassIcon name={f.icon} color={f.color} />
                <h3 className="text-lg font-bold">
                  <GradientText colors={["#ffffff", "#a78bfa"]} className="font-bold">
                    {f.title}
                  </GradientText>
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.description}</p>
              </div>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
export default FeaturesSection;
