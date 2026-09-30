"use client";

import { useEffect, useState, type FormEvent } from "react";
import { LoaderCircle, Save, X } from "lucide-react";
import { Button } from "@/components/buttons/button";
import { skillCategories, updateSkill, type Skill, type SkillCategory } from "@/lib/api/skills";

type UpdateSkillModalProps = {
  skill: Skill;
  onClose: () => void;
  onUpdated: () => void;
};

const fieldClassName =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-950 dark:disabled:bg-slate-800";

export function UpdateSkillModal({ skill, onClose, onUpdated }: UpdateSkillModalProps) {
  const [name, setName] = useState(skill.name);
  const [category, setCategory] = useState<SkillCategory>(skill.category);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (isSubmitting) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmedName = name.trim();
    if (!trimmedName || !category) {
      setError("Skill name and category are required.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await updateSkill({ id: skill.id, name: trimmedName, category });
      onUpdated();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update skill.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex h-screen items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-skill-title"
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        <header className="flex items-start justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
          <div>
            <h2 id="update-skill-title" className="text-lg font-bold text-slate-900 dark:text-white">
              Update Skill
            </h2>
            <p className="mt-1 text-sm text-slate-400">Edit this skill in your portfolio.</p>
          </div>
          <Button
            type="button"
            aria-label="Close modal"
            title="Close modal"
            variant="ghost"
            size="icon"
            disabled={isSubmitting}
            onClick={onClose}
            className="h-8 w-8 rounded-md text-slate-500"
          >
            <X size={16} />
          </Button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-5 py-5 sm:px-6">
            {error && (
              <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-950 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="update_skill_name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="update_skill_name"
                name="name"
                type="text"
                required
                maxLength={100}
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={isSubmitting}
                className={fieldClassName}
              />
            </div>

            <div>
              <label htmlFor="update_skill_category" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="update_skill_category"
                name="category"
                required
                value={category}
                onChange={(event) => setCategory(event.target.value as SkillCategory)}
                disabled={isSubmitting}
                className={fieldClassName}
              >
                {skillCategories.map((skillCategory) => (
                  <option key={skillCategory} value={skillCategory}>{skillCategory}</option>
                ))}
              </select>
            </div>
          </div>

          <footer className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
            <Button type="button" variant="secondary" disabled={isSubmitting} onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-32 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSubmitting ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
              {isSubmitting ? "Updating..." : "Update Skill"}
            </Button>
          </footer>
        </form>
      </section>
    </div>
  );
}