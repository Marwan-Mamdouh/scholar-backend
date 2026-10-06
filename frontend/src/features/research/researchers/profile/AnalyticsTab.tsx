import { ChartPie } from "lucide-react";
import FieldsDonut from "./FieldsDonut";
import ProfileEmptyState from "./ProfileEmptyState";
import { STAT_ITEMS } from "./ProfileStats";
import { formatNumber } from "../researcher.utils";
import type { FieldShare, ResearcherStats } from "../researcher.type";

interface AnalyticsTabProps {
  fields: FieldShare[];
  stats: ResearcherStats;
}

const SUB_PANEL = "rounded-2xl border border-neutral-500 bg-neutral-800/60 p-5 md:p-6";

// Recap order from the design: H-Index, Citations, Papers
const RECAP_ORDER = ["hIndex", "citations", "publications"] as const;

const AnalyticsTab = ({ fields, stats }: AnalyticsTabProps) => (
  <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
    <section aria-labelledby="fields-of-study-title" className={`${SUB_PANEL} flex flex-col gap-6`}>
      <h3
        id="fields-of-study-title"
        className="flex items-center gap-2 text-xl font-semibold text-neutral-50"
      >
        <ChartPie className="size-5 text-accent-300" aria-hidden="true" />
        Fields of Study
      </h3>
      {fields.length === 0 ? (
        <ProfileEmptyState title="No field data">
          None of this researcher&apos;s papers are tagged with a field of study yet.
        </ProfileEmptyState>
      ) : (
        <FieldsDonut fields={fields} />
      )}
    </section>

    <section aria-label="Metrics summary" className={`${SUB_PANEL} flex items-center`}>
      <dl className="flex w-full flex-col divide-y divide-neutral-500/60">
        {RECAP_ORDER.map((key) => {
          const item = STAT_ITEMS.find((stat) => stat.key === key)!;
          return (
            <div key={key} className="flex flex-col-reverse items-center gap-1 py-5">
              <dt className="text-xs uppercase tracking-widest text-neutral-200">{item.label}</dt>
              <dd className={`text-3xl font-bold ${item.color}`}>{formatNumber(stats[key])}</dd>
            </div>
          );
        })}
      </dl>
    </section>
  </div>
);

export default AnalyticsTab;
