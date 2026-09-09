import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext.jsx";

export default function Footer() {
  const { content } = useContent();
  const { footer, meta } = content;

  return (
    <footer className="border-t border-ink/10 px-6 py-10 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="font-display text-lg">{meta.siteName}</p>
          <p className="mt-1 text-sm text-muted">{footer.text}</p>
        </div>
        <ul className="flex flex-wrap gap-5">
          {footer.links.map((l) => (
            <li key={l.label}>
              <Link to={l.target} className="text-sm text-ink/80 hover:text-coral">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-xs text-muted">
        © {new Date().getFullYear()} {meta.siteName}. Built in {meta.location}.
      </p>
    </footer>
  );
}
