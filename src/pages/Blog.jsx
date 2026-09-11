import { Link } from "react-router-dom";
import { useContent } from "../context/ContentContext.jsx";
import Reveal from "../components/Reveal.jsx";
import TiltCard from "../components/TiltCard.jsx";

export default function Blog() {
  const { content } = useContent();
  const blog = content.blog || { heading: "Blog", subheading: "", posts: [] };
  const posts = (blog.posts || [])
    .filter((p) => p.published !== false)
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <section className="px-6 py-32 md:px-12">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h1 className="font-display text-4xl md:text-6xl">{blog.heading}</h1>
          {blog.subheading && <p className="mt-4 max-w-2xl text-lg text-ink/75">{blog.subheading}</p>}
        </Reveal>

        {posts.length === 0 ? (
          <p className="mt-12 text-ink/60">No posts yet — check back soon.</p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={i * 100}>
                <Link to={`/blog/${post.slug}`}>
                  <TiltCard maxTilt={5}>
                    <div className="glass h-full overflow-hidden rounded-2xl border border-ink/10">
                      {post.coverImage && (
                        <div className="aspect-[16/10] overflow-hidden">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        {post.date && (
                          <p className="text-xs uppercase tracking-wide text-coral">
                            {new Date(post.date).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        )}
                        <h2 className="mt-1 font-display text-lg">{post.title}</h2>
                        {post.excerpt && <p className="mt-1 text-sm text-ink/70">{post.excerpt}</p>}
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
