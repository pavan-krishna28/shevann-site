import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-5xl text-gradient">404</h1>
      <p className="mt-4 text-ink/70">This page doesn't exist yet.</p>
      <Link to="/" className="mt-6 rounded-full bg-coral-gradient px-6 py-2.5 text-sm font-semibold text-navy">
        Back home
      </Link>
    </section>
  );
}
