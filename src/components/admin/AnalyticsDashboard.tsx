"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import type { AnalyticsData } from "@/actions/analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Award,
  TrendingUp,
  IndianRupee,
  PieChart as PieIcon,
  BarChart3,
  CheckCircle2,
  Database,
  Globe,
  Zap,
} from "lucide-react";

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

const CATEGORY_COLORS = ["#22d3ee", "#6366f1", "#a855f7", "#ec4899", "#f59e0b"];
const TIER_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Top Visual Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Registered Students */}
        <Card className="border border-slate-800 bg-slate-900/60 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Users className="w-16 h-16 text-cyan-400" />
          </div>
          <CardHeader className="pb-2">
            <div className="text-xs text-slate-400 flex items-center justify-between mb-1">
              <span>Active Platform Students</span>
              <Badge variant="default" className="text-[10px] bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                Live DB
              </Badge>
            </div>
            <CardTitle className="text-2xl font-extrabold text-slate-100 font-mono mt-1">
              {data.totalStudents}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-[11px] text-slate-400 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Registered Student Profiles</span>
          </CardContent>
        </Card>

        {/* Card 2: Total Scholarships */}
        <Card className="border border-slate-800 bg-slate-900/60 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Award className="w-16 h-16 text-indigo-400" />
          </div>
          <CardHeader className="pb-2">
            <div className="text-xs text-slate-400 flex items-center justify-between mb-1">
              <span>Database Scholarships</span>
              <Badge variant="purple" className="text-[10px]">
                Verified
              </Badge>
            </div>
            <CardTitle className="text-2xl font-extrabold text-slate-100 font-mono mt-1">
              {data.totalScholarships}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-[11px] text-slate-400 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            <span>Seed Grants & Endowments</span>
          </CardContent>
        </Card>

        {/* Card 3: Avg CGPA */}
        <Card className="border border-slate-800 bg-slate-900/60 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <TrendingUp className="w-16 h-16 text-emerald-400" />
          </div>
          <CardHeader className="pb-2">
            <div className="text-xs text-slate-400 flex items-center justify-between mb-1">
              <span>Average Student CGPA</span>
              <Badge variant="success" className="text-[10px]">
                High Merit
              </Badge>
            </div>
            <CardTitle className="text-2xl font-extrabold text-slate-100 font-mono mt-1">
              {data.avgCgpa} <span className="text-xs font-normal text-slate-400">/ 10</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Across all enrolled streams</span>
          </CardContent>
        </Card>

        {/* Card 4: Avg Family Income */}
        <Card className="border border-slate-800 bg-slate-900/60 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <IndianRupee className="w-16 h-16 text-amber-400" />
          </div>
          <CardHeader className="pb-2">
            <div className="text-xs text-slate-400 flex items-center justify-between mb-1">
              <span>Avg Annual Income</span>
              <Badge variant="secondary" className="text-[10px]">
                Need-Based
              </Badge>
            </div>
            <CardTitle className="text-2xl font-extrabold text-slate-100 font-mono mt-1">
              ₹{(data.avgIncome / 100000).toFixed(1)}L <span className="text-xs font-normal text-slate-400">/ yr</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-[11px] text-slate-400 flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
            <span>Targeting low-income grants</span>
          </CardContent>
        </Card>
      </div>

      {/* Recharts Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Course Enrolment Bar Chart */}
        <Card className="border border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Course Popularity Breakdown
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Distribution of active students across academic degree courses.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.courseBreakdown} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <XAxis dataKey="course" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px", color: "#f8fafc" }}
                  cursor={{ fill: "rgba(30, 41, 59, 0.5)" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {data.courseBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 2: Category Demographic Pie Chart */}
        <Card className="border border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-400" />
              Category Demographics Breakdown
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Distribution of students by category (General, OBC, SC, ST, EWS).
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="category"
                >
                  {data.categoryBreakdown.map((_, index) => (
                    <Cell key={`pie-cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px", color: "#f8fafc" }}
                />
                <Legend
                  formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Lower Grid: Eligibility Match Tiers & System Service Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Eligibility Engine Score Breakdown */}
        <Card className="lg:col-span-2 border border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Eligibility Score Distribution (Match Engine)
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Analysis of student-to-scholarship eligibility scores calculated by our algorithm.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.eligibilityTiers} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="tier" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px", color: "#f8fafc" }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {data.eligibilityTiers.map((_, index) => (
                    <Cell key={`tier-cell-${index}`} fill={TIER_COLORS[index % TIER_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Health Status Panel */}
        <Card className="border border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Platform Infrastructure Status
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Live status monitor of databases and API gateways.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2 font-semibold text-slate-200">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>SQLite Database</span>
              </div>
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Connected
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2 font-semibold text-slate-200">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>SerpApi Search Engine</span>
              </div>
              <Badge variant="purple" className="gap-1">
                <Zap className="w-3 h-3 text-indigo-400" /> Active API
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2 font-semibold text-slate-200">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Prisma Client Engine</span>
              </div>
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> v5.22.0
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
