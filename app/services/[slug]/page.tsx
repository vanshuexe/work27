import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Home,
  Lock,
  MapPin,
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
import ServiceWhyUs from "@/components/ServiceWhyUs";
import ServiceFaq from "@/components/ServiceFaq";

const GROUP_LABELS = {
  love: "Love & Marriage",
  life: "Family, Career & Life",
};

function normalizeSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/-(astrologer|solution|specialist)$/g, "")
    .replace(/^get-your-(ex-)?love-back$/, "love-back")
    .replace(/^inter-?caste(-marriage)?(-problem)?$/, "inter-caste-marriage")
    .replace(/^powerful-black-magic$/, "black-magic")
    .replace(/^husband-wife(-problem)?$/, "husband-wife")
    .replace(/^divorce(-problem)?$/, "divorce");
}

function findMatchingService<T extends { slug: string; title: string; visible: boolean }>(
  services: T[],
  slug: string
): T | undefined {
  return services.find(
    (s) =>
      s.visible &&
      (s.slug === slug ||
        slugify(s.title) === slug ||
        normalizeSlug(s.slug) === normalizeSlug(slug) ||
        normalizeSlug(slugify(s.title)) === normalizeSlug(slug))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { services } = await readPublicContent();
  const service = findMatchingService(services, slug);

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

/* ── helpers ─────────────────────────────────────────────────── */
type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function parseBlocks(raw: string): Block[] {
  const blocks: Block[] = [];
  const paras = raw.split(/\n\s*\n/);

  for (const para of paras) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "h2", text: trimmed.replace(/^##\s+/, "") });
      continue;
    }
    if (trimmed.startsWith("### ")) {
      blocks.push({ type: "h3", text: trimmed.replace(/^###\s+/, "") });
      continue;
    }

    const lines = trimmed.split("\n");
    const isBullet = lines.every((l) => /^[-*]\s+/.test(l.trim()));
    if (isBullet) {
      blocks.push({ type: "ul", items: lines.map((l) => l.trim().replace(/^[-*]\s+/, "")) });
      continue;
    }
    const isOrdered = lines.every((l) => /^\d+\.\s+/.test(l.trim()));
    if (isOrdered) {
      blocks.push({ type: "ol", items: lines.map((l) => l.trim().replace(/^\d+\.\s+/, "")) });
      continue;
    }
    blocks.push({ type: "p", text: trimmed });
  }
  return blocks;
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

function renderBlocks(raw: string) {
  const blocks = parseBlocks(raw);
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    // First paragraph = lead intro with left border highlight
    if (block.type === "p" && i === 0) {
      elements.push(
        <p key={i} className="sdc__lead-para">
          {formatInline(block.text)}
        </p>
      );
      i++;
      continue;
    }

    // h3 heading — group with the immediately following bullet/ordered list as a styled section card
    if (block.type === "h3") {
      const nextBlock = blocks[i + 1];
      const hasListNext = nextBlock && (nextBlock.type === "ul" || nextBlock.type === "ol");

      if (hasListNext) {
        const listBlock = blocks[i + 1] as { type: "ul" | "ol"; items: string[] };
        const isOrdered = listBlock.type === "ol";
        elements.push(
          <div key={i} className="sdc__section-card">
            <h3 className="sdc__section-title">{block.text}</h3>
            {isOrdered ? (
              <ol className="sdc__ol">
                {listBlock.items.map((item, lIdx) => (
                  <li key={lIdx}>
                    <span className="sdc__ol-num">{lIdx + 1}</span>
                    <span>{formatInline(item)}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul className="sdc__ul">
                {listBlock.items.map((item, lIdx) => (
                  <li key={lIdx}>{formatInline(item)}</li>
                ))}
              </ul>
            )}
          </div>
        );
        i += 2;
        continue;
      }

      // h3 without a list after it
      elements.push(
        <h3 key={i} className="sdc__h3">{block.text}</h3>
      );
      i++;
      continue;
    }

    // h2 heading
    if (block.type === "h2") {
      elements.push(
        <h2 key={i} className="sdc__h2">{block.text}</h2>
      );
      i++;
      continue;
    }

    // Standalone bullet list
    if (block.type === "ul") {
      elements.push(
        <ul key={i} className="sdc__ul sdc__ul--standalone">
          {block.items.map((item, lIdx) => (
            <li key={lIdx}>{formatInline(item)}</li>
          ))}
        </ul>
      );
      i++;
      continue;
    }

    // Standalone ordered list
    if (block.type === "ol") {
      elements.push(
        <ol key={i} className="sdc__ol sdc__ol--standalone">
          {block.items.map((item, lIdx) => (
            <li key={lIdx}>
              <span className="sdc__ol-num">{lIdx + 1}</span>
              <span>{formatInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="sdc__para">
        {formatInline(block.text)}
      </p>
    );
    i++;
  }

  return elements;
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { services } = await readPublicContent();
  const service = findMatchingService(services, slug);

  if (!service) {
    notFound();
  }

  const isLocationPage = !!service.parentId;
  const parentService = isLocationPage
    ? services.find((s) => s.id === service.parentId || s.slug === service.parentId)
    : null;

  const targetParentId = isLocationPage ? service.parentId : service.id;
  const locationPages = services.filter(
    (s) => s.visible && (s.parentId === targetParentId || s.parentId === service.slug)
  );

  const otherServices = services
    .filter((s) => s.visible && !s.parentId && s.id !== service.id && s.id !== service.parentId)
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
      <Header services={services.filter((s) => s.visible)} />
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
                {parentService && (
                  <>
                    <span className="sep">/</span>
                    <Link href={`/services/${parentService.slug}`}>{parentService.title}</Link>
                  </>
                )}
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

              <div className="service-detail__content sdc">
                {renderBlocks(service.content || service.text)}

                <ServiceWhyUs serviceTitle={service.title} />

                <ServiceFaq title={service.title} />

                {locationPages.length > 0 && (
                  <div className="service-locations-box">
                    <h3>
                      <MapPin size={22} className="gold-text" />
                      {isLocationPage
                        ? `Other Locations for ${parentService?.title || "This Service"}`
                        : `Locations & Cities We Serve for ${service.title}`}
                    </h3>
                    <p>
                      Astrologer Kali Charan provides trusted Vedic astrology solutions, Kundli Milan, and spiritual remedies for clients across:
                    </p>
                    <div className="service-locations-grid">
                      {locationPages.map((loc) => (
                        <Link
                          href={`/services/${loc.slug}`}
                          key={loc.id}
                          className={`service-location-badge ${loc.id === service.id ? "is-active" : ""}`}
                        >
                          <span>📍 <strong>{loc.location ? `In ${loc.location}` : loc.title}</strong></span>
                          <ArrowRight size={13} />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <aside className="service-detail__sidebar">
              <div className="service-sidebar-card">
                <h3>Direct Astrological Consultation</h3>
                <p>
                  Speak with India's celebrated Vedic Astrologer Kali Charan for an instant, accurate
                  reading.
                </p>
                <ul className="service-sidebar-card__features">
                  <li><CheckCircle2 size={16} /> 25+ Years Vedic Experience</li>
                  <li><CheckCircle2 size={16} /> 100% Safe &amp; Pure Vidhi</li>
                  <li><CheckCircle2 size={16} /> Complete Privacy Guaranteed</li>
                </ul>
              </div>

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

