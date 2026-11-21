"use client";

import { useRef, type ReactNode } from "react";
import Accordion from "@/src/components/ui/accordion/Accordion";
import getBadgeStyle from "@/src/components/ui/Badge/badge.style";

interface FilterAccordionProps {
  label: string;
  activeCount?: number;
  onClear?: () => void;
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function FilterAccordion({
  label,
  activeCount = 0,
  onClear,
  defaultOpen = false,
  children,
}: FilterAccordionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef} className="w-full">
      <Accordion
        title={label}
        variant="compact"
        defaultOpen={defaultOpen}
        badge={
          activeCount > 0 ? (
            <span className={getBadgeStyle("accent", "solid", "sm")}>
              {activeCount}
            </span>
          ) : undefined
        }
      >
        <div className="flex flex-col gap-3">
          {children}
          {activeCount > 0 && onClear && (
            <button
              type="button"
              aria-label={`Clear ${label.toLowerCase()} filter`}
              onClick={() => {
                onClear();
                containerRef.current?.querySelector("button")?.focus();
              }}
              className="self-start rounded py-1 text-sm text-accent-300 underline-offset-4 hover:text-accent-200 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-200 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </Accordion>
    </div>
  );
}
