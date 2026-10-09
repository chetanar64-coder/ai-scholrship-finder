"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserRound,
  Search,
  BotMessageSquare,
  GraduationCap,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & stats",
  },
  {
    href: "/profile",
    label: "My Profile",
    icon: UserRound,
    description: "Manage your details",
  },
  {
    href: "/find-scholarships",
    label: "Find Scholarships",
    icon: Search,
    description: "Search opportunities",
  },
  {
    href: "/ai-assistant",
    label: "AI Assistant",
    icon: BotMessageSquare,
    description: "Get smart guidance",
  },
  {
    href: "/admin",
    label: "Admin Analytics",
    icon: ShieldCheck,
    description: "Platform metrics",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-title">ScholarAI</span>
          <span className="sidebar-brand-subtitle">Scholarship Finder</span>
        </div>
      </div>

      {/* Divider */}
      <div className="sidebar-divider" />

      {/* Navigation */}
      <nav className="sidebar-nav">
        <p className="sidebar-section-label">Navigation</p>
        {navItems.map(({ href, label, icon: Icon, description }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn("sidebar-nav-item", isActive && "active")}
            >
              <span className={cn("sidebar-nav-icon", isActive && "active")}>
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="sidebar-nav-content">
                <span className="sidebar-nav-label">{label}</span>
                <span className="sidebar-nav-desc">{description}</span>
              </span>
              {isActive && (
                <ChevronRight className="ml-auto h-4 w-4 text-violet-400 shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer badge */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-card">
          <p className="sidebar-footer-title">SerpApi Hackathon</p>
          <p className="sidebar-footer-sub">AI-Powered Scholarships</p>
        </div>
      </div>
    </aside>
  );
}
