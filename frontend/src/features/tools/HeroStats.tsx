"use client";

import useCountUp from "@/src/hooks/useCountUp";
import { HeroStat } from "./tools.type";

const HeroStatItem = ({ stat }: { stat: HeroStat }) => {
  const display = useCountUp(stat.value);

  return (
    <div className="bg-neutral-800/90 px-5 py-5.5">
      <dt className="sr-only">{stat.label}</dt>
      <dd>
        <span className="block font-main text-stat text-neutral-50">
          {display}
        </span>
        <span className="mt-1.5 block font-secondary text-xs uppercase tracking-eyebrow text-neutral-200">
          {stat.label}
        </span>
      </dd>
    </div>
  );
};

const HeroStats = ({ stats }: { stats: HeroStat[] }) => (
  <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-700">
    {stats.map((stat) => (
      <HeroStatItem key={stat.label} stat={stat} />
    ))}
  </dl>
);

export default HeroStats;
