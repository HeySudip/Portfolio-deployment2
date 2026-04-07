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
}

import avatarImg from "../assets/avatar.jpg";

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
    {
      id: "3",
      title: "Sentinel — Infrastructure Monitoring",
      description: "real-time system monitoring with anomaly detection. processes 100k+ events/sec with sub-ms latency.",
      tags: ["GO", "K8S"],
      link: "#",
      github: "#",
    },
    {
      id: "4",
      title: "PixelMind — Generative Art Engine",
      description: "create stunning AI-powered artwork using diffusion models with custom fine-tuning on personal style datasets.",
      tags: ["AI", "REACT"],
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
    {
      id: "2",
      company: "StartupXYZ",
      role: "Full Stack Developer",
      period: "Jan 2025 — May 2025",
      location: "San Francisco, CA",
      description: "Developed real-time collaboration features using WebSockets. Built responsive UI components with React and Framer Motion.",
      tags: ["React", "Node.js", "Socket.io", "MongoDB"],
    },
  ],
  education: [
    {
      id: "1",
      institution: "Stanford University",
      degree: "B.S. in Computer Science",
      period: "2022 — 2026",
      gpa: "3.9/4.0",
    },
  ],
  techStack: [
    "React", "Next.js", "TypeScript", "Node.js", "Python", "Go", "Rust",
    "PostgreSQL", "MongoDB", "Redis", "Docker", "Kubernetes", "AWS", "Figma"
  ],
};

const STORAGE_KEY = "portfolio_data";

export function getPortfolioData(): PortfolioData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load portfolio data:", e);
  }
  return defaultData;
}

export function savePortfolioData(data: PortfolioData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save portfolio data:", e);
  }
}

export function resetPortfolioData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
