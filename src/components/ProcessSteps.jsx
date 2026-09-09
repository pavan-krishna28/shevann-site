import { useContent } from "../context/ContentContext.jsx";
import Reveal from "./Reveal.jsx";

export default function ProcessSteps() {
  const { content } = useContent();
  const { process } = content;

  return (
    <section className="px-6 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-3xl md:text-4xl">{process.heading}</h2>
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-4">
          {process.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 100}>
              <div className="border-l-2 border-coral/40 pl-5">
                <p className="font-display text-lg text-coral">{step.title}</p>
                <p className="mt-2 text-sm text-ink/70">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
