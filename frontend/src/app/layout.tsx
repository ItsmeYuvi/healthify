import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import ClientDock from "@/components/ClientDock";
import MeshGradient from "@/components/MeshGradient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Healthify — AI Fitness & Nutrition Planner",
  description:
    "Get personalized exercise, yoga, and nutrition plans powered by AI.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.className} min-h-screen bg-[#050505] text-white noise-overlay relative pb-28 selection:bg-cyan-500/30`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <MeshGradient />
          <Navbar />
          <main className="container mx-auto px-4 py-6 relative z-10">{children}</main>
          <ClientDock />
        </ThemeProvider>
      </body>
    </html>
  );
}

