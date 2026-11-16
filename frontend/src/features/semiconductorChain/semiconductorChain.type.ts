export type LayerId =
  | "chip-design"
  | "wafer-fab-equipment"
  | "fab-foundries"
  | "materials-osat-oem";

/** Drives the alternating colour identity of each layer across the pyramid and detail panels. */
export type LayerTone = "accent" | "primary";

export interface ChainCompany {
  name: string;
  /** Optional grouping note for entries that cover several companies at once. */
  note?: string;
  whatTheyDo: string;
  whoTheyTarget: string;
  linkToPreviousLayer: string;
}

export interface ChainSubGroup {
  id: string;
  title: string;
  summary: string;
  companies: ChainCompany[];
}

export interface ChainLayer {
  id: LayerId;
  number: number;
  /** Full name used in headings. */
  name: string;
  /** Two or three words, sized to fit inside a pyramid tier. */
  shortName: string;
  /** Where the layer sits in the pyramid, e.g. "The apex". */
  position: string;
  tagline: string;
  overview: string;
  /** Null for the apex, which has no layer above it. */
  relationshipToPreviousLayer: string | null;
  keyTakeaway: string;
  tone: LayerTone;
  subGroups: ChainSubGroup[];
}

export interface FlowStep {
  step: number;
  title: string;
  description: string;
  /** Layers involved in this step — one step can span more than one. */
  layers: LayerId[];
}
