"use client";

import { useState } from "react";
export { default as RangeField } from "@/src/components/ui/RangeField/RangeField";

interface OptionListProps<T extends string | number> {
  options: { value: T; label: string; hint?: string }[];
  selected: T[];
  onToggle: (value: T) => void;
}

export function OptionList<T extends string | number>({
  options,
  selected,
  onToggle,
}: OptionListProps<T>) {
  return (
    <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
      {options.map((option) => {
        const checked = selected.includes(option.value);
        return (
          <label
            key={option.value}
            className="flex items-start gap-2.5 rounded-lg px-2 py-1.5 cursor-pointer hover:bg-white/5"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(option.value)}
              aria-label={
                option.hint ? `${option.label} — ${option.hint}` : option.label
              }
              className="mt-0.5 size-4 shrink-0 accent-accent-400 cursor-pointer"
            />
            <span className="flex flex-col">
              <span
                className={`text-sm ${checked ? "text-accent-200" : "text-neutral-100"}`}
              >
                {option.label}
              </span>
              {option.hint && (
                <span className="text-xs text-neutral-300">{option.hint}</span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
}

const NUMERIC_DRAFT = /^[-+]?\d*(?:\.\d*)?(?:[eE][-+]?\d*)?$/;

function toText(value: number | undefined): string {
  return value === undefined ? "" : String(value);
}

function parseDraft(raw: string): number | undefined | null {
  if (raw === "") return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

const FIELD_CLASS =
  "w-full rounded-lg border border-neutral-400 bg-transparent px-2.5 py-1.5 text-sm text-neutral-50 outline-none focus:border-accent-400";

interface NumericFieldProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  ariaLabel: string;
}

export function NumericField({
  value,
  onChange,
  placeholder,
  ariaLabel,
}: NumericFieldProps) {
  const [draft, setDraft] = useState(() => toText(value));
  const [syncedValue, setSyncedValue] = useState(value);

  // Reset the draft when the value changes from outside (e.g. "clear filters")
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(toText(value));
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={draft}
      onChange={(event) => {
        const raw = event.target.value;
        if (!NUMERIC_DRAFT.test(raw)) return;

        setDraft(raw);

        const parsed = parseDraft(raw);

        if (parsed === null || parsed === value) return;
        onChange(parsed);
      }}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className={FIELD_CLASS}
    />
  );
}
