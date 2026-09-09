import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext.jsx";
import Reveal from "../components/Reveal.jsx";
import TiltCard from "../components/TiltCard.jsx";

export default function Academy() {
  const { content } = useContent();
  const { academy } = content;

  return (
    <>
      <section className="px-6 pb-16 pt-32 md:px-12">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <h1 className="font-display text-4xl md:text-6xl">Shevann Academy</h1>
            <p className="mt-5 max-w-2xl text-lg text-ink/75">{academy.heading}</p>
            <p className="mt-3 max-w-2xl text-ink/70">{academy.description}</p>
            <Link
              to="/contact"
              className="mt-8 inline-block rounded-full bg-coral-gradient px-7 py-3 text-sm font-semibold text-navy transition-transform hover:scale-105"
            >
              {academy.cta.label}
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-3">
          {academy.tracks.map((track, i) => (
            <Reveal key={track.title} delay={i * 100}>
              <TiltCard maxTilt={5}>
                <div className="glass h-full rounded-2xl border border-ink/10 p-7">
                  <h3 className="font-display text-xl text-amber">{track.title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{track.description}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
