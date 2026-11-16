"use client";

import { ChevronDown } from "lucide-react";
import { Input } from "@/src/components/ui/InputField/Input";
import type { ProjectFacets, ProjectFilters, Sponsorship } from "./project.type";

interface ProjectToolbarProps {
  filters: ProjectFilters;
  facets: ProjectFacets;
  total: number | null;
  onChange: (filters: ProjectFilters) => void;
}

interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

const FilterSelect = ({ id, label, value, options, onChange }: FilterSelectProps) => (
  <div className="relative">
    <select
      id={id}
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`appearance-none cursor-pointer whitespace-nowrap rounded-full border bg-neutral-900 py-1.5 pl-3 pr-8 text-sm tracking-normal outline-none transition-colors duration-200 focus-visible:border-accent-300 ${
        value ? "border-accent-300 text-accent-200" : "border-neutral-400 text-neutral-200"
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
);

const asOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

const SPONSORSHIP_OPTIONS: { value: Sponsorship; label: string }[] = [
  { value: "sponsored", label: "Sponsored" },
  { value: "unsponsored", label: "Not sponsored" },
];

const ProjectToolbar = ({ filters, facets, total, onChange }: ProjectToolbarProps) => {
  const set = (patch: Partial<ProjectFilters>) => onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-3">
      <div className="w-full lg:w-64 lg:shrink-0">
        <Input
          id="project-search"
          type="search"
          size="sm"
          placeholder="Search by title, student or supervisor"
          aria-label="Search projects"
          value={filters.search}
          onChange={(event) => set({ search: event.target.value })}
        />
      </div>

      <div className="flex flex-wrap gap-2 lg:flex-nowrap">
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
        <FilterSelect
          id="project-year"
          label="Year"
          value={filters.year}
          options={asOptions(facets.years)}
          onChange={(year) => set({ year })}
        />
        <FilterSelect
          id="project-sponsorship"
          label="Sponsorship"
          value={filters.sponsorship}
          options={SPONSORSHIP_OPTIONS}
          onChange={(sponsorship) => set({ sponsorship: sponsorship as Sponsorship })}
        />
      </div>

      {total !== null && (
        <p className="whitespace-nowrap text-sm text-neutral-200 lg:ml-auto" aria-live="polite">
          Showing <span className="font-semibold text-neutral-50 tabular-nums">{total}</span>
        </p>
      )}
    </div>
  );
};

export default ProjectToolbar;
