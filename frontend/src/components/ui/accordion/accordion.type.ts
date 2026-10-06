import { ReactNode } from "react";
import { ComponentType } from "react";


export type AccordionIntent = "primary" | "accent";

export interface AccordionProps {
  title: string;
  subtitle?: string;

  icon: ComponentType<{ className?: string }>;

  children?: ReactNode;

  defaultOpen?: boolean;

  intent?: AccordionIntent;

  className?: string;

  disabled?: boolean;
}
