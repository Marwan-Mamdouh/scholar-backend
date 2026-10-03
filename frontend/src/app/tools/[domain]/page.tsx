import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DOMAINS,
  DOMAIN_SLUGS,
  ReferenceList,
  SectionHeading,
  ToolCatalog,
  ToolFlow,
  ToolsContainer,
  ToolsHero,
} from "@/src/features/tools";

type DomainParams = Promise<{ domain: string }>;

export function generateStaticParams() {
  return DOMAIN_SLUGS.map((domain) => ({ domain }));
}

export async function generateMetadata(props: {
  params: DomainParams;
}): Promise<Metadata> {
  const { domain } = await props.params;
  const page = DOMAINS[domain];

  if (!page) return {};

  return {
    title: `NEXUS | ${page.meta.title}`,
    description: page.meta.description,
  };
}

export default async function ToolsDomainPage(props: {
  params: DomainParams;
}) {
  const { domain } = await props.params;
  const page = DOMAINS[domain];

  if (!page) notFound();

  const { intent, hero, references, flow, catalog, panels } = page;

  return (
    <>
      <ToolsHero {...hero} intent={intent} />

      <ToolsContainer>
        <section className="mt-18 flex flex-col gap-8">
          <SectionHeading
            label={references.label}
            title={references.title}
            subtitle={references.subtitle}
            intent={intent}
          />
          <ReferenceList links={references.links} intent={intent} />
        </section>

        <section className="mt-18 flex flex-col gap-8">
          <SectionHeading
            label={flow.label}
            title={flow.title}
            subtitle={flow.subtitle}
            intent={intent}
          />
          <ToolFlow rows={flow.rows} panels={panels} intent={intent} />
        </section>

        <section className="mt-18 flex flex-col gap-8">
          <SectionHeading
            label={catalog.label}
            title={catalog.title}
            subtitle={catalog.subtitle}
            intent={intent}
          />
          <ToolCatalog
            filters={catalog.filters}
            labels={catalog.labels}
            tools={catalog.tools}
            intent={intent}
          />
        </section>
      </ToolsContainer>
    </>
  );
}
