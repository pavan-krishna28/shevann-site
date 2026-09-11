import { Routes, Route } from "react-router-dom";
import { useContent } from "./context/ContentContext.jsx";
import ThemeVars from "./components/ThemeVars.jsx";
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
import Blog from "./pages/Blog.jsx";
import BlogPost from "./pages/BlogPost.jsx";
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
  blog: Blog,
};

export default function App() {
  const { content } = useContent();

  return (
    <div className="flex min-h-screen flex-col">
      <ThemeVars />
      <Nav />
      <main className="flex-1">
        <Routes>
          {content.pages.map((page) => {
            const Component = PAGE_COMPONENTS[page.id] || NotFound;
            return <Route key={page.id} path={page.path} element={<Component />} />;
          })}
          {/* Individual blog posts get their own dynamic route — not part of the generic
              "pages" array above, since each post isn't a standalone nav-level page. */}
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
