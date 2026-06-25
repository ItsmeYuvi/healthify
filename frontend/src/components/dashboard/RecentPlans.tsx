"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { ClipboardList, Clock, ArrowRight } from "lucide-react";

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
      <div className="glass-surface bg-[#141414] border-white/[0.04] p-6 flex flex-col justify-center items-center h-[280px]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-luxury-gold/20 border-t-luxury-gold" />
      </div>
    );
  }

  return (
    <div className="glass-surface bg-[#141414] border-white/[0.04] p-6 flex flex-col justify-between h-full space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-luxury-gold flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-luxury-gold" />
            Active Blueprints
          </h3>
          {plans.length > 0 && (
            <Link href="/plans" className="text-xs font-bold text-luxury-gold hover:text-luxury-goldHover flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
            <div className="p-3 rounded-xl bg-white/[0.01] border border-white/[0.04]">
              <ClipboardList className="h-6 w-6 text-white/20" />
            </div>
            <p className="text-xs text-white/40 max-w-[200px]">No fitness plans found. Let's create your first one.</p>
            <Link href="/plans/create">
              <span className="inline-flex items-center text-xs font-semibold px-4 py-2 rounded-xl bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30 hover:bg-luxury-gold/25 transition-all">
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
                  className="group flex items-center justify-between p-3.5 rounded-2xl border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.03] hover:border-luxury-gold/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="space-y-1">
                    <h4 className="font-serif text-sm text-white font-medium group-hover:text-luxury-gold transition-colors duration-300">
                      {plan.plan_name}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-white/40">
                      <span>{GOAL_LABELS[plan.goal] || plan.goal}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" /> {dateStr}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/15">
                      {workoutDaysCount} workouts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentPlans;
