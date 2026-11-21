"use client";

import { Moon, Sun } from "lucide-react";
import ThemeIcon from "@/src/components/Icons/Theme";
import { useTheme } from "@/src/hooks/useTheme";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const label = theme
    ? `Switch to ${theme === "dark" ? "light" : "dark"} theme`
    : "Toggle theme";
  const Icon = theme === null ? ThemeIcon : theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      className={`items-center justify-center rounded-xl text-neutral-300 transition-colors hover:text-neutral-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300 ${className}`}
    >
      <Icon aria-hidden="true" className="h-6 w-6" />
    </button>
  );
}
