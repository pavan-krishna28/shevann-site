import { useContent } from "../context/ContentContext.jsx";
import Reveal from "./Reveal.jsx";

export default function Testimonials() {
  const { content } = useContent();
  const { testimonials } = content;
  if (!testimonials?.length) return null;

  return (
    <section className="px-6 py-20 md:px-12">
      <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal key={t.id} delay={i * 100}>
            <blockquote className="glass h-full rounded-2xl border border-ink/10 p-8">
              <p className="font-display text-xl leading-snug text-ink/90">"{t.quote}"</p>
              <footer className="mt-5 text-sm text-muted">
                {t.author} — {t.company}
              </footer>
            </blockquote>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
