import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { PageTransition } from "@/components/ui/PageTransition";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScholarAI — AI-Powered Scholarship Finder",
  description:
    "Find the perfect scholarship using AI-powered eligibility analysis. Built for the SerpApi Hackathon.",
  keywords: ["scholarship", "AI", "eligibility", "student", "SerpApi"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head />
      <body>
        <div className="app-shell">
          <Sidebar />
          <main className="app-main">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
