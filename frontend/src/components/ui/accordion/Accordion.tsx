"use client";
import { useId, useState } from "react";
import { Icon } from "@iconify/react";
import { ChevronDown } from "lucide-react";
import {
  getAccordionClasses,
  getAccordionIcon,
  getAccordionLine,
  getAccordionRightIcon,
  getBodyClasses,
  getHeaderClasses,
} from "./accordion.style";

import { AccordionProps } from "./accordion.type";

const Accordion = ({
  title,
  subtitle,
  icon,
  children,
  defaultOpen = false,
  className = "",
  disabled = false,
  variant = "default",
  badge,
}: AccordionProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const triggerId = useId();
  const IconComponent = icon;

  if (variant === "compact") {
    return (
      <div
        className={`w-full border-b border-neutral-600/60 py-1 ${className}`}
      >
        <h3>
          <button
            id={triggerId}
            type="button"
            disabled={disabled}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
            className={`flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-1 py-2 text-left text-sm font-medium transition-colors hover:text-accent-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-200 disabled:cursor-default disabled:opacity-50 ${open ? "text-accent-200" : "text-neutral-100"}`}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span>{title}</span>
              {badge}
            </span>
            <ChevronDown
              aria-hidden="true"
              className={`size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        </h3>
        <div
          id={panelId}
          aria-labelledby={triggerId}
          hidden={!open}
          className="px-1 pt-2 pb-3"
        >
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className={`${getAccordionClasses(open)} ${className}`}>
      <div className="relative">
        <div className={`${getAccordionLine(open)}`} />
        <div className="ml-5">
          <button
            type="button"
            id={triggerId}
            disabled={disabled}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen(!open)}
            className={getHeaderClasses()}
          >
            <div className="flex items-center gap-2.5 w-full ">
              {IconComponent && (
                <div className={`${getAccordionIcon(open)}`}>
                  <IconComponent className="text-neutral-900 h-8 w-8" />
                </div>
              )}
              <div className="text-left">
                <h3 className="text-2xl text-neutral-50 font-semibold tracking-wider">
                  {title}
                </h3>

                {subtitle && (
                  <p className="text-sm text-neutral-100 tracking-wider">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <Icon
              icon={open ? "mdi:chevron-up" : "mdi:chevron-down"}
              className={`${getAccordionRightIcon(open)}`}
            />
          </button>
          <div
            id={panelId}
            aria-labelledby={triggerId}
            hidden={!open}
            className={getBodyClasses(open)}
          >
            <div className="py-4 ">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
