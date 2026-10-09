"use client";

import { useState } from "react";
import type { MatchResult } from "@/lib/eligibility";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Award, Calendar, ExternalLink, ChevronDown, ChevronUp, Database } from "lucide-react";

interface DbMatchesSectionProps {
  results: MatchResult[];
  userName?: string;
}

export function DbMatchesSection({ results, userName }: DbMatchesSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const eligibleCount = results.filter((r) => r.eligible).length;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm mb-1">
            <Database className="w-4 h-4" />
            <span>LOCAL DATABASE ENGINE</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Top Matched Scholarships
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50">
              {eligibleCount} Eligible for {userName || "You"}
            </span>
          </h2>
        </div>
        <div className="text-xs text-slate-400">
          Scored by ScholarAI Eligibility Algorithm
        </div>
      </div>

      {/* Grid of Matched Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((item) => {
          const { scholarship, score, eligible, matchedCriteria, failedCriteria } = item;
          const isExpanded = expandedId === String(scholarship.id);

          // Score Badge Color
          let scoreVariant: "success" | "default" | "destructive" = "destructive";
          if (score >= 80) scoreVariant = "success";
          else if (score >= 50) scoreVariant = "default";

          return (
            <Card
              key={scholarship.id}
              className={`transition-all duration-200 border bg-slate-900/60 backdrop-blur-md hover:border-cyan-500/40 ${
                eligible ? "border-slate-800 hover:shadow-cyan-950/20 hover:shadow-lg" : "border-slate-800/60 opacity-85"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {scholarship.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-400 mt-1">
                      {scholarship.provider}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant={scoreVariant} className="text-xs font-mono font-bold">
                      {score}% Match
                    </Badge>
                    {eligible ? (
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Eligible
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Ineligible
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/40">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                    <Award className="w-4 h-4" />
                    <span>₹{scholarship.amount.toLocaleString("en-IN")} / year</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                <p className="text-slate-300 line-clamp-2 leading-relaxed">
                  {scholarship.description}
                </p>

                {/* Requirements Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Badge variant="secondary" className="text-[10px]">
                    Min CGPA: {scholarship.minCgpa}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    Max Income: ₹{(scholarship.maxIncome / 100000).toFixed(1)}L
                  </Badge>
                </div>

                {/* Collapsible Criteria breakdown */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 animate-fade-in-up">
                    <div className="text-[11px] font-semibold text-emerald-400">
                      Passed Eligibility Signals ({matchedCriteria.length}):
                    </div>
                    <ul className="space-y-1">
                      {matchedCriteria.map((crit, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{crit}</span>
                        </li>
                      ))}
                    </ul>

                    {failedCriteria.length > 0 && (
                      <>
                        <div className="text-[11px] font-semibold text-rose-400 pt-1">
                          Unmet Criteria ({failedCriteria.length}):
                        </div>
                        <ul className="space-y-1">
                          {failedCriteria.map((crit, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                              <XCircle className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                              <span>{crit}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-2 flex items-center justify-between border-t border-slate-800/40">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand(String(scholarship.id))}
                  className="text-xs text-slate-400 hover:text-slate-200 h-8 px-2"
                >
                  {isExpanded ? (
                    <span className="flex items-center gap-1">Hide Details <ChevronUp className="w-3.5 h-3.5" /></span>
                  ) : (
                    <span className="flex items-center gap-1">Criteria Analysis <ChevronDown className="w-3.5 h-3.5" /></span>
                  )}
                </Button>

                <Button
                  asChild
                  size="sm"
                  className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold h-8 text-xs gap-1.5 shadow-md shadow-cyan-950/50"
                >
                  <a href={scholarship.applyLink} target="_blank" rel="noopener noreferrer">
                    Apply Now <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
