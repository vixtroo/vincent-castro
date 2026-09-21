export const skillCategories = ["FRONTEND", "BACKEND", "DATABASE", "TOOLS"] as const;

export type SkillCategory = (typeof skillCategories)[number];

export type Skill = {
  id: number;
  created_at: string;
  name: string;
  category: SkillCategory;
  user_id: string;
};

type AllSkillsResponse = {
  success: boolean;
  data: {
    skills: Skill[];
    total: number;
    page: number;
    limit: number;
  } | null;
  message?: string;
  error?: string;
};

export type PaginatedSkills = {
  skills: Skill[];
  total: number;
  page: number;
  limit: number;
};

export async function getAllSkills({ page, limit }: { page: number; limit: number }): Promise<PaginatedSkills> {
  const baseUrl = process.env.BASE_URL;
  const searchParams = new URLSearchParams({ page: String(page), limit: String(limit) });

  const response = await fetch(`${baseUrl}/api/skills/get-all-skills?${searchParams.toString()}`);
  const result: AllSkillsResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || result.error || "Failed to fetch skills");
  }

  const data = result.data ?? { skills: [], total: 0, page, limit };

  return {
    skills: data.skills.filter(
      (skill) => skillCategories.includes(skill.category) && skill.name.trim().length > 0,
    ),
    total: data.total,
    page: data.page,
    limit: data.limit,
  };
}