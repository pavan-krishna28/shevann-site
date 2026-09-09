import { useContent } from "../context/ContentContext.jsx";
import Reveal from "./Reveal.jsx";
import TiltCard from "./TiltCard.jsx";

export default function PortfolioGrid() {
  const { content } = useContent();
  const { portfolio } = content;

  return (
    <section className="px-6 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-3xl md:text-4xl">Selected work</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {portfolio.map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <TiltCard maxTilt={5}>
                <div className="glass overflow-hidden rounded-2xl border border-ink/10">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-wide text-coral">{p.category}</p>
                    <h3 className="mt-1 font-display text-lg">{p.title}</h3>
                    <p className="mt-1 text-sm text-ink/70">{p.description}</p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
