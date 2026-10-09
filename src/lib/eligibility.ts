import type { Scholarship, User } from "@prisma/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MatchResult = {
  scholarship: Scholarship;
  score: number;        // 0–100
  eligible: boolean;
  matchedCriteria: string[];
  failedCriteria: string[];
};

// ─── Engine ───────────────────────────────────────────────────────────────────

/**
 * Calculates a 0–100 eligibility score for a student against a scholarship.
 *
 * Scoring:
 *   Category match    30 pts  HARD — 0 if not in eligibleCategories
 *   Course match      25 pts  HARD — 0 if not in eligibleCourses
 *   CGPA ≥ minCgpa    25 pts  HARD — 0 if below minimum
 *   Income ≤ maxIncome 20 pts HARD — 0 if above maximum
 *   CGPA headroom      +5 pts BONUS — if cgpa exceeds minCgpa by ≥ 1.0
 *   Income headroom    +5 pts BONUS — if income ≤ 50% of maxIncome
 *
 * All 4 hard criteria must pass for eligible = true.
 */
export function calculateEligibility(
  user: User,
  scholarship: Scholarship
): MatchResult {
  const eligibleCategories: string[] = JSON.parse(
    scholarship.eligibleCategories
  );
  const eligibleCourses: string[] = JSON.parse(scholarship.eligibleCourses);

  const matched: string[] = [];
  const failed: string[] = [];
  let score = 0;
  let allHardPass = true;

  // ── Hard: Category ────────────────────────────────────────────────────────
  if (eligibleCategories.includes(user.category)) {
    score += 30;
    matched.push(`Category (${user.category}) is eligible`);
  } else {
    failed.push(
      `Category (${user.category}) not eligible — requires ${eligibleCategories.join(" / ")}`
    );
    allHardPass = false;
  }

  // ── Hard: Course ──────────────────────────────────────────────────────────
  if (eligibleCourses.includes(user.course)) {
    score += 25;
    matched.push(`Course (${user.course}) is eligible`);
  } else {
    failed.push(
      `Course (${user.course}) not eligible — requires ${eligibleCourses.join(", ")}`
    );
    allHardPass = false;
  }

  // ── Hard: CGPA ────────────────────────────────────────────────────────────
  if (user.cgpa >= scholarship.minCgpa) {
    score += 25;
    matched.push(`CGPA ${user.cgpa.toFixed(2)} meets minimum ${scholarship.minCgpa}`);
  } else {
    failed.push(
      `CGPA ${user.cgpa.toFixed(2)} below minimum ${scholarship.minCgpa}`
    );
    allHardPass = false;
  }

  // ── Hard: Income ──────────────────────────────────────────────────────────
  if (user.familyIncome <= scholarship.maxIncome) {
    score += 20;
    matched.push(
      `Income ₹${user.familyIncome.toLocaleString("en-IN")} within limit ₹${scholarship.maxIncome.toLocaleString("en-IN")}`
    );
  } else {
    failed.push(
      `Income ₹${user.familyIncome.toLocaleString("en-IN")} exceeds limit ₹${scholarship.maxIncome.toLocaleString("en-IN")}`
    );
    allHardPass = false;
  }

  // ── Bonus: CGPA headroom ──────────────────────────────────────────────────
  if (user.cgpa - scholarship.minCgpa >= 1.0) {
    score += 5;
    matched.push(
      `Strong CGPA headroom (+${(user.cgpa - scholarship.minCgpa).toFixed(1)} above minimum)`
    );
  }

  // ── Bonus: Income headroom ────────────────────────────────────────────────
  if (user.familyIncome <= scholarship.maxIncome * 0.5) {
    score += 5;
    matched.push("Income well within limit (≤ 50% of maximum)");
  }

  // Cap at 100
  score = Math.min(100, score);

  return {
    scholarship,
    score,
    eligible: allHardPass,
    matchedCriteria: matched,
    failedCriteria: failed,
  };
}

/**
 * Runs the eligibility engine against all scholarships for a user.
 * Returns results sorted: eligible first (by score desc), then ineligible.
 */
export function analyseAllScholarships(
  user: User,
  scholarships: Scholarship[]
): MatchResult[] {
  const results = scholarships.map((s) => calculateEligibility(user, s));

  return results.sort((a, b) => {
    // Eligible first
    if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
    // Within same tier, sort by score descending
    return b.score - a.score;
  });
}
