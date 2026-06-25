"use client";
import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ActionItem {
  title: string;
  description: string;
  href: string;
  image: string;
  label: string;
}

const ACTIONS: ActionItem[] = [
  {
    title: "Bespoke Blueprint",
    description: "Generate bespoke AI fitness & diet schemes.",
    href: "/plans/create",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    label: "AI Planner",
  },
  {
    title: "Movement Log",
    description: "Record strength training and yoga logs.",
    href: "/log/workout",
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=600&q=80",
    label: "Physical Culture",
  },
  {
    title: "Nutritional Intake",
    description: "Log clean calories and macro balance.",
    href: "/log/meal",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    label: "Diet & Macros",
  },
  {
    title: "Biometrics Ledger",
    description: "Audit weight metrics and target trends.",
    href: "/progress",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80",
    label: "Diagnostics",
  },
];

export function QuickActions() {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-luxury-gold">Wellness Operations</h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ACTIONS.map((action) => {
          return (
            <Link key={action.title} href={action.href} className="block group relative overflow-hidden rounded-3xl h-40 bg-[#141414] border border-white/[0.04] p-6 transition-all duration-350 hover:-translate-y-1 hover:border-luxury-gold/30 hover:shadow-[0_12px_30px_rgba(197,168,128,0.04)]">
              {/* High Resolution Photography Background */}
              <img
                src={action.image}
                alt={action.title}
                className="absolute inset-0 object-cover w-full h-full opacity-15 mix-blend-luminosity group-hover:scale-105 group-hover:opacity-25 transition-all duration-700 pointer-events-none"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/90 via-[#0e0e0e]/40 to-transparent pointer-events-none" />

              <div className="relative h-full flex flex-col justify-between z-10 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-medium">
                    {action.label}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-white/30 group-hover:text-luxury-gold transition-colors duration-300" />
                </div>
                <div className="space-y-1 mt-auto">
                  <h4 className="font-serif text-lg text-white font-medium group-hover:text-luxury-gold transition-colors duration-300">
                    {action.title}
                  </h4>
                  <p className="text-xs text-white/50 leading-relaxed font-light">{action.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
