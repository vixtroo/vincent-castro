"use client";

import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import Image from "next/image";
import { ImagePlus, LoaderCircle, Plus, X } from "lucide-react";
import { Button } from "@/components/buttons/button";
import { createProject } from "@/lib/api/projects";

type AddProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const fieldClassName =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-950 dark:disabled:bg-slate-800";

export function AddProjectModal({ isOpen, onClose, onCreated }: AddProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [technologyInput, setTechnologyInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!projectImage) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImagePreview(reader.result);
    };
    reader.readAsDataURL(projectImage);
    return () => reader.abort();
  }, [projectImage]);

  useEffect(() => {
    if (!isOpen || isSubmitting) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  const addTechnology = () => {
    const technology = technologyInput.trim();
    if (!technology) return;
    if (!technologies.some((item) => item.toLowerCase() === technology.toLowerCase())) {
      setTechnologies((current) => [...current, technology]);
    }
    setTechnologyInput("");
  };

  const handleTechnologyKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTechnology();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setError("");
    setImagePreview("");

    if (file && !file.type.startsWith("image/")) {
      setProjectImage(null);
      event.target.value = "";
      setError("Choose a valid image file.");
      return;
    }

    setProjectImage(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setError("");

    if (!projectName.trim()) {
      setError("Project name is required.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!projectImage || !projectImage.type.startsWith("image/")) {
      setError("Choose a valid project image.");
      return;
    }
    if (technologies.length === 0) {
      setError("Add at least one technology to the tech stack.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createProject({
        projectImage,
        projectName: projectName.trim(),
        description: description.trim(),
        techStack: technologies,
      });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create project.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    onCreated();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm h-screen"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-project-title"
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        <header className="flex items-start justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
          <div>
            <h2 id="add-project-title" className="text-lg font-bold text-slate-900 dark:text-white">
              Add Project
            </h2>
            <p className="mt-1 text-sm text-slate-400">Add a project to your portfolio.</p>
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

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="overflow-y-auto px-5 py-5 sm:px-6">
            {error && (
              <div role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-950 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="project_image" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Project Image <span className="text-red-500">*</span>
                </label>
                <input
                  id="project_image"
                  name="project_image"
                  type="file"
                  accept="image/*"
                  disabled={isSubmitting}
                  onChange={handleImageChange}
                  className={`${fieldClassName} file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-blue-600 dark:file:bg-blue-950 dark:file:text-blue-300`}
                />
                {imagePreview && (
                  <div className="relative mt-3 h-40 overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
                    <Image src={imagePreview} alt="Selected project preview" fill unoptimized sizes="(max-width: 640px) 100vw, 640px" className="object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="project_name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="project_name"
                  name="project_name"
                  type="text"
                  required
                  maxLength={160}
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  disabled={isSubmitting}
                  placeholder="e.g. Portfolio Dashboard"
                  className={fieldClassName}
                />
              </div>

              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  disabled={isSubmitting}
                  placeholder="Describe what the project does..."
                  className={`${fieldClassName} resize-y`}
                />
              </div>

              <div>
                <label htmlFor="tech_stack_input" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Tech Stack <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="tech_stack_input"
                    type="text"
                    value={technologyInput}
                    onChange={(event) => setTechnologyInput(event.target.value)}
                    onKeyDown={handleTechnologyKeyDown}
                    disabled={isSubmitting}
                    placeholder="Add a technology"
                    className={fieldClassName}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Add technology"
                    title="Add technology"
                    disabled={isSubmitting || !technologyInput.trim()}
                    onClick={addTechnology}
                    className="h-10 w-10 shrink-0 rounded-md border-slate-200 dark:border-slate-700"
                  >
                    <Plus size={15} />
                  </Button>
                </div>
                {technologies.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-2" aria-label="Selected technologies">
                    {technologies.map((technology) => (
                      <li key={technology} className="flex items-center gap-1 rounded-full bg-blue-50 py-1 pl-2.5 pr-1 text-xs font-medium text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
                        {technology}
                        <button
                          type="button"
                          aria-label={`Remove ${technology}`}
                          title={`Remove ${technology}`}
                          disabled={isSubmitting}
                          onClick={() => setTechnologies((current) => current.filter((item) => item !== technology))}
                          className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-blue-100 disabled:opacity-50 dark:hover:bg-blue-900"
                        >
                          <X size={12} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs text-slate-400">Add at least one technology.</p>
                )}
              </div>
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
              {isSubmitting ? <LoaderCircle size={16} className="animate-spin" /> : <ImagePlus size={16} />}
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </footer>
        </form>
      </section>
    </div>
  );
}