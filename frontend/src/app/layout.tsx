import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Healthify — Quiet Luxury Wellness Portfolio",
  description:
    "Proactive AI health concierge, vitality diagnostics, and bespoke executive wellness planner.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#050A0F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="font-sans min-h-screen bg-[#050A0F] text-[#F0F4FF] overflow-x-hidden relative">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
