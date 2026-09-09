import { useContent } from "../context/ContentContext.jsx";
import Reveal from "../components/Reveal.jsx";

export default function About() {
  const { content } = useContent();
  const { about, meta } = content;

  return (
    <section className="px-6 py-32 md:px-12">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <h1 className="font-display text-4xl md:text-6xl">{about.heading}</h1>
          <p className="mt-6 max-w-2xl text-lg text-ink/75">{about.story}</p>
          <p className="mt-3 text-sm text-muted">Founded by {meta.founders} · {meta.location}</p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {about.values.map((v, i) => (
            <Reveal key={v.title} delay={i * 100}>
              <div className="border-l-2 border-coral/40 pl-5">
                <h3 className="font-display text-lg text-coral">{v.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{v.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
