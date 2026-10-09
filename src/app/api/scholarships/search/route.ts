import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildScholarshipQuery, executeSerpSearch } from "@/lib/serpapi";

// Simple in-memory rate limiting map (IP / session timestamp)
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 3000; // 3 seconds minimum between search requests

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const customQuery = searchParams.get("q") || undefined;
  const email = searchParams.get("email") || undefined;

  // 1. Rate Limiting Safeguard
  const clientIp = request.headers.get("x-forwarded-for") || "local-client";
  const now = Date.now();
  const lastRequest = rateLimitMap.get(clientIp);

  if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW_MS) {
    return NextResponse.json(
      {
        error: "Rate limit reached. Please wait a few seconds before searching again.",
      },
      { status: 429 }
    );
  }
  rateLimitMap.set(clientIp, now);

  try {
    // 2. Fetch User Profile for contextual query building
    let user = null;
    if (email) {
      user = await prisma.user.findUnique({ where: { email } });
    }
    
    // If no email passed, get the latest saved user profile
    if (!user) {
      user = await prisma.user.findFirst({
        orderBy: { updatedAt: "desc" },
      });
    }

    // 3. Build Query & Execute Search
    const queryToUse = buildScholarshipQuery(user, customQuery);
    const searchResponse = await executeSerpSearch(queryToUse, user);

    return NextResponse.json({
      success: true,
      data: searchResponse,
      userProfile: user
        ? {
            name: user.name,
            course: user.course,
            category: user.category,
            familyIncome: user.familyIncome,
          }
        : null,
    });
  } catch (err: any) {
    console.error("[API /api/scholarships/search Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to perform SerpApi search.",
      },
      { status: 500 }
    );
  }
}
