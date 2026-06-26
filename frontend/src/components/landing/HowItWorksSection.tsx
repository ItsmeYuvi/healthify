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
      color: "from-luxury-gold/10 to-transparent",
    },
    {
      step: "02",
      title: "AI Generates Your Plan",
      description: "Gemini AI analyzes your fitness metrics to engineer a customized weekly program featuring specific strength training, yoga practices, and authentic Indian diet guides.",
      icon: Cpu,
      color: "from-luxury-gold/10 to-transparent",
    },
    {
      step: "03",
      title: "Track & Evolve",
      description: "Log your daily exercises and meals directly. Watch your analytics update. Evolve your plans week-over-week as your endurance and stamina advance.",
      icon: Activity,
      color: "from-luxury-gold/10 to-transparent",
    },
  ];

  return (
    <section className="py-28 px-6 max-w-4xl mx-auto space-y-16 relative z-10">
      <div className="text-center space-y-4">
        <ScrollReveal enableBlur={true} baseOpacity={0.1} baseRotation={1}>
          <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold font-medium block">Bespoke Lifecycle</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white font-light tracking-tight mt-2">How It Works</h2>
        </ScrollReveal>
        <p className="text-sm md:text-base text-white/40 max-w-sm mx-auto font-light">
          Three simple steps to generate, log, and evolve your customized healthy lifestyle.
        </p>
      </div>

      {/* Sticky Scroll Stack Layout */}
      <div className="space-y-12">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <div className="w-full flex justify-center py-2 relative z-0">
                  <div className="h-10 w-0.5 border-l border-dashed border-[#00D4FF]/40" />
                </div>
              )}
              <div
                className="sticky top-28 transition-transform duration-300"
                style={{
                  zIndex: idx + 10,
                  transform: `scale(${1 - (steps.length - 1 - idx) * 0.03})`,
                }}
              >
                <div 
                  className="bg-[#0C1A26]/80 border border-[#00D4FF]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 py-8 md:py-10 px-8 md:px-12 rounded-3xl shadow-2xl relative overflow-hidden"
                  style={{ borderLeft: "3px solid #C9A84C" }}
                >
                  {/* Watermark stage number */}
                  <div className="absolute right-6 bottom-[-20px] text-[7rem] md:text-[9rem] font-mono font-bold text-[#00D4FF]/5 select-none pointer-events-none z-0">
                    {s.step}
                  </div>

                  {/* Radial ambient cyan glow in card background */}
                  <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#00D4FF]/5 blur-3xl pointer-events-none" />

                  <div className="space-y-4 max-w-xl text-left relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-semibold text-[#00D4FF] px-3 py-1 bg-[#00D4FF]/10 border border-[#00D4FF]/20 rounded-lg uppercase tracking-wider font-mono">
                        Stage {s.step}
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif text-white tracking-tight">{s.title}</h3>
                    <p className="text-sm text-[#7A9BB5] leading-relaxed font-light">{s.description}</p>
                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.01] border border-[#00D4FF]/10 text-[#00D4FF] shrink-0 mx-auto md:mx-0 shadow-sm relative z-10">
                    <Icon className="h-6 w-6 text-[#00D4FF]" />
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}
export default HowItWorksSection;
