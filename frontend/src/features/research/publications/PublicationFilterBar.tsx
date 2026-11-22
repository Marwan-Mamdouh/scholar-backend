"use client";

import CatalogFacetLoader from "@/src/components/catalog/CatalogFacetLoader";
import SearchableFacet from "@/src/components/ui/SearchableFacet/SearchableFacet";
import Button from "@/src/components/ui/Button/Button";
import FilterAccordion from "@/src/components/ui/FilterAccordion/FilterAccordion";
import { OptionList } from "@/src/components/ui/OptionList/OptionList";
import { countPublicationFilters } from "./publication.api";
import {
  ACCESS_TYPE_LABELS,
  EMPTY_FILTERS,
  PUBLISHER_LABELS,
} from "./publication.constants";
import type { PublicationFacets, PublicationFilters } from "./publication.type";

interface PublicationFilterBarProps {
  filters: PublicationFilters;
  onChange: (filters: PublicationFilters) => void;
}

interface FacetProps<T extends string | number> {
  label: string;
  options: { value: T; label: string; hint?: string }[];
  selected: T[];
  onChange: (values: T[]) => void;
}

function Facet<T extends string | number>({
  label,
  options,
  selected,
  onChange,
}: FacetProps<T>) {
  return (
    <FilterAccordion
      label={label}
      activeCount={selected.length}
      onClear={() => onChange([])}
    >
      {options.length ? (
        <OptionList
          options={options}
          selected={selected}
          onToggle={(value) =>
            onChange(
              selected.includes(value)
                ? selected.filter((item) => item !== value)
                : [...selected, value],
            )
          }
        />
      ) : (
        <p className="text-sm text-neutral-300">No options available.</p>
      )}
    </FilterAccordion>
  );
}

function labeledOptions<T extends string>(
  values: T[],
  labels: Record<T, string>,
) {
  return values
    .map((value) => ({ value, label: labels[value] }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export default function PublicationFilterBar({
  filters,
  onChange,
}: PublicationFilterBarProps) {
  const update = <Key extends keyof PublicationFilters>(
    key: Key,
    value: PublicationFilters[Key],
  ) => onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-col gap-1">
      <CatalogFacetLoader<PublicationFacets> catalog="publications">
        {(facets) => (
          <>
            <SearchableFacet
              label="Subject"
              options={facets.subjects.map((subject) => ({
                value: subject.id,
                label: subject.name,
                hint: subject.domain?.name,
              }))}
              selected={filters.categoryIds}
              onChange={(value) => update("categoryIds", value)}
            />
            <Facet
              label="Publication type"
              options={facets.publicationTypes.map((value) => ({
                value,
                label: value,
              }))}
              selected={filters.publicationTypes}
              onChange={(value) => update("publicationTypes", value)}
            />
            <Facet
              label="Access model"
              options={labeledOptions(facets.accessModels, ACCESS_TYPE_LABELS)}
              selected={filters.accessModels}
              onChange={(value) => update("accessModels", value)}
            />
            <SearchableFacet
              label="Publisher"
              options={labeledOptions(facets.publishers, PUBLISHER_LABELS)}
              selected={filters.publishers}
              onChange={(value) => update("publishers", value)}
            />
            <Facet
              label="Latest quartile"
              options={facets.quartiles.map((value) => ({
                value,
                label: value,
              }))}
              selected={filters.quartiles}
              onChange={(value) => update("quartiles", value)}
            />
          </>
        )}
      </CatalogFacetLoader>
      {countPublicationFilters(filters) > 0 && (
        <Button
          type="button"
          variant="link"
          intent="accent"
          onClick={() => onChange(EMPTY_FILTERS)}
        >
          Clear all
        </Button>
      )}
    </div>
  );
}
