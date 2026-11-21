"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import Button from "@/src/components/ui/Button/Button";

interface CatalogLayoutProps {
  search: ReactNode;
  filters?: ReactNode;
  toolbar?: ReactNode;
  activeFilterCount?: number;
  resultsLabel?: string;
  children: ReactNode;
}

export default function CatalogLayout({
  search,
  filters,
  toolbar,
  activeFilterCount = 0,
  resultsLabel = "Catalog results",
  children,
}: CatalogLayoutProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersId = useId();
  const toggleRef = useRef<HTMLDivElement>(null);

  function closeFilters() {
    setFiltersOpen(false);
    toggleRef.current?.querySelector("button")?.focus();
  }

  return (
    <div
      className={`grid min-w-0 items-start gap-6 ${filters ? "lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-x-8" : ""}`}
    >
      <div
        className={`flex min-w-0 flex-col gap-3 ${filters ? "lg:col-start-2 lg:row-start-1" : ""}`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full min-w-0 sm:max-w-lg">{search}</div>
          {toolbar && (
            <div className="shrink-0 self-start sm:self-auto">{toolbar}</div>
          )}
        </div>
        {filters && (
          <div ref={toggleRef} className="lg:hidden">
            <Button
              type="button"
              variant="outlined"
              intent="accent"
              className="min-h-11 w-full lg:hidden"
              iconLeft={
                <SlidersHorizontal aria-hidden="true" className="size-4" />
              }
              iconRight={
                <ChevronDown
                  aria-hidden="true"
                  className={`size-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
                />
              }
              aria-expanded={filtersOpen}
              aria-controls={filtersId}
              onClick={() => setFiltersOpen((open) => !open)}
            >
              {filtersOpen ? "Hide filters" : "Filters"}
              {activeFilterCount ? ` (${activeFilterCount})` : ""}
            </Button>
          </div>
        )}
      </div>

      {filters && (
        <aside
          id={filtersId}
          aria-label="Catalog filters"
          className={`${filtersOpen ? "block" : "hidden"} min-w-0 rounded-3xl bg-overlay/[0.035] p-5 lg:sticky lg:top-28 lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:block lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:overscroll-contain`}
        >
          <div className="mb-5 flex items-center gap-2 text-neutral-100">
            <SlidersHorizontal
              aria-hidden="true"
              className="size-4 text-accent-300"
            />
            <h2 className="text-lg font-medium">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="text-sm text-accent-300">
                ({activeFilterCount})
              </span>
            )}
          </div>
          {filters}
          <Button
            type="button"
            variant="outlined"
            intent="accent"
            className="mt-6 min-h-11 w-full lg:hidden"
            onClick={closeFilters}
          >
            Show results
          </Button>
        </aside>
      )}

      <section
        aria-label={resultsLabel}
        className={`flex min-w-0 flex-col gap-6 ${filters ? "lg:col-start-2 lg:row-start-2" : ""}`}
      >
        {children}
      </section>
    </div>
  );
}
