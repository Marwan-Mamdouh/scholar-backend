import type { Metadata } from "next";
import {
  GuideNotes,
  GuideSteps,
  SectionHeading,
  ToolsContainer,
  ToolsHero,
  environmentSetup,
} from "@/src/features/tools";

const INTENT = "accent";

export const metadata: Metadata = {
  title: `NEXUS | ${environmentSetup.meta.title}`,
  description: environmentSetup.meta.description,
};

export default function EnvironmentSetupPage() {
  const { hero, phases, notes } = environmentSetup;

  return (
    <>
      <ToolsHero {...hero} intent={INTENT} />

      <ToolsContainer>
        {phases.map((phase) => (
          <section key={phase.label} className="mt-18 flex flex-col gap-8">
            <SectionHeading
              label={phase.label}
              title={phase.title}
              intent={INTENT}
            />
            <GuideSteps steps={phase.steps} intent={INTENT} />
          </section>
        ))}

        <section className="mt-18 flex flex-col gap-8">
          <SectionHeading label={notes.label} intent={INTENT} />
          <GuideNotes items={notes.items} intent={INTENT} />
        </section>
      </ToolsContainer>
    </>
  );
}
