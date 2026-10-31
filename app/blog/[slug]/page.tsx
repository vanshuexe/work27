import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock, Home, Phone, Share2, Tag, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import CtaBand from "@/components/CtaBand";
import { CallButton, WhatsAppButton } from "@/components/ContactButtons";
import { PHONE, SITE_NAME, SITE_URL, TEL, WHATSAPP } from "@/lib/site";
import { readPublicBlogContent } from "@/lib/admin/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { blogs } = await readPublicBlogContent();
  const blog = blogs.find((b) => b.slug === slug && b.visible);

  if (!blog) {
    return { title: `Article Not Found | ${SITE_NAME}` };
  }

  const url = `${SITE_URL}/blog/${blog.slug}`;
  const imgUrl = blog.img.startsWith("http") ? blog.img : `${SITE_URL}${blog.img}`;

  return {
    title: `${blog.title} | ${SITE_NAME}`,
    description: blog.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: blog.date,
      authors: [blog.author],
      images: [{ url: imgUrl, width: 1200, height: 800, alt: blog.title }],
    },
  };
}

function renderContent(raw: string) {
  const paragraphs = raw.split(/\n\s*\n/);
  return paragraphs.map((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={idx} className="blog-post__h3">
          {trimmed.replace(/^###\s+/, "")}
        </h3>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={idx} className="blog-post__h2">
          {trimmed.replace(/^##\s+/, "")}
        </h2>
      );
    }

    // List items
    if (trimmed.split("\n").every((line) => line.trim().startsWith("- ") || line.trim().startsWith("* "))) {
      const items = trimmed.split("\n").map((line) => line.trim().replace(/^[-*]\s+/, ""));
      return (
        <ul key={idx} className="blog-post__list">
          {items.map((item, itemIdx) => {
            // Check for bold prefix e.g. **Heading:** text
            const boldMatch = item.match(/^\*\*(.+?)\*\*(.*)$/);
            if (boldMatch) {
              return (
                <li key={itemIdx}>
                  <strong>{boldMatch[1]}</strong>
                  {boldMatch[2]}
                </li>
              );
            }
            return <li key={itemIdx}>{item}</li>;
          })}
        </ul>
      );
    }

    // Numbered list
    if (trimmed.split("\n").every((line) => /^\d+\.\s+/.test(line.trim()))) {
      const items = trimmed.split("\n").map((line) => line.trim().replace(/^\d+\.\s+/, ""));
      return (
        <ol key={idx} className="blog-post__list">
          {items.map((item, itemIdx) => {
            const boldMatch = item.match(/^\*\*(.+?)\*\*(.*)$/);
            if (boldMatch) {
              return (
                <li key={itemIdx}>
                  <strong>{boldMatch[1]}</strong>
                  {boldMatch[2]}
                </li>
              );
            }
            return <li key={itemIdx}>{item}</li>;
          })}
        </ol>
      );
    }

    return (
      <p key={idx} className="blog-post__p">
        {trimmed}
      </p>
    );
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { blogs } = await readPublicBlogContent();
  const blog = blogs.find((b) => b.slug === slug && b.visible);

  if (!blog) notFound();

  const related = blogs.filter((b) => b.visible && b.id !== blog.id).slice(0, 3);
  const articleUrl = `${SITE_URL}/blog/${blog.slug}`;
  const imgUrl = blog.img.startsWith("http") ? blog.img : `${SITE_URL}${blog.img}`;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: [imgUrl],
    datePublished: blog.date,
    dateModified: blog.date,
    author: {
      "@type": "Person",
      name: blog.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/assets/img/logo-kali-charan.webp`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
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
        <article className="blog-detail">
          <header className="blog-detail-hero section--dark">
            <div className="container">
              <nav className="breadcrumbs" aria-label="Breadcrumbs">
                <Link href="/">
                  <Home size={14} aria-hidden="true" /> Home
                </Link>
                <span className="sep">/</span>
                <Link href="/blog">Blog</Link>
                <span className="sep">/</span>
                <span aria-current="page">{blog.category}</span>
              </nav>

              <span className="blog-badge blog-badge--lg">{blog.category}</span>
              <h1 className="blog-detail__title">{blog.title}</h1>

              <div className="blog-detail__meta">
                <span>
                  <User size={15} aria-hidden="true" /> {blog.author}
                </span>
                <span>
                  <Calendar size={15} aria-hidden="true" />
                  <time dateTime={blog.date}>
                    {new Date(blog.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </span>
                <span>
                  <Clock size={15} aria-hidden="true" /> {blog.readTime}
                </span>
              </div>
            </div>
          </header>

          <div className="container blog-detail__body-container">
            <div className="blog-detail__featured-image">
              <img src={blog.img} alt={blog.title} width={1200} height={700} loading="eager" fetchPriority="high" />
            </div>

            <div className="blog-detail__content">
              {renderContent(blog.content)}

              <div className="blog-consult-box">
                <div className="blog-consult-box__icon">
                  <Phone size={28} />
                </div>
                <div className="blog-consult-box__text">
                  <h3>Get Personal Guidance From Astrologer Kali Charan</h3>
                  <p>
                    Every birth chart is unique. Speak directly with Astrologer Kali Charan today on
                    Call or WhatsApp for accurate predictions, personalized dosha analysis, and
                    effective Vedic remedies.
                  </p>
                  <div className="blog-consult-box__buttons">
                    <CallButton label={`Call Now (${PHONE})`} />
                    <WhatsAppButton label="Chat on WhatsApp" />
                  </div>
                </div>
              </div>
            </div>

            <div className="blog-detail__footer">
              <Link href="/blog" className="btn btn--outline">
                <ArrowLeft size={16} aria-hidden="true" /> Back to All Articles
              </Link>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="section section--white related-blogs">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">Continue Reading</span>
                <h2 className="title">Related Astrology Articles</h2>
              </div>
              <div className="card-grid">
                {related.map((item) => (
                  <article className="blog-card" key={item.id}>
                    <div className="blog-card__img">
                      <Link href={`/blog/${item.slug}`} tabIndex={-1} aria-hidden="true">
                        <img src={item.img} alt={item.title} width={800} height={500} loading="lazy" />
                      </Link>
                      <span className="blog-badge">{item.category}</span>
                    </div>
                    <div className="blog-card__body">
                      <div className="blog-card__meta">
                        <span>
                          <Calendar size={13} aria-hidden="true" />
                          <time dateTime={item.date}>
                            {new Date(item.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </time>
                        </span>
                        <span>
                          <Clock size={13} aria-hidden="true" />
                          {item.readTime}
                        </span>
                      </div>
                      <h3>
                        <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                      </h3>
                      <p>{item.excerpt}</p>
                      <Link className="blog-card__link" href={`/blog/${item.slug}`}>
                        Read Article <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <CtaBand />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
