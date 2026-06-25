"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { User, Mail, Lock, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassButton } from "@/components/ui/GlassButton";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // 1. Register Account
      await axios.post(`${API_BASE_URL}/api/v1/auth/register`, {
        email: form.email.trim(),
        password: form.password,
        full_name: form.fullName.trim(),
      }, { timeout: 30000 });

      // 2. Automatically Log In
      const params = new URLSearchParams();
      params.append("username", form.email.trim());
      params.append("password", form.password);

      const loginRes = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 30000,
      });

      const token = loginRes.data.access_token;
      localStorage.setItem("access_token", token);
      localStorage.setItem("healthify_user_fullname", form.fullName.trim());
      localStorage.setItem("healthify_user_email", form.email.trim());
      window.dispatchEvent(new Event("storage"));

      // For new registrations, we know profile is empty, so redirect directly to onboarding profile
      router.push("/profile?onboarding=true");
    } catch (err: any) {
      console.error("[Register] Error:", err);
      let message = "Registration failed. Try a different email.";
      if (err.code === "ECONNABORTED") {
        message = "Connection timed out. Please try again.";
      } else if (err.response?.data?.detail) {
        message = err.response.data.detail;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="text-center space-y-1.5">
        <h2 className="text-3xl font-serif text-white font-light tracking-tight">
          Create <span className="italic text-luxury-gold">Account</span>
        </h2>
        <p className="text-xs text-white/40 font-light">
          Sign up to begin your bespoke wellness transformation
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-400">
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <GlassInput
          label="Full Name"
          name="fullName"
          type="text"
          required
          placeholder="e.g., John Doe"
          value={form.fullName}
          onChange={handleChange}
          icon={<User className="h-4 w-4" />}
        />

        <GlassInput
          label="Email Address"
          name="email"
          type="email"
          required
          placeholder="name@domain.com"
          value={form.email}
          onChange={handleChange}
          icon={<Mail className="h-4 w-4" />}
        />

        <div className="relative">
          <GlassInput
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            icon={<Lock className="h-4 w-4" />}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 bottom-3 text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <GlassInput
          label="Confirm Password"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          required
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={handleChange}
          icon={<Lock className="h-4 w-4" />}
        />

        <GlassButton variant="primary" type="submit" loading={loading} className="w-full mt-6 shadow-[0_0_15px_rgba(197,168,128,0.15)]">
          Create Account
        </GlassButton>
      </form>

      <div className="text-center pt-4 border-t border-white/[0.04] space-y-3">
        <p className="text-xs text-white/40 font-light">
          Already registered?{" "}
          <Link href="/login" className="text-luxury-gold hover:text-luxury-gold/80 hover:underline font-semibold">
            Sign In
          </Link>
        </p>
        <div className="text-[10px] text-white/20 select-none font-medium uppercase tracking-widest">
          Secure Connection Protocol Enabled
        </div>
      </div>
    </div>
  );
}
