"use client";

import { PlanForm } from "@/components/PlanForm";
import { Sparkles } from "lucide-react";

export default function PlanPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-primary-600" />
          Generate Your AI Plan
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Fill in your details below and let Gemini AI craft a personalized fitness, yoga, and nutrition plan.
        </p>
      </div>
      <PlanForm />
    </div>
  );
}
