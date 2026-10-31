import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import CtaBand from "@/components/CtaBand";
import { PHONE, SITE_NAME, TEL } from "@/lib/site";
import { readPublicContent } from "@/lib/admin/content";
import { slugify } from "@/lib/admin/types";

export const metadata: Metadata = {
  title: `Our Astrology Services & Vedic Solutions | ${SITE_NAME}`,
  description:
    "Explore genuine Vedic astrology solutions for love problems, ex love back, love marriage, husband-wife disputes, divorce, child, and business by Astrologer Kali Charan.",
};

const GROUP_LABELS = {
  love: "Love & Marriage",
  life: "Family, Career & Life",
};

export default async function ServicesIndexPage() {
  const { services } = await readPublicContent();
  const published = services.filter((s) => s.visible);

  const loveServices = published.filter((s) => s.group === "love");
  const lifeServices = published.filter((s) => s.group === "life");

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
              <span aria-current="page">Services</span>
            </nav>
            <span className="eyebrow">
              <Sparkles size={14} aria-hidden="true" /> Time-Tested Spiritual Remedies
            </span>
            <h1 className="title">
              Our Astrology <span className="gold-text">Services &amp; Solutions</span>
            </h1>
            <p>
              Over 25 years of mastery in Vedic astrology, Kundli analysis, and spiritual remedies.
              Select any service below to view detailed guidance and connect directly with
              Astrologer Kali Charan.
            </p>
          </div>
        </section>

        <section className="section section--white">
          <div className="container">
            {loveServices.length > 0 && (
              <div className="service-group" style={{ marginBottom: "50px" }}>
                <div className="section-head" style={{ marginBottom: "32px", textAlign: "left" }}>
                  <span className="eyebrow">Relationship Guidance</span>
                  <h2 className="title" style={{ fontSize: "1.8rem" }}>Love &amp; Marriage Services</h2>
                </div>
                <div className="card-grid">
                  {loveServices.map((service) => (
                    <article className="service-card" key={service.id}>
                      <Link href={`/services/${service.slug || slugify(service.title)}`} className="service-card__wrapper-link">
                        <div className="service-card__img">
                          <img src={service.img} alt={service.title} width={800} height={600} loading="lazy" />
                        </div>
                        <div className="service-card__body">
                          <span className="service-badge">Love &amp; Marriage</span>
                          <h3>{service.title}</h3>
                          <p>{service.text}</p>
                          <span className="service-card__cta">
                            Read Full Details &amp; Remedies <ArrowRight size={14} aria-hidden="true" />
                          </span>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {lifeServices.length > 0 && (
              <div className="service-group">
                <div className="section-head" style={{ marginBottom: "32px", textAlign: "left" }}>
                  <span className="eyebrow">Life &amp; Future Guidance</span>
                  <h2 className="title" style={{ fontSize: "1.8rem" }}>Family, Career &amp; Life Solutions</h2>
                </div>
                <div className="card-grid">
                  {lifeServices.map((service) => (
                    <article className="service-card" key={service.id}>
                      <Link href={`/services/${service.slug || slugify(service.title)}`} className="service-card__wrapper-link">
                        <div className="service-card__img">
                          <img src={service.img} alt={service.title} width={800} height={600} loading="lazy" />
                        </div>
                        <div className="service-card__body">
                          <span className="service-badge" style={{ background: "rgba(180, 83, 9, 0.15)", color: "#d97706" }}>Family &amp; Career</span>
                          <h3>{service.title}</h3>
                          <p>{service.text}</p>
                          <span className="service-card__cta">
                            Read Full Details &amp; Remedies <ArrowRight size={14} aria-hidden="true" />
                          </span>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <CtaBand />
      <Footer />
      <FloatingActions />
    </>
  );
}

