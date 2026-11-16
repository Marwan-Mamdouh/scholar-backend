import { BadgeIntent } from "@/src/components/ui/Badge/badge.type";
import { ButtonIntent } from "@/src/components/ui/Button/button.type";
import { LightingGlowVariant } from "@/src/components/ui/LightingGlow/lightingGlow.type";
import { ToolsIntent } from "./tools.type";

interface ToolsTheme {
  text: string;
  emphasis: string;
  border: string;
  bar: string;
  hover: string;
  glow: LightingGlowVariant;
  badge: BadgeIntent;
  button: ButtonIntent;
}

const themes: Record<ToolsIntent, ToolsTheme> = {
  primary: {
    text: "text-primary-300",
    emphasis: "[&_em]:not-italic [&_em]:text-primary-300",
    border: "border-primary-400",
    bar: "bg-primary-400",
    hover: "hover:border-primary-400 hover:shadow-[0px_0px_15px_2px_#3A90C9]",
    glow: "primary",
    badge: "primary",
    button: "primary",
  },
  accent: {
    text: "text-accent-400",
    emphasis: "[&_em]:not-italic [&_em]:text-accent-400",
    border: "border-accent-400",
    bar: "bg-accent-400",
    hover: "hover:border-accent-400 hover:shadow-[0px_0px_15px_2px_#37B5AA]",
    glow: "accent",
    badge: "accent",
    button: "accent",
  },
};

const getToolsTheme = (intent: ToolsIntent): ToolsTheme => themes[intent];

export default getToolsTheme;
