"use client";

import { useRef, useState } from "react";
import { Search, X } from "lucide-react";
import FilterAccordion from "../FilterAccordion/FilterAccordion";
import { Input } from "../InputField/Input";
import { OptionList } from "../OptionList/OptionList";

export function textFacetOptions(values: string[]) {
  return values.map((value) => ({ value, label: value.trim() }));
}

export default function SearchableFacet<T extends string | number>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { value: T; label: string; hint?: string }[];
  selected: T[];
  onChange: (values: T[]) => void;
}) {
  const [search, setSearch] = useState("");
  const container = useRef<HTMLDivElement>(null);
  const term = search.trim().toLocaleLowerCase();
  const visibleOptions = options.filter((option) =>
    `${option.label} ${option.hint ?? ""}`.toLocaleLowerCase().includes(term),
  );
  const choices = new Map(options.map((option) => [option.value, option]));

  function toggle(value: T) {
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  }

  return (
    <div ref={container}>
      <FilterAccordion
        label={label}
        activeCount={selected.length}
        onClear={() => onChange([])}
        summary={
          selected.length > 0 && (
            <ul
              aria-label={`Selected ${label.toLowerCase()}`}
              className="flex flex-wrap gap-1.5 px-1 pb-2"
            >
              {selected.map((value) => {
                const choice = choices.get(value);
                const text = choice?.label ?? String(value).trim();
                const name = choice?.hint ? `${text} — ${choice.hint}` : text;
                return (
                  <li key={value} className="min-w-0 max-w-full">
                    <button
                      type="button"
                      className="inline-flex min-h-7 max-w-full cursor-pointer items-center gap-1 rounded-full border border-accent-400/60 px-2 text-left text-xs text-accent-200 hover:bg-overlay/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-200"
                      aria-label={`Remove ${name}`}
                      onClick={(event) => {
                        const chip = event.currentTarget.closest("li");
                        const neighbor =
                          chip?.nextElementSibling ??
                          chip?.previousElementSibling;
                        (
                          neighbor?.querySelector("button") ??
                          container.current?.querySelector("button")
                        )?.focus();
                        toggle(value);
                      }}
                    >
                      <span className="min-w-0 break-words py-0.5">{text}</span>
                      <X aria-hidden="true" className="size-3 shrink-0" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )
        }
      >
        {options.length > 0 && (
          <Input
            type="search"
            size="sm"
            aria-label={`Search ${label.toLowerCase()}`}
            placeholder="Search options"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            endAdornment={<Search aria-hidden="true" className="size-4" />}
          />
        )}
        {visibleOptions.length > 0 ? (
          <OptionList
            options={visibleOptions}
            selected={selected}
            onToggle={toggle}
          />
        ) : (
          <p role="status" className="text-sm text-neutral-300">
            {options.length ? "No matching options." : "No options available."}
          </p>
        )}
      </FilterAccordion>
    </div>
  );
}
