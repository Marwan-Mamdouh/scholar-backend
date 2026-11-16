import Badge from "@/src/components/ui/Badge/Badge";
import ToolLinks from "./ToolLinks";
import getToolsTheme from "./tools.style";
import { CatalogTool, ToolsIntent } from "./tools.type";

interface ToolCardProps {
  tool: CatalogTool;
  label: string;
  intent?: ToolsIntent;
}

const ToolCard = ({ tool, label, intent = "primary" }: ToolCardProps) => {
  const theme = getToolsTheme(intent);

  return (
    <article className="flex flex-col gap-3 rounded-3xl border border-neutral-700 bg-neutral-800/40 px-5 py-5 transition-all duration-500 ease-in-out hover:bg-neutral-800/70">
      <div className="flex flex-col-reverse items-start gap-2 sm:flex-row sm:justify-between sm:gap-3">
        <h3 className="min-w-0 font-main text-h4 break-words text-neutral-50">
          {tool.name}
          {tool.core && (
            <span
              title="Cornerstone tool"
              className={`ml-1.5 align-middle text-sm ${theme.text}`}
            >
              ★
            </span>
          )}
        </h3>

        <Badge
          variant="outlined"
          intent={theme.badge}
          size="sm"
          textTransform="capitalize"
          className="shrink-0 whitespace-nowrap"
        >
          {label}
        </Badge>
      </div>

      <p className="flex-1 font-secondary text-subtext leading-relaxed text-neutral-100">
        {tool.desc}
      </p>

      <ToolLinks
        intent={intent}
        gh={tool.gh}
        web={tool.web}
        docs={tool.docs}
      />
    </article>
  );
};

export default ToolCard;
