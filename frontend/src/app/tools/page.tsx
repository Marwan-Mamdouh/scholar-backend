import type { Metadata } from "next";
import Card from "@/src/components/ui/Card/Card";
import {
  SectionHeading,
  ToolsContainer,
  ToolsHero,
  hub,
} from "@/src/features/tools";

export const metadata: Metadata = {
  title: `NEXUS | ${hub.meta.title}`,
  description: hub.meta.description,
};

export default function ToolsHubPage() {
  return (
    <>
      <ToolsHero {...hub.hero} />

      <ToolsContainer>
        <section className="mt-18 flex flex-col gap-8">
          <SectionHeading {...hub.section} />

          <div className="grid gap-5 lg:grid-cols-2">
            {hub.cards.map((card) => (
              <Card
                key={card.href}
                href={card.href}
                intent={card.intent}
                variant="outlined"
                icon={card.icon}
                title={card.title}
                description={card.desc}
                callToAction={card.cta}
                className="h-full border!"
              />
            ))}
          </div>
        </section>
      </ToolsContainer>
    </>
  );
}
