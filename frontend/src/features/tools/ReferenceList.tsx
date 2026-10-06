import { ArrowUpRight } from "lucide-react";
import { Github } from "@/src/components/Icons/Github";
import getToolsTheme from "./tools.style";
import { ReferenceLink, ToolsIntent } from "./tools.type";

interface ReferenceListProps {
  links: ReferenceLink[];
  intent?: ToolsIntent;
}

const ReferenceList = ({ links, intent = "primary" }: ReferenceListProps) => {
  const theme = getToolsTheme(intent);

  return (
    <ul className="flex flex-col gap-2.5">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className={`group flex items-center gap-4 rounded-2xl border border-neutral-700 bg-neutral-800/40 px-5 py-4 transition-all duration-500 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100 ${theme.hover}`}
          >
            <Github className={`h-6 w-6 shrink-0 ${theme.text}`} />

            <span className="min-w-0 flex-1">
              <span className="block font-main break-words text-h4 text-neutral-50">
                {link.name}
              </span>
              <span className="mt-0.5 block font-secondary text-subtext text-neutral-200">
                {link.desc}
              </span>
            </span>

            <ArrowUpRight
              className={`h-4.5 w-4.5 shrink-0 transition-transform duration-500 ease-in-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${theme.text}`}
            />
          </a>
        </li>
      ))}
    </ul>
  );
};

export default ReferenceList;
