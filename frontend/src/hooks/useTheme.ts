"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/src/lib/theme";

const THEME_CHANGE_EVENT = "scholar-theme-change";
const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";

function getTheme(): Theme {
  const theme = document.documentElement.dataset.theme;
  if (theme === "light" || theme === "dark") return theme;
  return window.matchMedia(SYSTEM_THEME_QUERY).matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const systemTheme = window.matchMedia(SYSTEM_THEME_QUERY);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
    if (event.newValue === "light" || event.newValue === "dark") {
      document.documentElement.dataset.theme = event.newValue;
    } else {
      delete document.documentElement.dataset.theme;
    }
    onChange();
  };

  systemTheme.addEventListener("change", onChange);
  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => {
    systemTheme.removeEventListener("change", onChange);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

function getServerTheme() {
  return null;
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  function toggleTheme() {
    const nextTheme = getTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The current tab still switches when browser storage is unavailable.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  return { theme, toggleTheme };
}
