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
  data: Skill[] | null;
  message?: string;
  error?: string;
};

export async function getAllSkills(): Promise<Skill[]> {
  const baseUrl = process.env.BASE_URL;

  const response = await fetch(`${baseUrl}/api/skills/get-all-skills`);
  const result: AllSkillsResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || result.error || "Failed to fetch skills");
  }

  return (result.data ?? []).filter(
    (skill) => skillCategories.includes(skill.category) && skill.name.trim().length > 0,
  );
}