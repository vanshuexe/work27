"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export type FaqItem = {
  q: string;
  a: string;
};

export function getServiceFaqs(serviceTitle: string): FaqItem[] {
  const cleanTitle = serviceTitle.replace(/\s+Astrologer$/i, "");
  return [
    {
      q: `How does Astrologer Kali Charan solve ${cleanTitle} problems?`,
      a: `Astrologer Kali Charan analyzes both partners' birth charts (Kundli) to identify root planetary doshas affecting the 5th house of romance and the 7th house of marriage. He then prescribes personalized, energized Vedic remedies, Shukra/Kamdev mantras, and planetary shanti pujas to resolve the conflict permanently.`,
    },
    {
      q: `How long does it take to see positive results?`,
      a: `Most clients experience visible positive shifts, reduced hostility, and rekindled emotional warmth within 24 to 72 hours of completing the suggested spiritual remedies, depending on the severity of planetary transits.`,
    },
    {
      q: `Can this astrological consultation be done online or on phone?`,
      a: `Yes. More than 70% of our clients consult from across India, the US, UK, Canada, and Australia via direct phone calls and WhatsApp. Astrological energy and energized yantras work with full potency regardless of distance.`,
    },
    {
      q: `Are the remedies and mantras 100% safe with no negative effects?`,
      a: `Yes, completely safe. Astrologer Kali Charan practices strictly pure, sattvic Vedic astrology rooted in ancient scriptures. There are zero harmful rituals or negative karma involved.`,
    },
    {
      q: `What details do I need to provide for the reading?`,
      a: `You only need to provide your name, date of birth, time, and place of birth. If birth time is not known, palm analysis or partner details can also be utilized for an accurate horoscope reading.`,
    },
  ];
}

export default function ServiceFaq({
  title,
  faqs,
}: {
  title: string;
  faqs?: FaqItem[];
}) {
  const items = faqs && faqs.length > 0 ? faqs : getServiceFaqs(title);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="service-faq-wrap" aria-label="Frequently Asked Questions">
      <div className="service-section-heading">
        <span className="eyebrow">
          <HelpCircle size={14} /> Clear Answers
        </span>
        <h2>Frequently Asked Questions About {title}</h2>
        <p>Find straightforward answers to common questions about our Vedic astrology consultation and remedies.</p>
      </div>

      <div className="service-faq-list">
        {items.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div className={`service-faq-item ${isOpen ? "is-open" : ""}`} key={faq.q}>
              <button
                type="button"
                className="service-faq-question"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span>{faq.q}</span>
                <ChevronDown size={18} className={`service-faq-chevron ${isOpen ? "is-open" : ""}`} />
              </button>
              {isOpen && (
                <div className="service-faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

