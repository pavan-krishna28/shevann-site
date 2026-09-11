import { Link, useParams } from "react-router-dom";
import { useContent } from "../context/ContentContext.jsx";
import Reveal from "../components/Reveal.jsx";

// Turns a pasted video URL into something embeddable. Supports YouTube and Vimeo links (the two
// people paste 99% of the time) by rewriting them to their embed form; anything else — a direct
// .mp4 URL, or a base64 data: URI from the admin upload tool — is treated as a raw video file.
function getVideoEmbed(url) {
  if (!url) return null;
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
  if (yt) return { type: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { type: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}` };
  return { type: "file", src: url };
}

export default function BlogPost() {
  const { slug } = useParams();
  const { content } = useContent();
  const posts = (content.blog && content.blog.posts) || [];
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <section className="px-6 py-32 text-center md:px-12">
        <h1 className="font-display text-3xl">Post not found</h1>
        <Link to="/blog" className="mt-6 inline-block rounded-btn border border-ink/25 px-5 py-2 text-sm hover:border-coral hover:text-coral">
          Back to blog
        </Link>
      </section>
    );
  }

  const video = getVideoEmbed(post.videoUrl);

  return (
    <section className="px-6 py-32 md:px-12">
      <article className="mx-auto max-w-3xl">
        <Reveal>
          <Link to="/blog" className="text-sm text-coral">
            ← Back to blog
          </Link>
          {post.date && (
            <p className="mt-4 text-xs uppercase tracking-wide text-coral">
              {new Date(post.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </p>
          )}
          <h1 className="mt-2 font-display text-4xl md:text-5xl">{post.title}</h1>
          {post.excerpt && <p className="mt-4 text-lg text-ink/75">{post.excerpt}</p>}
        </Reveal>

        {post.coverImage && (
          <Reveal delay={100}>
            <img src={post.coverImage} alt={post.title} className="mt-8 w-full rounded-2xl object-cover" />
          </Reveal>
        )}

        {video && (
          <Reveal delay={150}>
            <div className="mt-8 aspect-video overflow-hidden rounded-2xl">
              {video.type === "iframe" ? (
                <iframe
                  src={video.src}
                  title={post.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={video.src} controls className="h-full w-full" />
              )}
            </div>
          </Reveal>
        )}

        {post.content && (
          <Reveal delay={200}>
            <div className="mt-8 max-w-none text-ink/85">
              {post.content.split(/\n\s*\n/).map((para, i) => (
                <p key={i} className="mt-4 leading-relaxed first:mt-0">
                  {para}
                </p>
              ))}
            </div>
          </Reveal>
        )}
      </article>
    </section>
  );
}
