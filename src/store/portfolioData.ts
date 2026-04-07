import { supabase } from "./supabase";
import avatarImg from "../assets/avatar.jpg";

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  github: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  tags: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
  gpa: string;
  gpaType: "GPA" | "CGPA";
  gpaOutOf: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  location: string;
  tagline: string;
  skills: string[];
  about: string;
  avatarUrl: string;
  resumeUrl: string;
  socials: SocialLink[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  techStack: string[];
  layoutStyle: "name-big" | "title-big";
}

export const defaultData: PortfolioData = {
  name: "Alex Chen",
  title: "CREATIVE DEVELOPER",
  location: "SF",
  tagline: "building the future, one commit at a time",
  skills: ["full-stack", "ml", "systems", "design"],
  about: "22. cs senior. i build things that matter — from distributed systems to ml pipelines. when i'm not coding, i'm probably reading research papers or contributing to open source. passionate about clean architecture and elegant solutions.",
  avatarUrl: avatarImg,
  resumeUrl: "#",
  socials: [
    { platform: "GitHub", url: "https://github.com", icon: "github" },
    { platform: "Twitter", url: "https://twitter.com", icon: "twitter" },
    { platform: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
    { platform: "Email", url: "mailto:hello@example.com", icon: "mail" },
  ],
  projects: [
    {
      id: "1",
      title: "NeuralForge — AI Model Training Platform",
      description: "build, train, and deploy ml models through an intuitive ui. supports pytorch, tensorflow, and jax backends.",
      tags: ["ML", "PYTHON"],
      link: "#",
      github: "#",
    },
    {
      id: "2",
      title: "SyncFlow — Real-time Collaboration Engine",
      description: "conflict-free replicated data types (CRDTs) for seamless multi-user document editing with offline support.",
      tags: ["RUST", "WASM"],
      link: "#",
      github: "#",
    },
  ],
  experience: [
    {
      id: "1",
      company: "TechCorp Inc.",
      role: "Software Engineer Intern",
      period: "Jun 2025 — Present",
      location: "Remote",
      description: "Built microservices handling 50k+ requests/min. Optimized database queries resulting in 40% latency reduction.",
      tags: ["Go", "PostgreSQL", "gRPC", "Docker"],
    },
  ],
  education: [
    {
      id: "1",
      institution: "Stanford University",
      degree: "B.S. in Computer Science",
      period: "2022 — 2026",
      gpa: "3.9",
      gpaType: "GPA",
      gpaOutOf: "4.0",
    },
  ],
  layoutStyle: "title-big",
  techStack: [
    "React", "Next.js", "TypeScript", "Node.js", "Python", "Go", "Rust",
    "PostgreSQL", "MongoDB", "Redis", "Docker", "Kubernetes", "AWS", "Figma"
  ],
};

const TABLE = "portfolio";
const ROW_ID = 1;

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("data")
      .eq("id", ROW_ID)
      .single();

    if (error || !data) return defaultData;
    return data.data as PortfolioData;
  } catch {
    return defaultData;
  }
}

export async function savePortfolioData(portfolioData: PortfolioData): Promise<void> {
  try {
    const { error } = await supabase
      .from(TABLE)
      .upsert({ id: ROW_ID, data: portfolioData }, { onConflict: "id" });

    if (error) throw error;
  } catch (e) {
    console.error("Failed to save portfolio data:", e);
    throw e;
  }
}

export async function resetPortfolioData(): Promise<void> {
  await savePortfolioData(defaultData);
}
