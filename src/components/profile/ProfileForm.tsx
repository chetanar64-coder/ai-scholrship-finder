"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  User,
  Mail,
  TrendingUp,
  IndianRupee,
  BookOpen,
  Award,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

import { profileSchema, type ProfileFormData } from "@/lib/validations";
import { saveProfile } from "@/actions/profile";
import { toast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"] as const;
const COURSES = [
  "B.Tech",
  "M.Tech",
  "MBA",
  "MCA",
  "PhD",
  "B.Sc",
  "M.Sc",
  "B.Com",
  "Other",
] as const;
const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="form-error">
      <AlertCircle style={{ width: "12px", height: "12px" }} />
      {message}
    </p>
  );
}

export function ProfileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as any,
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const result = await saveProfile(data);

      if (result.success) {
        toast({
          variant: "success" as never,
          title: "✅ Profile Saved!",
          description: result.message,
        });
      } else {
        setServerError(result.error);
        toast({
          variant: "destructive",
          title: "Failed to save profile",
          description: result.error,
        });
      }
    } catch {
      const msg = "An unexpected error occurred. Please try again.";
      setServerError(msg);
      toast({
        variant: "destructive",
        title: "Error",
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoFill = () => {
    setValue("name", "Chethan A R", { shouldValidate: true });
    setValue("email", "chethan@university.edu", { shouldValidate: true });
    setValue("cgpa", 8.5, { shouldValidate: true });
    setValue("course", "B.Tech", { shouldValidate: true });
    setValue("semester", 5 as any, { shouldValidate: true });
    setValue("familyIncome", 350000, { shouldValidate: true });
    setValue("category", "OBC", { shouldValidate: true });
    setValue(
      "achievements",
      "Gold Medalist in State Hackathon 2025, NSS Volunteer, Published ML Research Paper.",
      { shouldValidate: true }
    );

    toast({
      variant: "success" as never,
      title: "✨ Demo Profile Loaded!",
      description: "Form auto-filled with Chethan A R (B.Tech 5th Sem, OBC, CGPA 8.5).",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* ── Demo Auto-Fill Banner ── */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(99,102,241,0.12))",
          border: "1px solid rgba(6,182,212,0.3)",
          borderRadius: "14px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              background: "rgba(6,182,212,0.2)",
              borderRadius: "10px",
              padding: "8px",
              display: "flex",
            }}
          >
            <Sparkles style={{ width: "20px", height: "20px", color: "#22d3ee" }} />
          </div>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#f8fafc", margin: 0 }}>
              Hackathon Demo Quick-Fill
            </h4>
            <p style={{ fontSize: "12px", color: "#94a3b8", margin: "2px 0 0 0" }}>
              Instantly populate a complete student profile to test eligibility scoring.
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={handleAutoFill}
          size="sm"
          style={{
            background: "linear-gradient(135deg, #06b6d4, #6366f1)",
            color: "#020617",
            fontWeight: "700",
            fontSize: "13px",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(6,182,212,0.3)",
            whiteSpace: "nowrap",
          }}
        >
          ✨ Demo Auto-Fill
        </Button>
      </div>

      {/* ── Personal Information ── */}
      <Card style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px" }}>
        <CardHeader>
          <CardTitle style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "16px", color: "#e8eaf0" }}>
            <span style={{ background: "rgba(124,58,237,0.15)", borderRadius: "8px", padding: "8px", display: "flex" }}>
              <User style={{ width: "16px", height: "16px", color: "#a78bfa" }} />
            </span>
            Personal Information
          </CardTitle>
          <CardDescription style={{ color: "#6b7280", fontSize: "13px" }}>
            Your basic identity details for scholarship matching.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            {/* Full Name */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <Label htmlFor="name" style={{ color: "#c4c9e2", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                <User style={{ width: "13px", height: "13px", color: "#a78bfa" }} />
                Full Name <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Chetan A R"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: errors.name ? "#ef4444" : "var(--border)", color: "#e8eaf0" }}
                {...register("name")}
              />
              <FieldError message={errors.name?.message} />
            </div>

            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <Label htmlFor="email" style={{ color: "#c4c9e2", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Mail style={{ width: "13px", height: "13px", color: "#a78bfa" }} />
                Email Address <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: errors.email ? "#ef4444" : "var(--border)", color: "#e8eaf0" }}
                {...register("email")}
              />
              <FieldError message={errors.email?.message} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Academic Details ── */}
      <Card style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px" }}>
        <CardHeader>
          <CardTitle style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "16px", color: "#e8eaf0" }}>
            <span style={{ background: "rgba(6,182,212,0.15)", borderRadius: "8px", padding: "8px", display: "flex" }}>
              <BookOpen style={{ width: "16px", height: "16px", color: "#22d3ee" }} />
            </span>
            Academic Details
          </CardTitle>
          <CardDescription style={{ color: "#6b7280", fontSize: "13px" }}>
            Your academic standing used to determine merit-based eligibility.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            {/* CGPA */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <Label htmlFor="cgpa" style={{ color: "#c4c9e2", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                <TrendingUp style={{ width: "13px", height: "13px", color: "#22d3ee" }} />
                CGPA (0 – 10) <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <Input
                id="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                placeholder="e.g. 8.5"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: errors.cgpa ? "#ef4444" : "var(--border)", color: "#e8eaf0" }}
                {...register("cgpa")}
              />
              <FieldError message={errors.cgpa?.message} />
            </div>

            {/* Course */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <Label style={{ color: "#c4c9e2", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                <BookOpen style={{ width: "13px", height: "13px", color: "#22d3ee" }} />
                Course / Program <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <Select onValueChange={(val) => setValue("course", val as ProfileFormData["course"], { shouldValidate: true })}>
                <SelectTrigger id="course" style={{ background: "rgba(255,255,255,0.04)", borderColor: errors.course ? "#ef4444" : "var(--border)", color: "#e8eaf0" }}>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {COURSES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.course?.message} />
            </div>

            {/* Semester */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <Label style={{ color: "#c4c9e2", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                Current Semester <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <Select onValueChange={(val) => setValue("semester", Number(val) as any, { shouldValidate: true })}>
                <SelectTrigger id="semester" style={{ background: "rgba(255,255,255,0.04)", borderColor: errors.semester ? "#ef4444" : "var(--border)", color: "#e8eaf0" }}>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTERS.map((s) => (
                    <SelectItem key={s} value={s}>Semester {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.semester?.message} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Financial & Category ── */}
      <Card style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px" }}>
        <CardHeader>
          <CardTitle style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "16px", color: "#e8eaf0" }}>
            <span style={{ background: "rgba(16,185,129,0.15)", borderRadius: "8px", padding: "8px", display: "flex" }}>
              <IndianRupee style={{ width: "16px", height: "16px", color: "#34d399" }} />
            </span>
            Financial & Category Details
          </CardTitle>
          <CardDescription style={{ color: "#6b7280", fontSize: "13px" }}>
            Used for need-based and reservation-based scholarship filtering.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            {/* Family Income */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <Label htmlFor="familyIncome" style={{ color: "#c4c9e2", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                <IndianRupee style={{ width: "13px", height: "13px", color: "#34d399" }} />
                Annual Family Income (₹) <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <Input
                id="familyIncome"
                type="number"
                min="0"
                placeholder="e.g. 500000"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: errors.familyIncome ? "#ef4444" : "var(--border)", color: "#e8eaf0" }}
                {...register("familyIncome")}
              />
              <FieldError message={errors.familyIncome?.message} />
            </div>

            {/* Category */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <Label style={{ color: "#c4c9e2", fontSize: "13px" }}>
                Category <span style={{ color: "#ef4444" }}>*</span>
              </Label>
              <Select onValueChange={(val) => setValue("category", val as ProfileFormData["category"], { shouldValidate: true })}>
                <SelectTrigger id="category" style={{ background: "rgba(255,255,255,0.04)", borderColor: errors.category ? "#ef4444" : "var(--border)", color: "#e8eaf0" }}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={errors.category?.message} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Achievements ── */}
      <Card style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px" }}>
        <CardHeader>
          <CardTitle style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "16px", color: "#e8eaf0" }}>
            <span style={{ background: "rgba(244,63,94,0.15)", borderRadius: "8px", padding: "8px", display: "flex" }}>
              <Award style={{ width: "16px", height: "16px", color: "#fb7185" }} />
            </span>
            Achievements & Extracurriculars
          </CardTitle>
          <CardDescription style={{ color: "#6b7280", fontSize: "13px" }}>
            Optional. List awards, certifications, sports, volunteering, etc.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <Textarea
              id="achievements"
              placeholder="e.g. Gold Medal in State Chess Championship, NSS Volunteer, Published research paper on ML…"
              rows={4}
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--border)", color: "#e8eaf0" }}
              {...register("achievements")}
            />
            <FieldError message={errors.achievements?.message} />
          </div>
        </CardContent>
      </Card>

      {/* ── Server Error ── */}
      {serverError && (
        <div style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: "10px",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "#fca5a5",
          fontSize: "14px",
        }}>
          <AlertCircle style={{ width: "16px", height: "16px", flexShrink: 0 }} />
          {serverError}
        </div>
      )}

      {/* ── Submit ── */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          id="save-profile-btn"
          type="submit"
          disabled={isSubmitting}
          size="lg"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            color: "#ffffff",
            border: "none",
            padding: "12px 32px",
            fontSize: "15px",
            fontWeight: "600",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            minWidth: "180px",
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} />
              Saving…
            </>
          ) : (
            <>
              <CheckCircle2 style={{ width: "16px", height: "16px" }} />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
