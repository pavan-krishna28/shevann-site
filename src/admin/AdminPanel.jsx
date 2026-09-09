import { useRef, useState } from "react";
import { useContent } from "../context/ContentContext.jsx";

const MAX_IMAGE_BYTES = 300 * 1024;

export default function AdminPanel() {
  const { content, updateContent, resetContent, exportJSON, importJSON } = useContent();
  const [jsonText, setJsonText] = useState(() => JSON.stringify(content, null, 2));
  const [jsonError, setJsonError] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);
  const [imageWarning, setImageWarning] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const fileInputRef = useRef(null);
  const importInputRef = useRef(null);

  function syncTextFromContent() {
    setJsonText(JSON.stringify(content, null, 2));
    setJsonError("");
  }

  function applyJson() {
    try {
      const parsed = JSON.parse(jsonText);
      updateContent(parsed);
      setJsonError("");
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1800);
    } catch (err) {
      setJsonError("Invalid JSON: " + err.message);
    }
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        importJSON(parsed);
        setJsonText(JSON.stringify(parsed, null, 2));
        setJsonError("");
      } catch (err) {
        setJsonError("Could not import file: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      setImageWarning(
        `This image is ${(file.size / 1024).toFixed(0)}KB — over the ~300KB recommended limit. It will still work, but consider compressing it first.`
      );
    } else {
      setImageWarning("");
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function updateField(path, value) {
    updateContent((prev) => {
      const next = structuredClone(prev);
      let obj = next;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return next;
    });
  }

  return (
    <section className="min-h-screen px-6 py-28 md:px-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-3xl">Shevann Admin</h1>
        <p className="mt-2 max-w-xl text-sm text-ink/70">
          Edits save to this browser's local storage instantly and override the site's base content
          for you. To publish permanently: click <strong>Export JSON</strong>, replace{" "}
          <code className="rounded bg-navy-soft px-1.5 py-0.5">src/data/site-content.json</code> in
          the repo with the downloaded file, then commit and push.
        </p>
        <p className="mt-2 max-w-xl text-xs text-amber">
          Note: this panel isn't password-protected — it's a local editing tool, not a secured CMS.
          Anyone who visits /#/admin can preview edits in their own browser, but those edits never
          affect what other visitors see until you export and publish them.
        </p>

        {/* Quick editors */}
        <div className="glass mt-8 rounded-2xl border border-ink/10 p-6">
          <h2 className="font-display text-xl">Quick edit: Hero</h2>
          <div className="mt-4 grid gap-4">
            <label className="block text-sm">
              Headline
              <input
                defaultValue={content.hero.headline}
                onBlur={(e) => updateField(["hero", "headline"], e.target.value)}
                className="mt-1 w-full rounded-xl bg-navy-soft px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              Subhead
              <textarea
                defaultValue={content.hero.subhead}
                onBlur={(e) => updateField(["hero", "subhead"], e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-xl bg-navy-soft px-3 py-2 text-sm"
              />
            </label>
          </div>
        </div>

        {/* Pages registry */}
        <div className="glass mt-6 rounded-2xl border border-ink/10 p-6">
          <h2 className="font-display text-xl">Pages (drives routing & nav)</h2>
          <p className="mt-1 text-xs text-ink/60">
            Toggling "show in nav" or editing labels here updates the live nav menu immediately —
            no route code to touch.
          </p>
          <ul className="mt-4 space-y-2">
            {content.pages.map((p, idx) => (
              <li key={p.id} className="flex items-center gap-3 rounded-xl bg-navy-soft px-3 py-2 text-sm">
                <span className="w-24 truncate text-ink/60">{p.id}</span>
                <input
                  defaultValue={p.label}
                  onBlur={(e) => updateField(["pages", idx, "label"], e.target.value)}
                  className="flex-1 rounded-lg bg-navy px-2 py-1 text-sm"
                />
                <span className="text-ink/50">{p.path}</span>
                <label className="flex items-center gap-1.5 text-xs text-ink/60">
                  <input
                    type="checkbox"
                    defaultChecked={p.showInNav}
                    onChange={(e) => updateField(["pages", idx, "showInNav"], e.target.checked)}
                  />
                  in nav
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Chatbot knowledge */}
        <div className="glass mt-6 rounded-2xl border border-ink/10 p-6">
          <h2 className="font-display text-xl">Chatbot knowledge base</h2>
          <p className="mt-1 text-xs text-ink/60">
            Each entry matches on keywords (case-insensitive, typo-tolerant). Edit the raw JSON
            below for full control, or use quick edits above for common fields.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ink/70">
            {content.chatbot.knowledge.map((k) => (
              <li key={k.id} className="rounded-xl bg-navy-soft px-3 py-2">
                <span className="text-coral">{k.keywords.join(", ")}</span> → {k.answer}
              </li>
            ))}
          </ul>
        </div>

        {/* Image upload helper */}
        <div className="glass mt-6 rounded-2xl border border-ink/10 p-6">
          <h2 className="font-display text-xl">Image upload</h2>
          <p className="mt-1 text-xs text-ink/60">
            Converts an image to a base64 string you can paste into any image field in the JSON
            editor below (e.g. a portfolio item's "image" field). Uploaded images live inside the
            content store itself — no separate file hosting needed.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-3 text-sm"
          />
          {imageWarning && <p className="mt-2 text-xs text-amber">{imageWarning}</p>}
          {imageBase64 && (
            <div className="mt-3">
              <img src={imageBase64} alt="Preview" className="h-24 rounded-lg object-cover" />
              <textarea
                readOnly
                value={imageBase64}
                rows={3}
                className="mt-2 w-full rounded-xl bg-navy-soft px-3 py-2 text-xs"
                onFocus={(e) => e.target.select()}
              />
            </div>
          )}
        </div>

        {/* Raw JSON editor */}
        <div className="glass mt-6 rounded-2xl border border-ink/10 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl">Full content JSON</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={syncTextFromContent}
                className="rounded-full border border-ink/25 px-4 py-1.5 text-xs font-semibold hover:border-coral hover:text-coral"
              >
                Reload from live content
              </button>
              <button
                onClick={applyJson}
                className="rounded-full bg-coral-gradient px-4 py-1.5 text-xs font-semibold text-navy"
              >
                Apply changes
              </button>
              <button
                onClick={exportJSON}
                className="rounded-full border border-amber/50 px-4 py-1.5 text-xs font-semibold text-amber hover:bg-amber/10"
              >
                Export JSON
              </button>
              <button
                onClick={() => importInputRef.current?.click()}
                className="rounded-full border border-ink/25 px-4 py-1.5 text-xs font-semibold hover:border-coral hover:text-coral"
              >
                Import JSON
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept="application/json"
                onChange={handleImportFile}
                className="hidden"
              />
              <button
                onClick={() => {
                  resetContent();
                  syncTextFromContent();
                }}
                className="rounded-full border border-red-400/40 px-4 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-400/10"
              >
                Reset to defaults
              </button>
            </div>
          </div>

          {jsonError && <p className="mt-3 text-sm text-red-300">{jsonError}</p>}
          {savedFlash && <p className="mt-3 text-sm text-amber">Saved to this browser.</p>}

          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            spellCheck={false}
            rows={22}
            className="mt-4 w-full rounded-xl bg-navy-soft p-4 font-mono text-xs leading-relaxed text-ink/90"
          />
        </div>
      </div>
    </section>
  );
}
