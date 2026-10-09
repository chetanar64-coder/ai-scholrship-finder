import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { executeSerpSearch, type SerpApiResult } from "@/lib/serpapi";
import { analyseAllScholarships } from "@/lib/eligibility";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, email } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: "Messages array is required." },
        { status: 400 }
      );
    }

    const latestUserMessage = messages[messages.length - 1].content || "";

    // 1. Fetch Student Profile Context
    let user = null;
    if (email) {
      user = await prisma.user.findUnique({ where: { email } });
    }
    if (!user) {
      user = await prisma.user.findFirst({ orderBy: { updatedAt: "desc" } });
    }

    // 2. Fetch Local Database Matches
    const dbScholarships = await prisma.scholarship.findMany();
    const localMatches = user ? analyseAllScholarships(user, dbScholarships) : [];

    // 3. Perform RAG Web Search via SerpApi
    const serpResponse = await executeSerpSearch(latestUserMessage, user);
    const liveWebResults = serpResponse.results;

    // 4. Construct System Prompt & RAG Context Window
    const profileSummary = user
      ? `Student Profile: ${user.name}, Course: ${user.course} (Semester ${user.semester}), Category: ${user.category}, CGPA: ${user.cgpa}, Family Income: ₹${user.familyIncome.toLocaleString("en-IN")}.`
      : "Student Profile: Guest Student (Default B.Tech, General Category).";

    const topDbMatchesText = localMatches.slice(0, 3).map((m) => 
      `- [${m.scholarship.name}](${m.scholarship.applyLink}) | Provider: ${m.scholarship.provider} | Amount: ₹${m.scholarship.amount.toLocaleString("en-IN")} | Match Score: ${m.score}% (${m.eligible ? "Eligible" : "Ineligible"})`
    ).join("\n");

    const serpWebResultsText = liveWebResults.slice(0, 4).map((r: SerpApiResult) => 
      `- [${r.title}](${r.link}) | Source: ${r.sourceDomain} | Snippet: ${r.snippet}`
    ).join("\n");

    const systemInstruction = `
You are ScholarAI, an expert AI Scholarship & Financial Aid Advisor for Indian students.
${profileSummary}

Verified Local Database Matches:
${topDbMatchesText || "No local DB matches."}

Live Web Opportunities (Retrieved via SerpApi Google Search):
${serpWebResultsText || "No web search results."}

Instruction:
Answer the student's question concisely, encouragingly, and clearly.
1. Directly address their prompt.
2. Cite specific scholarship names, eligibility criteria, and award amounts.
3. ALWAYS include clickable markdown links [Scholarship Name](URL) for any scholarship or portal you mention so the student can apply directly.
4. Keep formatting clean with bullet points and bold text for readability.
`.trim();

    const fullPrompt = `${systemInstruction}\n\nStudent Query: "${latestUserMessage}"`;

    // ─── 5. PRIMARY LLM PROVIDER: Google Gemini API ────────────────────────────
    const geminiKey = process.env.GEMINI_API_KEY?.trim();

    if (geminiKey) {
      try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(fullPrompt);
        const aiText = result.response.text();

        if (aiText && aiText.trim().length > 0) {
          return NextResponse.json({
            success: true,
            message: aiText,
            sources: liveWebResults.slice(0, 3).map((r) => ({ title: r.title, link: r.link, domain: r.sourceDomain })),
            providerUsed: "Google Gemini (Primary)",
          });
        }
      } catch (geminiErr: any) {
        console.warn("[Gemini API Error - Falling back to OpenRouter]:", geminiErr.message);
      }
    }

    // ─── 6. SECONDARY FALLBACK LLM PROVIDER: OpenRouter API ─────────────────────
    const openrouterKey = process.env.OPENROUTER_API_KEY?.trim();

    if (openrouterKey) {
      try {
        const openrouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openrouterKey}`,
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "ScholarAI Finder",
          },
          body: JSON.stringify({
            model: "google/gemini-2.0-flash-001",
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: latestUserMessage },
            ],
            temperature: 0.7,
          }),
        });

        if (openrouterRes.ok) {
          const openrouterData = await openrouterRes.json();
          const openrouterText = openrouterData.choices?.[0]?.message?.content;

          if (openrouterText && openrouterText.trim().length > 0) {
            return NextResponse.json({
              success: true,
              message: openrouterText,
              sources: liveWebResults.slice(0, 3).map((r) => ({ title: r.title, link: r.link, domain: r.sourceDomain })),
              providerUsed: "OpenRouter (Secondary Fallback)",
            });
          }
        } else {
          const errBody = await openrouterRes.text();
          console.warn("[OpenRouter API Error]:", errBody);
        }
      } catch (openrouterErr: any) {
        console.warn("[OpenRouter Exception]:", openrouterErr.message);
      }
    }

    // ─── 7. TERTIARY FALLBACK: Local Contextual Generator ───────────────────────
    let replyText = "";
    const lowerPrompt = latestUserMessage.toLowerCase();

    if (/eligible|match|find|qualified|fit/i.test(lowerPrompt)) {
      replyText = `Based on your profile as a **${user?.course || "B.Tech"}** student (${user?.category || "OBC"} category, CGPA: ${user?.cgpa || 8.0}), here are your top matched opportunities:\n\n`;

      if (localMatches.length > 0) {
        const top = localMatches[0];
        replyText += `### 🎯 Top Local Match: [${top.scholarship.name}](${top.scholarship.applyLink})\n`;
        replyText += `- **Match Score**: **${top.score}%** (${top.eligible ? "Eligible" : "Ineligible"})\n`;
        replyText += `- **Award**: ₹${top.scholarship.amount.toLocaleString("en-IN")} / year\n`;
        replyText += `- **Provider**: ${top.scholarship.provider}\n\n`;
      }

      if (liveWebResults.length > 0) {
        replyText += `### 🌐 Real-Time Web Search Results (via SerpApi):\n`;
        liveWebResults.slice(0, 3).forEach((r) => {
          replyText += `- [${r.title}](${r.link}) — *${r.sourceDomain}*\n  ${r.snippet}\n\n`;
        });
      }
      replyText += `\n*Tip: Add your GEMINI_API_KEY or OPENROUTER_API_KEY in .env for full streaming AI responses!*`;
    } else if (/document|require|apply|how|step|portal/i.test(lowerPrompt)) {
      replyText = `### 📋 Application Checklist & Portal Guide\n\n`;
      replyText += `When applying for scholarships on portals like [National Scholarship Portal (NSP)](https://scholarships.gov.in) or [Buddy4Study](https://www.buddy4study.com), make sure you have:\n\n`;
      replyText += `1. **Aadhaar Card** & linked active Bank Account for Direct Benefit Transfer (DBT).\n`;
      replyText += `2. **Income Certificate** (issued by Tehsildar or competent state authority).\n`;
      replyText += `3. **Caste / Category Certificate** (for ${user?.category || "reserved"} category benefits).\n`;
      replyText += `4. **Grade Sheet / Marksheets** showing current CGPA (${user?.cgpa || 8.0}).\n`;
      replyText += `5. **College ID & Bonafide Certificate** from your institute.\n\n`;
      if (liveWebResults.length > 0) {
        replyText += `### 🔗 Live Portals Discovered via SerpApi:\n`;
        liveWebResults.slice(0, 2).forEach((r) => {
          replyText += `- [${r.title}](${r.link}) (*${r.sourceDomain}*)\n`;
        });
      }
    } else {
      replyText = `Hello **${user?.name || "Student"}**! I analyzed your profile (${user?.course || "B.Tech"}, ${user?.category || "General"}, CGPA ${user?.cgpa || "N/A"}).\n\n`;
      replyText += `Here are the active opportunities retrieved in real-time for your query:\n\n`;
      liveWebResults.slice(0, 3).forEach((r) => {
        replyText += `* **[${r.title}](${r.link})** (*${r.sourceDomain}*)\n  ${r.snippet}\n\n`;
      });
      replyText += `Feel free to ask me about specific eligibility criteria, document requirements, or application deadlines!`;
    }

    return NextResponse.json({
      success: true,
      message: replyText,
      sources: liveWebResults.slice(0, 3).map((r) => ({ title: r.title, link: r.link, domain: r.sourceDomain })),
      providerUsed: "Local Contextual Fallback",
    });
  } catch (err: any) {
    console.error("[Chat API Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process chat response." },
      { status: 500 }
    );
  }
}
