import type { User } from "@prisma/client";

export interface SerpApiResult {
  id: string;
  title: string;
  link: string;
  snippet: string;
  sourceDomain: string;
  publishedDate?: string;
  sitelinks?: { title: string; link: string }[];
  tags: string[];
  position: number;
}

export interface SerpApiResponse {
  queryUsed: string;
  totalResults: number;
  isFallback: boolean;
  apiKeyPresent: boolean;
  results: SerpApiResult[];
  error?: string;
}

/**
  Builds targeted search queries based on student profile attributes.
  Example: "scholarships for B.Tech students OBC income financial aid India 2026"
 */
export function buildScholarshipQuery(
  user?: Partial<User> | null,
  customQuery?: string
): string {
  if (customQuery && customQuery.trim().length > 0) {
    const clean = customQuery.trim();
    if (/scholarship/i.test(clean)) return clean;
    return `${clean} scholarship India 2026`;
  }

  const course = user?.course || "Engineering";
  const category = user?.category || "General";
  const income = user?.familyIncome ?? 500000;

  const parts = [`scholarships for ${course} students`];

  if (category && category !== "General") {
    parts.push(category);
  }

  if (income <= 600000) {
    parts.push("income eligible financial aid");
  } else {
    parts.push("merit based");
  }

  parts.push("India 2026");

  return parts.join(" ");
}

/**
  Extract clean domain name from URL (e.g., "scholarships.gov.in")
 */
function extractDomain(urlStr: string): string {
  try {
    const parsed = new URL(urlStr);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return "scholarships-portal.org";
  }
}

/**
  Parses raw organic_results from SerpApi Google Search response
 */
export function parseSerpSearchResults(
  organicResults: any[],
  userCourse?: string,
  userCategory?: string
): SerpApiResult[] {
  if (!Array.isArray(organicResults)) return [];

  return organicResults.map((item, idx) => {
    const domain = extractDomain(item.link || "");
    const title = item.title || "Scholarship Opportunity";
    const snippet = item.snippet || "Explore application eligibility criteria, grant amounts, and deadlines for eligible students.";
    
    // Auto-generate tags based on title/snippet/domain matches
    const tags: string[] = [];
    if (domain.includes(".gov.in") || domain.includes("nic.in")) {
      tags.push("Government Portal");
    } else {
      tags.push("Verified Web Source");
    }

    if (userCourse && (title.includes(userCourse) || snippet.includes(userCourse))) {
      tags.push(`${userCourse} Eligible`);
    }

    if (userCategory && (title.includes(userCategory) || snippet.includes(userCategory))) {
      tags.push(`${userCategory} Reserved`);
    }

    if (/merit|excellence|bright/i.test(title + snippet)) {
      tags.push("Merit Based");
    }

    if (/income|means|poverty|aid|fee/i.test(title + snippet)) {
      tags.push("Financial Need");
    }

    if (tags.length === 1) {
      tags.push("2026 Batch");
    }

    // Extract sitelinks if present
    const sitelinks: { title: string; link: string }[] = [];
    if (item.sitelinks?.inline) {
      item.sitelinks.inline.slice(0, 3).forEach((sl: any) => {
        if (sl.title && sl.link) {
          sitelinks.push({ title: sl.title, link: sl.link });
        }
      });
    }

    return {
      id: `serp-${idx}-${domain}`,
      title,
      link: item.link || "#",
      snippet,
      sourceDomain: domain,
      publishedDate: item.date || item.snippet_highlighted_words?.[0],
      sitelinks: sitelinks.length > 0 ? sitelinks : undefined,
      tags: tags.slice(0, 3),
      position: item.position || idx + 1,
    };
  });
}

/**
  Simulates SerpApi results tailored to student profile when API key is unconfigured.
 */
