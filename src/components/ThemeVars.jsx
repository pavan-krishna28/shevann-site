import { useEffect } from "react";
import { useContent } from "../context/ContentContext.jsx";
import { FONT_OPTIONS, fontFallback } from "../data/fonts.js";

const COLOR_VARS = {
  navy: "--navy",
  navySurface: "--navy-surface",
  navySoft: "--navy-soft",
  coral: "--coral",
  amber: "--amber",
  ink: "--ink",
  muted: "--muted",
};

function ensureGoogleFont(fontName) {
  if (!fontName) return;
  const option = FONT_OPTIONS.find((f) => f.name === fontName);
  if (!option) return; // unknown font name — skip rather than risk a bad request
  const linkId = "gf-" + fontName.replace(/\s+/g, "-").toLowerCase();
  if (document.getElementById(linkId)) return; // already loaded this session
  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${option.google}&display=swap`;
  document.head.appendChild(link);
}

// Applies content.theme to CSS custom properties on the document root at runtime. Because
// tailwind.config.js points every color utility (bg-navy, text-coral, etc.) at these same
// variables, and index.css's font-family / font-size / border-radius rules do the same, this one
// effect is what makes admin edits to colors, fonts, text size, and button shape visible
// immediately — no rebuild needed for a live preview, only for the change to reach every visitor.
export default function ThemeVars() {
  const { content } = useContent();
  const theme = content.theme || {};

  useEffect(() => {
    const root = document.documentElement.style;

    for (const [key, cssVar] of Object.entries(COLOR_VARS)) {
      if (theme[key]) root.setProperty(cssVar, theme[key]);
    }

    if (theme.headingFont) {
      ensureGoogleFont(theme.headingFont);
      root.setProperty("--font-display", `"${theme.headingFont}"`);
    }
    if (theme.bodyFont) {
      ensureGoogleFont(theme.bodyFont);
      root.setProperty("--font-body", `"${theme.bodyFont}"`);
    }

    if (theme.fontScale) root.setProperty("--font-scale", String(theme.fontScale));
    if (theme.btnRadius) root.setProperty("--btn-radius", theme.btnRadius);
  }, [theme]);

  return null;
}

export { FONT_OPTIONS, fontFallback };
