import getToolsTheme from "./tools.style";
import { GuideStep, ToolsIntent } from "./tools.type";

interface GuideStepsProps {
  steps: GuideStep[];
  intent?: ToolsIntent;
}

const GuideSteps = ({ steps, intent = "accent" }: GuideStepsProps) => {
  const theme = getToolsTheme(intent);

  return (
    <ol className="flex flex-col gap-3">
      {steps.map((step) => (
        <li
          key={step.num}
          className="flex gap-4 rounded-2xl border border-neutral-700 bg-neutral-800/40 px-5 py-4.5"
        >
          <span
            className={`shrink-0 font-mono text-sm tracking-eyebrow ${theme.text}`}
          >
            {step.num}
          </span>

          <div className="min-w-0 flex-1">
            <h3 className="font-main text-h4 text-neutral-50">{step.title}</h3>
            <div className="mt-1.5 flex flex-col gap-2 font-secondary text-subtext leading-relaxed text-neutral-100">
              {step.description}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default GuideSteps;
