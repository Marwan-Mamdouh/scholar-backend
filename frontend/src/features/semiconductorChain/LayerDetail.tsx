import { FC } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ChainLayer } from "./semiconductorChain.type";
import getToneClasses from "./semiconductorChain.style";
import CompanyCard from "./CompanyCard";
import LayerLink from "./LayerLink";

/* min-h keeps the buttons from resizing as longer layer names wrap. */
const navLinkClasses =
  "group flex min-h-24 flex-1 items-center gap-3 rounded-2xl border border-neutral-600 px-5 py-3.5 transition-colors duration-300 hover:border-neutral-300 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300";

interface LayerDetailProps {
  layer: ChainLayer;
  previousLayer?: ChainLayer;
  nextLayer?: ChainLayer;
}

const LayerDetail: FC<LayerDetailProps> = ({ layer, previousLayer, nextLayer }) => {
  const tone = getToneClasses(layer.tone);

  const relationshipLabel = previousLayer
    ? `Link to layer ${previousLayer.number}`
    : "Where it sits in the chain";

  return (
    <section
      aria-label={`Layer ${layer.number}: ${layer.name}`}
      className="flex flex-col gap-10"
    >
      {/* Overview, and how this layer connects to the one above it */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2.5 rounded-2xl bg-white/5 p-5.5">
          <h3 className={`text-h4 font-bold ${tone.text}`}>Overview</h3>
          <p className="text-subtext text-neutral-100">{layer.overview}</p>
        </div>

        <div className={`flex flex-col gap-2.5 rounded-2xl ${tone.softBg} p-5.5`}>
          <h3 className={`text-h4 font-bold ${tone.text}`}>
            {previousLayer
              ? `Relationship to layer ${previousLayer.number} — ${previousLayer.shortName}`
              : "No layer above it"}
          </h3>
          <p className="text-subtext text-neutral-100">
            {layer.relationshipToPreviousLayer ??
              "This is the apex of the pyramid, so there is no layer before it. Every layer below exists to turn what happens here into a physical product."}
          </p>
        </div>
      </div>

      {/* Sub-groups and the companies inside them */}
      {layer.subGroups.map((subGroup) => (
        <div key={subGroup.id} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-baseline gap-3">
              <h3 className="text-h3-sm font-bold text-neutral-50">{subGroup.title}</h3>
              <span className="text-caption text-neutral-200">
                {subGroup.companies.length}{" "}
                {subGroup.companies.length === 1 ? "company" : "companies"}
              </span>
            </div>
            <p className="text-subtext text-neutral-200">{subGroup.summary}</p>
            <span className={`h-0.5 w-16 rounded-full ${tone.bg}`} aria-hidden="true" />
          </div>

          {/* A sub-group with a single company (e.g. ASML) reads better full width than
              as one narrow card in an otherwise empty row. */}
          <div
            className={`grid gap-4 ${
              subGroup.companies.length === 1
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            }`}
          >
            {subGroup.companies.map((company) => (
              <CompanyCard
                key={company.name}
                company={company}
                tone={layer.tone}
                relationshipLabel={relationshipLabel}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Key takeaway */}
      <div
        className={`flex flex-col gap-2 rounded-2xl border-l-4 ${tone.border} bg-white/5 px-5.5 py-4.5`}
      >
        <h3 className={`text-caption font-bold uppercase tracking-eyebrow ${tone.text}`}>
          Key takeaway
        </h3>
        <p className="text-lg text-neutral-50">{layer.keyTakeaway}</p>
      </div>

      {/* Walk the chain one layer at a time */}
      <nav
        aria-label="Move between layers"
        className="flex flex-col sm:flex-row gap-3 sm:items-stretch sm:justify-between"
      >
        {previousLayer ? (
          <LayerLink
            layer={previousLayer.id}
            ariaLabel={`Previous layer — layer ${previousLayer.number}: ${previousLayer.name}`}
            className={navLinkClasses}
          >
            <ArrowLeft className="h-5 w-5 shrink-0 text-neutral-200 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="flex flex-col">
              <span className="text-xs uppercase tracking-eyebrow text-neutral-300">
                Layer {previousLayer.number}
              </span>
              <span className="text-neutral-50">{previousLayer.shortName}</span>
            </span>
          </LayerLink>
        ) : (
          <span className="hidden sm:block sm:flex-1" />
        )}

        {nextLayer ? (
          <LayerLink
            layer={nextLayer.id}
            ariaLabel={`Next layer — layer ${nextLayer.number}: ${nextLayer.name}`}
            className={`${navLinkClasses} justify-end text-right`}
          >
            <span className="flex flex-col">
              <span className="text-xs uppercase tracking-eyebrow text-neutral-300">
                Layer {nextLayer.number}
              </span>
              <span className="text-neutral-50">{nextLayer.shortName}</span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-neutral-200 transition-transform duration-300 group-hover:translate-x-1" />
          </LayerLink>
        ) : (
          <span className="hidden sm:block sm:flex-1" />
        )}
      </nav>
    </section>
  );
};

export default LayerDetail;
