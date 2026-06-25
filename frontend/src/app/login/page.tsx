"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { User, Mail, Lock, ShieldAlert, Dumbbell } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { StarBorder } from "@/components/StarBorder";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", fullName: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let res;
      if (isRegister) {
        const payload = {
          email: form.email.trim(),
          password: form.password,
          full_name: form.fullName.trim(),
        };
        res = await axios.post(`${API_BASE_URL}/api/v1/auth/register`, payload, {
          timeout: 30000,
        });
      } else {
        const params = new URLSearchParams();
        params.append("username", form.email.trim());
        params.append("password", form.password);
        res = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          timeout: 30000,
        });
      }

      localStorage.setItem("access_token", res.data.access_token);
      // Dispatch storage event so layout components (like Navbar/Dock) update state immediately
      window.dispatchEvent(new Event("storage"));
      router.push("/dashboard");
    } catch (err: any) {
      console.error("[Auth] Error:", err);

      let message = "Something went wrong.";
      if (err.code === "ECONNABORTED") {
        message = "Connection timed out. The server may be starting up (free tier). Please wait 30 seconds and try again.";
      } else if (err.code === "ERR_NETWORK") {
        message = "Cannot connect to server. Please check your internet connection.";
      } else if (err.response) {
        const status = err.response.status;
        const detail = err.response.data?.detail;
        if (status === 400) {
          message = detail || "Invalid request.";
        } else if (status === 401) {
          message = detail || "Incorrect email or password.";
        } else if (status === 422) {
          message = detail || "Invalid input data. Please check all fields.";
        } else if (status === 500) {
          message = detail || "Server error. Please try again in a few moments.";
        } else {
          message = `Server error (${status}): ${detail || "Unknown error"}`;
        }
      } else if (err.message) {
        message = err.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md py-12 px-4 text-white">
      <GlassCard spotlightColor="rgba(6, 182, 212, 0.08)" borderGlowColor="rgba(6, 182, 212, 0.3)" className="shadow-2xl p-8 relative">
        {/* Ambient background glows inside the card */}
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

        <div className="relative space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-white/[0.04] border border-white/10 text-cyan-400 mx-auto shadow-glass-sm">
              <Dumbbell className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {isRegister ? "Create Account" : "Access Blueprint"}
            </h2>
            <p className="text-xs font-semibold text-white/40">
              {isRegister ? "Sign up to start your fitness journey" : "Sign in to manage your health schemes"}
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 p-3.5 text-xs text-red-400">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1">
                <label className="label">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={handleChange}
                    className="input pl-10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="label">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@domain.com"
                  value={form.email}
                  onChange={handleChange}
                  className="input pl-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="label">Password</label>
                {!isRegister && (
                  <span className="text-[11px] text-cyan-400 hover:underline cursor-pointer">Forgot?</span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="input pl-10"
                />
              </div>
              {isRegister && (
                <p className="text-[10px] text-white/40">Minimum 8 characters containing letters & numbers.</p>
              )}
            </div>

            <StarBorder color="#06b6d4" speed="3.5s" className="w-full mt-6" type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Authorizing...</span>
                </div>
              ) : (
                <span>{isRegister ? "Register Credentials" : "Enter Dashboard"}</span>
              )}
            </StarBorder>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {isRegister ? "Already registered? Sign In" : "New candidate? Create an Account"}
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
