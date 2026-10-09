"use server";

import { prisma } from "@/lib/db";
import { analyseAllScholarships, type MatchResult } from "@/lib/eligibility";

export type { MatchResult };

export type ScholarshipMatchResponse =
  | { status: "no_profile" }
  | { status: "no_scholarships" }
  | { status: "success"; results: MatchResult[]; userName: string };

/**
 * Fetches the student profile by email, fetches all scholarships from DB,
 * runs the eligibility engine, and returns sorted match results.
 */
export async function getScholarshipMatches(
  email: string
): Promise<ScholarshipMatchResponse> {
  // 1. Load student profile
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { status: "no_profile" };

  // 2. Load all scholarships
  const scholarships = await prisma.scholarship.findMany({
    orderBy: { amount: "desc" },
  });
  if (scholarships.length === 0) return { status: "no_scholarships" };

  // 3. Run engine
  const results = analyseAllScholarships(user, scholarships);

  return { status: "success", results, userName: user.name };
}

/**
 * Fetches the latest saved profile email from the DB (most recently updated).
 * Used by the dashboard to auto-load without requiring the user to log in.
 */
export async function getLatestUserEmail(): Promise<string | null> {
  const user = await prisma.user.findFirst({
    orderBy: { updatedAt: "desc" },
    select: { email: true },
  });
  return user?.email ?? null;
}
