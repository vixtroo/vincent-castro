"use client";

import { useEffect, useState } from "react";
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
  CircleCheck,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import { Button } from "@/components/buttons/button";
import { useAuth } from "@/components/auth_provider";
import { SplashScreen } from "@/components/splash/splash_screen";
import { useRouter } from "next/navigation";
import { getAllProjects, type PaginatedProjects } from "@/lib/api/projects";
import { getAllSkills, type PaginatedSkills } from "@/lib/api/skills";
import { AddProjectModal } from "@/components/modals/add_project_modal";
import { EditProjectModal } from "@/components/modals/edit_project_modal";
import { DeleteProjectModal } from "@/components/modals/delete_project_modal";

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

function ActionButton({ action, label, onClick }: { action: "edit" | "delete"; label: string; onClick?: () => void }) {
  const Icon = action === "edit" ? Pencil : Trash2;
  return (
    <Button
      type="button"
      aria-label={`${action} ${label}`}
      onClick={onClick}
      size="icon"
      variant="ghost"
      className={`flex h-8 w-8 items-center justify-center rounded-md border transition ${action === "delete" ? "border-red-100 text-red-400 hover:bg-red-50 dark:border-red-950 dark:hover:bg-red-950/40" : "border-blue-100 text-blue-500 hover:bg-blue-50 dark:border-blue-950 dark:hover:bg-blue-950/40"}`}
    >
      <Icon size={14} />
    </Button>
  );
}

