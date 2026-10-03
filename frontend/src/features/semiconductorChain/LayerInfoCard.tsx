import { FC } from "react";
import LightingGlow from "@/src/components/ui/LightingGlow/LightingGlow";
import { ChainLayer } from "./semiconductorChain.type";
import getToneClasses from "./semiconductorChain.style";
import { LAYER_DETAIL_ID, LAYER_HEADING_ID, countCompanies } from "./semiconductorChain.data";

const LayerInfoCard: FC<{ layer: ChainLayer }> = ({ layer }) => {
  const tone = getToneClasses(layer.tone);

  const stats = [
    { label: "Sub-groups", value: layer.subGroups.length },
    { label: "Companies profiled", value: countCompanies(layer) },
  ];

  return (
    <div
      id={LAYER_DETAIL_ID}
      className="relative z-0 w-full rounded-3xl bg-white/10 px-4.5 py-3.5 flex flex-col md:flex-row gap-5"
    >
      <div className={`w-2 rounded-full ${tone.bg} shrink-0`} />

      <div className="hidden lg:block absolute top-[-74%] left-[82%] w-73.5 h-54">
        <LightingGlow variant={layer.tone} className="blur-[150px]" />
      </div>

      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={`text-caption font-bold uppercase tracking-eyebrow ${tone.text}`}>
              Layer {layer.number}
            </span>
            <span
              className={`rounded-full ${tone.softBg} px-2.5 py-0.5 text-xs font-medium ${tone.softText}`}
            >
              {layer.position}
            </span>
          </div>
          {/* Focus lands here on a layer change, which announces it. No ring:
              it is out of the tab order. */}
          <h2
            id={LAYER_HEADING_ID}
            tabIndex={-1}
            className={`text-3xl md:text-2xl font-bold ${tone.softText} focus:outline-none`}
          >
            {layer.name}
          </h2>
          <p className="text-neutral-50 text-lg font-normal">{layer.tagline}</p>
        </div>

        <div className="flex items-start md:items-center flex-col md:flex-row gap-6 rounded-xl bg-white/10 px-2.5">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-1.5 p-1.5">
              <span className={`text-2xl font-bold ${tone.text}`}>{stat.value}</span>
              <span className="text-white font-medium text-subtext">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LayerInfoCard;
