import Reveal from "../components/Reveal.jsx";
import PortfolioGrid from "../components/PortfolioGrid.jsx";
import Testimonials from "../components/Testimonials.jsx";

export default function Work() {
  return (
    <>
      <section className="px-6 pb-8 pt-32 md:px-12">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <h1 className="font-display text-4xl md:text-6xl">Our work</h1>
            <p className="mt-5 max-w-2xl text-lg text-ink/75">
              A selection of Studio projects — each one built as a partnership, not a hand-off.
            </p>
          </Reveal>
        </div>
      </section>
      <PortfolioGrid />
      <Testimonials />
    </>
  );
}
