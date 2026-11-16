import getToolsTheme from "./tools.style";
import { SectionHeadingData, ToolsIntent } from "./tools.type";

interface SectionHeadingProps extends SectionHeadingData {
  intent?: ToolsIntent;
}

const SectionHeading = ({
  label,
  title,
  subtitle,
  intent = "primary",
}: SectionHeadingProps) => {
  const theme = getToolsTheme(intent);

  return (
    <div className="flex flex-col gap-2">
      <p
        className={`flex items-center gap-3 font-secondary text-xs uppercase tracking-eyebrow ${theme.text}`}
      >
        {label}
        <span aria-hidden className="h-px flex-1 bg-neutral-700" />
      </p>

      {title && (
        <h2 className="font-main text-h2-sm tracking-display text-neutral-50">
          {title}
        </h2>
      )}

      {subtitle && (
        <p className="max-w-2xl font-secondary text-subtext text-neutral-100">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
