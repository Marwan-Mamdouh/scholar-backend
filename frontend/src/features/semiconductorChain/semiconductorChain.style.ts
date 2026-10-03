import { LayerTone } from "./semiconductorChain.type";

/**
 * Tailwind class names have to be written out in full to survive the build,
 * so each tone keeps its own literal set rather than being interpolated.
 */
const toneClasses = {
  accent: {
    text: "text-accent-300",
    softText: "text-accent-200",
    border: "border-accent-300",
    softBorder: "border-accent-300/30",
    bg: "bg-accent-400",
    softBg: "bg-accent-400/10",
    fill: "fill-accent-400/25",
    activeFill: "fill-accent-400/45",
    stroke: "stroke-accent-300",
    labelFill: "fill-accent-200",
    ring: "ring-accent-300",
  },
  primary: {
    text: "text-primary-300",
    softText: "text-primary-200",
    border: "border-primary-300",
    softBorder: "border-primary-300/30",
    bg: "bg-primary-400",
    softBg: "bg-primary-400/10",
    fill: "fill-primary-400/25",
    activeFill: "fill-primary-400/45",
    stroke: "stroke-primary-300",
    labelFill: "fill-primary-200",
    ring: "ring-primary-300",
  },
} as const;

export type ToneClasses = (typeof toneClasses)[LayerTone];

const getToneClasses = (tone: LayerTone): ToneClasses => toneClasses[tone];

export default getToneClasses;
