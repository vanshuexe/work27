import { Clock, Lock, Sparkles, Users } from "lucide-react";
import { CallButton, WhatsAppButton } from "./ContactButtons";
import { HERO_POINTS, IMG_ALT } from "@/lib/site";

const POINT_ICONS = { clock: Clock, users: Users, lock: Lock };

export default function Hero() {
  return (
    <section className="hero section--dark" id="top">
      <div className="container hero__grid">
        <div className="hero__text">
          <span className="hero__badge">
            <Sparkles size={15} aria-hidden="true" />
            Famous Indian Astrologer
          </span>
          <h1>
            Astrologer <span className="gold-text">Kali Charan</span>
          </h1>
          <p className="hero__lead">
            Love back, love marriage, husband–wife and family problem solutions through Vedic
            astrology, with complete privacy. Talk to us today and get guidance within 3 hours.
          </p>
          <div className="btn-row">
            <CallButton label="Call Now" />
            <WhatsAppButton label="Chat on WhatsApp" />
          </div>
          <ul className="hero__points">
            {HERO_POINTS.map(({ icon, label }) => {
              const Icon = POINT_ICONS[icon];
              return (
                <li key={label}>
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="hero__visual">
          <span className="hero__ring" aria-hidden="true" />
          <span className="hero__ring hero__ring--inner" aria-hidden="true" />
          <img src="/assets/img/logo-kali-charan.webp" alt={IMG_ALT} width={420} height={420} />
        </div>
      </div>
    </section>
  );
}
