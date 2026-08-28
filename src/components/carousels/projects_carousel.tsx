"use client";

import { useEffect, useState } from "react";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProjectsCard, ProjectsCardProps } from "@/components/cards/projects_card";

type ProjectsCarouselProps = {
  projects: ProjectsCardProps[];
};

function getVisibleCount() {
  if (typeof window === "undefined") return 1;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
}

export function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const [visibleCount, setVisibleCount] = useState(1);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const updateVisibleCount = () => setVisibleCount(getVisibleCount());

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const pages = [];
  for (let index = 0; index < projects.length; index += visibleCount) {
    pages.push(projects.slice(index, index + visibleCount));
  }

  const pageCount = pages.length;
  const currentPage = Math.min(page, Math.max(pageCount - 1, 0));

  if (projects.length === 0) return null;

  return (
    <div className="w-full">
      <div className="relative px-12 sm:px-14">
        <div className="overflow-hidden py-6">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {pages.map((pageProjects, pageIndex) => (
              <div
                key={pageIndex}
                className="grid min-w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
              >
                {pageProjects.map((project) => (
                  <ProjectsCard key={project.project_name} {...project} />
                ))}
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Previous projects"
          title="Previous projects"
          onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 0))}
          disabled={currentPage === 0}
          className="absolute left-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-500 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-400 cursor-pointer"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          type="button"
          aria-label="Next projects"
          title="Next projects"
          onClick={() => setPage((currentPage) => Math.min(currentPage + 1, pageCount - 1))}
          disabled={currentPage === pageCount - 1}
          className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-500 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-400 cursor-pointer"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      {pageCount > 1 && (
        <div className="mt-4 flex justify-center gap-2" aria-label="Project pages">
          {pages.map((_, pageIndex) => (
            <button
              key={pageIndex}
              type="button"
              aria-label={`Go to project page ${pageIndex + 1}`}
              aria-current={currentPage === pageIndex ? "page" : undefined}
              onClick={() => setPage(pageIndex)}
              className={`h-2 rounded-full transition-all ${
                currentPage === pageIndex
                  ? "w-6 bg-blue-500 dark:bg-blue-600"
                  : "w-2 bg-slate-300 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
