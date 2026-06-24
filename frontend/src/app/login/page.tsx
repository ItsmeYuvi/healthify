"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { User, Mail, Lock, ShieldAlert, Dumbbell } from "lucide-react";

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
    <div className="mx-auto max-w-md py-12 px-4 text-gray-900 dark:text-gray-100">
      <div className="card shadow-2xl relative border border-gray-250 bg-white p-8 dark:border-gray-800 dark:bg-gray-900/60 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-450 mx-auto">
              <Dumbbell className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-extrabold">
              {isRegister ? "Create Account" : "Access Blueprint"}
            </h2>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {isRegister ? "Sign up to start your fitness journey" : "Sign in to manage your health schemes"}
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 p-3.5 text-xs text-red-650 dark:text-red-400">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1">
                <label className="label text-xs uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-450">
                    <User className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={handleChange}
                    className="input pl-10 bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 dark:bg-gray-955 dark:border-gray-805 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="label text-xs uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-455">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@domain.com"
                  value={form.email}
                  onChange={handleChange}
                  className="input pl-10 bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 dark:bg-gray-955 dark:border-gray-805 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="label text-xs uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">Password</label>
                {!isRegister && (
                  <span className="text-[11px] text-gray-400 hover:text-emerald-500 cursor-pointer">Forgot?</span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-455">
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
                  className="input pl-10 bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 dark:bg-gray-955 dark:border-gray-805 dark:text-white"
                />
              </div>
              {isRegister && (
                <p className="text-[10px] text-gray-450 dark:text-gray-500">Minimum 8 characters containing letters & numbers.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 mt-6 font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-transform bg-emerald-600 hover:bg-emerald-555"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Authorizing...</span>
                </>
              ) : (
                <span>{isRegister ? "Register Credentials" : "Enter Dashboard"}</span>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-450 hover:underline hover:text-emerald-700 dark:hover:text-emerald-350"
            >
              {isRegister ? "Already registered? Sign In" : "New candidate? Create an Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
