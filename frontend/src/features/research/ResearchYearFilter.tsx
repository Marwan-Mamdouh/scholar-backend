"use client";

import { useEffect, useState } from "react";
import FilterAccordion from "@/src/components/ui/FilterAccordion/FilterAccordion";
import RangeField from "@/src/components/ui/RangeField/RangeField";
import ResearchYearHistogram from "./ResearchYearHistogram";
import {
  fetchResearchYears,
  type ResearchYears,
  type YearCatalog,
  type YearRange,
} from "./researchYears.api";

interface ResearchYearFilterProps {
  catalog: YearCatalog;
  value: YearRange;
  onChange: (range: YearRange) => void;
}

export default function ResearchYearFilter({
  catalog,
  value,
  onChange,
}: ResearchYearFilterProps) {
  const [result, setResult] = useState<ResearchYears>();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchResearchYears(catalog, controller.signal)
      .then((options) => {
        if (!controller.signal.aborted) setResult(options);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, [catalog, attempt]);

  const { years, counts = [] } = result ?? {};
  const last = (years?.length ?? 0) - 1;
  const min = value ? (years?.indexOf(value.fromYear) ?? -1) : 0;
  const max = value ? (years?.indexOf(value.toYear) ?? -1) : last;

  return (
    <FilterAccordion
      label="Year"
      activeCount={value ? 1 : 0}
      onClear={() => onChange(null)}
    >
      {failed ? (
        <div className="text-sm text-neutral-200">
          <p>Couldn’t load years.</p>
          <button
            type="button"
            className="text-accent-300 underline"
            onClick={() => {
              setFailed(false);
              setAttempt((count) => count + 1);
            }}
          >
            Try again
          </button>
        </div>
      ) : !years ? (
        <p role="status" className="text-sm text-neutral-200">
          Loading years…
        </p>
      ) : years.length === 0 ? (
        <p className="text-sm text-neutral-200">No years available.</p>
      ) : (
        <>
          <ResearchYearHistogram
            counts={counts}
            range={value}
            catalog={catalog}
          />
          {years.length === 1 ? (
            <p className="text-sm text-neutral-200">
              Only {years[0]} is available.
            </p>
          ) : (
            <RangeField
              label={catalog === "papers" ? "Publication year" : "Project year"}
              showLabel={false}
              bound={{ min: 0, max: last }}
              value={{ min: Math.max(0, min), max: max === -1 ? last : max }}
              step={1}
              formatValue={(index) => String(years[index])}
              onChange={({ min = 0, max = last }) => {
                const range =
                  min === 0 && max === last
                    ? null
                    : { fromYear: years[min], toYear: years[max] };
                if (
                  range?.fromYear !== value?.fromYear ||
                  range?.toYear !== value?.toYear
                ) {
                  onChange(range);
                }
              }}
            />
          )}
        </>
      )}
    </FilterAccordion>
  );
}
