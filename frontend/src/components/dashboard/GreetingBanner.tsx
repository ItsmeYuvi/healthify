"use client";
import React, { useEffect, useState } from "react";
import { ShinyText } from "../reactbits/text-animations/ShinyText";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";

export function GreetingBanner() {
  const [userName, setUserName] = useState("");
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning 🌅");
    else if (hour < 17) setGreeting("Good afternoon 🌤️");
    else setGreeting("Good evening 🌙");

    const token = localStorage.getItem("access_token");
    if (token) {
      axios
        .get(`${API_BASE_URL}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUserName(res.data.full_name))
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
    <div className="space-y-1.5">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
        {greeting},{" "}
        <ShinyText text={userName || "Athlete"} className="font-extrabold" />
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-white/40">
        <span className="font-semibold">{formattedDate}</span>
        <span className="hidden sm:inline">•</span>
        <span>Let's lock in your metrics and progress today.</span>
      </div>
    </div>
  );
}
export default GreetingBanner;
