import LightingGlow from "@/src/components/ui/LightingGlow/LightingGlow";
import HeroStats from "./HeroStats";
import ToolsContainer from "./ToolsContainer";
import getToolsTheme from "./tools.style";
import { ToolsHeroData, ToolsIntent } from "./tools.type";

interface ToolsHeroProps extends ToolsHeroData {
  intent?: ToolsIntent;
}

const ToolsHero = ({
  eyebrow,
  title,
  body,
  stats,
  intent = "primary",
}: ToolsHeroProps) => {
  const theme = getToolsTheme(intent);
  const counterGlow = theme.glow === "accent" ? "primary" : "accent";

  return (
    <section className="relative overflow-hidden border-b border-neutral-700 bg-brand-gradient">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 right-[10%] h-64 w-96">
          <LightingGlow variant={theme.glow} className="blur-[150px]" />
        </div>
        <div className="absolute bottom-[-10%] left-[6%] hidden h-52 w-80 lg:block">
          <LightingGlow variant={counterGlow} className="blur-[150px]" />
        </div>
      </div>

      <ToolsContainer className="relative z-10 pt-28 pb-14 lg:pt-32">
        <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
          <div>
            <p
              className={`flex items-center gap-2.5 font-secondary text-sm uppercase tracking-eyebrow ${theme.text}`}
            >
              <span aria-hidden className="h-px w-6 bg-current" />
              {eyebrow}
            </p>

            <h1
              className={`mt-5 font-main text-h1-sm tracking-display text-neutral-50 lg:text-h1 ${theme.emphasis}`}
            >
              {title}
            </h1>

            {body && (
              <p className="mt-5 max-w-xl font-secondary text-subtext leading-loose text-neutral-100">
                {body}
              </p>
            )}
          </div>

          {stats && <HeroStats stats={stats} />}
        </div>
      </ToolsContainer>
    </section>
  );
};

export default ToolsHero;
