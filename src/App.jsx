import { Routes, Route } from "react-router-dom";
import { useContent } from "./context/ContentContext.jsx";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Chatbot from "./components/Chatbot.jsx";
import NotFound from "./pages/NotFound.jsx";
import Home from "./pages/Home.jsx";
import Studio from "./pages/Studio.jsx";
import Academy from "./pages/Academy.jsx";
import Work from "./pages/Work.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import AdminPanel from "./admin/AdminPanel.jsx";

// Component registry: maps a page "id" from site-content.json to the component
// that renders it. The ROUTE and NAV LINK for every page are fully generated
// from the JSON "pages" array — nothing is hand-wired per page here.
const PAGE_COMPONENTS = {
  home: Home,
  studio: Studio,
  academy: Academy,
  work: Work,
  about: About,
  contact: Contact,
};

export default function App() {
  const { content } = useContent();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Routes>
          {content.pages.map((page) => {
            const Component = PAGE_COMPONENTS[page.id] || NotFound;
            return <Route key={page.id} path={page.path} element={<Component />} />;
          })}
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
