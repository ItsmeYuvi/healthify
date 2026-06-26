import { Dumbbell, Activity, Utensils, LineChart, Heart, Target } from "lucide-react";
import { ScrollReveal } from "../reactbits/text-animations/ScrollReveal";

export function FeaturesSection() {
  const features = [
    {
      icon: Dumbbell,
      title: "Bespoke AI Blueprints",
      description: "Custom conditioning regimes engineered specifically for your body type, physical metrics, and performance goals.",
      colSpan: "lg:col-span-2",
    },
    {
      icon: Activity,
      title: "Movement Auditing",
      description: "Log your daily active training sessions, sets, and reps to map heart rate and strength development.",
      colSpan: "lg:col-span-1",
    },
    {
      icon: Utensils,
      title: "Nutritional Integrity",
      description: "Track calories and macro compliance with bespoke Indian diet recipe guides tailored for cognitive output.",
      colSpan: "lg:col-span-2",
    },
    {
      icon: LineChart,
      title: "Progress Analytics",
      description: "Audit biometric markers, weight metrics, and health trends via elegant diagnostic dashboards.",
      colSpan: "lg:col-span-1",
    },
    {
      icon: Heart,
      title: "Restorative Yoga",
      description: "Traditional Indian yoga asanas and pranayamas integrated dynamically to restore autonomic balance.",
      colSpan: "lg:col-span-1",
    },
    {
      icon: Target,
      title: "Adaptive Goal Tuning",
      description: "Proactive baseline recalculations that adjust targets as your cardiovascular index advances.",
      colSpan: "lg:col-span-1",
    },
  ];

  return (
    <section id="features" className="py-28 px-6 relative z-10 max-w-6xl mx-auto space-y-20">
      <div className="text-center space-y-4">
        <ScrollReveal enableBlur={true} baseOpacity={0.1} baseRotation={1}>
          <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold font-medium block">Facets of Health</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white font-light tracking-tight mt-2">Everything You Need</h2>
        </ScrollReveal>
        <p className="text-sm md:text-base text-white/40 max-w-md mx-auto font-light">
          An all-in-one elite fitness studio designed to monitor, adapt, and accelerate your physical capabilities.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <ScrollReveal
              key={i}
              enableBlur={true}
              baseOpacity={0.05}
              baseRotation={1}
              className={`h-full ${f.colSpan}`}
            >
              <div className="h-full flex flex-col justify-between items-start p-8 bg-[#0C1A26]/70 border border-[#00D4FF]/10 rounded-2xl relative overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-[#00D4FF]/35 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,212,255,0.05)] group">
                <div className="space-y-4 text-left">
                  <div className="p-3 bg-[#00D4FF]/10 border border-[#00D4FF]/25 text-[#00D4FF] w-fit rounded-full flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#00D4FF] block" />
                  </div>
                  <h3 className="font-serif text-xl text-white font-medium group-hover:text-[#00D4FF] transition-colors duration-300">
                    {f.title}
                  </h3>
                  <p className="text-sm text-[#7A9BB5] leading-relaxed font-light">{f.description}</p>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
export default FeaturesSection;
