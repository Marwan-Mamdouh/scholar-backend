"use client";

import { useState } from "react";
import StagePanel from "./StagePanel";
import getToolsTheme from "./tools.style";
import { FlowRow, FlowStage, StagePanelData, ToolsIntent } from "./tools.type";

interface ToolFlowProps {
  rows: FlowRow[];
  panels: Record<string, StagePanelData>;
  intent?: ToolsIntent;
}

interface FlowStageButtonProps {
  stage: FlowStage;
  intent: ToolsIntent;
  isActive: boolean;
  onOpen: () => void;
}

const FlowStageButton = ({
  stage,
  intent,
  isActive,
  onOpen,
}: FlowStageButtonProps) => {
  const theme = getToolsTheme(intent);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-expanded={isActive}
      className={`group flex h-full w-full cursor-pointer items-start gap-4 rounded-2xl border bg-neutral-800/40 px-5 py-4.5 text-left transition-all duration-500 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100 sm:items-center ${
        isActive ? theme.border : "border-neutral-700"
      } ${theme.hover}`}
    >
      <span
        className={`shrink-0 font-mono text-sm tracking-eyebrow ${theme.text}`}
      >
        {stage.num}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-main text-h4 text-neutral-50">
          {stage.name}
        </span>
        <span className="mt-1 block font-secondary text-subtext leading-relaxed text-neutral-200">
          {stage.desc}
        </span>
      </span>

      <span className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
        <span className="font-secondary text-xs uppercase tracking-eyebrow text-neutral-300">
          {stage.count}
        </span>
        <span
          className={`font-secondary text-xs uppercase tracking-eyebrow transition-all duration-500 ease-in-out group-hover:translate-x-1 ${theme.text}`}
        >
          Open →
        </span>
      </span>
    </button>
  );
};

const ParallelDivider = () => (
  <div className="flex items-center gap-3">
    <span aria-hidden className="h-px flex-1 bg-neutral-700" />
    <span className="font-secondary text-xs uppercase tracking-eyebrow text-neutral-300">
      Runs in parallel
    </span>
    <span aria-hidden className="h-px flex-1 bg-neutral-700" />
  </div>
);

const ToolFlow = ({ rows, panels, intent = "primary" }: ToolFlowProps) => {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const renderStage = (stage: FlowStage) => (
    <FlowStageButton
      key={stage.panel}
      stage={stage}
      intent={intent}
      isActive={activePanel === stage.panel}
      onOpen={() => setActivePanel(stage.panel)}
    />
  );

  return (
    <>
      <div className="flex flex-col gap-3">
        {rows.map((row) =>
          row.kind === "single" ? (
            renderStage(row.stage)
          ) : (
            <div
              key={row.stages[0].panel}
              className="flex flex-col gap-3 py-1.5"
            >
              <ParallelDivider />
              <div className="grid gap-3 lg:grid-cols-2">
                {row.stages.map(renderStage)}
              </div>
            </div>
          ),
        )}
      </div>

      {activePanel && panels[activePanel] && (
        <StagePanel
          panel={panels[activePanel]}
          intent={intent}
          onClose={() => setActivePanel(null)}
        />
      )}
    </>
  );
};

export default ToolFlow;
