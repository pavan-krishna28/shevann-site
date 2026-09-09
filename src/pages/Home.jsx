import Hero from "../components/Hero.jsx";
import PathChooser from "../components/PathChooser.jsx";
import ServicesGrid from "../components/ServicesGrid.jsx";
import PortfolioGrid from "../components/PortfolioGrid.jsx";
import Testimonials from "../components/Testimonials.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <PathChooser />
      <ServicesGrid />
      <PortfolioGrid />
      <Testimonials />
    </>
  );
}
