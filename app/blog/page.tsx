import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Home } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import CtaBand from "@/components/CtaBand";
import { PHONE, SEO_TITLE, SITE_NAME, TEL } from "@/lib/site";
import { readPublicBlogContent } from "@/lib/admin/content";

export const metadata: Metadata = {
  title: `Astrology Blog & Articles | ${SITE_NAME}`,
  description:
    "Read genuine astrological insights, relationship remedies, love marriage advice, and Vedic solutions by Astrologer Kali Charan.",
};

export default async function BlogIndexPage() {
  const { blogs } = await readPublicBlogContent();
  const published = blogs.filter((b) => b.visible);

  return (
    <>
      <div className="announce">
        <strong>Trusted by 98K+ clients</strong>
        <span className="sep hide-sm">•</span>
        <span className="hide-sm">100% privacy</span>
        <span className="sep">•</span>
        <a href={TEL}>
          Call <strong>{PHONE}</strong>
        </a>
      </div>
      <Header />
      <main id="main">
        <section className="section section--dark blog-page-hero">
          <div className="container">
            <nav className="breadcrumbs" aria-label="Breadcrumbs">
              <Link href="/">
                <Home size={14} aria-hidden="true" /> Home
              </Link>
              <span className="sep">/</span>
              <span aria-current="page">Blog</span>
            </nav>
            <span className="eyebrow">Astrology Insights &amp; Guidance</span>
            <h1 className="title">
              Articles &amp; <span className="gold-text">Vedic Solutions</span>
            </h1>
            <p>
              In-depth articles by Astrologer Kali Charan to help you understand relationship dynamics,
              kundli influences, and time-tested spiritual remedies.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="card-grid">
              {published.map((blog) => (
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

            {published.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <h3>No articles published yet</h3>
                <p style={{ color: "var(--ink-muted)", marginTop: "8px" }}>
                  Please check back soon for astrological insights and guidance.
                </p>
              </div>
            )}
          </div>
        </section>

        <CtaBand />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}

