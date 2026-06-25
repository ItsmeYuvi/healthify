"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { GreetingBanner } from "@/components/dashboard/GreetingBanner";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentPlans } from "@/components/dashboard/RecentPlans";
import { TodaySummary } from "@/components/dashboard/TodaySummary";
import { WeeklyChart } from "@/components/dashboard/WeeklyChart";
import { LoadingGlass } from "@/components/shared/LoadingGlass";

export default function DashboardPage() {
  const [plansCount, setPlansCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    axios
      .get(`${API_BASE_URL}/api/v1/plans/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPlansCount(res.data?.length || 0);
      })
      .catch((err) => {
        console.error("[Dashboard] failed to fetch plans count", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingGlass />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome / Header */}
      <GreetingBanner />

      {/* Metric Cards Grid */}
      <StatsGrid plansCount={plansCount} />

      {/* Log shortcuts grid */}
      <QuickActions />

      {/* Main Widgets layout */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-1">
          <RecentPlans />
        </div>
        <div className="md:col-span-1">
          <TodaySummary />
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <WeeklyChart />
        </div>
      </div>
    </div>
  );
}
