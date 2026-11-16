import { FC } from "react";
import { ChevronRight } from "lucide-react";
import { CHAIN_FLOW_STEPS, getLayerById } from "./semiconductorChain.data";
import getToneClasses from "./semiconductorChain.style";
import LayerLink from "./LayerLink";

const ChainFlow: FC = () => {
  return (
    <section aria-labelledby="chain-flow-heading" className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 id="chain-flow-heading" className="text-h2-sm font-bold text-neutral-50">
          The order things actually happen
        </h2>
        <p className="text-subtext text-neutral-200 max-w-3xl">
          The pyramid ranks layers by how abstract they are, not by sequence. In production the
          bottom layer works at both ends: raw materials feed the fab before it starts, and
          packaging and assembly only begin once it finishes.
        </p>
      </div>

      {/* One row or one column: two columns fold the order into a Z. role="list"
          restores what Tailwind's `list-style: none` drops in Safari. */}
      <ol role="list" className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {CHAIN_FLOW_STEPS.map((step, index) => (
          <li
            key={step.step}
            /* One tone for all five: per-step colour implied a layer identity
               these cards cannot carry — 3 of 5 share a layer. The pills carry it. */
            className="relative flex flex-col gap-3 rounded-2xl border-t-4 border-accent-300 bg-white/5 p-4.5"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-400 text-sm font-bold text-neutral-900">
                {step.step}
              </span>
              <h3 className="text-h4-sm font-semibold text-neutral-50">{step.title}</h3>
            </div>

            <p className="text-subtext text-neutral-100 flex-1">{step.description}</p>

            <div className="flex flex-wrap gap-1.5">
              {step.layers.map((layerId) => {
                const layer = getLayerById(layerId);
                const layerTone = getToneClasses(layer.tone);

                return (
                  <LayerLink
                    key={layerId}
                    layer={layerId}
                    ariaLabel={`Read layer ${layer.number}: ${layer.name}`}
                    className={`rounded-full ${layerTone.softBg} px-2.5 py-1.5 text-xs font-medium ${layerTone.softText} transition-all duration-300 hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300`}
                  >
                    Layer {layer.number}
                  </LayerLink>
                );
              })}
            </div>

            {/* The section exists to show an order, so draw the direction. */}
            {index < CHAIN_FLOW_STEPS.length - 1 && (
              <ChevronRight
                aria-hidden="true"
                className="absolute -bottom-4 left-1/2 h-4 w-4 -translate-x-1/2 rotate-90 text-neutral-300 lg:-right-4 lg:bottom-auto lg:left-auto lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0 lg:rotate-0"
              />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
};

export default ChainFlow;
