"use client";

import { Input } from "@/src/components/ui/InputField/Input";
import FilterPill from "./FilterPill";
import { NumericField, OptionList, RangeField } from "./FilterControls";
import { isRangeActive } from "./publication.api";
import {
  ACCESS_TYPE_LABELS,
  ACCESS_TYPE_OPTIONS,
  CURRENCY_OPTIONS,
  EMPTY_FILTERS,
  LICENSE_LABELS,
  LICENSE_OPTIONS,
  QUARTILE_OPTIONS,
} from "./publication.constants";
import type {
  LicenseType,
  PublicationAccessType,
  PublicationDomain,
  PublicationFilterRanges,
  PublicationFilterState,
  Quartile,
  RangeValue,
} from "./publication.type";

interface PublicationFilterBarProps {
  filters: PublicationFilterState;
  onChange: (filters: PublicationFilterState) => void;
  domains: PublicationDomain[];
  ranges: PublicationFilterRanges;
}

function toggle<T>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

const PublicationFilterBar = ({
  filters,
  onChange,
  domains,
  ranges,
}: PublicationFilterBarProps) => {
  const update = <K extends keyof PublicationFilterState>(
    key: K,
    value: PublicationFilterState[K],
  ) => onChange({ ...filters, [key]: value });

  const categoryOptions = domains.flatMap((domain) =>
    domain.subCategories.map((subCategory) => ({
      value: subCategory.id,
      label: subCategory.name,
      hint: domain.name,
    })),
  );

  const metricsCount = [
    isRangeActive(filters.impactFactor, ranges.impactFactor),
    isRangeActive(filters.citeScore, ranges.citeScore),
    isRangeActive(filters.sjr, ranges.sjr),
  ].filter(Boolean).length;

  const speedCount = [
    isRangeActive(filters.firstDecisionWeeks, ranges.firstDecisionWeeks),
    isRangeActive(
      filters.submissionToAcceptanceWeeks,
      ranges.submissionToAcceptanceWeeks,
    ),
  ].filter(Boolean).length;

  const activeCount =
    filters.categoryIds.length +
    filters.publishingModel.length +
    filters.licensing.length +
    filters.quartiles.length +
    metricsCount +
    speedCount +
    (filters.maxCost !== undefined ? 1 : 0);

  const clearRanges = (keys: (keyof PublicationFilterState)[]) => {
    const cleared = { ...filters };
    for (const key of keys) {
      (cleared[key] as RangeValue) = {};
    }
    onChange(cleared);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="w-full lg:w-75 shrink-0">
          <Input
            placeholder="Search by title, acronym or publisher"
            value={filters.search}
            onChange={(event) => update("search", event.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterPill
            label="Category"
            activeCount={filters.categoryIds.length}
            onClear={() => update("categoryIds", [])}
          >
            <OptionList
              options={categoryOptions}
              selected={filters.categoryIds}
              onToggle={(value) =>
                update("categoryIds", toggle(filters.categoryIds, value))
              }
            />
          </FilterPill>

          <FilterPill
            label="Access"
            activeCount={filters.publishingModel.length}
            onClear={() => update("publishingModel", [])}
          >
            <OptionList
              options={ACCESS_TYPE_OPTIONS.map((value) => ({
                value,
                label: ACCESS_TYPE_LABELS[value],
              }))}
              selected={filters.publishingModel}
              onToggle={(value) =>
                update(
                  "publishingModel",
                  toggle(filters.publishingModel, value as PublicationAccessType),
                )
              }
            />
          </FilterPill>

          <FilterPill
            label="License"
            activeCount={filters.licensing.length}
            onClear={() => update("licensing", [])}
          >
            <OptionList
              options={LICENSE_OPTIONS.map((value) => ({
                value,
                label: LICENSE_LABELS[value],
              }))}
              selected={filters.licensing}
              onToggle={(value) =>
                update("licensing", toggle(filters.licensing, value as LicenseType))
              }
            />
          </FilterPill>

          <FilterPill
            label="Quartile"
            activeCount={filters.quartiles.length}
            onClear={() => update("quartiles", [])}
          >
            <OptionList
              options={QUARTILE_OPTIONS.map((value) => ({ value, label: value }))}
              selected={filters.quartiles}
              onToggle={(value) =>
                update("quartiles", toggle(filters.quartiles, value as Quartile))
              }
            />
          </FilterPill>

          <FilterPill
            label="Metrics"
            activeCount={metricsCount}
            onClear={() => clearRanges(["impactFactor", "citeScore", "sjr"])}
          >
            <div className="flex flex-col gap-3.5">
              <RangeField
                label="Impact Factor"
                bound={ranges.impactFactor}
                value={filters.impactFactor}
                onChange={(value) => update("impactFactor", value)}
              />
              <RangeField
                label="CiteScore"
                bound={ranges.citeScore}
                value={filters.citeScore}
                onChange={(value) => update("citeScore", value)}
              />
              <RangeField
                label="SJR"
                bound={ranges.sjr}
                value={filters.sjr}
                onChange={(value) => update("sjr", value)}
                step={0.01}
              />
            </div>
          </FilterPill>

          <FilterPill
            label="Speed"
            activeCount={speedCount}
            onClear={() =>
              clearRanges(["firstDecisionWeeks", "submissionToAcceptanceWeeks"])
            }
          >
            <div className="flex flex-col gap-3.5">
              <RangeField
                label="First decision"
                bound={ranges.firstDecisionWeeks}
                value={filters.firstDecisionWeeks}
                onChange={(value) => update("firstDecisionWeeks", value)}
                step={0.5}
                unit="wks"
              />
              <RangeField
                label="To acceptance"
                bound={ranges.submissionToAcceptanceWeeks}
                value={filters.submissionToAcceptanceWeeks}
                onChange={(value) =>
                  update("submissionToAcceptanceWeeks", value)
                }
                step={0.5}
                unit="wks"
              />
            </div>
          </FilterPill>

          <FilterPill
            label="Price"
            activeCount={filters.maxCost !== undefined ? 1 : 0}
            onClear={() => update("maxCost", undefined)}
          >
            <div className="flex flex-col gap-3.5">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm text-neutral-100">Currency</span>
                <select
                  value={filters.currency}
                  onChange={(event) => update("currency", event.target.value)}
                  className="rounded-lg border border-neutral-400 bg-neutral-800 px-2.5 py-1.5 text-sm text-neutral-50 outline-none focus:border-accent-400 cursor-pointer"
                >
                  {CURRENCY_OPTIONS.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-sm text-neutral-100">
                  Max article fee (APC)
                </span>
                <NumericField
                  value={filters.maxCost}
                  onChange={(maxCost) => update("maxCost", maxCost)}
                  placeholder="Any"
                  ariaLabel="Maximum article fee"
                />
              </label>
            </div>
          </FilterPill>
        </div>
      </div>

      {activeCount > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-300">
            {activeCount} filter{activeCount === 1 ? "" : "s"} applied
          </span>
          <button
            type="button"
            onClick={() => onChange({ ...EMPTY_FILTERS, search: filters.search })}
            className="text-sm text-accent-300 hover:text-accent-200 underline underline-offset-4 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default PublicationFilterBar;
