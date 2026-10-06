import { DomainPage } from "../tools.type";
import analog from "./analog";
import digital from "./digital";
import general from "./general";

export const DOMAINS: Record<string, DomainPage> = {
  [digital.slug]: digital,
  [analog.slug]: analog,
  [general.slug]: general,
};

export const DOMAIN_SLUGS = Object.keys(DOMAINS);

export { default as hub } from "./hub";
export { default as environmentSetup } from "./environmentSetup";
