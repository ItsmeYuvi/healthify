"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, Dumbbell, LineChart, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Plans", href: "/plans", icon: ClipboardList },
    { label: "Log", href: "/log/workout", icon: Dumbbell },
    { label: "Progress", href: "/progress", icon: LineChart },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-40 h-14 md:hidden rounded-2xl border border-white/[0.04] bg-[#141414]/90 backdrop-blur-2xl px-6 py-2 shadow-2xl flex items-center justify-between">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center p-1 rounded-xl transition-all duration-300",
              isActive ? "text-luxury-gold scale-105" : "text-white/50 hover:text-white"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[9px] font-semibold mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
export default MobileNav;
