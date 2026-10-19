"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import notFoundAnimation from "@/src/components/assets/NotFound.json";
import Button from "@/src/components/ui/Button/Button";
import type { Paginated } from "@/src/lib/api-client";
import { useDebouncedValue } from "@/src/hooks/useDebouncedValue";
import ProjectCard from "./ProjectCard";
import ProjectToolbar from "./ProjectToolbar";
import { PROJECTS_PAGE_SIZE, fetchProjects } from "./project.api";
import { EMPTY_FILTERS, filtersKey, hasActiveFilters, toProjectSummary } from "./project.utils";
import type { GraduationProject, ProjectFacets, ProjectFilters } from "./project.type";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface ProjectsExplorerProps {
  initialPage: Paginated<GraduationProject> | null;
  facets: ProjectFacets;
  /** Set when the first request failed on the server */
  initialError?: string;
}

interface Loaded {
  /** `${filtersKey}#${pages}#${attempt}` the items below belong to */
  key: string;
  items: GraduationProject[];
  total: number | null;
  error: string | null;
}

const requestKey = (key: string, pages: number, attempt: number) => `${key}#${pages}#${attempt}`;

const ProjectsExplorer = ({ initialPage, facets, initialError }: ProjectsExplorerProps) => {
  const [filters, setFilters] = useState<ProjectFilters>(EMPTY_FILTERS);
  const debouncedSearch = useDebouncedValue(filters.search, 300);
  const applied = { ...filters, search: debouncedSearch };
  const appliedKey = filtersKey(applied);

  // Pages reset to 1 whenever the applied filters change
  const [paging, setPaging] = useState({ key: appliedKey, pages: 1 });
  const pages = paging.key === appliedKey ? paging.pages : 1;
  const [attempt, setAttempt] = useState(0);
  const wanted = requestKey(appliedKey, pages, attempt);

  const [loaded, setLoaded] = useState<Loaded>(() => ({
    key: requestKey(filtersKey(EMPTY_FILTERS), 1, 0),
    items: initialPage?.data ?? [],
    total: initialPage?.pagination.total ?? null,
    error: initialPage ? null : (initialError ?? "Projects are unavailable right now."),
  }));
  const loading = loaded.key !== wanted;

  useEffect(() => {
    if (loaded.key === wanted) return;
    const controller = new AbortController();

    (async () => {
      try {
        const result = await fetchProjects(
          { ...applied, page: pages, limit: PROJECTS_PAGE_SIZE },
          controller.signal,
        );
        setLoaded((previous) => ({
          key: wanted,
          // Load More appends; a new filter (page 1) replaces
          items: pages === 1 ? (result.data ?? []) : [...previous.items, ...(result.data ?? [])],
          total: result.pagination.total,
          error: null,
        }));
      } catch (cause) {
        if (controller.signal.aborted) return;
        setLoaded((previous) => ({
          ...previous,
          key: wanted,
          error: cause instanceof Error ? cause.message : "Couldn't load projects.",
        }));
      }
    })();

    return () => controller.abort();
    // `applied` is derived from `wanted`'s parts; listing `wanted` is enough
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wanted]);

  const projects = loaded.items.map(toProjectSummary);
  const canLoadMore = loaded.total !== null && loaded.items.length < loaded.total;
  const showError = loaded.error && !loading;

  return (
    <div className="flex flex-col gap-8">
      <ProjectToolbar
        filters={filters}
        facets={facets}
        total={loaded.error ? null : loaded.total}
        onChange={setFilters}
      />

      {showError ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <h3 className="text-xl font-semibold text-danger-300">Couldn&apos;t load projects</h3>
          <p className="max-w-md text-neutral-100">{loaded.error}</p>
          <Button
            type="button"
            variant="outlined"
            intent="accent"
            size="md"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Try again
          </Button>
        </div>
      ) : projects.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center gap-2.5 pt-6 pb-16 text-center">
          <Lottie animationData={notFoundAnimation} loop className="mx-auto w-64" />
          <h3 className="text-2xl font-semibold text-accent-300">No Projects Found</h3>
          <p className="text-neutral-100">
            {hasActiveFilters(applied)
              ? "No projects match these filters."
              : "No graduation projects have been posted yet."}
          </p>
          {hasActiveFilters(filters) && (
            <Button
              type="button"
              variant="link"
              intent="accent"
              size="md"
              onClick={() => setFilters(EMPTY_FILTERS)}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div
          className={`flex flex-col gap-6 transition-opacity duration-300 ${loading && pages === 1 ? "opacity-60" : "opacity-100"}`}
          aria-busy={loading}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {(canLoadMore || (loading && pages > 1)) && (
            <Button
              type="button"
              variant="outlined"
              intent="secondary"
              size="md"
              className="self-center"
              disabled={loading}
              onClick={() => setPaging({ key: appliedKey, pages: pages + 1 })}
            >
              {loading && pages > 1 ? (
                <Loader2 className="size-4 animate-spin" aria-label="Loading" />
              ) : (
                "Load More"
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsExplorer;