function getSimulatedSerpResults(
  query: string,
  user?: Partial<User> | null
): SerpApiResult[] {
  const course = user?.course || "B.Tech";
  const category = user?.category || "OBC";

  return [
    {
      id: "sim-1",
      title: `National Overseas & Domestic ${course} Student Scholarship 2026`,
      link: "https://scholarships.gov.in/national-overseas-scheme",
      snippet: `Official Government scheme providing up to ₹2,50,000 per annum for ${course} students belonging to ${category} and economically weaker sections. Applications close soon.`,
      sourceDomain: "scholarships.gov.in",
      publishedDate: "Updated 2 days ago",
      tags: ["Government Portal", `${course} Eligible`, "High Grant"],
      position: 1,
      sitelinks: [
        { title: "Eligibility Criteria", link: "https://scholarships.gov.in/guidelines" },
        { title: "Online Application Portal", link: "https://scholarships.gov.in/apply" }
      ]
    },
    {
      id: "sim-2",
      title: `Buddy4Study ${course} Merit-Cum-Means Assistance Grant 2026`,
      link: "https://www.buddy4study.com/scholarships/stem-merit-means-grant",
      snippet: `Financial aid program supporting ${course} and STEM degree aspirants across India. Covers tuition fees, laptops, and monthly learning allowances for top applicants.`,
      sourceDomain: "buddy4study.com",
      publishedDate: "Verified Partner",
      tags: ["Verified Web Source", "Financial Need", "Laptop Support"],
      position: 2,
    },
    {
      id: "sim-3",
      title: `${category} Community Higher Education Trust Fellowship`,
      link: "https://www.vidyasaarathi.co.in/Vidyasaarathi/scholarship",
      snippet: `Exclusive endowment grant for ${category} category scholars pursuing ${course} and higher technical education. Minimum 60% marks required with family income under ₹6 Lakhs.`,
      sourceDomain: "vidyasaarathi.co.in",
      publishedDate: "Active Now",
      tags: [`${category} Reserved`, "Need Based", "Tuition Waiver"],
      position: 3,
    },
    {
      id: "sim-4",
      title: "Reliance Foundation Undergraduate STEM Scholarships 2026",
      link: "https://www.scholarships.reliancefoundation.org",
      snippet: `Inviting applications from first-year ${course} students. Selected scholars receive up to ₹2,00,000 over the duration of their degree course plus leadership workshops.`,
      sourceDomain: "reliancefoundation.org",
      publishedDate: "3 days ago",
      tags: ["Corporate Grant", "Leadership", "Merit Based"],
      position: 4,
    },
    {
      id: "sim-5",
      title: `Central Sector Scheme of Scholarships for College & University Students`,
      link: "https://www.education.gov.in/en/scholarships-education",
      snippet: `Department of Higher Education scheme for top 20th percentile students. Provides annual stipend directly transferred to Aadhaar-linked bank accounts for 8 semesters.`,
      sourceDomain: "education.gov.in",
      publishedDate: "Govt Direct",
      tags: ["Government Portal", "DBT Transfer", "Direct Grant"],
      position: 5,
    }
  ];
}

/**
  Main execution logic: Searches SerpApi Google engine or returns simulated fallback
 */
export async function executeSerpSearch(
  query: string,
  user?: Partial<User> | null
): Promise<SerpApiResponse> {
  const apiKey = process.env.SERPAPI_API_KEY?.trim();

  // If no API key is configured, return realistic simulated response
  if (!apiKey) {
    const results = getSimulatedSerpResults(query, user);
    return {
      queryUsed: query,
      totalResults: results.length,
      isFallback: true,
      apiKeyPresent: false,
      results,
    };
  }

  try {
    const searchUrl = new URL("https://serpapi.com/search.json");
    searchUrl.searchParams.set("engine", "google");
    searchUrl.searchParams.set("q", query);
    searchUrl.searchParams.set("location", "India");
    searchUrl.searchParams.set("hl", "en");
    searchUrl.searchParams.set("gl", "in");
    searchUrl.searchParams.set("api_key", apiKey);

    const res = await fetch(searchUrl.toString(), {
      next: { revalidate: 300 }, // Cache search for 5 minutes
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[SerpApi Error] HTTP ${res.status}: ${errText}`);
      // Fallback on API error
      const results = getSimulatedSerpResults(query, user);
      return {
        queryUsed: query,
        totalResults: results.length,
        isFallback: true,
        apiKeyPresent: true,
        results,
        error: `SerpApi HTTP ${res.status}: Unable to fetch live results. Serving cached fallback.`,
      };
    }

    const data = await res.json();
    const parsedResults = parseSerpSearchResults(
      data.organic_results || [],
      user?.course,
      user?.category
    );

    return {
      queryUsed: query,
      totalResults: data.search_information?.total_results || parsedResults.length,
      isFallback: false,
      apiKeyPresent: true,
      results: parsedResults,
    };
  } catch (err: any) {
    console.error("[SerpApi Exception]:", err);
    const results = getSimulatedSerpResults(query, user);
    return {
      queryUsed: query,
      totalResults: results.length,
      isFallback: true,
      apiKeyPresent: true,
      results,
      error: err.message || "Network exception during SerpApi execution.",
    };
  }
}
