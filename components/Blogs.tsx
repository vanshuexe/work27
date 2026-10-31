import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { ManagedBlog } from "@/lib/admin/types";

export default function Blogs({ blogs }: { blogs: ManagedBlog[] }) {
  if (!blogs || blogs.length === 0) return null;

  return (
    <section className="section" id="blogs">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Vedic Astrology Insights</span>
          <h2 className="title">
            Latest Articles &amp; <span className="gold-text">Astrological Guidance</span>
          </h2>
          <p>
            Explore expert insights, spiritual remedies, and relationship advice by Astrologer Kali
            Charan to bring harmony, love, and success into your life.
          </p>
        </div>

        <div className="card-grid">
          {blogs.slice(0, 6).map((blog) => (
            <article className="blog-card" key={blog.id}>
              <div className="blog-card__img">
                <Link href={`/blog/${blog.slug}`} tabIndex={-1} aria-hidden="true">
                  <img src={blog.img} alt={blog.title} width={800} height={500} loading="lazy" />
                </Link>
                <span className="blog-badge">{blog.category}</span>
              </div>
              <div className="blog-card__body">
                <div className="blog-card__meta">
                  <span>
                    <Calendar size={13} aria-hidden="true" />
                    <time dateTime={blog.date}>
                      {new Date(blog.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </span>
                  <span>
                    <Clock size={13} aria-hidden="true" />
                    {blog.readTime}
                  </span>
                </div>
                <h3>
                  <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                </h3>
                <p>{blog.excerpt}</p>
                <Link className="blog-card__link" href={`/blog/${blog.slug}`}>
                  Read Full Article <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {blogs.length > 3 && (
          <div className="blogs__more">
            <Link href="/blog" className="btn btn--gold">
              View All Blog Articles
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

