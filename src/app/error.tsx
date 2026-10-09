"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ScholarAI Error Boundary]:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[450px] p-6 text-center space-y-4 animate-fade-in-up">
      <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-800/60 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-rose-400" />
      </div>

      <div className="space-y-1 max-w-md">
        <h2 className="text-xl font-bold text-slate-100">Application Recovered</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          {error.message || "An unexpected error occurred. ScholarAI safeguard prevented a system crash."}
        </p>
      </div>

      <Button
        onClick={() => reset()}
        className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-5 text-xs h-9 gap-1.5 shadow-md shadow-cyan-950/50"
      >
        <RefreshCw className="w-3.5 h-3.5" /> Reload Component
      </Button>
    </div>
  );
}
