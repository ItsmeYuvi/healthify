"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";

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
        res = await axios.post(`${API_BASE_URL}/api/v1/auth/register`, {
          email: form.email,
          password: form.password,
          full_name: form.fullName,
        });
      } else {
        const params = new URLSearchParams();
        params.append("username", form.email);
        params.append("password", form.password);
        res = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
      }
      localStorage.setItem("access_token", res.data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md py-12">
      <div className="card">
        <h2 className="text-2xl font-bold text-center">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {isRegister ? "Sign up to start your fitness journey" : "Sign in to your Healthify account"}
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isRegister && (
            <div>
              <label className="label">Full Name</label>
              <input type="text" name="fullName" required value={form.fullName} onChange={handleChange} className="input" />
            </div>
          )}
          <div>
            <label className="label">Email</label>
            <input type="email" name="email" required value={form.email} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" name="password" required minLength={8} value={form.password} onChange={handleChange} className="input" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Please wait..." : isRegister ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-primary-600 hover:underline dark:text-primary-400"
          >
            {isRegister ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