function Pagination({
  label,
  page = 1,
  pageCount = 1,
  onPageChange = () => undefined,
}: {
  label: string;
  page?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-400 dark:border-slate-800">
      <span>{label}</span>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          aria-label="Previous page"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          size="icon"
          variant="ghost"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700"
        >
          <ChevronLeft size={13} />
        </Button>
        <Button type="button" size="icon" variant="default" className="h-7 w-7 rounded-md bg-blue-600 text-sm text-white" aria-label={`Page ${page}`}>
          {page}
        </Button>
        <Button
          type="button"
          aria-label="Next page"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}
          size="icon"
          variant="ghost"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700"
        >
          <ChevronRight size={13} />
        </Button>
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

function ProjectsSection({ onTotalChange }: { onTotalChange: (total: number) => void }) {
  const [projects, setProjects] = useState<PaginatedProjects>({ projects: [], total: 0, page: 1, limit: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PaginatedProjects["projects"][number] | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<PaginatedProjects["projects"][number] | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isCurrentRequest = true;

    getAllProjects({ page: projects.page, limit: projects.limit })
      .then((result) => {
        if (isCurrentRequest) {
          setProjects(result);
          onTotalChange(result.total);
        }
      })
      .catch((requestError) => {
        if (isCurrentRequest) {
          console.error("Error fetching dashboard projects", requestError);
          setError("Unable to load projects right now.");
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [onTotalChange, projects.page, projects.limit, refreshKey]);

  useEffect(() => {
    if (!successMessage) return;
    const timeoutId = window.setTimeout(() => setSuccessMessage(""), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const handleProjectCreated = () => {
    setIsAddProjectOpen(false);
    setSuccessMessage("Project created successfully.");
    setError(null);
    setIsLoading(true);
    setProjects((current) => ({ ...current, page: 1 }));
    setRefreshKey((current) => current + 1);
  };

  const handleProjectUpdated = () => {
    setSelectedProject(null);
    setSuccessMessage("Project updated successfully.");
    setError(null);
    setIsLoading(true);
    setRefreshKey((current) => current + 1);
  };

  const handleProjectDeleted = (projectId: string) => {
    setProjectToDelete(null);
    setSuccessMessage("Project deleted successfully.");
    setError(null);
    onTotalChange(Math.max(0, projects.total - 1));
    setProjects((current) => {
      const remainingProjects = current.projects.filter((project) => project.id !== projectId);
      return {
        ...current,
        projects: remainingProjects,
        total: Math.max(0, current.total - 1),
        page: remainingProjects.length === 0 && current.page > 1 ? current.page - 1 : current.page,
      };
    });
    setRefreshKey((current) => current + 1);
  };

  const pageCount = Math.max(1, Math.ceil(projects.total / projects.limit));

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setError(null);
    setProjects((current) => ({ ...current, page }));
  };

  return (
    <>
    <section className={`${surface} overflow-hidden`}>
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Projects</h2>
          <p className="mt-1 text-sm text-slate-400">Manage your portfolio projects.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SearchInput label="Search projects..." />
          <Button
            type="button"
            size="sm"
            variant="default"
            onClick={() => setIsAddProjectOpen(true)}
            className="flex h-9 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={14} /> Add Project
          </Button>
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
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">Loading projects...</td></tr>
            ) : error ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-red-500">{error}</td></tr>
            ) : projects.projects.map((project, index) => (
              <tr
                key={project.id}
                className="transition hover:bg-blue-50/40 dark:hover:bg-slate-800/50"
              >
                <td className="px-4 py-3 text-slate-400">{(projects.page - 1) * projects.limit + index + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative h-8 w-10 overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
                      <Image
                        src={project.image_url || "/assets/hero_display.png"}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <span className="whitespace-nowrap font-medium text-slate-700 dark:text-slate-200">
                      {project.project_name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    {(project.tech_stack ?? []).map((tech) => (
                      <span
                        key={tech}
                        className="whitespace-nowrap rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-600 dark:bg-blue-950/60 dark:text-blue-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-400">-</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <ActionButton action="edit" label={project.project_name} onClick={() => setSelectedProject(project)} />
                    <ActionButton action="delete" label={project.project_name} onClick={() => setProjectToDelete(project)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        label={`Showing ${projects.total === 0 ? 0 : (projects.page - 1) * projects.limit + 1} - ${Math.min(projects.page * projects.limit, projects.total)} of ${projects.total} projects`}
        page={projects.page}
        pageCount={pageCount}
        onPageChange={handlePageChange}
      />
    </section>
    {isAddProjectOpen && (
      <AddProjectModal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        onCreated={handleProjectCreated}
      />
    )}
    {selectedProject && (
      <EditProjectModal
        key={selectedProject.id}
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onUpdated={handleProjectUpdated}
      />
    )}
    {projectToDelete && (
      <DeleteProjectModal
        key={projectToDelete.id}
        project={projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onDeleted={handleProjectDeleted}
      />
    )}
    {successMessage && (
      <div
        role="status"
        className="fixed right-5 top-5 z-[2100] flex max-w-[calc(100vw-2.5rem)] items-center gap-2 rounded-md border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg dark:border-emerald-900 dark:bg-slate-900 dark:text-emerald-300"
      >
        <CircleCheck size={17} />
        {successMessage}
      </div>
    )}
    </>
  );
}

function SkillsSection({ onTotalChange }: { onTotalChange: (total: number) => void }) {
  const [skills, setSkills] = useState<PaginatedSkills>({ skills: [], total: 0, page: 1, limit: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrentRequest = true;

    getAllSkills({ page: skills.page, limit: skills.limit })
      .then((result) => {
        if (isCurrentRequest) {
          setSkills(result);
          onTotalChange(result.total);
        }
      })
      .catch((requestError) => {
        if (isCurrentRequest) {
          console.error("Error fetching dashboard skills", requestError);
          setError("Unable to load skills right now.");
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [onTotalChange, skills.page, skills.limit]);

  const pageCount = Math.max(1, Math.ceil(skills.total / skills.limit));

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setError(null);
    setSkills((current) => ({ ...current, page }));
  };

  return (
    <section className={`${surface} overflow-hidden`}>
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Skills</h2>
          <p className="mt-1 text-sm text-slate-400">Manage your technical skills and expertise.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SearchInput label="Search skills..." />
          <Button
            type="button"
            size="sm"
            variant="default"
            className="flex h-9 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={14} /> Add Skill
          </Button>
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
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">Loading skills...</td></tr>
            ) : error ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-red-500">{error}</td></tr>
            ) : skills.skills.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No skills available.</td></tr>
            ) : skills.skills.map((skill, index) => (
              <tr key={skill.id} className="transition hover:bg-blue-50/40 dark:hover:bg-slate-800/50">
                <td className="px-4 py-3 text-slate-400">{(skills.page - 1) * skills.limit + index + 1}</td>
                <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{skill.name}</td>
                <td className="px-4 py-3">
                  <span className={`${skill.category.toLowerCase()} rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 dark:bg-blue-950/60 dark:text-blue-300`}>
                    {skill.category}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-400">
                  {skill.created_at ? new Date(skill.created_at).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <ActionButton action="edit" label={skill.name} />
                    <ActionButton action="delete" label={skill.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        label={`Showing ${skills.total === 0 ? 0 : (skills.page - 1) * skills.limit + 1} - ${Math.min(skills.page * skills.limit, skills.total)} of ${skills.total} skills`}
        page={skills.page}
        pageCount={pageCount}
        onPageChange={handlePageChange}
      />
    </section>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { status } = useAuth();
  const [skillsTotal, setSkillsTotal] = useState<number | null>(null);
  const [projectsTotal, setProjectsTotal] = useState<number | null>(null);

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
                value={projectsTotal === null ? "-" : String(projectsTotal)}
                tone="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300"
              />
              <SummaryCard
                icon={Code2}
                label="Total Skills"
                value={skillsTotal === null ? "-" : String(skillsTotal)}
                tone="bg-emerald-100 text-emerald-500 dark:bg-emerald-950 dark:text-emerald-300"
              />
              <div className="col-span-2">
                <CurrentlyBuildingCard />
              </div>
            </section>
            <ProjectsSection onTotalChange={setProjectsTotal} />
            <SkillsSection onTotalChange={setSkillsTotal} />
          </main>
        </div>
      </div>
    </div>
  );
}
