"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Code2,
  FolderKanban,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import { useAuth } from "@/components/auth_provider";
import { SplashScreen } from "@/components/splash/splash_screen";
import { useRouter } from "next/navigation";

const projects = [
  {
    name: "Stradcom LTO IT Portal",
    stack: ["PHP", "CodeIgniter", "Bootstrap"],
    date: "Sep 16, 2026 10:24 AM",
    image: "/assets/hero_display.png",
  },
  {
    name: "Rental Platform (Agoda Clone)",
    stack: ["Next.js", "Tailwind CSS", "React"],
    date: "Sep 12, 2026 04:32 PM",
    image: "/assets/display_2.png",
  },
  {
    name: "A.C.E. Community Platform",
    stack: ["Next.js", "Tailwind CSS", "React"],
    date: "Sep 08, 2026 11:17 AM",
    image: "/assets/hero_display.png",
  },
  {
    name: "MD Portal Mobile",
    stack: ["React Native", "Expo", "Node.js"],
    date: "Sep 03, 2026 02:45 PM",
    image: "/assets/display_2.png",
  },
  {
    name: "HoldTones",
    stack: ["React", "Tailwind CSS", "Node.js"],
    date: "Aug 28, 2026 09:12 AM",
    image: "/assets/hero_display.png",
  },
  {
    name: "Safe-Midman App",
    stack: ["Next.js", "Tailwind CSS", "Node.js"],
    date: "Aug 21, 2026 05:36 PM",
    image: "/assets/display_2.png",
  },
];

const skills = [
  ["React", "FRONTEND", "Sep 16, 2026 01:20 PM"],
  ["Next.js", "FRONTEND", "Sep 12, 2026 11:03 AM"],
  ["Tailwind CSS", "FRONTEND", "Sep 10, 2026 04:17 PM"],
  ["Node.js", "BACKEND", "Sep 08, 2026 03:42 PM"],
  ["PHP", "BACKEND", "Sep 05, 2026 10:11 AM"],
  ["CodeIgniter", "BACKEND", "Sep 02, 2026 09:28 AM"],
  ["PostgreSQL", "DATABASE", "Aug 30, 2026 02:16 PM"],
  ["Supabase", "DATABASE", "Aug 27, 2026 10:45 AM"],
  ["MySQL", "DATABASE", "Aug 24, 2026 01:12 PM"],
  ["Git", "TOOLS", "Aug 20, 2026 09:04 AM"],
  ["GitHub", "TOOLS", "Aug 18, 2026 04:37 PM"],
  ["Figma", "TOOLS", "Aug 15, 2026 11:50 AM"],
];

const surface =
  "rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900";

function SearchInput({ label }: { label: string }) {
  return (
    <label className="relative block w-full sm:w-52">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        aria-label={label}
        placeholder={label}
        className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-blue-950"
      />
    </label>
  );
}

function ActionButton({ action, label }: { action: "edit" | "delete"; label: string }) {
  const Icon = action === "edit" ? Pencil : Trash2;
  return (
    <button
      type="button"
      aria-label={`${action} ${label}`}
      className={`flex h-8 w-8 items-center justify-center rounded-md border transition ${action === "delete" ? "border-red-100 text-red-400 hover:bg-red-50 dark:border-red-950 dark:hover:bg-red-950/40" : "border-blue-100 text-blue-500 hover:bg-blue-50 dark:border-blue-950 dark:hover:bg-blue-950/40"}`}
    >
      <Icon size={14} />
    </button>
  );
}

