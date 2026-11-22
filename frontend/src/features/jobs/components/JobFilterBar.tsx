"use client";

import { Search } from "lucide-react";
import Button from "@/src/components/ui/Button/Button";
import FilterPill from "@/src/components/ui/FilterPill/FilterPill";
import CatalogFacetLoader from "@/src/components/catalog/CatalogFacetLoader";
import SearchableFacet, {
  textFacetOptions,
} from "@/src/components/ui/SearchableFacet/SearchableFacet";
import FilterAccordion from "@/src/components/ui/FilterAccordion/FilterAccordion";
import { Input } from "@/src/components/ui/InputField/Input";
import { OptionList } from "@/src/components/ui/OptionList/OptionList";
import { EMPTY_FILTERS, JOB_TYPES, SENIORITY_LEVELS } from "../jobs.constants";
import type { JobFacets, JobFilters } from "../jobs.type";

interface Props {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
}

const SORT_OPTIONS: { value: JobFilters["sort"]; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" },
];

export default function JobFilterBar({ filters, onChange }: Props) {
  function update<K extends keyof JobFilters>(key: K, value: JobFilters[K]) {
    onChange({ ...filters, [key]: value, page: 1 });
  }
  const activeCount = [
    filters.countries.length > 0,
    filters.companyIds.length > 0,
    filters.disciplines.length > 0,
    filters.type,
    filters.seniority,
  ].filter(Boolean).length;

  return (
    <div className="flex w-full flex-col gap-1">
      <CatalogFacetLoader<JobFacets> catalog="jobs">
        {(facets) => (
          <>
            <SearchableFacet
              label="Country"
              options={textFacetOptions(facets.countries)}
              selected={filters.countries}
              onChange={(values) => update("countries", values)}
            />
            <SearchableFacet
              label="Discipline"
              options={textFacetOptions(facets.disciplines)}
              selected={filters.disciplines}
              onChange={(values) => update("disciplines", values)}
            />
            <SearchableFacet
              label="Company"
              options={facets.companies.map(({ id, name }) => ({
                value: id,
                label: name,
              }))}
              selected={filters.companyIds}
              onChange={(values) => update("companyIds", values)}
            />
          </>
        )}
      </CatalogFacetLoader>
      <FilterAccordion
        label="Job type"
        activeCount={filters.type ? 1 : 0}
        onClear={() => update("type", "")}
      >
        <OptionList<JobFilters["type"]>
          inputType="radio"
          options={[
            { value: "", label: "All job types" },
            ...Object.entries(JOB_TYPES).map(([value, label]) => ({
              value: value as JobFilters["type"],
              label,
            })),
          ]}
          selected={[filters.type]}
          onToggle={(value) => update("type", value)}
        />
      </FilterAccordion>
      <FilterAccordion
        label="Seniority"
        activeCount={filters.seniority ? 1 : 0}
        onClear={() => update("seniority", "")}
      >
        <OptionList<JobFilters["seniority"]>
          inputType="radio"
          options={[
            { value: "", label: "All seniority levels" },
            ...Object.entries(SENIORITY_LEVELS).map(([value, label]) => ({
              value: value as JobFilters["seniority"],
              label,
            })),
          ]}
          selected={[filters.seniority]}
          onToggle={(value) => update("seniority", value)}
        />
      </FilterAccordion>
      {(activeCount > 0 || filters.search) && (
        <Button
          type="button"
          variant="link"
          intent="accent"
          size="md"
          onClick={() => onChange({ ...EMPTY_FILTERS, sort: filters.sort })}
        >
          Clear all{activeCount > 0 ? ` (${activeCount})` : ""}
        </Button>
      )}
    </div>
  );
}

export function JobSearch({ filters, onChange }: Props) {
  return (
    <Input
      type="search"
      aria-label="Search jobs"
      placeholder="Search job titles, skills, or keywords…"
      value={filters.search}
      onChange={(event) =>
        onChange({ ...filters, search: event.target.value, page: 1 })
      }
      endAdornment={<Search aria-hidden="true" className="size-5" />}
    />
  );
}

export function JobSort({ filters, onChange }: Props) {
  return (
    <FilterPill
      label={`Sort: ${SORT_OPTIONS.find((option) => option.value === filters.sort)?.label}`}
    >
      <OptionList
        inputType="radio"
        options={SORT_OPTIONS}
        selected={[filters.sort]}
        onToggle={(value) => onChange({ ...filters, sort: value, page: 1 })}
      />
    </FilterPill>
  );
}
