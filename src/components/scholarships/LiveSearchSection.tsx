"use client";

import { useState, useEffect, useCallback } from "react";
import type { SerpApiResponse, SerpApiResult } from "@/lib/serpapi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Globe,
  ExternalLink,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Zap,
  Tag,
  Link2,
} from "lucide-react";

interface LiveSearchSectionProps {
  userEmail?: string;
  userCourse?: string;
  userCategory?: string;
}

export function LiveSearchSection({
  userEmail,
  userCourse = "Engineering",
  userCategory = "OBC",
}: LiveSearchSectionProps) {
  const [queryInput, setQueryInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SerpApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(
    async (queryOverride?: string) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (queryOverride !== undefined) {
          if (queryOverride) params.set("q", queryOverride);
        } else if (queryInput.trim()) {
          params.set("q", queryInput.trim());
        }

        if (userEmail) {
          params.set("email", userEmail);
        }

        const res = await fetch(`/api/scholarships/search?${params.toString()}`);
        
        if (res.status === 429) {
          const errData = await res.json();
          throw new Error(errData.error || "Rate limit reached. Please wait 3 seconds.");
        }

        if (!res.ok) {
          throw new Error(`API error HTTP ${res.status}`);
        }

        const json = await res.json();
        if (!json.success) {
          throw new Error(json.error || "Failed to retrieve search results.");
        }

        setData(json.data);
        setActiveQuery(json.data.queryUsed || "");
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching SerpApi search results.");
      } finally {
        setLoading(false);
      }
    },
    [queryInput, userEmail]
  );

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults();
  };

  const handlePresetTagClick = (tagLabel: string) => {
    setQueryInput(tagLabel);
    fetchResults(tagLabel);
  };

  const presetTags = [
    { label: `${userCourse} Grants`, query: `scholarships for ${userCourse} students` },
    { label: `${userCategory} Category`, query: `scholarships for ${userCategory} students India` },
    { label: "Government Portals", query: "government scholarships India 2026 nsp" },
    { label: "Low Income Financial Aid", query: "need based scholarship income under 5 lakhs" },
    { label: "Merit & STEM", query: "merit scholarship STEM female student 2026" },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-1">
            <Globe className="w-4 h-4" />
            <span>LIVE SERPAPI WEB ENGINE</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Real-Time Web Opportunities
            <Sparkles className="w-4 h-4 text-amber-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time web search results from Google Search via SerpApi dynamically matched to your profile.
          </p>
        </div>

        {/* Engine Status Badge */}
        {data && (
          <div className="shrink-0 flex items-center">
            {data.apiKeyPresent && !data.isFallback ? (
              <Badge variant="success" className="gap-1.5 py-1 px-3 text-xs">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Live SerpApi Engine Active
              </Badge>
            ) : (
              <Badge variant="purple" className="gap-1.5 py-1 px-3 text-xs bg-amber-500/10 text-amber-300 border-amber-500/20">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                SerpApi Demo Mode
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Interactive Search Bar & Chips */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search custom scholarships (e.g. 'Engineering women grant', 'State merit')..."
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              className="pl-9 bg-slate-950/80 border-slate-800 text-slate-200 placeholder:text-slate-500 text-xs sm:text-sm focus:border-indigo-500 h-10"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-semibold px-4 text-xs h-10 gap-1.5 shrink-0"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            <span>Search</span>
          </Button>
        </form>

        {/* Quick Filter Tag Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium mr-1">
            <Tag className="w-3 h-3 text-indigo-400" /> Quick Presets:
          </span>
          {presetTags.map((tag, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetTagClick(tag.query)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800/70 hover:bg-indigo-950 hover:text-indigo-300 text-slate-300 border border-slate-700/50 transition-colors"
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Active Query Display */}
        {activeQuery && (
          <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
            <span>Executed Google Query:</span>
            <code className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-indigo-300 font-mono text-[10px]">
              "{activeQuery}"
            </code>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/50 flex items-start gap-3 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-200">Search Request Failed</p>
            <p className="mt-0.5 opacity-90">{error}</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => fetchResults()}
            className="text-xs text-rose-300 hover:text-rose-100 hover:bg-rose-900/40 h-7"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Loading Skeleton Grid */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <Card key={n} className="border-slate-800 bg-slate-900/40 p-4 space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Results Grid */}
      {!loading && data && data.results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.results.map((item: SerpApiResult) => (
            <Card
              key={item.id}
              className="transition-all duration-200 border border-slate-800 bg-slate-900/60 backdrop-blur-md hover:border-indigo-500/40 hover:shadow-indigo-950/20 hover:shadow-lg flex flex-col justify-between"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-mono bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40 max-w-[200px] truncate">
                    <Globe className="w-3 h-3 shrink-0" />
                    <span className="truncate">{item.sourceDomain}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Google Rank #{item.position}
                  </span>
                </div>
                <CardTitle className="text-base font-bold text-slate-100 hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {item.title}
                  </a>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 text-xs flex-1">
                <p className="text-slate-300 line-clamp-3 leading-relaxed">
                  {item.snippet}
                </p>

                {/* Sitelinks if present */}
                {item.sitelinks && item.sitelinks.length > 0 && (
                  <div className="pt-1 space-y-1">
                    <div className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <Link2 className="w-3 h-3 text-indigo-400" /> Direct Deep Links:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.sitelinks.map((sl, sIdx) => (
                        <a
                          key={sIdx}
                          href={sl.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-indigo-300 hover:text-indigo-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1"
                        >
                          {sl.title} <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Match Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.tags.map((tag, tIdx) => (
                    <Badge key={tIdx} variant="secondary" className="text-[10px] bg-slate-800/80 text-indigo-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-2 border-t border-slate-800/40 flex justify-between items-center">
                <span className="text-[10px] text-slate-500">
                  {item.publishedDate || "Verified via SerpApi"}
                </span>

                <Button
                  asChild
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-semibold h-8 text-xs gap-1.5 shadow-md shadow-indigo-950/50"
                >
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    Apply on Web Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && data && data.results.length === 0 && !error && (
        <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-xl space-y-2">
          <p className="text-sm font-semibold text-slate-300">No Web Opportunities Found</p>
          <p className="text-xs text-slate-500">Try refining your search terms or using one of the preset filter tags above.</p>
        </div>
      )}
    </div>
  );
}
