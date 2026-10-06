"use client";

import { useState } from "react";
import type { FieldShare } from "../researcher.type";

// Categorical slots validated (CVD + normal-vision, incl. ring wrap-around) against the
// dark panel surface. Fixed order, never cycled; "Other" is always neutral.
export const FIELD_COLORS = ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181"];
export const OTHER_COLOR = "#6b8d9c";

const SIZE = 120;
const RADIUS = 46;
const STROKE = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 1.5;

export function fieldColor(field: FieldShare, index: number): string {
  return field.name === "Other" ? OTHER_COLOR : FIELD_COLORS[index % FIELD_COLORS.length];
}

export function formatShare(share: number): string {
  return `${Math.round(share * 100)}%`;
}

/** Arc length and start offset (along the ring) for each field, in order. */
export function toSegments(fields: FieldShare[]) {
  const segments: { field: FieldShare; index: number; length: number; offset: number }[] = [];
  let offset = 0;
  fields.forEach((field, index) => {
    const length = field.share * CIRCUMFERENCE;
    segments.push({ field, index, length, offset });
    offset += length;
  });
  return segments;
}

const FieldsDonut = ({ fields }: { fields: FieldShare[] }) => {
  const [active, setActive] = useState<number | null>(null);
  const gap = fields.length > 1 ? GAP : 0;
  const total = fields.reduce((sum, field) => sum + field.count, 0);
  const focused = active === null ? null : fields[active];

  const segments = toSegments(fields);

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
      <div className="relative size-44 md:size-52 shrink-0">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="size-full -rotate-90"
          role="img"
          aria-label={`Fields of study: ${fields
            .map((field) => `${field.name} ${formatShare(field.share)}`)
            .join(", ")}`}
        >
          {segments.map(({ field, index, length, offset: start }) => (
            <circle
              key={field.name}
              data-testid="donut-segment"
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={fieldColor(field, index)}
              strokeWidth={active === index ? STROKE + 3 : STROKE}
              strokeDasharray={`${Math.max(length - gap, 0.01)} ${CIRCUMFERENCE}`}
              strokeDashoffset={-start}
              opacity={active === null || active === index ? 1 : 0.35}
              className="cursor-pointer transition-[opacity,stroke-width] duration-200"
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
            >
              <title>{`${field.name}: ${field.count} papers (${formatShare(field.share)})`}</title>
            </circle>
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          {focused ? (
            <>
              <span className="text-2xl font-bold text-neutral-50">
                {formatShare(focused.share)}
              </span>
              <span className="text-xs text-neutral-200 line-clamp-2">{focused.name}</span>
            </>
          ) : (
            <>
              <span className="text-2xl font-bold text-neutral-50">{total}</span>
              <span className="text-xs text-neutral-200">tagged papers</span>
            </>
          )}
        </div>
      </div>

      <ul aria-label="Fields of study legend" className="flex flex-col gap-2 text-sm">
        {fields.map((field, index) => (
          <li
            key={field.name}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
            className={`flex items-center gap-2.5 rounded-md px-1.5 py-0.5 transition-colors duration-200 ${active === index ? "bg-white/10" : ""}`}
          >
            <span
              aria-hidden="true"
              className="size-3 shrink-0 rounded-sm"
              style={{ backgroundColor: fieldColor(field, index) }}
            />
            <span className="text-neutral-50">{field.name}</span>
            <span className="ml-auto pl-4 tabular-nums text-neutral-200">
              {formatShare(field.share)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FieldsDonut;
