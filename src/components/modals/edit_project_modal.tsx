"use client";

import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import Image from "next/image";
import { LoaderCircle, Plus, Save, X } from "lucide-react";
import { Button } from "@/components/buttons/button";
import { updateProject, type PaginatedProjects } from "@/lib/api/projects";

type EditProjectModalProps = {
  project: PaginatedProjects["projects"][number];
  onClose: () => void;
  onUpdated: () => void;
};

const fieldClassName =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-950 dark:disabled:bg-slate-800";

export function EditProjectModal({ project, onClose, onUpdated }: EditProjectModalProps) {
  const [projectName, setProjectName] = useState(project.project_name);
  const [description, setDescription] = useState(project.description);
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([...(project.tech_stack ?? [])]);
  const [technologyInput, setTechnologyInput] = useState("");
  const [features, setFeatures] = useState<string[]>([...(project.features ?? [])]);
  const [featureInput, setFeatureInput] = useState("");
  const [isCurrentlyBuilding, setIsCurrentlyBuilding] = useState(project.is_currently_building);
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
    if (!projectImage) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImagePreview(reader.result);
    };
    reader.readAsDataURL(projectImage);
    return () => reader.abort();
  }, [projectImage]);

  useEffect(() => {
    if (isSubmitting) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onClose]);

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

  const addFeature = () => {
    const feature = featureInput.trim();
    if (!feature) return;
    if (!features.some((item) => item.toLowerCase() === feature.toLowerCase())) {
      setFeatures((current) => [...current, feature]);
    }
    setFeatureInput("");
  };

  const handleFeatureKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addFeature();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setError("");

    if (file && !file.type.startsWith("image/")) {
      setProjectImage(null);
      setImagePreview("");
      event.target.value = "";
      setError("Choose a valid image file.");
      return;
    }

    setProjectImage(file);
    setImagePreview("");
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
    if (projectImage && !projectImage.type.startsWith("image/")) {
      setError("Choose a valid image file.");
      return;
    }
    if (technologies.length === 0) {
      setError("Add at least one technology to the tech stack.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProject({
        id: project.id,
        projectImage: projectImage ?? undefined,
        projectName: projectName.trim(),
        description: description.trim(),
        techStack: technologies,
        features,
        isCurrentlyBuilding,
      });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update project.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    onUpdated();
  };

  const displayedImage = imagePreview || project.image_url;

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
        aria-labelledby="edit-project-title"
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        <header className="flex items-start justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
          <div>
            <h2 id="edit-project-title" className="text-lg font-bold text-slate-900 dark:text-white">
              Edit Project
            </h2>
            <p className="mt-1 text-sm text-slate-400">Update your portfolio project.</p>
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
                <label htmlFor="edit_project_image" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Project Image
                </label>
                <input
                  id="edit_project_image"
                  name="project_image"
                  type="file"
                  accept="image/*"
                  disabled={isSubmitting}
                  onChange={handleImageChange}
                  className={`${fieldClassName} file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-blue-600 dark:file:bg-blue-950 dark:file:text-blue-300`}
                />
                {displayedImage ? (
                  <div className="relative mt-3 h-40 overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
                    <Image
                      src={displayedImage}
                      alt={`${projectName || "Project"} preview`}
                      fill
                      unoptimized={Boolean(imagePreview)}
                      sizes="(max-width: 640px) 100vw, 640px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="mt-3 flex h-40 items-center justify-center rounded-md border border-dashed border-slate-200 text-sm text-slate-400 dark:border-slate-700">
                    No project image available
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="edit_project_name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit_project_name"
                  name="project_name"
                  type="text"
                  required
                  maxLength={160}
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  disabled={isSubmitting}
                  className={fieldClassName}
                />
              </div>

              <div>
                <label htmlFor="edit_description" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="edit_description"
                  name="description"
                  required
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  disabled={isSubmitting}
                  className={`${fieldClassName} resize-y`}
                />
              </div>

              <div>
                <label htmlFor="edit_tech_stack_input" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Tech Stack <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="edit_tech_stack_input"
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

              <div>
                <label htmlFor="edit_project_features_input" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Features
                </label>
                <div className="flex gap-2">
                  <input
                    id="edit_project_features_input"
                    type="text"
                    value={featureInput}
                    onChange={(event) => setFeatureInput(event.target.value)}
                    onKeyDown={handleFeatureKeyDown}
                    disabled={isSubmitting}
                    placeholder="Add a feature"
                    className={fieldClassName}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Add feature"
                    title="Add feature"
                    disabled={isSubmitting || !featureInput.trim()}
                    onClick={addFeature}
                    className="h-10 w-10 shrink-0 rounded-md border-slate-200 dark:border-slate-700"
                  >
                    <Plus size={15} />
                  </Button>
                </div>
                {features.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2" aria-label="Selected features">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-1 rounded-full bg-blue-50 py-1 pl-2.5 pr-1 text-xs font-medium text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
                        {feature}
                        <button
                          type="button"
                          aria-label={`Remove ${feature}`}
                          title={`Remove ${feature}`}
                          disabled={isSubmitting}
                          onClick={() => setFeatures((current) => current.filter((item) => item !== feature))}
                          className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-blue-100 disabled:opacity-50 dark:hover:bg-blue-900"
                        >
                          <X size={12} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={isCurrentlyBuilding}
                  onChange={(event) => setIsCurrentlyBuilding(event.target.checked)}
                  disabled={isSubmitting}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600"
                />
                Is Currently Building
              </label>
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </footer>
        </form>
      </section>
    </div>
  );
}