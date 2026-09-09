import { useContent } from "../context/ContentContext.jsx";
import Reveal from "./Reveal.jsx";
import TiltCard from "./TiltCard.jsx";

export default function ServicesGrid() {
  const { content } = useContent();
  const { services } = content;

  return (
    <section className="px-6 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-3xl md:text-4xl">What we do</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 80}>
              <TiltCard maxTilt={4}>
                <div className="glass h-full rounded-2xl border border-ink/10 p-7">
                  <h3 className="font-display text-xl">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{s.summary}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {s.outcomes.map((o) => (
                      <li key={o} className="rounded-full border border-ink/15 px-3 py-1 text-xs text-ink/70">
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
