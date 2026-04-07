import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import {
  ExternalLink,
  ArrowUpRight,
  Settings,
} from "lucide-react";
import { getPortfolioData, type PortfolioData, type SocialLink } from "../store/portfolioData";
import bgTexture from "../assets/bg-texture.jpg";

// SVG icons for socials
function GithubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

const iconMap: Record<string, React.ReactNode> = {
  github: <GithubIcon />,
  twitter: <XIcon />,
  linkedin: <LinkedinIcon />,
  mail: <MailIcon />,
};

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function Portfolio({ onNavigateAdmin }: { onNavigateAdmin?: () => void }) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const refreshData = () => setData(getPortfolioData());

  useEffect(() => {
    refreshData();
    // Re-read localStorage whenever window gets focus (e.g. coming back from admin)
    window.addEventListener("focus", refreshData);
    // Also listen for storage events (cross-tab)
    window.addEventListener("storage", refreshData);
    return () => {
      window.removeEventListener("focus", refreshData);
      window.removeEventListener("storage", refreshData);
    };
  }, []);

  if (!data) return null;

  const isDark = theme === "dark";

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: isDark ? "#0a0a0b" : "#f5f0eb",
      }}
    >
      {/* Paper texture background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${bgTexture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: isDark ? 0.15 : 0.4,
        }}
      />

      {/* Main card */}
      <div className="relative z-10 min-h-screen flex items-start justify-center px-4 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-[720px] relative"
          style={{
            backgroundColor: isDark ? "rgba(17, 17, 19, 0.95)" : "rgba(255, 255, 255, 0.97)",
            borderRadius: "16px",
            border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.08)",
            boxShadow: isDark
              ? "0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)"
              : "0 25px 80px rgba(0,0,0,0.12)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Theme toggle & Admin */}
          <div className="absolute top-5 right-5 flex items-center gap-2 z-20">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="text-xs font-mono px-3 py-1.5 rounded-lg transition-all"
              style={{
                color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)",
                backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              }}
            >
              {isDark ? "light" : "dark"}
            </button>
            {onNavigateAdmin && (
              <button
                onClick={onNavigateAdmin}
                className="p-1.5 rounded-lg transition-all group"
                style={{
                  color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)",
                  backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                }}
                title="Admin Panel"
              >
                <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" />
              </button>
            )}
          </div>

          <div className="px-8 md:px-12 py-10 md:py-14">
            <motion.div variants={container} initial="hidden" animate="visible">
              {/* ===== HERO ===== */}
              <motion.div variants={item} className="mb-10">
                <div className="flex items-start gap-5 md:gap-7 mb-6">
                  {/* Avatar with glow */}
                  <div className="relative group flex-shrink-0">
                    <div
                      className="absolute -inset-1 rounded-2xl blur-md opacity-50 group-hover:opacity-80 transition-opacity duration-700"
                      style={{
                        background: "linear-gradient(135deg, #22c55e33, #3b82f633, #a855f733)",
                      }}
                    />
                    <img
                      src={data.avatarUrl}
                      alt={data.name}
                      className="relative w-20 h-20 md:w-28 md:h-28 rounded-2xl object-cover"
                      style={{
                        border: isDark ? "2px solid rgba(255,255,255,0.08)" : "2px solid rgba(0,0,0,0.08)",
                      }}
                    />
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2"
                      style={{
                        backgroundColor: "#22c55e",
                        borderColor: isDark ? "#111113" : "#ffffff",
                      }}
                    />
                  </div>

                  <div className="pt-1">
                    <p
                      className="text-xs font-mono mb-1.5"
                      style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}
                    >
                      Hi, I'm {data.name.split(" ")[0]}
                    </p>
                    <h1
                      className="text-2xl md:text-4xl font-black tracking-tight leading-[1.1]"
                      style={{ color: isDark ? "#ffffff" : "#111111" }}
                    >
                      {data.title}
                    </h1>
                  </div>
                </div>

                {/* Location & tagline */}
                <div
                  className="flex items-center gap-2 text-sm font-mono flex-wrap"
                  style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)" }}
                >
                  <span className="uppercase font-bold text-xs">{data.location}</span>
                  <span style={{ color: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }}>·</span>
                  <span>{data.tagline}</span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {data.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-mono"
                      style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)" }}
                    >
                      {skill}
                      {data.skills.indexOf(skill) < data.skills.length - 1 && (
                        <span className="ml-2" style={{ color: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }}>·</span>
                      )}
                    </span>
                  ))}
                </div>

                {/* Social icons */}
                <div className="flex items-center gap-2.5 mt-5">
                  {data.socials.map((social: SocialLink) => (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                      style={{
                        color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = isDark ? "#ffffff" : "#000000";
                        e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)";
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                      title={social.platform}
                    >
                      {iconMap[social.icon] || <ExternalLink size={20} />}
                    </a>
                  ))}
                </div>
              </motion.div>

              {/* Divider */}
              <motion.div variants={item} className="mb-10">
                <div
                  className="h-px w-16"
                  style={{ backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)" }}
                />
              </motion.div>

              {/* ===== ABOUT ===== */}
              <motion.section variants={item} className="mb-12">
                <h2
                  className="font-serif italic text-xl md:text-2xl mb-4"
                  style={{ color: isDark ? "#ffffff" : "#111111" }}
                >
                  about
                </h2>
                <p
                  className="text-sm font-mono leading-relaxed"
                  style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }}
                >
                  {data.about}
                </p>
              </motion.section>

              {/* ===== EXPERIENCE ===== */}
              {data.experience.length > 0 && (
                <motion.section variants={item} className="mb-12">
                  <h2
                    className="font-serif italic text-xl md:text-2xl mb-6"
                    style={{ color: isDark ? "#ffffff" : "#111111" }}
                  >
                    experience
                  </h2>
                  <div className="space-y-5">
                    {data.experience.map((exp) => (
                      <div
                        key={exp.id}
                        className="group p-4 md:p-5 rounded-xl transition-all duration-300"
                        style={{
                          backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                          border: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.04)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
                          e.currentTarget.style.border = isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)";
                          e.currentTarget.style.border = isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.04)";
                        }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                          <div>
                            <h3
                              className="font-semibold text-sm"
                              style={{ color: isDark ? "#ffffff" : "#111111" }}
                            >
                              {exp.company}
                            </h3>
                            <p className="text-sm" style={{ color: "#22c55e" }}>
                              {exp.role}
                            </p>
                          </div>
                          <div className="sm:text-right">
                            <p
                              className="text-[11px] font-mono uppercase tracking-wider"
                              style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}
                            >
                              {exp.period}
                            </p>
                            <p
                              className="text-[11px] font-mono"
                              style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }}
                            >
                              {exp.location}
                            </p>
                          </div>
                        </div>
                        <p
                          className="text-sm mb-3"
                          style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}
                        >
                          {exp.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {exp.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md"
                              style={{
                                backgroundColor: "rgba(34,197,94,0.1)",
                                color: "#22c55e",
                                border: "1px solid rgba(34,197,94,0.15)",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* ===== EDUCATION ===== */}
              {data.education.length > 0 && (
                <motion.section variants={item} className="mb-12">
                  <h2
                    className="font-serif italic text-xl md:text-2xl mb-6"
                    style={{ color: isDark ? "#ffffff" : "#111111" }}
                  >
                    education
                  </h2>
                  <div className="space-y-4">
                    {data.education.map((edu) => (
                      <div
                        key={edu.id}
                        className="p-4 md:p-5 rounded-xl"
                        style={{
                          backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                          border: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.04)",
                        }}
                      >
                        <h3
                          className="font-semibold text-sm"
                          style={{ color: isDark ? "#ffffff" : "#111111" }}
                        >
                          {edu.institution}
                        </h3>
                        <p className="text-sm" style={{ color: "#22c55e" }}>
                          {edu.degree}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span
                            className="text-[11px] font-mono"
                            style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}
                          >
                            {edu.period}
                          </span>
                          {edu.gpa && (
                            <>
                              <span style={{ color: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)" }}>·</span>
                              <span
                                className="text-[11px] font-mono"
                                style={{ color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}
                              >
                                GPA: {edu.gpa}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* ===== PROJECTS ===== */}
              <motion.section variants={item} className="mb-12">
                <h2
                  className="font-serif italic text-xl md:text-2xl mb-6"
                  style={{ color: isDark ? "#ffffff" : "#111111" }}
                >
                  projects
                </h2>
                <div className="space-y-3">
                  {data.projects.map((project) => (
                    <a
                      key={project.id}
                      href={project.link || project.github || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-4 p-4 md:p-5 rounded-xl transition-all duration-300"
                      style={{
                        backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                        border: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.04)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
                        e.currentTarget.style.border = isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)";
                        e.currentTarget.style.border = isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.04)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {/* Tag column */}
                      <div className="flex flex-col gap-1 pt-0.5 flex-shrink-0 min-w-[70px]">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono font-bold tracking-widest uppercase"
                            style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold text-sm group-hover:underline underline-offset-4 decoration-1 transition-all"
                          style={{
                            color: isDark ? "#ffffff" : "#111111",
                            textDecorationColor: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
                          }}
                        >
                          {project.title}
                        </h3>
                        <p
                          className="text-sm font-mono mt-1 leading-relaxed"
                          style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}
                        >
                          {project.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <ArrowUpRight
                        size={16}
                        className="flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}
                      />
                    </a>
                  ))}
                </div>
              </motion.section>

              {/* ===== TECH STACK ===== */}
              {data.techStack.length > 0 && (
                <motion.section variants={item} className="mb-10">
                  <h2
                    className="font-serif italic text-xl md:text-2xl mb-6"
                    style={{ color: isDark ? "#ffffff" : "#111111" }}
                  >
                    tech stack
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {data.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono px-3 py-1.5 rounded-lg transition-all duration-300 cursor-default"
                        style={{
                          backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                          color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)",
                          border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = isDark ? "rgba(34,197,94,0.1)" : "rgba(34,197,94,0.08)";
                          e.currentTarget.style.color = "#22c55e";
                          e.currentTarget.style.borderColor = "rgba(34,197,94,0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
                          e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)";
                          e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* ===== FOOTER ===== */}
              <motion.footer variants={item} className="pt-8">
                <div
                  className="h-px w-full mb-6"
                  style={{ backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
                />
                <div className="flex items-center justify-between">
                  <p
                    className="text-[11px] font-mono"
                    style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }}
                  >
                    © {new Date().getFullYear()} {data.name}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: "#22c55e" }}
                    />
                    <span
                      className="text-[11px] font-mono"
                      style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }}
                    >
                      available for work
                    </span>
                  </div>
                </div>
              </motion.footer>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
