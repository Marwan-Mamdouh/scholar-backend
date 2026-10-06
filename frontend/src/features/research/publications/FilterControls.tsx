"use client";

import { useEffect, useState } from "react";
import type { NumericRange, RangeValue } from "./publication.type";

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

  useEffect(() => {
    setDraft(toText(value));
  }, [value]);

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

interface RangeFieldProps {
  label: string;
  bound: NumericRange;
  value: RangeValue;
  onChange: (value: RangeValue) => void;
  step?: number;
  unit?: string;
}

const SLIDER =
  "pointer-events-none absolute inset-x-0 top-0 m-0 h-5 w-full appearance-none bg-transparent focus:outline-none " +
  "[&::-webkit-slider-runnable-track]:h-5 [&::-webkit-slider-runnable-track]:bg-transparent " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 " +
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full " +
  "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accent-200 " +
  "[&::-webkit-slider-thumb]:bg-neutral-800 [&::-webkit-slider-thumb]:cursor-grab " +
  "[&:focus-visible::-webkit-slider-thumb]:ring-2 [&:focus-visible::-webkit-slider-thumb]:ring-accent-300 " +
  "[&::-moz-range-track]:h-5 [&::-moz-range-track]:bg-transparent " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 " +
  "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full " +
  "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-accent-200 " +
  "[&::-moz-range-thumb]:bg-neutral-800 [&::-moz-range-thumb]:cursor-grab " +
  "[&:focus-visible::-moz-range-thumb]:ring-2 [&:focus-visible::-moz-range-thumb]:ring-accent-300";

function decimalsOf(step: number): number {
  return String(step).split(".")[1]?.length ?? 0;
}

function clamp(value: number, low: number, high: number): number {
  return Math.min(Math.max(value, low), high);
}

export function RangeField({
  label,
  bound,
  value,
  onChange,
  step = 0.1,
  unit,
}: RangeFieldProps) {
  const span = bound.max - bound.min;
  const low = clamp(value.min ?? bound.min, bound.min, bound.max);
  const high = clamp(value.max ?? bound.max, bound.min, bound.max);

  const round = (raw: number) => Number(raw.toFixed(decimalsOf(step)));
  const percent = (raw: number) => (span <= 0 ? 0 : ((raw - bound.min) / span) * 100);

  const setLow = (raw: number) =>
    onChange({ min: round(Math.min(raw, high)), max: round(high) });
  const setHigh = (raw: number) =>
    onChange({ min: round(low), max: round(Math.max(raw, low)) });

  const lowOnTop = low > bound.min + span / 2;
  const narrowed = low > bound.min || high < bound.max;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm text-neutral-100">{label}</span>
        <span
          className={`text-xs tabular-nums ${narrowed ? "text-accent-200" : "text-neutral-300"}`}
        >
          {low}–{high}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>

      <div className="relative h-5">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-neutral-500" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent-400"
          style={{
            left: `${percent(low)}%`,
            right: `${100 - percent(high)}%`,
          }}
        />
        <input
          type="range"
          min={bound.min}
          max={bound.max}
          step={step}
          value={low}
          onChange={(event) => setLow(Number(event.target.value))}
          aria-label={`${label} minimum`}
          className={`${SLIDER} ${lowOnTop ? "z-20" : "z-10"}`}
        />
        <input
          type="range"
          min={bound.min}
          max={bound.max}
          step={step}
          value={high}
          onChange={(event) => setHigh(Number(event.target.value))}
          aria-label={`${label} maximum`}
          className={`${SLIDER} ${lowOnTop ? "z-10" : "z-20"}`}
        />
      </div>
    </div>
  );
}
