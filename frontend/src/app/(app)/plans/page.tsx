"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { GlassModal } from "@/components/ui/GlassModal";
import { Dumbbell, Salad, Plus, Search, Trash2, ArrowRight, ClipboardList, ShieldAlert } from "lucide-react";
import { ShinyText } from "@/components/reactbits/text-animations/ShinyText";

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

export default function PlansHubPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Deletion modal state
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    axios
      .get(`${API_BASE_URL}/api/v1/plans/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPlans(res.data || []);
      })
      .catch((err) => {
        console.error("[PlansHub] failed to fetch plans", err);
        setError("Could not load fitness plans. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteConfirm = async () => {
    if (!deletePlanId) return;
    setDeleteLoading(true);
    setError("");

    const token = localStorage.getItem("access_token");
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/plans/${deletePlanId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans((prev) => prev.filter((p) => p.id !== deletePlanId));
      setDeletePlanId(null);
    } catch (err) {
      console.error("[PlansHub] delete failed", err);
      setError("Failed to delete the blueprint. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredPlans = plans
    .filter((p) => {
      if (activeFilter === "all") return true;
      return p.goal === activeFilter;
    })
    .filter((p) => {
      if (!search.trim()) return true;
      return p.plan_name.toLowerCase().includes(search.toLowerCase());
    });

  const uniqueGoals = ["all", ...Array.from(new Set(plans.map((p) => p.goal)))];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Plans <ShinyText text="Blueprints" />
          </h1>
          <p className="text-xs text-white/40">Manage your active AI generated training blueprints.</p>
        </div>
        <Link href="/plans/create">
          <GlassButton variant="violet" className="gap-2 text-xs font-bold py-2.5">
            <Plus className="h-4 w-4" /> New Blueprint
          </GlassButton>
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-3 flex items-center text-white/40 pointer-events-none">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search blueprints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-semibold pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#0c0c12]/50 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
          />
        </div>

        {/* Goal Filters */}
        {plans.length > 0 && (
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {uniqueGoals.map((goal) => (
              <button
                key={goal}
                onClick={() => setActiveFilter(goal)}
                className={`rounded-xl px-4 py-2 text-xs font-bold border transition-all ${
                  activeFilter === goal
                    ? "bg-violet-500 text-white border-transparent shadow-md"
                    : "bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {GOAL_LABELS[goal] || goal.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Plans */}
      {filteredPlans.length === 0 ? (
        <GlassCard className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white/[0.01] border-white/5">
          <div className="rounded-2xl bg-white/[0.03] p-4 border border-white/5">
            <ClipboardList className="h-10 w-10 text-white/20" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Blueprints Found</h3>
            <p className="text-xs text-white/40 max-w-sm px-4">
              {plans.length === 0
                ? "You haven't generated any customized blueprints yet."
                : "No training plans match your active filter."}
            </p>
          </div>
          {plans.length === 0 && (
            <Link href="/plans/create">
              <GlassButton variant="violet" className="text-xs font-bold px-5 py-2.5">
                Create First Plan
              </GlassButton>
            </Link>
          )}
        </GlassCard>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan) => {
            const workoutDaysCount = plan.daily_plans?.filter((dp) => dp.exercises && dp.exercises.length > 0).length || 0;
            const weekNum = plan.week_number || 1;

            return (
              <GlassCard
                key={plan.id}
                onClick={() => router.push(`/plans/${plan.id}`)}
                spotlightColor="rgba(139, 92, 246, 0.15)"
                className="hover:shadow-lg cursor-pointer flex flex-col justify-between h-full bg-white/[0.01] border-white/5 p-5 group"
              >
                <div className="space-y-4">
                  {/* Badge Row */}
                  <div className="flex items-center justify-between">
                    <GlassBadge variant="violet" className="text-[10px] font-bold">
                      Week {weekNum}
                    </GlassBadge>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-semibold text-white/40">{plan.duration_weeks} weeks</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletePlanId(plan.id);
                        }}
                        className="rounded-lg p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-white/5"
                        title="Delete Blueprint"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Goal */}
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold group-hover:text-violet-400 transition-colors leading-tight">
                      {plan.plan_name}
                    </h3>
                    <p className="text-xs text-white/40">
                      Goal: <span className="font-bold text-white/60">{GOAL_LABELS[plan.goal] || plan.goal}</span>
                    </p>
                  </div>

                  {/* Indicators */}
                  <div className="grid grid-cols-2 gap-3 border-y border-white/[0.06] py-3 text-xs text-white/60">
                    <div className="flex items-center gap-2">
                      <Dumbbell className="h-4 w-4 text-violet-400" />
                      <span>{workoutDaysCount} workouts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Salad className="h-4 w-4 text-teal-400" />
                      <span>7-day diet</span>
                    </div>
                  </div>
                </div>

                {/* Footer details */}
                <div className="mt-5 flex items-center justify-between text-[10px]">
                  <span className="text-white/30">
                    Created {new Date(plan.created_at).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-violet-400 group-hover:text-violet-300 transition-colors">
                    Enter Blueprint
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Deletion Modal */}
      <GlassModal
        isOpen={deletePlanId !== null}
        onClose={() => setDeletePlanId(null)}
        title="Delete Blueprint?"
      >
        <div className="space-y-4">
          <p className="text-xs text-white/60 leading-relaxed">
            Are you sure you want to permanently delete this fitness and nutrition blueprint? This action is irreversible.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <GlassButton
              variant="outline"
              onClick={() => setDeletePlanId(null)}
              className="text-xs font-bold"
            >
              Cancel
            </GlassButton>
            <GlassButton
              variant="danger"
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className="text-xs font-bold"
            >
              {deleteLoading ? "Deleting..." : "Yes, Delete"}
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
