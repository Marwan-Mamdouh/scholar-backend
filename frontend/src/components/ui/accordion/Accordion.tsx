"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
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
}: AccordionProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const IconComponent = icon;
  return (
    <div className={`${getAccordionClasses(open)} ${className}`}>
      <div className="relative">
        <div className={`${getAccordionLine(open)}`} />
        <div className="ml-5">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setOpen(!open)}
            className={getHeaderClasses()}
          >
            <div className="flex items-center gap-2.5 w-full ">
              <div className={`${getAccordionIcon(open)}`}>
                <IconComponent className="text-neutral-900 h-8 w-8" />
              </div>
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
          <div className={getBodyClasses(open)} >
            <div className="py-4 ">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
