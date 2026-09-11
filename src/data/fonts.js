// Curated font picker for the admin Theme tab. Kept to a small, known-safe list (rather than a
// free-text field) so a typo can never break the site's fonts. Add more entries here if needed —
// "google" is the family name as Google Fonts expects it in a css2 URL, "fallback" is the CSS
// generic family used while the webfont loads (or if it fails to load).
export const FONT_OPTIONS = [
  { name: "Fraunces", google: "Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400", fallback: "serif" },
  { name: "Playfair Display", google: "Playfair+Display:wght@400;600;700", fallback: "serif" },
  { name: "DM Serif Display", google: "DM+Serif+Display:ital@0;1", fallback: "serif" },
  { name: "Cormorant Garamond", google: "Cormorant+Garamond:wght@400;600;700", fallback: "serif" },
  { name: "Manrope", google: "Manrope:wght@400;500;600;700;800", fallback: "sans-serif" },
  { name: "Inter", google: "Inter:wght@400;500;600;700;800", fallback: "sans-serif" },
  { name: "Poppins", google: "Poppins:wght@400;500;600;700", fallback: "sans-serif" },
  { name: "Space Grotesk", google: "Space+Grotesk:wght@400;500;600;700", fallback: "sans-serif" },
  { name: "Outfit", google: "Outfit:wght@400;500;600;700", fallback: "sans-serif" },
  { name: "Sora", google: "Sora:wght@400;500;600;700", fallback: "sans-serif" },
];

export function fontFallback(name) {
  const match = FONT_OPTIONS.find((f) => f.name === name);
  return match ? match.fallback : "sans-serif";
}
