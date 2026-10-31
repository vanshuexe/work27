import { Check, Phone } from "lucide-react";
import { WhatsAppButton } from "./ContactButtons";
import { IMG_ALT, PHONE, TEL } from "@/lib/site";

const CHECKLIST = ["Pure Vedic Astrology", "Astrological Remedies", "100% Quality Work"];

export default function About() {
  return (
    <section className="section section--white" id="about">
      <div className="container about__grid">
        <div className="about__media">
          <img src="/assets/img/about-kali-charan.jpg?v=6" alt={IMG_ALT} width={1254} height={1254} loading="lazy" />
        </div>
        <div className="about__text">
          <span className="eyebrow">About Us</span>
          <h2 className="title">Astrologer Kali Charan</h2>
          <p>
            World-famous Astrologer Kali Charan is a specialist in astrology, lost love back and love
            problem consultation. He serves clients all over the world — UK, USA, Australia, India,
            Canada, New Zealand and many other countries.
          </p>
          <p>
            With more than 25 years of experience in astrology, he provides long-lasting solutions
            to the pressing problems that disrupt our day-to-day lives.
          </p>
          <ul className="checklist">
            {CHECKLIST.map((item) => (
              <li key={item}>
                <Check size={20} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <div className="btn-row about__btns">
            <a href={TEL} className="btn btn--outline">
              <Phone size={18} aria-hidden="true" />
              Call {PHONE}
            </a>
            <WhatsAppButton label="Chat on WhatsApp" />
          </div>
        </div>
      </div>
    </section>
  );
}
