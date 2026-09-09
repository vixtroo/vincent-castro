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

export async function getCurrentlyBuildingProject(): Promise<CurrentlyBuildingProject | null> {
  const baseUrl = process.env.BASE_URL;

  const response = await fetch(`${baseUrl}/api/projects/currently-building`);
  const result: CurrentlyBuildingProjectResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || result.error || "Failed to fetch currently building project");
  }

  return result.data;
}
