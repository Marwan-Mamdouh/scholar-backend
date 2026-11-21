"use client";

import { Search } from "lucide-react";
import Button from "@/src/components/ui/Button/Button";
import FilterPill from "@/src/components/ui/FilterPill/FilterPill";
import FilterAccordion from "@/src/components/ui/FilterAccordion/FilterAccordion";
import { Input } from "@/src/components/ui/InputField/Input";
import { OptionList } from "@/src/components/ui/OptionList/OptionList";
import { EMPTY_FILTERS, JOB_TYPES, SENIORITY_LEVELS } from "../jobs.constants";
import type { JobFilters } from "../jobs.type";

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
    filters.country,
    filters.company,
    filters.discipline,
    filters.type,
    filters.seniority,
  ].filter((value) => value.trim()).length;

  return (
    <div className="flex w-full flex-col gap-1">
      {(
        [
          { key: "country", label: "Country", placeholder: "e.g. Egypt" },
          {
            key: "discipline",
            label: "Discipline",
            placeholder: "e.g. Semiconductors",
          },
          {
            key: "company",
            label: "Company",
            placeholder: "Search company name",
          },
        ] as const
      ).map(({ key, label, placeholder }) => (
        <FilterAccordion
          key={key}
          label={label}
          activeCount={filters[key].trim() ? 1 : 0}
          onClear={() => update(key, "")}
        >
          <Input
            aria-label={`Filter by ${label.toLowerCase()}`}
            placeholder={placeholder}
            size="sm"
            value={filters[key]}
            onChange={(event) => update(key, event.target.value)}
          />
        </FilterAccordion>
      ))}
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
