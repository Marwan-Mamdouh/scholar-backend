import { FC } from "react";
import { ChainCompany, LayerTone } from "./semiconductorChain.type";
import getToneClasses from "./semiconductorChain.style";

interface CompanyCardProps {
  company: ChainCompany;
  tone: LayerTone;
  /** Changes per layer, because the apex has no layer above it to relate to. */
  relationshipLabel: string;
}

const CompanyCard: FC<CompanyCardProps> = ({ company, tone, relationshipLabel }) => {
  const toneClasses = getToneClasses(tone);

  return (
    <article
      className={`flex h-full flex-col gap-4 rounded-2xl border ${toneClasses.softBorder} bg-white/5 p-5 transition-colors duration-300 hover:bg-white/10`}
    >
      <header className="flex flex-wrap items-center gap-2.5">
        <span className={`h-6 w-1 shrink-0 rounded-full ${toneClasses.bg}`} aria-hidden="true" />
        <h4 className="text-h4 font-bold text-neutral-50">{company.name}</h4>
        {company.note && (
          <span
            className={`rounded-full ${toneClasses.softBg} px-2.5 py-0.5 text-xs font-medium ${toneClasses.softText}`}
          >
            {company.note}
          </span>
        )}
      </header>

      <dl className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1">
          <dt className={`text-xs font-semibold uppercase tracking-eyebrow ${toneClasses.text}`}>
            What they do
          </dt>
          <dd className="text-subtext text-neutral-100">{company.whatTheyDo}</dd>
        </div>

        <div className="flex flex-col gap-1">
          <dt className={`text-xs font-semibold uppercase tracking-eyebrow ${toneClasses.text}`}>
            Who they target
          </dt>
          <dd className="text-subtext text-neutral-100">{company.whoTheyTarget}</dd>
        </div>

        <div className="flex flex-col gap-1">
          <dt className={`text-xs font-semibold uppercase tracking-eyebrow ${toneClasses.text}`}>
            {relationshipLabel}
          </dt>
          <dd className="text-subtext text-neutral-100">{company.linkToPreviousLayer}</dd>
        </div>
      </dl>
    </article>
  );
};

export default CompanyCard;
