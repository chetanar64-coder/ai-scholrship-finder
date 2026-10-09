import type { Metadata } from "next";
import { getLatestUserEmail } from "@/actions/scholarships";
import { prisma } from "@/lib/db";
import { ChatInterface } from "@/components/assistant/ChatInterface";
import { Sparkles, Bot } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Assistant — ScholarAI",
  description: "Web-augmented RAG scholarship assistant supercharged with live SerpApi search.",
};

export default async function AiAssistantPage() {
  const email = await getLatestUserEmail();
  let user = null;

  if (email) {
    user = await prisma.user.findUnique({ where: { email } });
  }

  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Bot className="w-3.5 h-3.5" />
            <span>AI Scholarship Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            AI Assistant
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ask natural language questions about scholarship eligibility, portal guidelines, and application tips.
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <ChatInterface
        userName={user?.name || "Student"}
        userCourse={user?.course || "B.Tech"}
        userCategory={user?.category || "OBC"}
        userEmail={email || undefined}
      />
    </div>
  );
}
