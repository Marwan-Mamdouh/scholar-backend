import { ReactNode } from "react";
import { BookOpen, Globe } from "lucide-react";
import { Github } from "@/src/components/Icons/Github";
import getButtonClasses from "@/src/components/ui/Button/button.style";
import getToolsTheme from "./tools.style";
import { ToolLinksData, ToolsIntent } from "./tools.type";

interface ToolLinksProps extends ToolLinksData {
  intent?: ToolsIntent;
}

const linkOrder: {
  key: keyof ToolLinksData;
  label: string;
  icon: ReactNode;
}[] = [
  { key: "gh", label: "GitHub", icon: <Github className="h-4 w-4" /> },
  { key: "web", label: "Website", icon: <Globe className="h-4 w-4" /> },
  { key: "docs", label: "Docs", icon: <BookOpen className="h-4 w-4" /> },
];

const ToolLinks = ({ intent = "primary", ...links }: ToolLinksProps) => {
  const available = linkOrder.filter((link) => links[link.key]);
  if (available.length === 0) return null;

  const className = getButtonClasses({
    variant: "link",
    intent: getToolsTheme(intent).button,
    size: "lg",
  });

  return (
    <div className="flex flex-wrap items-center gap-4">
      {available.map((link) => (
        <a
          key={link.key}
          href={links[link.key]}
          target="_blank"
          rel="noreferrer"
          className={className}
        >
          {link.icon}
          {link.label}
        </a>
      ))}
    </div>
  );
};

export default ToolLinks;
