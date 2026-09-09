import { createContext, useContext, useState, useCallback, useMemo } from "react";
import baseContent from "../data/site-content.json";

const STORAGE_KEY = "shevann_cms";
const ContentContext = createContext(null);

function deepMerge(base, override) {
  if (Array.isArray(base) || Array.isArray(override)) {
    return override !== undefined ? override : base;
  }
  if (typeof base === "object" && base !== null && typeof override === "object" && override !== null) {
    const out = { ...base };
    for (const key of Object.keys(override)) {
      out[key] = deepMerge(base[key], override[key]);
    }
    return out;
  }
  return override !== undefined ? override : base;
}

function loadOverride() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function ContentProvider({ children }) {
  const [override, setOverride] = useState(loadOverride);

  const content = useMemo(() => deepMerge(baseContent, override), [override]);

  const updateContent = useCallback((updater) => {
    setOverride((prev) => {
      const currentMerged = deepMerge(baseContent, prev);
      const nextMerged = typeof updater === "function" ? updater(currentMerged) : updater;
      // Store the full merged object as the override so exports/edits are self-contained.
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMerged));
      return nextMerged;
    });
  }, []);

  const resetContent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setOverride({});
  }, []);

  const exportJSON = useCallback(() => {
    const dataStr = JSON.stringify(content, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site-content.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content]);

  const importJSON = useCallback((jsonObj) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jsonObj));
    setOverride(jsonObj);
  }, []);

  const value = { content, updateContent, resetContent, exportJSON, importJSON };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
