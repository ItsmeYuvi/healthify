"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { Calendar, Dumbbell, Salad, User, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Plan {
  id: string;
  plan_name: string;
  goal: string;
  duration_weeks: number;
  created_at: string;
  daily_plans: any[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch user info
    axios
      .get(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserName(res.data.full_name);
      })
      .catch(() => {
        // If auth fails, redirect
        localStorage.removeItem("access_token");
        router.push("/login");
      });

    // Fetch plans
    axios
      .get(`${API_BASE_URL}/api/v1/plans/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPlans(res.data))
      .catch((err) => {
        const status = err.response?.status;
        if (status === 401) {
          localStorage.removeItem("access_token");
          router.push("/login");
        } else {
          setError("Failed to load plans. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6 text-primary-600" />
            My Dashboard
          </h1>
          {userName && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Welcome back, {userName}!
            </p>
          )}
        </div>
        <Link href="/plan" className="btn-primary">
          + New Plan
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {plans.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No plans yet. Create your first AI-powered fitness plan!
          </p>
          <Link href="/plan" className="btn-primary mt-4 inline-block">
            Generate Plan
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="card">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{plan.plan_name}</h3>
                <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                  {plan.duration_weeks} week{plan.duration_weeks > 1 ? "s" : ""}
                </span>
              </div>
              <p className="mt-1 text-sm capitalize text-gray-500 dark:text-gray-400">
                {plan.goal.replace(/_/g, " ")}
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Dumbbell className="h-4 w-4" />
                  {plan.daily_plans?.length || 0} days
                </span>
                <span className="flex items-center gap-1">
                  <Salad className="h-4 w-4" />
                  Meals included
                </span>
              </div>
              <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                Created {new Date(plan.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
