"use client";
import React from "react";
import { GlassCard } from "../ui/GlassCard";
import { GlassIcon } from "../ui/GlassIcons";
import { CountUp } from "../reactbits/data-display/CountUp";
import * as Icons from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  subtext?: string;
  iconName: keyof typeof Icons;
  color?: "violet" | "teal" | "pink" | "amber" | "rose";
}

export function StatCard({
  title,
  value,
  suffix = "",
  subtext,
  iconName,
  color = "violet",
}: StatCardProps) {
  return (
    <GlassCard spotlightColor="rgba(139, 92, 246, 0.15)" className="p-5 flex flex-col justify-between h-full bg-zinc-50/50 dark:bg-white/[0.01] border-zinc-200 dark:border-white/5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-white/40">{title}</span>
        <GlassIcon name={iconName} color={color} className="h-10 w-10 rounded-xl" />
      </div>
      <div className="mt-4 space-y-1">
        <div className="text-2xl font-extrabold text-zinc-800 dark:text-white flex items-baseline gap-1">
          <CountUp to={value} className="font-extrabold" />
          <span className="text-sm font-semibold text-zinc-500 dark:text-white/60">{suffix}</span>
        </div>
        {subtext && <p className="text-[10px] text-zinc-400 dark:text-white/30 font-semibold">{subtext}</p>}
      </div>
    </GlassCard>
  );
}
export default StatCard;
