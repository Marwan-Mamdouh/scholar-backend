"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

interface FilterPillProps {
  label: string;

  activeCount?: number;
  onClear?: () => void;
  children: ReactNode;
}

const FilterPill = ({
  label,
  activeCount = 0,
  onClear,
  children,
}: FilterPillProps) => {
  const [open, setOpen] = useState(false);
  const [panelOffset, setPanelOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const isActive = activeCount > 0;

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        containerRef.current?.querySelector("button")?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          const bounds = containerRef.current?.getBoundingClientRect();
          if (bounds) {
            const panelWidth = Math.min(280, window.innerWidth - 64);
            setPanelOffset(
              Math.min(0, window.innerWidth - 16 - bounds.left - panelWidth),
            );
          }
          setOpen((value) => !value);
        }}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className={`px-4 py-2 rounded-full border text-sm flex items-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-200 ${
          isActive
            ? "border-accent-400 text-accent-200 bg-accent-400/10"
            : "border-neutral-400 text-neutral-100 hover:border-accent-400"
        }`}
      >
        {label}
        {isActive && (
          <span className="rounded-full bg-accent-400 text-neutral-900 text-[10px] font-semibold min-w-4.5 h-4.5 px-1 flex items-center justify-center">
            {activeCount}
          </span>
        )}
        <span className="text-[10px]">▼</span>
      </button>

      {open && (
        <div
          id={panelId}
          style={{ left: panelOffset }}
          className="absolute top-full mt-2 z-30 w-70 max-w-[calc(100vw-4rem)] rounded-2xl border border-neutral-400 bg-neutral-800 p-4"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-sm font-semibold text-neutral-50">
              {label}
            </span>
            {isActive && onClear && (
              <button
                type="button"
                onClick={onClear}
                className="text-xs text-accent-300 hover:text-accent-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterPill;
