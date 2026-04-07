import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  RotateCcw,
  Check,
  X,
  Upload,
  User,
  Briefcase,
  GraduationCap,
  FolderOpen,
  Code2,
  Link2,
  Eye,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import {
  getPortfolioData,
  savePortfolioData,
  resetPortfolioData,
  defaultData,
  type PortfolioData,
  type Project,
  type Experience,
  type Education,
  type SocialLink,
} from "../store/portfolioData";

type Tab = "profile" | "experience" | "education" | "projects" | "tech" | "socials";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export default function AdminPanel({ onNavigateBack }: { onNavigateBack: () => void }) {
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getPortfolioData().then(setData);
  }, []);

  const handleSave = async () => {
    try {
      await savePortfolioData(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Failed to save. Check your connection.");
    }
  };

  const handleReset = async () => {
    await resetPortfolioData();
    setData(defaultData);
    setShowResetConfirm(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setData({ ...data, avatarUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <User size={16} /> },
    { id: "experience", label: "Experience", icon: <Briefcase size={16} /> },
    { id: "education", label: "Education", icon: <GraduationCap size={16} /> },
    { id: "projects", label: "Projects", icon: <FolderOpen size={16} /> },
    { id: "tech", label: "Tech Stack", icon: <Code2 size={16} /> },
    { id: "socials", label: "Socials", icon: <Link2 size={16} /> },
  ];

  // Project helpers
  const addProject = () => {
    const newProject: Project = {
      id: generateId(),
      title: "",
      description: "",
      tags: [],
      link: "",
      github: "",
    };
    setData({ ...data, projects: [...data.projects, newProject] });
  };

  const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
    setData({
      ...data,
      projects: data.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    });
  };

  const removeProject = (id: string) => {
    setData({ ...data, projects: data.projects.filter((p) => p.id !== id) });
  };

  // Experience helpers
  const addExperience = () => {
    const newExp: Experience = {
      id: generateId(),
      company: "",
      role: "",
      period: "",
      location: "",
      description: "",
      tags: [],
    };
    setData({ ...data, experience: [...data.experience, newExp] });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | string[]) => {
    setData({
      ...data,
      experience: data.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    });
  };

  const removeExperience = (id: string) => {
    setData({ ...data, experience: data.experience.filter((e) => e.id !== id) });
  };

  // Education helpers
  const addEducation = () => {
    const newEdu: Education = {
      id: generateId(),
      institution: "",
      degree: "",
      period: "",
      gpa: "",
    };
    setData({ ...data, education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setData({
      ...data,
      education: data.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    });
  };

  const removeEducation = (id: string) => {
    setData({ ...data, education: data.education.filter((e) => e.id !== id) });
  };

  // Social helpers
  const addSocial = () => {
    const newSocial: SocialLink = { platform: "", url: "", icon: "github" };
    setData({ ...data, socials: [...data.socials, newSocial] });
  };

  const updateSocial = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...data.socials];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, socials: updated });
  };

  const removeSocial = (index: number) => {
    setData({ ...data, socials: data.socials.filter((_, i) => i !== index) });
  };

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-md border-b border-dark-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateBack}
              className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-white font-semibold text-lg">Admin Panel</h1>
              <p className="text-dark-500 text-xs font-mono">edit your portfolio</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateBack}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-800 text-dark-300 hover:text-white text-sm transition-all border border-dark-700/50 hover:border-dark-600"
            >
              <Eye size={14} />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-800 text-dark-400 hover:text-red-400 text-sm transition-all border border-dark-700/50 hover:border-red-500/30"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                saved
                  ? "bg-accent text-dark-950"
                  : "bg-accent/90 hover:bg-accent text-dark-950"
              }`}
            >
              {saved ? <Check size={14} /> : <Save size={14} />}
              {saved ? "Saved!" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-red-500/10">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <h3 className="text-white font-semibold">Reset All Data?</h3>
            </div>
            <p className="text-dark-400 text-sm mb-6">
              This will reset all your portfolio data to defaults. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg bg-dark-800 text-dark-300 text-sm hover:bg-dark-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-all border border-red-500/20"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-dark-400 hover:text-white hover:bg-dark-800 border border-transparent"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <SectionCard title="Photo">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <img
                    src={data.avatarUrl}
                    alt="Avatar"
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-dark-700"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Upload size={20} className="text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-dark-400 text-sm mb-2">Upload a new profile photo</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-lg bg-dark-700 text-dark-200 text-sm hover:bg-dark-600 transition-all"
                  >
                    Choose File
                  </button>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Basic Info">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Name"
                  value={data.name}
                  onChange={(v) => setData({ ...data, name: v })}
                />
                <InputField
                  label="Title"
                  value={data.title}
                  onChange={(v) => setData({ ...data, title: v })}
                  placeholder="e.g. CREATIVE DEVELOPER"
                />
                <InputField
                  label="Location"
                  value={data.location}
                  onChange={(v) => setData({ ...data, location: v })}
                />
                <InputField
                  label="Tagline"
                  value={data.tagline}
                  onChange={(v) => setData({ ...data, tagline: v })}
                />
              </div>
            </SectionCard>

            <SectionCard title="Skills">
              <TagInput
                tags={data.skills}
                onChange={(tags) => setData({ ...data, skills: tags })}
                placeholder="Add a skill..."
              />
            </SectionCard>

            <SectionCard title="About">
              <textarea
                value={data.about}
                onChange={(e) => setData({ ...data, about: e.target.value })}
                rows={5}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-dark-200 text-sm font-mono placeholder-dark-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all resize-none"
                placeholder="Tell us about yourself..."
              />
            </SectionCard>

            <SectionCard title="Resume URL">
              <InputField
                label="Resume Link"
                value={data.resumeUrl}
                onChange={(v) => setData({ ...data, resumeUrl: v })}
                placeholder="https://..."
              />
            </SectionCard>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === "experience" && (
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <SectionCard
                key={exp.id}
                title={exp.company || `Experience ${index + 1}`}
                onDelete={() => removeExperience(exp.id)}
                collapsible
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Company"
                    value={exp.company}
                    onChange={(v) => updateExperience(exp.id, "company", v)}
                  />
                  <InputField
                    label="Role"
                    value={exp.role}
                    onChange={(v) => updateExperience(exp.id, "role", v)}
                  />
                  <InputField
                    label="Period"
                    value={exp.period}
                    onChange={(v) => updateExperience(exp.id, "period", v)}
                    placeholder="e.g. Jun 2025 — Present"
                  />
                  <InputField
                    label="Location"
                    value={exp.location}
                    onChange={(v) => updateExperience(exp.id, "location", v)}
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-dark-400 text-xs font-mono uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                    rows={3}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-dark-200 text-sm font-mono placeholder-dark-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all resize-none"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-dark-400 text-xs font-mono uppercase tracking-wider mb-2">Tags</label>
                  <TagInput
                    tags={exp.tags}
                    onChange={(tags) => updateExperience(exp.id, "tags", tags)}
                    placeholder="Add tech tag..."
                  />
                </div>
              </SectionCard>
            ))}
            <button
              onClick={addExperience}
              className="w-full py-3 rounded-xl border-2 border-dashed border-dark-700 text-dark-400 hover:text-accent hover:border-accent/30 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Plus size={16} />
              Add Experience
            </button>
          </div>
        )}

        {/* Education Tab */}
        {activeTab === "education" && (
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <SectionCard
                key={edu.id}
                title={edu.institution || `Education ${index + 1}`}
                onDelete={() => removeEducation(edu.id)}
                collapsible
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Institution"
                    value={edu.institution}
                    onChange={(v) => updateEducation(edu.id, "institution", v)}
                  />
                  <InputField
                    label="Degree"
                    value={edu.degree}
                    onChange={(v) => updateEducation(edu.id, "degree", v)}
                  />
                  <InputField
                    label="Period"
                    value={edu.period}
                    onChange={(v) => updateEducation(edu.id, "period", v)}
                    placeholder="e.g. 2022 — 2026"
                  />
                  <InputField
                    label="GPA"
                    value={edu.gpa}
                    onChange={(v) => updateEducation(edu.id, "gpa", v)}
                    placeholder="e.g. 3.9/4.0"
                  />
                </div>
              </SectionCard>
            ))}
            <button
              onClick={addEducation}
              className="w-full py-3 rounded-xl border-2 border-dashed border-dark-700 text-dark-400 hover:text-accent hover:border-accent/30 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Plus size={16} />
              Add Education
            </button>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="space-y-4">
            {data.projects.map((project, index) => (
              <SectionCard
                key={project.id}
                title={project.title || `Project ${index + 1}`}
                onDelete={() => removeProject(project.id)}
                collapsible
              >
                <div className="space-y-4">
                  <InputField
                    label="Title"
                    value={project.title}
                    onChange={(v) => updateProject(project.id, "title", v)}
                    placeholder="e.g. Project Name — Short Description"
                  />
                  <div>
                    <label className="block text-dark-400 text-xs font-mono uppercase tracking-wider mb-2">Description</label>
                    <textarea
                      value={project.description}
                      onChange={(e) => updateProject(project.id, "description", e.target.value)}
                      rows={3}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-dark-200 text-sm font-mono placeholder-dark-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Live URL"
                      value={project.link}
                      onChange={(v) => updateProject(project.id, "link", v)}
                      placeholder="https://..."
                    />
                    <InputField
                      label="GitHub URL"
                      value={project.github}
                      onChange={(v) => updateProject(project.id, "github", v)}
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-dark-400 text-xs font-mono uppercase tracking-wider mb-2">Tags</label>
                    <TagInput
                      tags={project.tags}
                      onChange={(tags) => updateProject(project.id, "tags", tags)}
                      placeholder="Add tag..."
                    />
                  </div>
                </div>
              </SectionCard>
            ))}
            <button
              onClick={addProject}
              className="w-full py-3 rounded-xl border-2 border-dashed border-dark-700 text-dark-400 hover:text-accent hover:border-accent/30 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Plus size={16} />
              Add Project
            </button>
          </div>
        )}

        {/* Tech Stack Tab */}
        {activeTab === "tech" && (
          <SectionCard title="Technologies">
            <TagInput
              tags={data.techStack}
              onChange={(tags) => setData({ ...data, techStack: tags })}
              placeholder="Add technology..."
            />
          </SectionCard>
        )}

        {/* Socials Tab */}
        {activeTab === "socials" && (
          <div className="space-y-4">
            {data.socials.map((social, index) => (
              <SectionCard
                key={index}
                title={social.platform || `Social ${index + 1}`}
                onDelete={() => removeSocial(index)}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Platform"
                    value={social.platform}
                    onChange={(v) => updateSocial(index, "platform", v)}
                    placeholder="e.g. GitHub"
                  />
                  <InputField
                    label="URL"
                    value={social.url}
                    onChange={(v) => updateSocial(index, "url", v)}
                    placeholder="https://..."
                  />
                  <div>
                    <label className="block text-dark-400 text-xs font-mono uppercase tracking-wider mb-2">Icon</label>
                    <select
                      value={social.icon}
                      onChange={(e) => updateSocial(index, "icon", e.target.value)}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-dark-200 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="github">GitHub</option>
                      <option value="twitter">Twitter / X</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="mail">Email</option>
                    </select>
                  </div>
                </div>
              </SectionCard>
            ))}
            <button
              onClick={addSocial}
              className="w-full py-3 rounded-xl border-2 border-dashed border-dark-700 text-dark-400 hover:text-accent hover:border-accent/30 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Plus size={16} />
              Add Social Link
            </button>
          </div>
        )}

        {/* Floating save button on mobile */}
        <div className="fixed bottom-6 right-6 sm:hidden">
          <button
            onClick={handleSave}
            className={`p-4 rounded-full shadow-2xl transition-all ${
              saved ? "bg-accent text-dark-950" : "bg-accent text-dark-950"
            }`}
          >
            {saved ? <Check size={22} /> : <Save size={22} />}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================= Shared Components ========================= */

function SectionCard({
  title,
  children,
  onDelete,
  collapsible = false,
}: {
  title: string;
  children: React.ReactNode;
  onDelete?: () => void;
  collapsible?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-dark-900/60 border border-dark-800 rounded-2xl overflow-hidden">
      <div
        className={`flex items-center justify-between px-5 py-4 ${collapsible ? "cursor-pointer hover:bg-dark-800/30" : ""}`}
        onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
      >
        <div className="flex items-center gap-2">
          {collapsible && (
            <span className="text-dark-500">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
          <h3 className="text-white font-medium text-sm">{title}</h3>
        </div>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      {isOpen && (
        <div className="px-5 pb-5">
          {children}
        </div>
      )}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-dark-400 text-xs font-mono uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-dark-200 text-sm placeholder-dark-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
      />
    </div>
  );
}

function TagInput({
  tags,
  onChange,
  placeholder,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        onChange([...tags, input.trim()]);
      }
      setInput("");
    }
    if (e.key === "Backspace" && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 min-h-[44px] focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/20 transition-all">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-lg bg-dark-700 text-dark-200 border border-dark-600/50"
        >
          {tag}
          <button
            onClick={() => onChange(tags.filter((_, idx) => idx !== i))}
            className="text-dark-500 hover:text-red-400 transition-colors ml-0.5"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] bg-transparent text-dark-200 text-sm placeholder-dark-500 focus:outline-none"
      />
    </div>
  );
}
