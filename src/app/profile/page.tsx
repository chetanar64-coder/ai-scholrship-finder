import type { Metadata } from "next";
import { UserRound, Sparkles } from "lucide-react";
import { ProfileForm } from "@/components/profile/ProfileForm";

export const metadata: Metadata = {
  title: "My Profile — ScholarAI",
  description: "Set up your student profile to get personalised scholarship matches.",
};

export default function ProfilePage() {
  return (
    <>
      {/* Header */}
      <div className="page-header animate-fade-in-up">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.15))",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: "14px",
              padding: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <UserRound style={{ width: "24px", height: "24px", color: "#a78bfa" }} />
            </div>
            <div>
              <h1 className="page-title">Student Profile</h1>
              <p className="page-subtitle">
                Fill in your details accurately to unlock the best scholarship matches.
              </p>
            </div>
          </div>

          {/* AI tip badge */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(124,58,237,0.1)",
            border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: "10px",
            padding: "10px 14px",
            fontSize: "12px",
            color: "#a78bfa",
            maxWidth: "240px",
          }}>
            <Sparkles style={{ width: "14px", height: "14px", flexShrink: 0 }} />
            <span>
              <strong>AI Tip:</strong> A complete profile increases your match accuracy by up to 80%.
            </span>
          </div>
        </div>
      </div>

      <div className="page-content animate-fade-in-up delay-100">
        <ProfileForm />
      </div>
    </>
  );
}
