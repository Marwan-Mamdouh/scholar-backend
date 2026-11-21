"use client";

import { ChevronDown } from "lucide-react";
import ResearchYearFilter from "../ResearchYearFilter";
import FilterAccordion from "@/src/components/ui/FilterAccordion/FilterAccordion";
import type {
  ProjectFacets,
  ProjectFilters,
  Sponsorship,
} from "./project.type";

interface ProjectFiltersPanelProps {
  filters: ProjectFilters;
  facets: ProjectFacets;
  onChange: (filters: ProjectFilters) => void;
}

interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

const FilterSelect = ({
  id,
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) => (
  <FilterAccordion
    label={label}
    activeCount={value ? 1 : 0}
    onClear={() => onChange("")}
  >
    <div className="relative">
      <select
        id={id}
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full min-w-0 appearance-none cursor-pointer truncate rounded-xl border bg-neutral-900 py-1.5 pl-3 pr-8 text-sm tracking-normal outline-none transition-colors duration-200 focus-visible:border-accent-300 ${
          value
            ? "border-accent-300 text-accent-200"
            : "border-neutral-400 text-neutral-200"
        }`}
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-neutral-200"
        aria-hidden="true"
      />
    </div>
  </FilterAccordion>
);

const asOptions = (values: string[]) =>
  values.map((value) => ({ value, label: value }));

const SPONSORSHIP_OPTIONS: { value: Sponsorship; label: string }[] = [
  { value: "sponsored", label: "Sponsored" },
  { value: "unsponsored", label: "Not sponsored" },
];

const ProjectFiltersPanel = ({
  filters,
  facets,
  onChange,
}: ProjectFiltersPanelProps) => {
  const set = (patch: Partial<ProjectFilters>) =>
    onChange({ ...filters, ...patch });

  return (
    <div className="flex w-full flex-col gap-1">
      <FilterSelect
        id="project-university"
        label="University"
        value={filters.university}
        options={asOptions(facets.universities)}
        onChange={(university) => set({ university })}
      />
      <FilterSelect
        id="project-field"
        label="Project Field"
        value={filters.projectField}
        options={asOptions(facets.fields)}
        onChange={(projectField) => set({ projectField })}
      />
      <ResearchYearFilter
        catalog="projects"
        value={filters.yearRange}
        onChange={(yearRange) => set({ yearRange })}
      />
      <FilterSelect
        id="project-sponsorship"
        label="Sponsorship"
        value={filters.sponsorship}
        options={SPONSORSHIP_OPTIONS}
        onChange={(sponsorship) =>
          set({ sponsorship: sponsorship as Sponsorship })
        }
      />
    </div>
  );
};

export default ProjectFiltersPanel;
