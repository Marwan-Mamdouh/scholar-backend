export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "scholar-theme";

// Runs before first paint. Without an explicit preference, CSS follows the OS.
export const themeInitScript = `(() => {
  try {
    const theme = localStorage.getItem("${THEME_STORAGE_KEY}");
    if (theme === "light" || theme === "dark") {
      document.documentElement.dataset.theme = theme;
    }
  } catch {}
})();`;
