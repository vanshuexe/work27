import { Clock, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "./ContactButtons";
import { FOOTER_WHY_US, LIFE_SERVICES, LOVE_SERVICES, NAV, PHONE, SITE_NAME, TEL, WHATSAPP } from "@/lib/site";
import { slugify } from "@/lib/admin/types";

const SERVICE_LINKS = [...LOVE_SERVICES, ...LIFE_SERVICES].slice(0, 6);

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src="/assets/img/logo-kali-charan.webp" alt={SITE_NAME} width={96} height={96} loading="lazy" />
          <p lang="hi">
            समस्या कैसी भी हो घबराएं नहीं, तुरंत हमसे संपर्क करें और समाधान पाएं! रूठे प्रेमी प्रेमिका को मनाना, पति
            पत्नी में अनबन, मनचाहा खोया प्यार, पारिवारिक समस्या, माता पिता को शादी के लिए राज़ी करना — सभी
            समस्याओं का हल सिर्फ एक फ़ोन कॉल।
          </p>
        </div>
        <div>
          <h3>Quick Links</h3>
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
            <li>
              <a href="#how-it-works">How It Works</a>
            </li>
          </ul>
        </div>
        <div>
          <h3>Our Services</h3>
          <ul>
            {SERVICE_LINKS.map((s) => (
              <li key={s.title}>
                <a href={`/services/${slugify(s.title)}`}>{s.title}</a>
              </li>
            ))}
            <li>
              <a href="/services" style={{ color: "var(--accent)", fontWeight: 600 }}>
                All Services & Remedies →
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3>Contact</h3>
          <ul className="footer__contact">
            <li>
              <Phone size={17} aria-hidden="true" />
              <a href={TEL}>{PHONE}</a>
            </li>
            <li>
              <WhatsAppIcon size={17} />
              <a href={WHATSAPP} target="_blank" rel="noreferrer">
                Chat on WhatsApp
              </a>
            </li>
            <li>
              <Clock size={17} aria-hidden="true" />
              <span>Available 24/7</span>
            </li>
            <li>
              <MapPin size={17} aria-hidden="true" />
              <span>Online consultation worldwide</span>
            </li>
          </ul>
          <h3 className="footer__subhead">Why Us</h3>
          <ul>
            {FOOTER_WHY_US.slice(0, 3).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container">© 2026 {SITE_NAME}. All rights reserved.</div>
      </div>
    </footer>
  );
}
