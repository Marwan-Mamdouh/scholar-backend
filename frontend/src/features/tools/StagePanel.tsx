"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Badge from "@/src/components/ui/Badge/Badge";
import Button from "@/src/components/ui/Button/Button";
import ToolLinks from "./ToolLinks";
import getToolsTheme from "./tools.style";
import { StagePanelData, ToolsIntent } from "./tools.type";

interface StagePanelProps {
  panel: StagePanelData;
  intent: ToolsIntent;
  onClose: () => void;
}

const StagePanel = ({ panel, intent, onClose }: StagePanelProps) => {
  const theme = getToolsTheme(intent);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <>
      <button
        aria-label="Close stage details"
        tabIndex={-1}
        onClick={onClose}
        className="fixed inset-0 z-[60] cursor-default bg-neutral-900/70 backdrop-blur-[2px]"
      />

      <aside
        aria-label={panel.title}
        className="fixed inset-y-0 right-0 z-[70] flex w-[85%] max-w-2xl flex-col overflow-y-auto border-l border-neutral-700 bg-neutral-900 shadow-[0px_0px_40px_10px_rgba(0,0,0,0.45)]"
      >
        <div className="sticky top-0 z-10 flex items-start gap-4 border-b border-neutral-700 bg-neutral-900/95 px-6 py-6 backdrop-blur-[7.5px] sm:px-8">
          <div className="min-w-0 flex-1">
            <p
              className={`font-secondary text-xs uppercase tracking-eyebrow ${theme.text}`}
            >
              {panel.eye}
            </p>
            <h2 className="mt-2 font-main text-h3 tracking-display text-neutral-50">
              {panel.title}
            </h2>
            <p className="mt-2.5 font-secondary text-subtext leading-relaxed text-neutral-100">
              {panel.desc}
            </p>
          </div>

          <Button
            aria-label="Close"
            variant="icon"
            intent="secondary"
            size="lg"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col gap-9 px-6 py-7 sm:px-8">
          {panel.cats.map((group) => (
            <section key={group.title} className="flex flex-col gap-4">
              <h3 className="font-secondary text-xs uppercase tracking-eyebrow text-neutral-200">
                {group.title}
              </h3>

              <ul className="flex flex-col gap-3">
                {group.tools.map((tool) => (
                  <li
                    key={tool.name}
                    className="flex flex-col gap-2.5 rounded-2xl border border-neutral-700 bg-neutral-800/40 px-5 py-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-main text-h4-sm text-neutral-50">
                        {tool.name}
                      </h4>
                      {tool.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant={tag === "core" ? "solid" : "outlined"}
                          intent={tag === "core" ? theme.badge : "secondary"}
                          size="sm"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <p className="font-secondary text-subtext leading-relaxed text-neutral-100">
                      {tool.desc}
                    </p>

                    {tool.use && (
                      <p className="font-secondary text-subtext text-neutral-200">
                        <span className={theme.text}>When to use:</span>{" "}
                        {tool.use}
                      </p>
                    )}

                    <ToolLinks
                      intent={intent}
                      gh={tool.gh}
                      web={tool.web}
                      docs={tool.docs}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </aside>
    </>
  );
};

export default StagePanel;
