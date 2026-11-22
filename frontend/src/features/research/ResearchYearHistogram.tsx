import type { YearCatalog, YearCount, YearRange } from "./researchYears.api";

export default function ResearchYearHistogram({
  counts,
  range,
  catalog,
}: {
  counts: YearCount[];
  range: YearRange;
  catalog: YearCatalog;
}) {
  if (!counts.length) return null;
  const peak = counts.reduce((max, { count }) => Math.max(max, count), 1);
  const record = catalog === "papers" ? "paper" : "project";

  return (
    <ul
      aria-label={catalog === "papers" ? "Papers by year" : "Projects by year"}
      className="box-content flex h-13 items-end border-b border-gray-400/70 px-1"
      style={{ columnGap: `min(2px, ${40 / counts.length}%)` }}
    >
      {counts.map(({ year, count }) => {
        const selected =
          !range || (year >= range.fromYear && year <= range.toYear);
        const label = `${year}: ${count.toLocaleString("en")} ${record}${count === 1 ? "" : "s"}`;

        return (
          <li
            key={year}
            title={label}
            aria-label={
              range
                ? `${label}, ${selected ? "in range" : "outside range"}`
                : label
            }
            className={`min-w-0 flex-1 rounded-t-sm ${selected ? "bg-emerald-400" : "bg-emerald-700"}`}
            style={{ height: `max(1px, ${(count / peak) * 100}%)` }}
          />
        );
      })}
    </ul>
  );
}
