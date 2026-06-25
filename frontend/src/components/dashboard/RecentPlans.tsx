"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { GlassCard } from "../ui/GlassCard";
import { GlassBadge } from "../ui/GlassBadge";
import { Dumbbell, Salad, ArrowRight, ClipboardList, Clock } from "lucide-react";
import { ShinyText } from "../reactbits/text-animations/ShinyText";

interface Plan {
  id: string;
  plan_name: string;
  goal: string;
  duration_weeks: number;
  week_number?: number;
  created_at: string;
  daily_plans?: any[];
}

const GOAL_LABELS: Record<string, string> = {
  fat_loss: "Fat Loss",
  weight_gain: "Weight Gain",
  muscle_build: "Muscle Build",
  endurance: "Endurance",
  flexibility: "Flexibility",
  general_health: "General Health",
};

export function RecentPlans() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    axios
      .get(`${API_BASE_URL}/api/v1/plans/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const sorted = (res.data || []).sort(
          (a: Plan, b: Plan) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setPlans(sorted.slice(0, 3));
      })
      .catch((err) => console.error("[RecentPlans] failed to fetch plans", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <GlassCard className="p-6 bg-zinc-50/50 dark:bg-white/[0.01] border-zinc-200 dark:border-white/5 flex flex-col justify-center items-center h-[260px]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500/20 border-t-violet-500" />
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 bg-zinc-50/50 dark:bg-white/[0.01] border-zinc-200 dark:border-white/5 flex flex-col h-full justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-white/40 flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-violet-500 dark:text-violet-400" />
            Recent Blueprints
          </h3>
          {plans.length > 0 && (
            <Link href="/plans" className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5">
              <ClipboardList className="h-6 w-6 text-zinc-400 dark:text-white/20" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-white/40 max-w-[200px]">No fitness plans found. Let's create your first one.</p>
            <Link href="/plans/create">
              <span className="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-600 dark:text-violet-300 border border-violet-500/30 hover:bg-violet-500/30 transition-colors">
                Generate Plan
              </span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {plans.map((plan) => {
              const workoutDaysCount = plan.daily_plans?.filter((dp) => dp.exercises && dp.exercises.length > 0).length || 0;
              const dateStr = new Date(plan.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={plan.id}
                  onClick={() => router.push(`/plans/${plan.id}`)}
                  className="group flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/[0.01] hover:bg-zinc-100 dark:hover:bg-white/[0.03] transition-all cursor-pointer"
                >
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-zinc-800 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {plan.plan_name}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 dark:text-white/40">
                      <span>{GOAL_LABELS[plan.goal] || plan.goal}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" /> {dateStr}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <GlassBadge variant="violet" className="text-[9px] font-bold">
                      {workoutDaysCount} workouts
                    </GlassBadge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </GlassCard>
  );
}

export default RecentPlans;
