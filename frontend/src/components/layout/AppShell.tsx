"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileNav } from "./MobileNav";
import { LoadingGlass } from "../shared/LoadingGlass";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
        <LoadingGlass />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative">
      {/* Sidebar - Collapsible left drawer */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      {/* TopBar - Fixed right-hand header bar */}
      <TopBar collapsed={collapsed} />

      {/* Main Content Area */}
      <div
        className={cn(
          "min-h-screen pt-20 px-6 pb-24 md:pb-8 transition-all duration-300",
          collapsed ? "md:ml-20" : "md:ml-64"
        )}
      >
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>

      {/* Bottom Nav on Mobile devices */}
      <MobileNav />
    </div>
  );
}
export default AppShell;
