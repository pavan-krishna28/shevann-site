import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext.jsx";
import ServicesGrid from "../components/ServicesGrid.jsx";
import ProcessSteps from "../components/ProcessSteps.jsx";
import PortfolioGrid from "../components/PortfolioGrid.jsx";
import Testimonials from "../components/Testimonials.jsx";
import Reveal from "../components/Reveal.jsx";

export default function Studio() {
  const { content } = useContent();

  return (
    <>
      <section className="px-6 pb-16 pt-32 md:px-12">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <h1 className="font-display text-4xl md:text-6xl">Shevann Studio</h1>
            <p className="mt-5 max-w-2xl text-lg text-ink/75">
              A product and brand studio for founders and teams who want a partner that thinks
              about outcomes, not just deliverables.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-block rounded-full bg-coral-gradient px-7 py-3 text-sm font-semibold text-navy transition-transform hover:scale-105"
            >
              Get a quote
            </Link>
          </Reveal>
        </div>
      </section>
      <ServicesGrid />
      <ProcessSteps />
      <PortfolioGrid />
      <Testimonials />
    </>
  );
}
