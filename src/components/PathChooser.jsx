import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext.jsx";
import TiltCard from "./TiltCard.jsx";
import Reveal from "./Reveal.jsx";

const accentMap = {
  coral: { border: "hover:border-coral/60", text: "text-coral" },
  amber: { border: "hover:border-amber/60", text: "text-amber" },
};

export default function PathChooser() {
  const { content } = useContent();
  const { pathChooser } = content;

  return (
    <section className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-3xl md:text-4xl">{pathChooser.heading}</h2>
          <p className="mt-3 max-w-xl text-ink/70">{pathChooser.subheading}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {pathChooser.cards.map((card, i) => {
            const accent = accentMap[card.accent] || accentMap.coral;
            return (
              <Reveal key={card.id} delay={i * 120}>
                <TiltCard>
                  <div
                    className={`glass group flex h-full flex-col justify-between rounded-3xl border border-ink/10 p-8 transition-colors ${accent.border}`}
                  >
                    <div>
                      <h3 className="font-display text-2xl">{card.title}</h3>
                      <p className="mt-3 text-ink/70">{card.description}</p>
                    </div>
                    <Link
                      to={card.cta.target}
                      className={`mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold ${accent.text}`}
                    >
                      {card.cta.label}
                    </Link>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
