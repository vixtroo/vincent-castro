import type { ProjectsCardProps } from "@/components/cards/projects_card";

export interface CurrentlyBuildingProject {
  id: number;
  project_name: string;
  description: string;
  project_image: string;
  tech_stack: string[];
  updated_at: string | null;
  created_at: string;
  user_id: string;
  is_currently_building: boolean;
  features: string[] | null;
  currently_building_stack: string;
}

type CurrentlyBuildingProjectResponse = {
  success: boolean;
  data: CurrentlyBuildingProject | null;
  message?: string;
  error?: string;
};

type ApiProject = {
  project_name: string | null;
  description: string | null;
  project_image: string | null;
  tech_stack: string[] | null;
};

type AllProjectsResponse = {
  success: boolean;
  data: ApiProject[] | null;
  message?: string;
  error?: string;
};

export async function getCurrentlyBuildingProject(): Promise<CurrentlyBuildingProject | null> {
  const baseUrl = process.env.BASE_URL;

  const response = await fetch(`${baseUrl}/api/projects/currently-building`);
  const result: CurrentlyBuildingProjectResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || result.error || "Failed to fetch currently building project");
  }

  return result.data;
}

export async function getAllProjects(): Promise<ProjectsCardProps[]> {
  const baseUrl = process.env.BASE_URL;

  const response = await fetch(`${baseUrl}/api/projects/get-all-projects`);
  const result: AllProjectsResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || result.error || "Failed to fetch projects");
  }

  return (result.data ?? []).map((project) => ({
    image_url: project.project_image?.trim() || undefined,
    project_name: project.project_name?.trim() || "Untitled project",
    description: project.description?.trim() || "No description available.",
    tech_stack: (project.tech_stack ?? []).filter(
      (technology): technology is string => typeof technology === "string" && technology.trim().length > 0,
    ),
  }));
}