function Pagination({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-400 dark:border-slate-800">
      <span>{label}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700"
        >
          <ChevronLeft size={13} />
        </button>
        <button type="button" className="h-7 w-7 rounded-md bg-blue-600 text-sm text-white">
          1
        </button>
        <button
          type="button"
          aria-label="Next page"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700"
        >
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: typeof FolderKanban;
  label: string;
  value: string;
  detail?: string;
  tone: string;
}) {
  return (
    <div className={`${surface} relative overflow-hidden p-4`}>
      <div className={`mb-4 flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}>
        <Icon size={17} />
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
      {detail && <p className="mt-1 text-xs text-emerald-500">↗ {detail}</p>}
    </div>
  );
}

function CurrentlyBuildingCard() {
  return (
    <article className={`${surface} flex flex-col gap-4 p-4 sm:flex-row sm:items-center`}>
      <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-md bg-slate-100 sm:w-44 dark:bg-slate-800">
        <Image
          src="/assets/hero_display.png"
          alt="Stradcom LTO IT Portal preview"
          fill
          className="object-cover"
          sizes="176px"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-blue-500">Currently Building</p>
        <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
          Stradcom LTO IT Portal
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {["PHP", "CodeIgniter", "Bootstrap"].map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 dark:bg-blue-950/60 dark:text-blue-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function ProjectsSection() {
  return (
    <section className={`${surface} overflow-hidden`}>
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Projects</h2>
          <p className="mt-1 text-sm text-slate-400">Manage your portfolio projects.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SearchInput label="Search projects..." />
          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={14} /> Add Project
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400 dark:bg-slate-950/60">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Tech Stack</th>
              <th className="px-4 py-3 font-medium">Last Updated</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {projects.map((project, index) => (
              <tr
                key={project.name}
                className="transition hover:bg-blue-50/40 dark:hover:bg-slate-800/50"
              >
                <td className="px-4 py-3 text-slate-400">{index + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative h-8 w-10 overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
                      <Image
                        src={project.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <span className="whitespace-nowrap font-medium text-slate-700 dark:text-slate-200">
                      {project.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="whitespace-nowrap rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-600 dark:bg-blue-950/60 dark:text-blue-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-400">{project.date}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <ActionButton action="edit" label={project.name} />
                    <ActionButton action="delete" label={project.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination label="Showing 1 - 6 of 6 projects" />
    </section>
  );
}

function SkillsSection() {
  return (
    <section className={`${surface} overflow-hidden`}>
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Skills</h2>
          <p className="mt-1 text-sm text-slate-400">Manage your technical skills and expertise.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SearchInput label="Search skills..." />
          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={14} /> Add Skill
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-xs">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400 dark:bg-slate-950/60">
            <tr>
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Skill Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Last Updated</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {skills.map(([name, category, date], index) => (
              <tr key={name} className="transition hover:bg-blue-50/40 dark:hover:bg-slate-800/50">
                <td className="px-4 py-3 text-slate-400">{index + 1}</td>
                <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{name}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
                    {category}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-400">{date}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <ActionButton action="edit" label={name} />
                    <ActionButton action="delete" label={name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination label="Showing 1 - 6 of 12 skills" />
    </section>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [router, status]);

  if (status !== "authenticated") {
    return <SplashScreen isVisible />;
  }

  return (
    <div
      id="dashboard"
      className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
    >
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <Topbar />
          <main className="mx-auto max-w-[1320px] space-y-6 px-5 py-7 md:px-8 md:py-9">
            <section>
              <div className="mb-2 px-3 py-2 bg-blue-50 rounded-3xl w-fit dark:bg-blue-900 dark:text-blue-300">
                <h1 className="text-md font-bold text-blue-500">👋 Welcome back!</h1>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
                Vincent <span className="text-blue-500">Patrick Castro</span>
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-5 text-slate-500 dark:text-slate-400">
                Here&apos;s a quick overview of your portfolio, projects, skills and development
                progress.
              </p>
            </section>
            <section className="grid gap-4 sm:grid-cols-4">
              <SummaryCard
                icon={FolderKanban}
                label="Total Projects"
                value="6"
                tone="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300"
              />
              <SummaryCard
                icon={Code2}
                label="Total Skills"
                value="12"
                tone="bg-emerald-100 text-emerald-500 dark:bg-emerald-950 dark:text-emerald-300"
              />
              <div className="col-span-2">
                <CurrentlyBuildingCard />
              </div>
            </section>
            <ProjectsSection />
            <SkillsSection />
          </main>
        </div>
      </div>
    </div>
  );
}
