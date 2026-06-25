"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlanForm } from "@/components/PlanForm";
import { Sparkles } from "lucide-react";
import { BlurText } from "@/components/BlurText";

export default function PlanPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="space-y-8 max-w-2xl mx-auto pt-6 text-white">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold flex items-center justify-center gap-2 tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
          <Sparkles className="h-6 w-6 text-cyan-400 animate-pulse" />
          <BlurText text="Generate Your AI Plan" animateBy="words" />
        </h1>
        <p className="text-sm text-white/40">
          Fill in your details below and let Gemini AI craft a personalized fitness, yoga, and nutrition plan.
        </p>
      </div>
      <PlanForm />
    </div>
  );
}
