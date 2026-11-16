import { FC, KeyboardEvent } from "react";
import { ChainLayer, LayerId } from "./semiconductorChain.type";
import getToneClasses from "./semiconductorChain.style";
import { countCompanies } from "./semiconductorChain.data";

interface SemiconductorPyramidProps {
  layers: ChainLayer[];
  activeLayer: LayerId;
  onLayerChange: (layer: LayerId) => void;
}

/*
 * The pyramid is drawn as a cone that is cut off above the first tier, so even
 * the apex row is wide enough to hold a label. APEX_Y is where the full cone
 * would converge; TOP_Y is where we actually start drawing tiers.
 */
const APEX_Y = -60;
const TOP_Y = 20;
const BASE_Y = 440;
const CENTER_X = 400;
const HALF_BASE = 340;
const TIER_GAP = 6;

const halfWidthAt = (y: number) => ((y - APEX_Y) / (BASE_Y - APEX_Y)) * HALF_BASE;

const tierBounds = (index: number, total: number) => {
  const tierHeight = (BASE_Y - TOP_Y) / total;
  const top = TOP_Y + index * tierHeight;
  return { top, bottom: top + tierHeight - TIER_GAP };
};

const tierPolygon = (index: number, total: number) => {
  const { top, bottom } = tierBounds(index, total);
  const halfTop = halfWidthAt(top);
  const halfBottom = halfWidthAt(bottom);

  return [
    `${CENTER_X - halfTop},${top}`,
    `${CENTER_X + halfTop},${top}`,
    `${CENTER_X + halfBottom},${bottom}`,
    `${CENTER_X - halfBottom},${bottom}`,
  ].join(" ");
};

const capPolygon = () =>
  [
    `${CENTER_X},${APEX_Y}`,
    `${CENTER_X + halfWidthAt(TOP_Y - TIER_GAP)},${TOP_Y - TIER_GAP}`,
    `${CENTER_X - halfWidthAt(TOP_Y - TIER_GAP)},${TOP_Y - TIER_GAP}`,
  ].join(" ");

const SemiconductorPyramid: FC<SemiconductorPyramidProps> = ({
  layers,
  activeLayer,
  onLayerChange,
}) => {
  const handleKeyDown = (event: KeyboardEvent<SVGGElement>, layerId: LayerId) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onLayerChange(layerId);
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center gap-3">
      <p className="text-caption text-neutral-200 tracking-eyebrow uppercase text-center">
        Abstract — ideas &amp; blueprints
      </p>

      <svg
        viewBox="0 -70 800 520"
        role="group"
        aria-label="Semiconductor value chain pyramid. Select a layer to read about it."
        className="w-full h-auto max-w-4xl overflow-visible"
      >
        {/* Decorative tip, grouped with layer 1 so clicking it selects the apex. */}
        <polygon
          points={capPolygon()}
          className={`${getToneClasses(layers[0].tone).fill} ${
            getToneClasses(layers[0].tone).stroke
          } ${activeLayer === layers[0].id ? "opacity-100" : "opacity-40"} transition-opacity duration-300`}
          strokeWidth="1.5"
          aria-hidden="true"
        />

        {layers.map((layer, index) => {
          const isActive = activeLayer === layer.id;
          const tone = getToneClasses(layer.tone);
          const { top } = tierBounds(index, layers.length);
          const companyCount = countCompanies(layer);

          return (
            <g
              key={layer.id}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              aria-label={`Layer ${layer.number}: ${layer.name}. ${layer.position}. ${companyCount} companies.`}
              onClick={() => onLayerChange(layer.id)}
              onKeyDown={(event) => handleKeyDown(event, layer.id)}
              className="group cursor-pointer focus:outline-none [&:focus-visible>polygon]:stroke-neutral-50 [&:focus-visible>polygon]:stroke-[3]"
            >
              <polygon
                points={tierPolygon(index, layers.length)}
                className={`${isActive ? tone.activeFill : tone.fill} ${
                  tone.stroke
                } transition-all duration-300 ${
                  isActive ? "opacity-100" : "opacity-55 group-hover:opacity-85"
                }`}
                strokeWidth={isActive ? 2.5 : 1.5}
              />

              <text
                x={CENTER_X}
                y={top + 40}
                textAnchor="middle"
                className={`${
                  isActive ? tone.labelFill : "fill-neutral-200"
                } text-[19px] sm:text-[15px] font-medium tracking-[0.18em] uppercase`}
              >
                Layer {layer.number}
              </text>

              {/* Sizes are in viewBox units, so they shrink with the SVG — bump them
                  up on narrow screens to stay legible. */}
              <text
                x={CENTER_X}
                y={top + 72}
                textAnchor="middle"
                className={`${
                  isActive ? "fill-neutral-50" : "fill-neutral-100"
                } text-[30px] sm:text-[26px] font-bold`}
              >
                {layer.shortName}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="text-caption text-neutral-200 tracking-eyebrow uppercase text-center">
        Physical — silicon &amp; finished products
      </p>
    </div>
  );
};

export default SemiconductorPyramid;
