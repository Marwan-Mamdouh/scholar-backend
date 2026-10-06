import { ReactNode } from "react";

export type ToolsIntent = "primary" | "accent";

export interface SectionHeadingData {
  label: string;
  title?: string;
  subtitle?: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface ToolsHeroData {
  eyebrow: string;
  title: ReactNode;
  body?: string;
  stats?: HeroStat[];
}

export interface PageMeta {
  title: string;
  description: string;
}

export interface ToolLinksData {
  gh?: string;
  web?: string;
  docs?: string;
}

export interface ReferenceLink {
  name: string;
  desc: string;
  href: string;
}

export interface CatalogTool extends ToolLinksData {
  cat: string;
  name: string;
  desc: string;
  core?: boolean;
  use?: string;
}

export interface CatalogFilter {
  id: string;
  label: string;
}

export interface PanelTool extends ToolLinksData {
  name: string;
  desc: string;
  use?: string;
  tags?: string[];
}

export interface PanelGroup {
  title: string;
  tools: PanelTool[];
}

export interface StagePanelData {
  eye: string;
  title: string;
  desc: string;
  cats: PanelGroup[];
}

export interface FlowStage {
  num: string;
  name: string;
  desc: string;
  count: string;
  panel: string;
}

export type FlowRow =
  | { kind: "single"; stage: FlowStage }
  | { kind: "parallel"; stages: [FlowStage, FlowStage] };

export interface DomainPage {
  slug: string;
  intent: ToolsIntent;
  meta: PageMeta;
  hero: ToolsHeroData;
  references: SectionHeadingData & { links: ReferenceLink[] };
  flow: SectionHeadingData & { rows: FlowRow[] };
  catalog: SectionHeadingData & {
    filters: CatalogFilter[];
    labels: Record<string, string>;
    tools: CatalogTool[];
  };
  panels: Record<string, StagePanelData>;
}

export interface HubCard {
  href: string;
  icon: ReactNode;
  title: string;
  desc: string;
  cta: string;
  intent: ToolsIntent;
}

export interface HubPage {
  meta: PageMeta;
  hero: ToolsHeroData;
  section: SectionHeadingData;
  cards: HubCard[];
}

export interface GuideStep {
  num: string;
  title: string;
  description: ReactNode;
}

export interface GuidePhase {
  label: string;
  title: string;
  steps: GuideStep[];
}

export interface GuideNote {
  icon: ReactNode;
  title: string;
  desc: ReactNode;
}

export interface GuidePage {
  meta: PageMeta;
  hero: ToolsHeroData;
  phases: GuidePhase[];
  notes: SectionHeadingData & { items: GuideNote[] };
}
