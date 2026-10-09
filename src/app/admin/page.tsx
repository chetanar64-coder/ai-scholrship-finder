import type { Metadata } from "next";
import { getAdminAnalyticsData } from "@/actions/analytics";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { BarChart3, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Analytics — ScholarAI",
  description: "Platform analytics, student demographics, and scholarship eligibility score distributions.",
};

export default async function AdminAnalyticsPage() {
  const analyticsData = await getAdminAnalyticsData();

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrative Control & Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            Admin Analytics
            <BarChart3 className="w-5 h-5 text-cyan-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time platform usage metrics, demographic breakdowns, and eligibility engine performance.
          </p>
        </div>
      </div>

      {/* Main Analytics Visual Dashboard */}
      <AnalyticsDashboard data={analyticsData} />
    </div>
  );
}
