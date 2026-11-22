"use client";

import { useEffect, useState } from "react";
import { SearchX } from "lucide-react";
import Button from "@/src/components/ui/Button/Button";
import {
  CATALOG_GRID,
  CatalogCardsSkeleton,
} from "@/src/components/catalog/CatalogCard";
import CatalogPagination from "@/src/components/catalog/CatalogPagination";
import CatalogLayout from "@/src/components/catalog/CatalogLayout";
import { useDebouncedValue } from "@/src/hooks/useDebouncedValue";
import { buildJobsQuery, fetchJobs } from "../jobs.api";
import { EMPTY_FILTERS } from "../jobs.constants";
import type { JobFilters, JobsResponse } from "../jobs.type";
import JobCard from "./JobCard";
import JobFilterBar, { JobSearch, JobSort } from "./JobFilterBar";

export default function JobsExplorer() {
  const [filters, setFilters] = useState<JobFilters>(EMPTY_FILTERS);
  const debouncedFilters = useDebouncedValue(filters, 300);
  const query = buildJobsQuery(debouncedFilters);
  const [retry, setRetry] = useState(0);
  const requestKey = `${query}:${retry}`;
  const [result, setResult] = useState<{
    key: string;
    data?: JobsResponse;
    error?: string;
  }>();
  const loading =
    result?.key !== requestKey || buildJobsQuery(filters) !== query;

  useEffect(() => {
    const controller = new AbortController();
    fetchJobs(query, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResult({ key: requestKey, data });
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted)
          setResult({
            key: requestKey,
            error:
              cause instanceof Error
                ? cause.message
                : "Something went wrong loading jobs.",
          });
      });
    return () => controller.abort();
  }, [query, requestKey]);

  const data = result?.data;
  const activeFilterCount = [
    filters.countries.length > 0,
    filters.companyIds.length > 0,
    filters.disciplines.length > 0,
    filters.type,
    filters.seniority,
  ].filter(Boolean).length;
  const hasFilters = [
    filters.search,
    filters.countries.length > 0,
    filters.companyIds.length > 0,
    filters.disciplines.length > 0,
    filters.type,
    filters.seniority,
  ].some(Boolean);
  const pagination = data?.pagination;
  const first =
    pagination && pagination.total
      ? (pagination.page - 1) * pagination.limit + 1
      : 0;
  const last = pagination
    ? Math.min(pagination.page * pagination.limit, pagination.total)
    : 0;

  return (
    <CatalogLayout
      search={<JobSearch filters={filters} onChange={setFilters} />}
      toolbar={<JobSort filters={filters} onChange={setFilters} />}
      filters={<JobFilterBar filters={filters} onChange={setFilters} />}
      activeFilterCount={activeFilterCount}
      resultsLabel="Job results"
    >
      <p role="status" className="text-sm text-accent-200">
        {loading
          ? "Loading opportunities…"
          : result?.error
            ? "Jobs unavailable"
            : `Showing ${first}–${last} of ${pagination?.total ?? 0} jobs`}
      </p>
      <div aria-busy={loading}>
        {loading ? (
          <CatalogCardsSkeleton />
        ) : result?.error ? (
          <div
            role="alert"
            className="flex flex-col items-center gap-4 py-20 text-center"
          >
            <h3 className="text-2xl font-semibold text-danger-300">
              Couldn&apos;t load jobs
            </h3>
            <p className="max-w-md text-neutral-100">{result.error}</p>
            <Button
              intent="accent"
              variant="outlined"
              onClick={() => setRetry((value) => value + 1)}
            >
              Try again
            </Button>
          </div>
        ) : !data?.data.length ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <SearchX aria-hidden="true" className="size-14 text-accent-300" />
            <h3 className="text-2xl font-semibold text-primary-200">
              No jobs found
            </h3>
            <p className="max-w-md text-neutral-100">
              {hasFilters
                ? "Try different keywords or clear your filters to explore more opportunities."
                : "New opportunities will appear here when they are posted. Check back soon."}
            </p>
            <Button
              intent="accent"
              variant="outlined"
              onClick={() => {
                setFilters(EMPTY_FILTERS);
                setRetry((value) => value + 1);
              }}
            >
              {hasFilters ? "Clear filters" : "Refresh jobs"}
            </Button>
          </div>
        ) : (
          <div className={CATALOG_GRID}>
            {data.data.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
      {!loading && pagination && (
        <CatalogPagination
          label={"Jobs pagination"}
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setFilters({ ...filters, page })}
        />
      )}
    </CatalogLayout>
  );
}
