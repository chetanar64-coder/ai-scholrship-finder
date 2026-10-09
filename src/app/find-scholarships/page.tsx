import type { Metadata } from "next";
import Link from "next/link";
import { getLatestUserEmail, getScholarshipMatches } from "@/actions/scholarships";
import { prisma } from "@/lib/db";
import { DbMatchesSection } from "@/components/scholarships/DbMatchesSection";
import { LiveSearchSection } from "@/components/scholarships/LiveSearchSection";
import { Button } from "@/components/ui/button";
import { Search, UserCheck, AlertCircle, ArrowRight, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Find Scholarships — Dual AI & Live Web Finder",
  description: "Discover curated scholarships from our database and real-time opportunities scraped via SerpApi Google Search.",
};

export default async function FindScholarshipsPage() {
  const email = await getLatestUserEmail();

  let user = null;
  let matchesResponse = null;

  if (email) {
    user = await prisma.user.findUnique({ where: { email } });
    matchesResponse = await getScholarshipMatches(email);
  }

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Search className="w-3.5 h-3.5" />
            <span>Dual-Engine Scholarship Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Find Scholarships
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Matching verified local database opportunities with real-time web results from SerpApi Google Search.
          </p>
        </div>

        {/* Profile Status Badge */}
        {user ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-800/40 text-xs shrink-0">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="font-bold text-slate-200">{user.name}</div>
              <div className="text-[10px] text-slate-400">
                {user.course} • {user.category} Category
              </div>
            </div>
          </div>
        ) : (
          <Button
            asChild
            size="sm"
            className="bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-xs shrink-0 gap-1.5"
          >
            <Link href="/profile">
              <AlertCircle className="w-3.5 h-3.5" /> Complete Profile <ArrowRight className="w-3 h-3" />
            </Link>
          </Button>
        )}
      </div>

      {/* No Profile Alert Banner if applicable */}
      {!user && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 flex items-center justify-between gap-4 text-amber-200 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>No Profile Found:</strong> Complete your student profile to enable AI match scoring for local database scholarships. Live web search is still available below!
            </span>
          </div>
          <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shrink-0">
            <Link href="/profile">Set Up Profile</Link>
          </Button>
        </div>
      )}

      {/* Top Section: Local Database Matched Scholarships (Phase 2 Eligibility Engine) */}
      {matchesResponse && matchesResponse.status === "success" && (
        <DbMatchesSection
          results={matchesResponse.results}
          userName={matchesResponse.userName}
        />
      )}

      {/* Bottom Section: Real-Time Web Search (Phase 3 Core SerpApi Integration) */}
      <LiveSearchSection
        userEmail={email || undefined}
        userCourse={user?.course || "Engineering"}
        userCategory={user?.category || "OBC"}
      />
    </div>
  );
}
