"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import { Button } from "@/components/buttons/button";
import { deleteSkill, type Skill } from "@/lib/api/skills";

type DeleteSkillModalProps = {
  skill: Skill;
  onClose: () => void;
  onDeleted: (skillId: number) => void;
};

export function DeleteSkillModal({ skill, onClose, onDeleted }: DeleteSkillModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const requestInProgress = useRef(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && !requestInProgress.current) onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleDelete = async () => {
    if (requestInProgress.current) return;
    requestInProgress.current = true;
    setIsDeleting(true);
    setError("");

    try {
      await deleteSkill(skill.id);
      onDeleted(skill.id);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete skill.");
      requestInProgress.current = false;
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex h-screen items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) onClose();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-skill-title"
        aria-describedby="delete-skill-description"
        className="w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300">
              <TriangleAlert size={32} />
            </div>
            <div className="min-w-0">
              <h2 id="delete-skill-title" className="text-lg font-bold text-slate-900 dark:text-white">
                Delete Skill
              </h2>
              <p id="delete-skill-description" className="mt-2 break-words text-sm leading-6 text-slate-600 dark:text-slate-300">
                Are you sure you want to permanently delete <span className="font-semibold text-slate-900 dark:text-white">{skill.name}</span>? This action cannot be undone.
              </p>
            </div>
          </div>

          {error && (
            <div role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-950 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 dark:border-slate-800 sm:flex-row sm:justify-end sm:px-6">
          <Button type="button" variant="secondary" disabled={isDeleting} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
            className="rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? <LoaderCircle size={16} className="animate-spin" /> : <TriangleAlert size={16} />}
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </footer>
      </section>
    </div>
  );
}