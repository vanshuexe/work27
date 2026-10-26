import { ArrowRight, Phone } from "lucide-react";
import { LIFE_SERVICES, LOVE_SERVICES, PHONE, TEL, WHATSAPP, type Service } from "@/lib/site";

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="service-card">
      <div className="service-card__img">
        <img src={service.img} alt="" width={800} height={600} loading="lazy" />
      </div>
      <div className="service-card__body">
        <h3>{service.title}</h3>
        <p>{service.text}</p>
        <div className="service-card__actions">
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="link-arrow">
            Ask on WhatsApp
            <ArrowRight size={17} aria-hidden="true" />
          </a>
          <a href={TEL} className="round-call" aria-label={`Call ${PHONE} about ${service.title}`}>
            <Phone size={18} />
          </a>
        </div>
      </div>
    </article>
  );
}

const GROUPS = [
  { title: "Love & Marriage", services: LOVE_SERVICES },
  { title: "Family, Career & Life", services: LIFE_SERVICES },
];

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Our Services</span>
          <h2 className="title">Astrology Based Solutions</h2>
          <p>
            Trusted by 98K+ clients. Whatever the problem, there is a remedy — choose your concern
            and talk to us directly.
          </p>
        </div>
        {GROUPS.map((group) => (
          <div className="service-group" key={group.title}>
            <h3 className="service-group__title">{group.title}</h3>
            <div className="card-grid">
              {group.services.map((service) => (
                <ServiceCard service={service} key={service.title} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
