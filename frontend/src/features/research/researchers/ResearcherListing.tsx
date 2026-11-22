"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import CatalogLayout from "@/src/components/catalog/CatalogLayout";
import CatalogPagination from "@/src/components/catalog/CatalogPagination";
import { CatalogCardsSkeleton } from "@/src/components/catalog/CatalogCard";
import Button from "@/src/components/ui/Button/Button";
import CatalogFacetLoader from "@/src/components/catalog/CatalogFacetLoader";
import SearchableFacet, {
  textFacetOptions,
} from "@/src/components/ui/SearchableFacet/SearchableFacet";
import { Input } from "@/src/components/ui/InputField/Input";
import { useDebouncedValue } from "@/src/hooks/useDebouncedValue";
import ResearcherGrid from "./ResearcherGrid";
import { fetchResearchers } from "./researcher.api";
import { toResearcherSummary } from "./researcher.utils";
import type { AcademicResearcher, ResearcherFacets } from "./researcher.type";

const emptyFilters: ResearcherFacets & { researcher: string } = {
  researcher: "",
  topics: [],
  departments: [],
  universities: [],
};

const fields = [
  { key: "topics", label: "Topics" },
  { key: "departments", label: "Research Fields" },
  { key: "universities", label: "Universities" },
] as const;

interface ResearcherResults {
  items: AcademicResearcher[];
  total: number;
  totalPages: number;
  error?: string;
}

export function useResearcherListing(initial: ResearcherResults) {
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const applied = useDebouncedValue(filters, 300);
  const pending = filters !== applied;
  const key = JSON.stringify([applied, page, attempt]);
  const initialPage =
    page === 1 &&
    !applied.researcher.trim() &&
    fields.every(({ key }) => !applied[key].length) &&
    attempt === 0;
  const [loaded, setLoaded] = useState<ResearcherResults & { key: string }>();

  useEffect(() => {
    if (pending || initialPage) return;
    const controller = new AbortController();
    const [firstName, ...lastName] = applied.researcher.trim().split(/\s+/);
    const nameQuery = lastName.length
      ? { firstName, lastName: lastName.join(" ") }
      : { researcher: firstName };
    fetchResearchers(
      {
        ...nameQuery,
        topics: applied.topics,
        departments: applied.departments,
        universities: applied.universities,
        page,
      },
      controller.signal,
    )
      .then(({ data, pagination }) => {
        if (!controller.signal.aborted)
          setLoaded({
            key,
            items: data,
            total: pagination.total,
            totalPages: pagination.totalPages,
          });
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted)
          setLoaded({
            key,
            items: [],
            total: 0,
            totalPages: 0,
            error:
              cause instanceof Error
                ? cause.message
                : "Could not load researchers.",
          });
      });
    return () => controller.abort();
  }, [applied, page, pending, initialPage, key]);

  const result = initialPage
    ? initial
    : loaded?.key === key
      ? loaded
      : undefined;
  function update(next: typeof filters) {
    setFilters(next);
    setPage(1);
  }
  return {
    filters,
    page,
    setPage,
    result,
    loading: pending || !result,
    update,
    retry: () => setAttempt((value) => value + 1),
  };
}

export default function ResearcherListing({
  listing,
  onViewProfile,
}: {
  listing: ReturnType<typeof useResearcherListing>;
  onViewProfile: (id: number) => void;
}) {
  const { filters, page, setPage, result, loading, update, retry } = listing;
  const activeCount = fields.filter(({ key }) => filters[key].length).length;
  return (
    <CatalogLayout
      search={
        <Input
          type="search"
          aria-label="Search researchers"
          placeholder="Search by Researcher Name"
          value={filters.researcher}
          onChange={(event) =>
            update({ ...filters, researcher: event.target.value })
          }
          endAdornment={<Search aria-hidden="true" className="size-5" />}
        />
      }
      filters={
        <div className="flex flex-col gap-1">
          <CatalogFacetLoader<ResearcherFacets> catalog="researchers">
            {(facets) =>
              fields.map(({ key, label }) => (
                <SearchableFacet
                  key={key}
                  label={label}
                  options={textFacetOptions(facets[key])}
                  selected={filters[key]}
                  onChange={(values) => update({ ...filters, [key]: values })}
                />
              ))
            }
          </CatalogFacetLoader>
          {(activeCount > 0 || filters.researcher) && (
            <Button
              type="button"
              variant="link"
              intent="accent"
              onClick={() => update(emptyFilters)}
            >
              Clear all
            </Button>
          )}
        </div>
      }
      activeFilterCount={activeCount}
      resultsLabel="Researcher results"
    >
      <p role="status" className="text-sm text-accent-200">
        {loading
          ? "Loading researchers…"
          : result?.error
            ? "Researchers unavailable"
            : `${result?.total} researcher${result?.total === 1 ? "" : "s"}`}
      </p>
      {loading ? (
        <CatalogCardsSkeleton />
      ) : result?.error ? (
        <div
          role="alert"
          className="flex flex-col items-center gap-3 py-16 text-center"
        >
          <h3 className="text-xl font-semibold text-danger-300">
            Researchers Are Unavailable
          </h3>
          <p className="text-neutral-100">{result.error}</p>
          <Button variant="outlined" intent="accent" onClick={retry}>
            Try again
          </Button>
        </div>
      ) : result?.items.length ? (
        <>
          <ResearcherGrid
            researchers={result.items.map(toResearcherSummary)}
            onViewProfile={onViewProfile}
          />
          <CatalogPagination
            label="Researchers pages"
            page={page}
            totalPages={result.totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <h3 className="text-2xl font-semibold text-accent-300">
            {activeCount || filters.researcher
              ? "No researchers found"
              : "Find What You're Looking For"}
          </h3>
          <p className="text-neutral-100">
            Search by name, topic, research field or university.
          </p>
        </div>
      )}
    </CatalogLayout>
  );
}
