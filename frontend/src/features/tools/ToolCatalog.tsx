"use client";

import { useState } from "react";
import Button from "@/src/components/ui/Button/Button";
import ToolCard from "./ToolCard";
import getToolsTheme from "./tools.style";
import { CatalogFilter, CatalogTool, ToolsIntent } from "./tools.type";

interface ToolCatalogProps {
  filters: CatalogFilter[];
  labels: Record<string, string>;
  tools: CatalogTool[];
  intent?: ToolsIntent;
}

const ALL = "all";

const ToolCatalog = ({
  filters,
  labels,
  tools,
  intent = "primary",
}: ToolCatalogProps) => {
  const [activeFilter, setActiveFilter] = useState(ALL);
  const theme = getToolsTheme(intent);

  const visibleTools =
    activeFilter === ALL
      ? tools
      : tools.filter((tool) => tool.cat === activeFilter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2.5">
        {filters.map((filter) => {
          const isActive = filter.id === activeFilter;
          return (
            <Button
              key={filter.id}
              size="lg"
              variant={isActive ? "solid" : "outlined"}
              intent={isActive ? theme.button : "secondary"}
              aria-pressed={isActive}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </Button>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleTools.map((tool) => (
          <ToolCard
            key={`${tool.cat}-${tool.name}`}
            tool={tool}
            label={labels[tool.cat] ?? tool.cat}
            intent={intent}
          />
        ))}
      </div>
    </div>
  );
};

export default ToolCatalog;
