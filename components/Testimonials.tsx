import { Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/site";

export default function Testimonials() {
  return (
    <section className="section section--white" id="reviews">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Testimonials</span>
          <h2 className="title">Hear From Those Who Trust Us</h2>
        </div>
        <div className="reviews">
          {TESTIMONIALS.map((t) => (
            <figure className="review" key={t.name}>
              <Quote className="review__quote" size={34} aria-hidden="true" />
              <div className="stars" aria-label="Rated 5 out of 5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={18} fill="currentColor" aria-hidden="true" />
                ))}
              </div>
              <blockquote>
                <p>{t.text}</p>
              </blockquote>
              <figcaption className="review__person">
                <img src="/assets/img/testimonial-avatar.webp" alt="" width={46} height={46} loading="lazy" />
                <span>
                  <strong>{t.name}</strong>
                  <span>{t.city}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
