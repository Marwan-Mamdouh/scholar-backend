"use client";

interface NumericRange {
  min: number;
  max: number;
}

interface RangeValue {
  min?: number;
  max?: number;
}

interface RangeFieldProps {
  label: string;
  bound: NumericRange;
  value: RangeValue;
  onChange: (value: RangeValue) => void;
  step?: number;
  unit?: string;
  showLabel?: boolean;
  formatValue?: (value: number) => string;
}

const SLIDER =
  "pointer-events-none absolute inset-x-0 top-0 m-0 h-11 w-full appearance-none bg-transparent focus:outline-none focus-visible:z-30 " +
  "[&::-webkit-slider-runnable-track]:h-6 [&::-webkit-slider-runnable-track]:bg-transparent " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-6 " +
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full " +
  "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accent-200 " +
  "[&::-webkit-slider-thumb]:bg-neutral-800 [&::-webkit-slider-thumb]:cursor-grab " +
  "[&:focus-visible::-webkit-slider-thumb]:ring-2 [&:focus-visible::-webkit-slider-thumb]:ring-accent-300 " +
  "[&::-moz-range-track]:h-6 [&::-moz-range-track]:bg-transparent " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-6 " +
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

export default function RangeField({
  label,
  bound,
  value,
  onChange,
  step = 0.1,
  unit,
  showLabel = true,
  formatValue = String,
}: RangeFieldProps) {
  const span = bound.max - bound.min;
  const low = clamp(value.min ?? bound.min, bound.min, bound.max);
  const high = clamp(value.max ?? bound.max, bound.min, bound.max);

  const round = (raw: number) => Number(raw.toFixed(decimalsOf(step)));
  const percent = (raw: number) =>
    span <= 0 ? 0 : ((raw - bound.min) / span) * 100;

  const setLow = (raw: number) =>
    onChange({ min: round(Math.min(raw, high)), max: high });
  const setHigh = (raw: number) =>
    onChange({ min: low, max: round(Math.max(raw, low)) });

  const lowOnTop = low > bound.min + span / 2;
  const narrowed = low > bound.min || high < bound.max;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        {showLabel && <span className="text-sm text-neutral-100">{label}</span>}
        <span
          className={`text-xs tabular-nums ${narrowed ? "text-accent-200" : "text-neutral-300"}`}
        >
          {formatValue(low)}
          {low !== high && `–${formatValue(high)}`}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>

      <div className="relative h-11">
        <div className="absolute inset-x-3 top-1/2 h-1 -translate-y-1/2 rounded-full bg-neutral-500">
          <div
            className="absolute h-full rounded-full bg-accent-400"
            style={{
              left: `${percent(low)}%`,
              right: `${100 - percent(high)}%`,
            }}
          />
        </div>
        <input
          type="range"
          min={bound.min}
          max={bound.max}
          step={step}
          value={low}
          onChange={(event) => setLow(Number(event.target.value))}
          aria-label={`${label} minimum`}
          aria-valuetext={formatValue(low)}
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
          aria-valuetext={formatValue(high)}
          className={`${SLIDER} ${lowOnTop ? "z-10" : "z-20"}`}
        />
      </div>
    </div>
  );
}
