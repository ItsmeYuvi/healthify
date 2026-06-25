"use client";
import React from "react";
import Link from "next/link";
import { GlassCard } from "../ui/GlassCard";
import { Dumbbell, Utensils, Scale, Sparkles } from "lucide-react";

interface ActionItem {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<any>;
  color: string;
  glow: string;
}

const ACTIONS: ActionItem[] = [
  {
    title: "Generate Plan",
    description: "Create an AI fitness/meal program",
    href: "/plans/create",
    icon: Sparkles,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    glow: "rgba(245, 158, 11, 0.15)",
  },
  {
    title: "Log Workout",
    description: "Record your training exercises",
    href: "/log/workout",
    icon: Dumbbell,
    color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    glow: "rgba(139, 92, 246, 0.15)",
  },
  {
    title: "Log Meal",
    description: "Track calories and macronutrients",
    href: "/log/meal",
    icon: Utensils,
    color: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    glow: "rgba(20, 184, 166, 0.15)",
  },
  {
    title: "Log Weight",
    description: "Check in your current progress",
    href: "/progress",
    icon: Scale,
    color: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    glow: "rgba(236, 72, 153, 0.15)",
  },
];

export function QuickActions() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-white/40">Quick Actions</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} href={action.href} className="block group">
              <GlassCard
                spotlightColor={action.glow}
                className="p-5 h-full transition-all duration-300 hover:scale-[1.02] border-white/5 bg-white/[0.01] hover:bg-white/[0.03]"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl border ${action.color} transition-all duration-300 group-hover:scale-110`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white group-hover:text-white transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-xs text-white/40 mt-0.5 leading-snug">{action.description}</p>
                  </div>
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
