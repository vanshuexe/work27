import {
  FAQS,
  SEO_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  WHATSAPP,
} from "@/lib/site";
import type { ManagedService } from "@/lib/admin/types";

// schema.org data for search engines. No ratings or reviews are marked up: Google only
// accepts those when they come from a verifiable review system.
export default function StructuredData({ services }: { services: ManagedService[] }) {
  const logo = `${SITE_URL}/assets/img/logo-kali-charan.webp`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        inLanguage: "en-IN",
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#business`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        image: logo,
        logo,
        description: SEO_DESCRIPTION,
        telephone: "+919649331806",
        areaServed: [{ "@type": "Country", name: "India" }, "Worldwide"],
        availableLanguage: ["English", "Hindi"],
        openingHours: "Mo-Su 00:00-23:59",
        sameAs: [WHATSAPP],
        knowsAbout: ["Vedic astrology", "Love problem solution", "Love marriage", "Kundli reading"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Astrology Services",
          itemListElement: services.filter(s => s.visible).map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.title, description: s.text },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so the JSON can never close the script tag early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
