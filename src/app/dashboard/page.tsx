import type { Metadata } from "next";
import {
  GraduationCap,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard — ScholarAI",
  description: "Your scholarship journey overview",
};

const stats = [
  {
    label: "Scholarships Available",
    value: "2,847",
    change: "+12 this week",
    icon: Award,
    color: "violet",
  },
  {
    label: "Active Students",
    value: "18,430",
    change: "+340 today",
    icon: Users,
    color: "cyan",
  },
  {
    label: "Success Rate",
    value: "73%",
    change: "+5% this month",
    icon: TrendingUp,
    color: "emerald",
  },
  {
    label: "Avg. Award Amount",
    value: "₹85K",
    change: "Per scholarship",
    icon: Target,
    color: "rose",
  },
];

const quickActions = [
  {
    href: "/profile",
    icon: GraduationCap,
    title: "Complete Your Profile",
    desc: "Add your CGPA, income, category and more to get personalized matches.",
    cta: "Set up profile",
    badge: "Start here",
  },
  {
    href: "/find-scholarships",
    icon: BookOpen,
    title: "Browse Scholarships",
    desc: "Explore thousands of scholarships filtered by your eligibility.",
    cta: "Search now",
    badge: "Phase 2",
  },
  {
    href: "/ai-assistant",
    icon: Sparkles,
    title: "Ask AI Assistant",
    desc: "Get instant answers about scholarship eligibility and application tips.",
    cta: "Chat now",
    badge: "Phase 3",
  },
];

export default function DashboardPage() {
  return (
    <>
      {/* Header */}
      <div className="page-header animate-fade-in-up">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div>
            <h1 className="page-title">
              Welcome back, <span className="gradient-text">Chetan 👋</span>
            </h1>
            <p className="page-subtitle">
              Here&apos;s your scholarship journey at a glance.
            </p>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          {stats.map(({ label, value, change, icon: Icon, color }, i) => (
            <div
              key={label}
              className={`stat-card ${color} animate-fade-in-up`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    background:
                      color === "violet"
                        ? "rgba(124,58,237,0.15)"
                        : color === "cyan"
                        ? "rgba(6,182,212,0.15)"
                        : color === "emerald"
                        ? "rgba(16,185,129,0.15)"
                        : "rgba(244,63,94,0.15)",
                    borderRadius: "10px",
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    style={{
                      width: "20px",
                      height: "20px",
                      color:
                        color === "violet"
                          ? "#a78bfa"
                          : color === "cyan"
                          ? "#22d3ee"
                          : color === "emerald"
                          ? "#34d399"
                          : "#fb7185",
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "800",
                  color: "#e8eaf0",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  marginBottom: "4px",
                }}
              >
                {value}
              </div>
              <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "2px" }}>
                {label}
              </div>
              <div style={{ fontSize: "12px", color: "#4b5563" }}>{change}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#e8eaf0",
            marginBottom: "16px",
            letterSpacing: "-0.01em",
          }}
        >
          Quick Actions
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {quickActions.map(({ href, icon: Icon, title, desc, cta, badge }, i) => (
            <div
              key={href}
              className="stat-card animate-fade-in-up"
              style={{
                animationDelay: `${(i + 4) * 0.08}s`,
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    background: "rgba(124,58,237,0.15)",
                    borderRadius: "10px",
                    padding: "10px",
                  }}
                >
                  <Icon style={{ width: "20px", height: "20px", color: "#a78bfa" }} />
                </div>
                <span className="badge badge-violet">{badge}</span>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#e8eaf0",
                    marginBottom: "6px",
                  }}
                >
                  {title}
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.5 }}>
                  {desc}
                </div>
              </div>
              <Link
                href={href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#a78bfa",
                  textDecoration: "none",
                  marginTop: "auto",
                  transition: "gap 0.2s ease",
                }}
              >
                {cta}
                <ArrowRight style={{ width: "14px", height: "14px" }} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
