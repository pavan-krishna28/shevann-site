import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useContent } from "../context/ContentContext.jsx";

export default function Nav() {
  const { content } = useContent();
  const { nav, pages, meta } = content;
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navPages = pages.filter((p) => p.showInNav);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="glass mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-medium" onClick={() => setOpen(false)}>
          <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
            <path
              d="M20 20 C20 14, 44 14, 44 24 C44 32, 20 30, 20 40 C20 50, 44 50, 44 44"
              fill="none"
              stroke="url(#navgrad)"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="navgrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF6B4A" />
                <stop offset="100%" stopColor="#FFA630" />
              </linearGradient>
            </defs>
          </svg>
          {nav.logoText || meta.siteName}
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {navPages.map((p) => (
            <li key={p.id}>
              <Link
                to={p.path}
                className={`text-sm transition-colors hover:text-coral ${
                  location.pathname === p.path ? "text-coral" : "text-ink/85"
                }`}
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to="/contact"
          className="hidden rounded-full bg-coral-gradient px-5 py-2 text-sm font-semibold text-navy transition-transform hover:scale-105 md:inline-block"
        >
          {nav.cta?.label || "Let's talk"}
        </Link>

        <button
          className="text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="glass mx-4 mt-2 rounded-2xl p-4 md:hidden">
          <ul className="flex flex-col gap-3">
            {navPages.map((p) => (
              <li key={p.id}>
                <Link to={p.path} className="block py-1 text-ink/90" onClick={() => setOpen(false)}>
                  {p.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/contact"
                className="mt-2 block rounded-full bg-coral-gradient px-4 py-2 text-center text-sm font-semibold text-navy"
                onClick={() => setOpen(false)}
              >
                {nav.cta?.label || "Let's talk"}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
