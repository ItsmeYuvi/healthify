"use client";
import React from "react";
import { GlassCard } from "../ui/GlassCard";
import { ScrollReveal } from "../reactbits/text-animations/ScrollReveal";
import { Activity, Cpu, Sparkles } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Tell Us Your Goals",
      description: "Complete a simple physical diagnostic profile specifying your age, gender, height, weight, activity levels, dietary preferences, and target goal.",
      icon: Sparkles,
      color: "from-violet-500/20 to-transparent",
    },
    {
      step: "02",
      title: "AI Generates Your Plan",
      description: "Gemini AI analyzes your fitness metrics to engineer a customized weekly program featuring specific strength training, yoga practices, and authentic Indian diet guides.",
      icon: Cpu,
      color: "from-teal-500/20 to-transparent",
    },
    {
      step: "03",
      title: "Track & Evolve",
      description: "Log your daily exercises and meals directly. Watch your analytics update. Evolve your plans week-over-week as your endurance and stamina advance.",
      icon: Activity,
      color: "from-pink-500/20 to-transparent",
    },
  ];

  return (
    <section className="py-24 px-6 max-w-4xl mx-auto space-y-16 relative z-10">
      <div className="text-center space-y-3">
        <ScrollReveal enableBlur={true} baseOpacity={0.1} baseRotation={1}>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tightest">How It Works</h2>
        </ScrollReveal>
        <p className="text-sm md:text-base text-white/40 max-w-sm mx-auto">
          Three simple steps to generate, log, and evolve your customized healthy lifestyle.
        </p>
      </div>

      {/* Sticky Scroll Stack Layout */}
      <div className="space-y-12">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="sticky top-28 transition-transform duration-300"
              style={{
                zIndex: idx + 10,
                transform: `scale(${1 - (steps.length - 1 - idx) * 0.03})`,
              }}
            >
              <GlassCard className="bg-[#0b0b10] border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 py-8 md:py-10 shadow-2xl relative overflow-hidden">
                {/* Radial ambient glow in card background */}
                <div className={`absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br ${s.color} blur-3xl pointer-events-none`} />

                <div className="space-y-4 max-w-xl text-left">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-accent px-3 py-1 bg-accent/15 border border-accent/20 rounded-full">
                      Step {s.step}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{s.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{s.description}</p>
                </div>

                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/[0.03] border border-white/10 text-white/30 shrink-0 mx-auto md:mx-0 shadow-glass-sm">
                  <Icon className="h-9 w-9 text-white/70" />
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>
    </section>
  );
}
export default HowItWorksSection;
