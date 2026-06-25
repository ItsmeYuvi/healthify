"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, Dumbbell, LogOut } from "lucide-react";
import { Dock } from "./Dock";

export function ClientDock() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    // Listen for storage / custom auth events
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname]);

  if (!isLoggedIn) return null;

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    // Dispatch event so other components (like Navbar) update immediately
    window.dispatchEvent(new Event("storage"));
    router.push("/login");
  };

  const dockItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Dashboard",
      href: "/dashboard",
      isActive: pathname === "/dashboard",
    },
    {
      icon: <Dumbbell className="h-5 w-5" />,
      label: "AI Plans",
      href: "/plan",
      isActive: pathname.startsWith("/plan"),
    },
    {
      icon: <LogOut className="h-5 w-5 text-red-400" />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto">
        <Dock items={dockItems} />
      </div>
    </div>
  );
}
export default ClientDock;
