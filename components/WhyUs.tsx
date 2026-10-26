import { Award, BadgeCheck, Clock, Users } from "lucide-react";
import CounterNumber from "./CounterNumber";
import { COUNTERS, FEATURES } from "@/lib/site";

const FEATURE_ICONS = { award: Award, clock: Clock, badge: BadgeCheck, users: Users };

export default function WhyUs() {
  return (
    <section className="section section--dark" id="why-us">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Why Choose Us</span>
          <h2 className="title">
            Guidance You Can <span className="gold-text">Trust</span>
          </h2>
          <p lang="hi">
            सभी जगह से निराश हुए व्यक्ति या प्यार में धोखा खाए प्रेमी प्रेमिका एक बार जरूर संपर्क करें। हमारा
            नंबर स्क्रीन पर दिया हुआ है।
          </p>
        </div>
        <div className="features">
          {FEATURES.map(({ icon, title }) => {
            const Icon = FEATURE_ICONS[icon];
            return (
              <div className="feature" key={title}>
                <span className="feature__icon">
                  <Icon size={28} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
              </div>
            );
          })}
        </div>
        <div className="stats">
          {COUNTERS.map((c) => (
            <div className="stat" key={c.label}>
              <strong className="gold-text">
                <CounterNumber value={c.value} />+
              </strong>
              <span>{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
