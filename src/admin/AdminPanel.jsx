import { useRef, useState } from "react";
import { useContent } from "../context/ContentContext.jsx";
import { FONT_OPTIONS } from "../data/fonts.js";

const MAX_IMAGE_BYTES = 300 * 1024;
const UNLOCK_KEY = "shevann_admin_unlocked";

const BTN_RADIUS_OPTIONS = [
  { label: "Pill (fully round)", value: "9999px" },
  { label: "Rounded", value: "14px" },
  { label: "Soft corners", value: "8px" },
  { label: "Square", value: "2px" },
];

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function slugify(str) {
  return (str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---------- Passphrase gate ----------
// Deters casual visitors from finding /#/admin and poking around — it is NOT real security.
// This is a static site with no server, so the passphrase (content.admin.passphrase) ships
// inside the public JS bundle like everything else here; anyone determined enough to read the
// bundle can find it. Don't put anything here you wouldn't want a technically curious visitor to
// eventually see. Change the passphrase any time via the Advanced JSON tab ("admin.passphrase").
function PassphraseGate({ expected, onUnlock }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (value === expected) {
      sessionStorage.setItem(UNLOCK_KEY, "true");
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="glass w-full max-w-sm rounded-2xl border border-ink/10 p-7">
        <h1 className="font-display text-2xl">Shevann Admin</h1>
        <p className="mt-2 text-sm text-ink/70">Enter the passphrase to continue.</p>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          className="mt-4 w-full rounded-xl bg-navy-soft px-4 py-3 text-sm text-ink focus:outline-none"
          placeholder="Passphrase"
        />
        {error && <p className="mt-2 text-sm text-coral">That's not it — try again.</p>}
        <button type="submit" className="mt-4 w-full rounded-btn bg-coral-gradient px-6 py-3 text-sm font-semibold text-navy">
          Unlock
        </button>
        <p className="mt-4 text-xs text-muted">
          This is a soft lock for a static site, not real security — don't store anything sensitive here.
        </p>
      </form>
    </section>
  );
}

const TABS = [
  { id: "theme", label: "Theme" },
  { id: "content", label: "Content" },
  { id: "blog", label: "Blog" },
  { id: "images", label: "Images" },
  { id: "advanced", label: "Advanced (JSON)" },
];

export default function AdminPanel() {
  const { content, updateContent, resetContent, exportJSON, importJSON } = useContent();
  const expectedPass = content.admin?.passphrase || "shevann2026";
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(UNLOCK_KEY) === "true");

  const [tab, setTab] = useState("theme");
  const [jsonText, setJsonText] = useState(() => JSON.stringify(content, null, 2));
  const [jsonError, setJsonError] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);
  const [imageWarning, setImageWarning] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const fileInputRef = useRef(null);
  const importInputRef = useRef(null);

  function flashSaved() {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }

  function updateField(path, value) {
    updateContent((prev) => {
      const next = structuredClone(prev);
      let obj = next;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return next;
    });
    flashSaved();
  }

  function syncTextFromContent() {
    setJsonText(JSON.stringify(content, null, 2));
    setJsonError("");
  }

  function applyJson() {
    try {
      const parsed = JSON.parse(jsonText);
      updateContent(parsed);
      setJsonError("");
      flashSaved();
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
    reader.onload = () => setImageBase64(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  // ---------- Blog helpers ----------
  function addPost() {
    updateContent((prev) => {
      const next = structuredClone(prev);
      if (!next.blog) next.blog = { heading: "Blog", subheading: "", posts: [] };
      next.blog.posts.unshift({
        id: "post-" + Date.now(),
        slug: "untitled-post-" + Date.now(),
        title: "Untitled post",
        excerpt: "",
        content: "",
        coverImage: "",
        videoUrl: "",
        date: new Date().toISOString().slice(0, 10),
        published: false,
      });
      return next;
    });
    flashSaved();
  }

  function updatePostField(idx, field, value) {
    updateContent((prev) => {
      const next = structuredClone(prev);
      next.blog.posts[idx][field] = value;
      return next;
    });
  }

  function removePost(idx) {
    updateContent((prev) => {
      const next = structuredClone(prev);
      next.blog.posts.splice(idx, 1);
      return next;
    });
    flashSaved();
  }

  async function handlePostImage(idx, e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    updatePostField(idx, "coverImage", dataUrl);
    flashSaved();
    e.target.value = "";
  }

  if (!unlocked) {
    return <PassphraseGate expected={expectedPass} onUnlock={() => setUnlocked(true)} />;
  }

  const theme = content.theme || {};

  return (
    <section className="min-h-screen px-6 py-28 md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl">Shevann Admin</h1>
          {savedFlash && <span className="text-sm text-amber">Saved to this browser ✓</span>}
        </div>
        <p className="mt-2 max-w-xl text-sm text-ink/70">
          Edits save to this browser's local storage instantly and override the site's base content
          for you, live. To publish permanently for every visitor: go to the{" "}
          <button onClick={() => setTab("advanced")} className="text-coral underline">
            Advanced tab
          </button>
          , click <strong>Export JSON</strong>, replace{" "}
          <code className="rounded bg-navy-soft px-1.5 py-0.5">src/data/site-content.json</code> in
          the repo with the downloaded file, then commit and push — Netlify redeploys automatically.
        </p>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-ink/10 pb-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-btn px-4 py-1.5 text-sm font-semibold transition-colors ${
                tab === t.id ? "bg-coral-gradient text-navy" : "border border-ink/20 text-ink/70 hover:border-coral hover:text-coral"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ---------------- THEME TAB ---------------- */}
        {tab === "theme" && (
          <div className="mt-6 space-y-6">
            <div className="glass rounded-2xl border border-ink/10 p-6">
              <h2 className="font-display text-xl">Colors</h2>
              <p className="mt-1 text-xs text-ink/60">Changes apply live across every page immediately.</p>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  ["navy", "Background"],
                  ["navySurface", "Surface"],
                  ["navySoft", "Input / soft panel"],
                  ["ink", "Text"],
                  ["muted", "Muted text"],
                  ["coral", "Accent 1"],
                  ["amber", "Accent 2"],
                ].map(([key, label]) => (
                  <label key={key} className="block text-xs text-ink/70">
                    {label}
                    <div className="mt-1 flex items-center gap-2 rounded-xl bg-navy-soft px-2 py-1.5">
                      <input
                        type="color"
                        value={theme[key] || "#000000"}
                        onChange={(e) => updateField(["theme", key], e.target.value)}
                        className="h-7 w-7 cursor-pointer rounded border-none bg-transparent"
                      />
                      <span className="font-mono text-[11px] text-ink/60">{theme[key]}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl border border-ink/10 p-6">
              <h2 className="font-display text-xl">Fonts & text size</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  Heading font
                  <select
                    value={theme.headingFont || "Fraunces"}
                    onChange={(e) => updateField(["theme", "headingFont"], e.target.value)}
                    className="mt-1 w-full rounded-xl bg-navy-soft px-3 py-2 text-sm"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.name} value={f.name}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm">
                  Body font
                  <select
                    value={theme.bodyFont || "Manrope"}
                    onChange={(e) => updateField(["theme", "bodyFont"], e.target.value)}
                    className="mt-1 w-full rounded-xl bg-navy-soft px-3 py-2 text-sm"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.name} value={f.name}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="mt-4 block text-sm">
                Overall text size — {Math.round((theme.fontScale || 1) * 100)}%
                <input
                  type="range"
                  min="0.85"
                  max="1.25"
                  step="0.05"
                  value={theme.fontScale || 1}
                  onChange={(e) => updateField(["theme", "fontScale"], parseFloat(e.target.value))}
                  className="mt-2 w-full"
                />
              </label>
            </div>

            <div className="glass rounded-2xl border border-ink/10 p-6">
              <h2 className="font-display text-xl">Button shape</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {BTN_RADIUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateField(["theme", "btnRadius"], opt.value)}
                    style={{ borderRadius: opt.value }}
                    className={`bg-coral-gradient px-5 py-2 text-sm font-semibold text-navy ${
                      theme.btnRadius === opt.value ? "ring-2 ring-ink" : ""
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- CONTENT TAB ---------------- */}
        {tab === "content" && (
          <div className="mt-6 space-y-6">
            <div className="glass rounded-2xl border border-ink/10 p-6">
              <h2 className="font-display text-xl">Site identity</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  Site name
                  <input
                    defaultValue={content.meta.siteName}
                    onBlur={(e) => updateField(["meta", "siteName"], e.target.value)}
                    className="mt-1 w-full rounded-xl bg-navy-soft px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm">
                  Tagline
                  <input
                    defaultValue={content.meta.tagline}
                    onBlur={(e) => updateField(["meta", "tagline"], e.target.value)}
                    className="mt-1 w-full rounded-xl bg-navy-soft px-3 py-2 text-sm"
                  />
                </label>
              </div>
            </div>

            <div className="glass rounded-2xl border border-ink/10 p-6">
              <h2 className="font-display text-xl">Home hero</h2>
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

            <div className="glass rounded-2xl border border-ink/10 p-6">
              <h2 className="font-display text-xl">Page headings</h2>
              <p className="mt-1 text-xs text-ink/60">
                For anything not listed here — services, portfolio items, testimonials, process
                steps, and so on — use the Advanced JSON tab, which can edit every field on every
                page.
              </p>
              <div className="mt-4 grid gap-4">
                <label className="block text-sm">
                  Academy heading
                  <input
                    defaultValue={content.academy.heading}
                    onBlur={(e) => updateField(["academy", "heading"], e.target.value)}
                    className="mt-1 w-full rounded-xl bg-navy-soft px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm">
                  Academy description
                  <textarea
                    defaultValue={content.academy.description}
                    onBlur={(e) => updateField(["academy", "description"], e.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded-xl bg-navy-soft px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm">
                  About heading
                  <input
                    defaultValue={content.about.heading}
                    onBlur={(e) => updateField(["about", "heading"], e.target.value)}
                    className="mt-1 w-full rounded-xl bg-navy-soft px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm">
                  About story
                  <textarea
                    defaultValue={content.about.story}
                    onBlur={(e) => updateField(["about", "story"], e.target.value)}
                    rows={4}
                    className="mt-1 w-full rounded-xl bg-navy-soft px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm">
                  Contact heading
                  <input
                    defaultValue={content.contact.heading}
                    onBlur={(e) => updateField(["contact", "heading"], e.target.value)}
                    className="mt-1 w-full rounded-xl bg-navy-soft px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm">
                  Contact notification email (where enquiries should go)
                  <input
                    defaultValue={content.contact.email}
                    onBlur={(e) => updateField(["contact", "email"], e.target.value)}
                    className="mt-1 w-full rounded-xl bg-navy-soft px-3 py-2 text-sm"
                  />
                  <span className="mt-1 block text-xs text-ink/50">
                    This is the "email us directly" address shown on the page. The form itself
                    delivers to whatever email address is set up under your Netlify site's Forms →
                    Form notifications settings.
                  </span>
                </label>
              </div>
            </div>

            <div className="glass rounded-2xl border border-ink/10 p-6">
              <h2 className="font-display text-xl">Pages (drives routing & nav)</h2>
              <p className="mt-1 text-xs text-ink/60">
                Toggling "show in nav" or editing labels here updates the live nav menu immediately.
              </p>
              <ul className="mt-4 space-y-2">
                {content.pages.map((p, idx) => (
                  <li key={p.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-navy-soft px-3 py-2 text-sm">
                    <span className="w-20 truncate text-ink/60">{p.id}</span>
                    <input
                      defaultValue={p.label}
                      onBlur={(e) => updateField(["pages", idx, "label"], e.target.value)}
                      className="min-w-[8rem] flex-1 rounded-lg bg-navy px-2 py-1 text-sm"
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

            <div className="glass rounded-2xl border border-ink/10 p-6">
              <h2 className="font-display text-xl">Chatbot knowledge base</h2>
              <p className="mt-1 text-xs text-ink/60">
                Edit via the Advanced JSON tab for full control over keywords and answers.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-ink/70">
                {content.chatbot.knowledge.map((k) => (
                  <li key={k.id} className="rounded-xl bg-navy-soft px-3 py-2">
                    <span className="text-coral">{k.keywords.join(", ")}</span> → {k.answer}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ---------------- BLOG TAB ---------------- */}
        {tab === "blog" && (
          <div className="mt-6 space-y-6">
            <div className="glass rounded-2xl border border-ink/10 p-6">
              <h2 className="font-display text-xl">Blog page</h2>
              <div className="mt-4 grid gap-4">
                <label className="block text-sm">
                  Heading
                  <input
                    defaultValue={content.blog?.heading || ""}
                    onBlur={(e) => updateField(["blog", "heading"], e.target.value)}
                    className="mt-1 w-full rounded-xl bg-navy-soft px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm">
                  Subheading
                  <input
                    defaultValue={content.blog?.subheading || ""}
                    onBlur={(e) => updateField(["blog", "subheading"], e.target.value)}
                    className="mt-1 w-full rounded-xl bg-navy-soft px-3 py-2 text-sm"
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">Posts</h2>
              <button onClick={addPost} className="rounded-btn bg-coral-gradient px-4 py-1.5 text-xs font-semibold text-navy">
                + New post
              </button>
            </div>

            {(content.blog?.posts || []).map((post, idx) => (
              <div key={post.id} className="glass rounded-2xl border border-ink/10 p-6">
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-xs text-ink/70">
                    <input
                      type="checkbox"
                      checked={post.published !== false}
                      onChange={(e) => updatePostField(idx, "published", e.target.checked)}
                    />
                    Published (visible on the live blog)
                  </label>
                  <button
                    onClick={() => removePost(idx)}
                    className="rounded-btn border border-red-400/40 px-3 py-1 text-xs font-semibold text-red-300 hover:bg-red-400/10"
                  >
                    Delete post
                  </button>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm">
                    Title
                    <input
                      value={post.title}
                      onChange={(e) => {
                        updatePostField(idx, "title", e.target.value);
                      }}
                      onBlur={(e) => {
                        // Auto-slug only if the slug still looks auto-generated / untouched.
                        if (!post.slug || post.slug.startsWith("untitled-post-")) {
                          updatePostField(idx, "slug", slugify(e.target.value));
                        }
                      }}
                      className="mt-1 w-full rounded-xl bg-navy-soft px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="block text-sm">
                    URL slug (site.com/#/blog/<em>this</em>)
                    <input
                      value={post.slug}
                      onChange={(e) => updatePostField(idx, "slug", slugify(e.target.value))}
                      className="mt-1 w-full rounded-xl bg-navy-soft px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="block text-sm">
                    Date
                    <input
                      type="date"
                      value={post.date}
                      onChange={(e) => updatePostField(idx, "date", e.target.value)}
                      className="mt-1 w-full rounded-xl bg-navy-soft px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="block text-sm">
                    Video URL (YouTube, Vimeo, or a direct video file)
                    <input
                      value={post.videoUrl || ""}
                      onChange={(e) => updatePostField(idx, "videoUrl", e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="mt-1 w-full rounded-xl bg-navy-soft px-3 py-2 text-sm"
                    />
                  </label>
                </div>

                <label className="mt-4 block text-sm">
                  Excerpt (shown on the blog list)
                  <textarea
                    value={post.excerpt}
                    onChange={(e) => updatePostField(idx, "excerpt", e.target.value)}
                    rows={2}
                    className="mt-1 w-full rounded-xl bg-navy-soft px-3 py-2 text-sm"
                  />
                </label>

                <label className="mt-4 block text-sm">
                  Full content (blank line = new paragraph)
                  <textarea
                    value={post.content}
                    onChange={(e) => updatePostField(idx, "content", e.target.value)}
                    rows={6}
                    className="mt-1 w-full rounded-xl bg-navy-soft px-3 py-2 text-sm"
                  />
                </label>

                <div className="mt-4">
                  <span className="block text-sm">Cover image</span>
                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    {post.coverImage && (
                      <img src={post.coverImage} alt="" className="h-16 w-24 rounded-lg object-cover" />
                    )}
                    <input
                      value={post.coverImage || ""}
                      onChange={(e) => updatePostField(idx, "coverImage", e.target.value)}
                      placeholder="Paste an image URL…"
                      className="min-w-[12rem] flex-1 rounded-xl bg-navy-soft px-3 py-2 text-sm"
                    />
                    <label className="cursor-pointer rounded-btn border border-ink/25 px-3 py-1.5 text-xs font-semibold hover:border-coral hover:text-coral">
                      Upload instead
                      <input type="file" accept="image/*" onChange={(e) => handlePostImage(idx, e)} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---------------- IMAGES TAB ---------------- */}
        {tab === "images" && (
          <div className="mt-6">
            <div className="glass rounded-2xl border border-ink/10 p-6">
              <h2 className="font-display text-xl">Image upload helper</h2>
              <p className="mt-1 text-xs text-ink/60">
                Converts an image to a base64 string you can paste into any image field in the JSON
                editor (e.g. a portfolio item's "image" field). Uploaded images live inside the
                content store itself — no separate file hosting needed. (Blog post covers have their
                own upload button right on the Blog tab.)
              </p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="mt-3 text-sm" />
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
          </div>
        )}

        {/* ---------------- ADVANCED / RAW JSON TAB ---------------- */}
        {tab === "advanced" && (
          <div className="mt-6 space-y-6">
            <p className="text-xs text-amber">
              Note: this panel isn't password-protected against someone reading the site's source —
              it's a soft lock for a static site, not a secured CMS. Edits here only affect your own
              browser until exported and published (see banner above).
            </p>
            <div className="glass rounded-2xl border border-ink/10 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-xl">Full content JSON</h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={syncTextFromContent}
                    className="rounded-btn border border-ink/25 px-4 py-1.5 text-xs font-semibold hover:border-coral hover:text-coral"
                  >
                    Reload from live content
                  </button>
                  <button onClick={applyJson} className="rounded-btn bg-coral-gradient px-4 py-1.5 text-xs font-semibold text-navy">
                    Apply changes
                  </button>
                  <button
                    onClick={exportJSON}
                    className="rounded-btn border border-amber/50 px-4 py-1.5 text-xs font-semibold text-amber hover:bg-amber/10"
                  >
                    Export JSON
                  </button>
                  <button
                    onClick={() => importInputRef.current?.click()}
                    className="rounded-btn border border-ink/25 px-4 py-1.5 text-xs font-semibold hover:border-coral hover:text-coral"
                  >
                    Import JSON
                  </button>
                  <input ref={importInputRef} type="file" accept="application/json" onChange={handleImportFile} className="hidden" />
                  <button
                    onClick={() => {
                      resetContent();
                      syncTextFromContent();
                    }}
                    className="rounded-btn border border-red-400/40 px-4 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-400/10"
                  >
                    Reset to defaults
                  </button>
                </div>
              </div>

              {jsonError && <p className="mt-3 text-sm text-red-300">{jsonError}</p>}

              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                spellCheck={false}
                rows={26}
                className="mt-4 w-full rounded-xl bg-navy-soft p-4 font-mono text-xs leading-relaxed text-ink/90"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
