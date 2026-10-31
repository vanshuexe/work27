import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Home,
  Lock,
  Phone,
  Sparkles,
  Users,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import CtaBand from "@/components/CtaBand";
import { CallButton, WhatsAppButton } from "@/components/ContactButtons";
import { PHONE, SITE_NAME, SITE_URL, TEL, WHATSAPP } from "@/lib/site";
import { readPublicContent } from "@/lib/admin/content";
import { slugify } from "@/lib/admin/types";

const GROUP_LABELS = {
  love: "Love & Marriage",
  life: "Family, Career & Life",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { services } = await readPublicContent();
  const service = services.find(
    (s) => s.visible && (s.slug === slug || slugify(s.title) === slug)
  );

  if (!service) {
    return { title: `Service Not Found | ${SITE_NAME}` };
  }

  const url = `${SITE_URL}/services/${service.slug}`;
  const imgUrl = service.img.startsWith("http")
    ? service.img
    : `${SITE_URL}${service.img}`;

  return {
    title: `${service.title} Specialist | Astrologer Kali Charan`,
    description: `${service.text} Get 100% genuine Vedic astrology solutions and remedies from Astrologer Kali Charan. Call/WhatsApp ${PHONE}.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${service.title} | ${SITE_NAME}`,
      description: service.text,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: imgUrl, width: 1000, height: 750, alt: service.title }],
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
        <h3 key={idx} className="service-detail__h3">
          {trimmed.replace(/^###\s+/, "")}
        </h3>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={idx} className="service-detail__h2">
          {trimmed.replace(/^##\s+/, "")}
        </h2>
      );
    }

    const lines = trimmed.split("\n");
    const isBulletList = lines.every((line) => line.trim().startsWith("- ") || line.trim().startsWith("* "));
    if (isBulletList) {
      return (
        <ul key={idx} className="service-detail__list">
          {lines.map((line, lIdx) => (
            <li key={lIdx}>{formatInline(line.trim().replace(/^[-*]\s+/, ""))}</li>
          ))}
        </ul>
      );
    }

    const isNumberedList = lines.every((line) => /^\d+\.\s+/.test(line.trim()));
    if (isNumberedList) {
      return (
        <ol key={idx} className="service-detail__ol">
          {lines.map((line, lIdx) => (
            <li key={lIdx}>{formatInline(line.trim().replace(/^\d+\.\s+/, ""))}</li>
          ))}
        </ol>
      );
    }

    return (
      <p key={idx} className="service-detail__p">
        {formatInline(trimmed)}
      </p>
    );
  });
}

function formatInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, pIdx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { services } = await readPublicContent();
  const service = services.find(
    (s) => s.visible && (s.slug === slug || slugify(s.title) === slug)
  );

  if (!service) {
    notFound();
  }

  const otherServices = services
    .filter((s) => s.visible && s.id !== service.id)
    .slice(0, 6);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE_URL}/services/${service.slug}#service`,
        name: service.title,
        description: service.text,
        provider: {
          "@type": "Person",
          name: "Astrologer Kali Charan",
          url: `${SITE_URL}/`,
          telephone: PHONE,
        },
        areaServed: [
          { "@type": "Country", name: "India" },
          { "@type": "Country", name: "United Kingdom" },
          { "@type": "Country", name: "United States" },
          { "@type": "Country", name: "Canada" },
          { "@type": "Country", name: "Australia" },
        ],
        serviceType: service.title,
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          price: "0",
          priceCurrency: "INR",
          description: "Initial astrological telephonic consultation",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `${SITE_URL}/services`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: `${SITE_URL}/services/${service.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
        <article className="service-detail">
          <header className="service-detail-hero section--dark">
            <div className="container">
              <nav className="breadcrumbs" aria-label="Breadcrumbs">
                <Link href="/">
                  <Home size={14} aria-hidden="true" /> Home
                </Link>
                <span className="sep">/</span>
                <Link href="/services">Services</Link>
                <span className="sep">/</span>
                <span aria-current="page">{service.title}</span>
              </nav>

              <span className="eyebrow">
                <Sparkles size={14} aria-hidden="true" />
                {GROUP_LABELS[service.group]} Solution
              </span>
              <h1 className="service-detail-hero__title">
                {service.title}
              </h1>
              <p className="service-detail-hero__lead">{service.text}</p>

              <div className="btn-row" style={{ marginTop: "24px" }}>
                <CallButton label={`Call Now (${PHONE})`} />
                <WhatsAppButton label="Consult on WhatsApp" />
              </div>
            </div>
          </header>

          <div className="container service-detail__body-container">
            <div className="service-detail__main">
              <div className="service-detail__featured-image">
                <img
                  src={service.img}
                  alt={service.title}
                  width={1000}
                  height={750}
                  loading="eager"
                  fetchPriority="high"
                />
              </div>

              <div className="service-detail__content">
                {renderContent(service.content || service.text)}

                <div className="service-trust-grid">
                  <div className="service-trust-card">
                    <Clock size={24} className="gold-text" />
                    <h4>Fast Spiritual Guidance</h4>
                    <p>Accurate horoscope readings and clear remedies within 3 to 24 hours.</p>
                  </div>
                  <div className="service-trust-card">
                    <Lock size={24} className="gold-text" />
                    <h4>100% Confidentiality</h4>
                    <p>Your relationship, family matters, and personal data remain completely private.</p>
                  </div>
                  <div className="service-trust-card">
                    <Users size={24} className="gold-text" />
                    <h4>98,000+ Happy Clients</h4>
                    <p>Serving satisfied clients across India, UK, USA, Canada, and worldwide.</p>
                  </div>
                </div>

                <div className="blog-consult-box">
                  <div className="blog-consult-box__icon">
                    <Phone size={28} />
                  </div>
                  <div className="blog-consult-box__text">
                    <h3>Talk Directly With Astrologer Kali Charan</h3>
                    <p>
                      Don't let misunderstandings or planetary doshas damage your happiness. Speak
                      directly with Astrologer Kali Charan today on Call or WhatsApp for personalized
                      Kundli analysis and proven Vedic remedies.
                    </p>
                    <div className="blog-consult-box__buttons">
                      <CallButton label={`Call Now (${PHONE})`} />
                      <WhatsAppButton label="Chat on WhatsApp" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="service-detail__sidebar">
              <div className="service-sidebar-card">
                <h3>Direct Astrological Consultation</h3>
                <p>
                  Speak with India's celebrated Vedic Astrologer Kali Charan for an instant, accurate
                  reading.
                </p>
                <div className="service-sidebar-card__buttons">
                  <CallButton label="Call Now" />
                  <WhatsAppButton label="WhatsApp Us" />
                </div>
                <ul className="service-sidebar-card__features">
                  <li><CheckCircle2 size={16} /> 25+ Years Vedic Experience</li>
                  <li><CheckCircle2 size={16} /> 100% Safe &amp; Pure Vidhi</li>
                  <li><CheckCircle2 size={16} /> Complete Privacy Guaranteed</li>
                </ul>
              </div>

              {otherServices.length > 0 && (
                <div className="service-sidebar-nav">
                  <h3>Other Services</h3>
                  <ul>
                    {otherServices.map((other) => (
                      <li key={other.id}>
                        <Link href={`/services/${other.slug || slugify(other.title)}`}>
                          <span>{other.title}</span>
                          <ArrowRight size={14} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="service-sidebar-back">
                <Link href="/services" className="btn btn--outline" style={{ width: "100%", justifyContent: "center" }}>
                  <ArrowLeft size={16} /> View All Services
                </Link>
              </div>
            </aside>
          </div>
        </article>
      </main>
      <CtaBand />
      <Footer />
      <FloatingActions />
    </>
  );
}

