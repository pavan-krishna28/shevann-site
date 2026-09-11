import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext.jsx";
import GradientMesh from "./GradientMesh.jsx";

export default function Hero() {
  const { content } = useContent();
  const { hero } = content;

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden px-6 pt-24 md:px-12">
      <GradientMesh className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-navy/40" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <h1 className="font-display text-[2.6rem] leading-[1.05] tracking-tight md:text-7xl">
          {hero.headline}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink/80 md:text-xl">{hero.subhead}</p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            to={hero.primaryCta.target === "contact" ? "/contact" : hero.primaryCta.target}
            className="rounded-btn bg-coral-gradient px-7 py-3 text-sm font-semibold text-navy shadow-lg shadow-coral/20 transition-transform hover:scale-105"
          >
            {hero.primaryCta.label}
          </Link>
          <Link
            to={hero.secondaryCta.target}
            className="rounded-btn border border-ink/25 px-7 py-3 text-sm font-semibold text-ink transition-colors hover:border-coral hover:text-coral"
          >
            {hero.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
