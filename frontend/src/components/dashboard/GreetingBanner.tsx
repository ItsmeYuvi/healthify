"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";

export function GreetingBanner() {
  const [userName, setUserName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("healthify_user_fullname") || "";
    }
    return "";
  });
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const token = localStorage.getItem("access_token");
    if (token) {
      axios
        .get(`${API_BASE_URL}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUserName(res.data.full_name);
          localStorage.setItem("healthify_user_fullname", res.data.full_name);
        })
        .catch(() => {});
    }
  }, []);

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="border-b border-white/[0.04] pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div className="space-y-1.5">
        <span className="text-xs uppercase tracking-widest text-luxury-gold font-medium">Bespoke Wellness Dashboard</span>
        <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight">
          {greeting}, <span className="italic text-luxury-gold font-light">{userName || "Member"}</span>
        </h1>
      </div>
      <div className="md:text-right">
        <p className="text-sm font-semibold text-white/80">{formattedDate}</p>
        <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">Executive Wellness Portfolio</p>
      </div>
    </div>
  );
}
export default GreetingBanner;
