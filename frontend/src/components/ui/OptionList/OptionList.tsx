"use client";

import { useId } from "react";

interface OptionListProps<T extends string | number> {
  options: { value: T; label: string; hint?: string }[];
  selected: T[];
  onToggle: (value: T) => void;
  inputType?: "checkbox" | "radio";
}

export function OptionList<T extends string | number>({
  options,
  selected,
  onToggle,
  inputType = "checkbox",
}: OptionListProps<T>) {
  const groupName = useId();

  return (
    <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
      {options.map((option) => {
        const checked = selected.includes(option.value);
        return (
          <label
            key={option.value}
            className="flex items-start gap-2.5 rounded-lg px-2 py-1.5 cursor-pointer hover:bg-overlay/5"
          >
            <input
              type={inputType}
              name={inputType === "radio" ? groupName : undefined}
              value={option.value}
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
