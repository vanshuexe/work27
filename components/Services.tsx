import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ManagedService } from "@/lib/admin/types";
import { slugify } from "@/lib/admin/types";

function ServiceCard({ service }: { service: ManagedService }) {
  const href = `/services/${service.slug || slugify(service.title)}`;
  return (
    <article className="service-card">
      <Link href={href} className="service-card__wrapper-link">
        <div className="service-card__img">
          <img src={service.img} alt={service.title} width={800} height={600} loading="lazy" />
        </div>
        <div className="service-card__body">
          <h3>{service.title}</h3>
          <p>{service.text}</p>
          <span className="service-card__cta">
            View Details &amp; Remedies <ArrowRight size={14} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}

export default function Services({ services }: { services: ManagedService[] }) {
  const groups = [
    { title: "Love & Marriage", services: services.filter(s => s.group === "love" && s.visible) },
    { title: "Family, Career & Life", services: services.filter(s => s.group === "life" && s.visible) },
  ].filter(group => group.services.length > 0);
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
        {groups.map((group) => (
          <div className="service-group" key={group.title}>
            <h3 className="service-group__title">{group.title}</h3>
            <div className="card-grid">
              {group.services.map((service) => (
                <ServiceCard service={service} key={service.id} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
