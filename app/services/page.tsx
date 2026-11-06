import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home, MapPin, Sparkles } from "lucide-react";
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

  const loveServices = published.filter((s) => s.group === "love" && !s.parentId);
  const lifeServices = published.filter((s) => s.group === "life" && !s.parentId);
  const locationPages = published.filter((s) => !!s.parentId);
  const serviceMap = new Map(published.flatMap((s) => [[s.id, s], [s.slug, s]]));

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
      <Header services={published} />
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
                  {loveServices.map((service) => {
                    const serviceLocations = locationPages.filter(
                      (loc) => loc.parentId === service.id || loc.parentId === service.slug
                    );
                    const serviceHref = `/services/${service.slug || slugify(service.title)}`;
                    return (
                      <article className="service-card" key={service.id}>
                        <div className="service-card__img">
                          <Link href={serviceHref}>
                            <img src={service.img} alt={service.title} width={800} height={600} loading="lazy" />
                          </Link>
                        </div>
                        <div className="service-card__body">
                          <span className="service-badge">Love &amp; Marriage</span>
                          <h3>
                            <Link href={serviceHref}>{service.title}</Link>
                          </h3>
                          <p>{service.text}</p>
                          {serviceLocations.length > 0 && (
                            <div className="service-card__loc-tags">
                              <span className="service-card__loc-label">📍 Available in:</span>
                              <div className="service-card__loc-pills">
                                {serviceLocations.map((loc) => (
                                  <Link
                                    key={loc.id}
                                    href={`/services/${loc.slug}`}
                                    className="service-card__loc-pill"
                                  >
                                    {loc.location}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                          <Link href={serviceHref} className="service-card__cta">
                            Read Full Details &amp; Remedies <ArrowRight size={14} aria-hidden="true" />
                          </Link>
                        </div>
                      </article>
                    );
                  })}
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
                  {lifeServices.map((service) => {
                    const serviceLocations = locationPages.filter(
                      (loc) => loc.parentId === service.id || loc.parentId === service.slug
                    );
                    const serviceHref = `/services/${service.slug || slugify(service.title)}`;
                    return (
                      <article className="service-card" key={service.id}>
                        <div className="service-card__img">
                          <Link href={serviceHref}>
                            <img src={service.img} alt={service.title} width={800} height={600} loading="lazy" />
                          </Link>
                        </div>
                        <div className="service-card__body">
                          <span className="service-badge" style={{ background: "rgba(180, 83, 9, 0.15)", color: "#d97706" }}>Family &amp; Career</span>
                          <h3>
                            <Link href={serviceHref}>{service.title}</Link>
                          </h3>
                          <p>{service.text}</p>
                          {serviceLocations.length > 0 && (
                            <div className="service-card__loc-tags">
                              <span className="service-card__loc-label">📍 Available in:</span>
                              <div className="service-card__loc-pills">
                                {serviceLocations.map((loc) => (
                                  <Link
                                    key={loc.id}
                                    href={`/services/${loc.slug}`}
                                    className="service-card__loc-pill"
                                  >
                                    {loc.location}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                          <Link href={serviceHref} className="service-card__cta">
                            Read Full Details &amp; Remedies <ArrowRight size={14} aria-hidden="true" />
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            {locationPages.length > 0 && (
              <div className="service-group" style={{ marginTop: "60px" }}>
                <div className="service-locations-box">
                  <h3>
                    <MapPin size={24} className="gold-text" />
                    Locations &amp; Cities We Serve
                  </h3>
                  <p>
                    Astrologer Kali Charan provides specialized Vedic astrology consultations and Kundli readings across India, USA, UK, Canada, and Australia:
                  </p>
                  <div className="service-locations-grid">
                    {locationPages.map((loc) => {
                      const parent = serviceMap.get(loc.parentId || "");
                      return (
                        <Link
                          href={`/services/${loc.slug}`}
                          key={loc.id}
                          className="service-location-badge"
                        >
                          <div>
                            <div>📍 <strong>{loc.location ? `In ${loc.location}` : loc.title}</strong></div>
                            {parent && (
                              <div style={{ fontSize: "0.78rem", color: "rgba(227, 182, 92, 0.9)", marginTop: "3px" }}>
                                {parent.title}
                              </div>
                            )}
                          </div>
                          <ArrowRight size={13} />
                        </Link>
                      );
                    })}
                  </div>
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

