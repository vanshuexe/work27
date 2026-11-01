import { Award, Clock, HeartHandshake, Lock, ShieldCheck, Users } from "lucide-react";

const WHY_US_ITEMS = [
  {
    icon: Award,
    title: "25+ Years of Vedic Mastery",
    desc: "Over two decades of accurate Kundli reading, planetary transit analysis, and authentic Vedic astrology.",
  },
  {
    icon: Lock,
    title: "100% Confidential & Private",
    desc: "Your personal details, love life, and family situations remain completely private and secure.",
  },
  {
    icon: Clock,
    title: "Fast & Visible Results",
    desc: "Effective Vedic rituals and energized mantras formulated to show positive influence within 24–72 hours.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Pure Sattvic Vidhi",
    desc: "Only positive, divine Vedic pujas and Kamdev/Shukra mantras with zero negative side-effects.",
  },
  {
    icon: Users,
    title: "98,000+ Satisfied Clients",
    desc: "Trusted by individuals and couples across India, USA, UK, Canada, Australia, and worldwide.",
  },
  {
    icon: HeartHandshake,
    title: "Direct Astrologer Consultation",
    desc: "Speak directly with Astrologer Kali Charan one-on-one for personalized, compassionate guidance.",
  },
];

export default function ServiceWhyUs({ serviceTitle }: { serviceTitle: string }) {
  return (
    <section className="service-why-us" aria-label="Why Choose Astrologer Kali Charan">
      <div className="service-section-heading">
        <span className="eyebrow">
          <ShieldCheck size={14} /> Trusted Worldwide
        </span>
        <h2>Why Choose Astrologer Kali Charan for {serviceTitle}?</h2>
        <p>
          Experience genuine, compassionate Vedic guidance backed by 25+ years of proven relationship solutions.
        </p>
      </div>

      <div className="service-why-grid">
        {WHY_US_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div className="service-why-card" key={item.title}>
              <div className="service-why-icon">
                <Icon size={24} />
              </div>
              <div className="service-why-text">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

