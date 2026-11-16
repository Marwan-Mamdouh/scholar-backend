import type { ResearcherStats } from "../researcher.type";
import { formatNumber } from "../researcher.utils";

// Two accents only: H-Index and Papers share primary, Citations uses accent
export const STAT_ITEMS = [
  { key: "hIndex", label: "H-Index", color: "text-primary-300" },
  { key: "publications", label: "Papers", color: "text-primary-300" },
  { key: "citations", label: "Citations", color: "text-accent-300" },
] as const satisfies readonly {
  key: keyof ResearcherStats;
  label: string;
  color: string;
}[];

const PANEL =
  "flex items-center justify-center gap-1 rounded-xl border border-neutral-500/60 bg-neutral-800/60 px-2 py-5";

export const ProfileStats = ({ stats }: { stats: ResearcherStats }) => (
  <dl className="grid grid-cols-3 gap-3 md:gap-6">
    {STAT_ITEMS.map((item) => (
      <div key={item.key} className={`${PANEL} flex-col-reverse`}>
        <dt className="text-[11px] md:text-xs uppercase tracking-widest text-neutral-200">
          {item.label}
        </dt>
        <dd className={`text-3xl md:text-4xl font-bold ${item.color}`}>
          {formatNumber(stats[item.key])}
        </dd>
      </div>
    ))}
  </dl>
);

export const ProfileStatsSkeleton = () => (
  <div className="grid grid-cols-3 gap-3 md:gap-6" aria-hidden="true">
    {STAT_ITEMS.map((item) => (
      <div key={item.key} className={`${PANEL} h-24.5 animate-pulse`} />
    ))}
  </div>
);
