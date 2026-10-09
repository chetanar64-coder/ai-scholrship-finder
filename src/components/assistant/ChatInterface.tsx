"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Send,
  User,
  Bot,
  RefreshCw,
  ExternalLink,
  Globe,
  HelpCircle,
  Zap,
  CheckCircle2,
  FileText,
  Award,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: { title: string; link: string; domain: string }[];
  providerUsed?: string;
}

interface ChatInterfaceProps {
  userName?: string;
  userCourse?: string;
  userCategory?: string;
  userEmail?: string;
}

export function ChatInterface({
  userName = "Student",
  userCourse = "B.Tech",
  userCategory = "OBC",
  userEmail,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: `Hello **${userName}**! 👋 I am your **ScholarAI Assistant**, supercharged with real-time web search via **SerpApi**.\n\nAsk me anything about scholarship eligibility for **${userCourse}** (${userCategory} category), application deadlines, document requirements, or essay guidance!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          email: userEmail,
        }),
      });

      if (!res.ok) {
        throw new Error(`Chat API error HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to generate AI response");
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sources: data.sources,
        providerUsed: data.providerUsed,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `⚠️ **Error**: ${err.message || "Failed to connect to AI engine. Please try again."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const presetQuestions = [
    "What scholarships am I eligible for?",
    "How do I apply for NSP government grants?",
    "What documents are required for SC/ST/OBC scholarships?",
    "Are there laptop or stipend allowances available?",
  ];

  // Helper to parse simple markdown bold & links in chat bubbles
  const renderFormattedText = (text: string) => {
    // Regex for markdown links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const title = match[1];
      const url = match[2];
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 font-semibold underline hover:text-cyan-300 inline-flex items-center gap-0.5 mx-0.5"
        >
          {title}
          <ExternalLink className="w-3 h-3 inline shrink-0" />
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.map((part, i) => {
      if (typeof part === "string") {
        // Handle bold **text**
        const boldSplit = part.split(/\*\*(.*?)\*\*/g);
        return boldSplit.map((bText, bIdx) =>
          bIdx % 2 === 1 ? (
            <strong key={bIdx} className="font-bold text-slate-100">
              {bText}
            </strong>
          ) : (
            bText
          )
        );
      }
      return part;
    });
  };

  return (
    <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-2xl flex flex-col h-[650px] max-w-4xl mx-auto rounded-2xl overflow-hidden">
      {/* Header */}
      <CardHeader className="py-3 px-5 border-b border-slate-800 bg-slate-950/60 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-950/50 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
              ScholarAI Assistant
              <Badge variant="default" className="text-[10px] bg-cyan-500/10 text-cyan-400 border-cyan-500/20 py-0">
                Web-Augmented RAG
              </Badge>
            </CardTitle>
            <p className="text-[11px] text-slate-400">
              Contextual AI backed by real-time SerpApi Google Search
            </p>
          </div>
        </div>

        <Badge variant="purple" className="text-[10px] font-mono gap-1 py-1 px-2.5">
          <Globe className="w-3 h-3 text-indigo-400" /> SerpApi Live
        </Badge>
      </CardHeader>

      {/* Messages Container */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                msg.role === "user"
                  ? "bg-indigo-600 text-slate-100"
                  : "bg-cyan-950 text-cyan-400 border border-cyan-800/60"
              }`}
            >
              {msg.role === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[82%] rounded-2xl p-3.5 space-y-2 border ${
                msg.role === "user"
                  ? "bg-indigo-600/20 border-indigo-500/30 text-slate-100 rounded-tr-none"
                  : "bg-slate-950/80 border-slate-800 text-slate-200 rounded-tl-none"
              }`}
            >
              <div className="flex items-center justify-between gap-4 text-[10px] text-slate-400 mb-1 border-b border-slate-800/50 pb-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-300">
                    {msg.role === "user" ? userName : "ScholarAI Bot"}
                  </span>
                  {msg.providerUsed && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                      {msg.providerUsed}
                    </span>
                  )}
                </div>
                <span>{msg.timestamp}</span>
              </div>

              <div className="whitespace-pre-wrap leading-relaxed">
                {renderFormattedText(msg.content)}
              </div>

              {/* Injected Sources Drawer */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1">
                  <div className="text-[10px] font-semibold text-indigo-400 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Live Web Sources Verified by SerpApi:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.sources.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] bg-slate-900 hover:bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1 transition-colors max-w-[220px] truncate"
                      >
                        <span className="truncate">{s.title}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-3 animate-fade-in-up">
            <div className="w-8 h-8 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-950/80 border border-slate-800 text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              <span className="text-xs">Searching SerpApi & analyzing eligibility...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      {/* Preset Suggestion Chips */}
      <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/60 flex flex-wrap items-center gap-1.5 overflow-x-auto">
        <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mr-1">
          <HelpCircle className="w-3 h-3 text-cyan-400" /> Suggestions:
        </span>
        {presetQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q)}
            className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800/50 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-700/40 transition-colors whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Footer */}
      <CardFooter className="p-3 bg-slate-950/80 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2 w-full"
        >
          <Input
            type="text"
            placeholder="Ask ScholarAI anything (e.g., 'What scholarships match my CGPA?')..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-500 text-xs sm:text-sm focus:border-cyan-500 h-10"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-4 h-10 gap-1.5 shrink-0 shadow-md shadow-cyan-950/50"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
