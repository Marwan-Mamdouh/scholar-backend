"use client";

import { useEffect, useState } from "react";
import { BookOpen, Search, SearchX } from "lucide-react";
import CatalogCard, {
  CATALOG_GRID,
  CatalogCardsSkeleton,
} from "@/src/components/catalog/CatalogCard";
import CatalogLayout from "@/src/components/catalog/CatalogLayout";
import FilterAccordion from "@/src/components/ui/FilterAccordion/FilterAccordion";
import Badge from "@/src/components/ui/Badge/Badge";
import CatalogPagination from "@/src/components/catalog/CatalogPagination";
import Button from "@/src/components/ui/Button/Button";
import { Input } from "@/src/components/ui/InputField/Input";
import { useDebouncedValue } from "@/src/hooks/useDebouncedValue";
import type { Paginated } from "@/src/lib/api-client";
import { fetchPapers, type ResearchPaper } from "./paper.api";

export default function PapersExplorer() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);
  const [retry, setRetry] = useState(0);
  const term = search.trim();
  const selectedYear = /^\d{4}$/.test(year) && Number(year) > 0 ? year : "";
  const debouncedTerm = useDebouncedValue(term, 300);
  const debouncedYear = useDebouncedValue(selectedYear, 300);
  const queryReady = term === debouncedTerm && selectedYear === debouncedYear;
  const key = JSON.stringify([debouncedTerm, debouncedYear, page, retry]);
  const [result, setResult] = useState<{
    key: string;
    data?: Paginated<ResearchPaper>;
    error?: string;
  }>();

  useEffect(() => {
    if (!queryReady) return;
    const controller = new AbortController();
    fetchPapers(debouncedTerm, debouncedYear, page, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResult({ key, data });
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setResult({
            key,
            error:
              cause instanceof Error ? cause.message : "Could not load papers.",
          });
        }
      });
    return () => controller.abort();
  }, [debouncedTerm, debouncedYear, key, page, queryReady]);

  const loading = !queryReady || result?.key !== key;
  const data = result?.key === key ? result.data : undefined;
  const total = data?.pagination.total ?? 0;

  return (
    <CatalogLayout
      resultsLabel="Paper results"
      activeFilterCount={selectedYear ? 1 : 0}
      search={
        <Input
          type="search"
          aria-label="Search papers"
          placeholder="Search by title, journal or DOI"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          endAdornment={<Search aria-hidden="true" className="size-5" />}
        />
      }
      filters={
        <FilterAccordion
          label="Year"
          activeCount={selectedYear ? 1 : 0}
          onClear={() => {
            setYear("");
            setPage(1);
          }}
        >
          <Input
            aria-label="Publication year"
            placeholder="e.g. 2024"
            size="sm"
            inputMode="numeric"
            maxLength={4}
            value={year}
            onChange={(event) => {
              setYear(event.target.value.replace(/\D/g, ""));
              setPage(1);
            }}
          />
        </FilterAccordion>
      }
    >
      <p role="status" className="text-sm text-accent-200">
        {loading
          ? "Loading papers…"
          : result?.error
            ? "Papers unavailable"
            : `${total} paper${total === 1 ? "" : "s"}`}
      </p>
      <div aria-busy={loading}>
        {loading ? (
          <CatalogCardsSkeleton />
        ) : result?.error ? (
          <div
            role="alert"
            className="flex flex-col items-center gap-3 py-12 text-center"
          >
            <h3 className="text-xl font-semibold text-danger-300">
              Couldn&apos;t load papers
            </h3>
            <p className="text-neutral-100">{result.error}</p>
            <Button
              intent="accent"
              variant="outlined"
              onClick={() => setRetry((attempt) => attempt + 1)}
            >
              Try again
            </Button>
          </div>
        ) : !data?.data.length ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <SearchX aria-hidden="true" className="size-10 text-accent-300" />
            <h3 className="text-xl font-semibold text-primary-200">
              No papers found
            </h3>
            <p className="text-neutral-100">
              Try a different keyword or publication year.
            </p>
            {(search || year) && (
              <Button
                intent="accent"
                variant="outlined"
                onClick={() => {
                  setSearch("");
                  setYear("");
                  setPage(1);
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className={CATALOG_GRID}>
            {data.data.map((paper) => (
              <CatalogCard
                key={paper.id}
                title={paper.title}
                eyebrow={paper.journalTitle ?? paper.sourceName ?? undefined}
                icon={
                  <BookOpen
                    aria-hidden="true"
                    className="size-8 text-accent-300"
                  />
                }
                badge={
                  paper.publicationYear && (
                    <Badge size="md" variant="solid" intent="accent">
                      {paper.publicationYear}
                    </Badge>
                  )
                }
                href={`/research/papers/${paper.id}`}
              >
                {paper.staff?.name && (
                  <p className="line-clamp-2 text-accent-300">
                    {paper.staff.name}
                  </p>
                )}
                {paper.subtitle && (
                  <p className="line-clamp-2 text-neutral-200">
                    {paper.subtitle}
                  </p>
                )}
              </CatalogCard>
            ))}
          </div>
        )}
      </div>
      {!loading && data && (
        <CatalogPagination
          label="Papers pagination"
          page={data.pagination.page}
          totalPages={data.pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </CatalogLayout>
  );
}
