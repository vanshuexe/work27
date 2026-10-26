import { CallButton, WhatsAppButton } from "./ContactButtons";
import { PHONE } from "@/lib/site";

export default function CtaBand() {
  return (
    <section className="cta" aria-label="Contact">
      <div className="container">
        <div className="cta__box">
          <div>
            <h2>Talk to Astrologer Kali Charan Today</h2>
            <p>Available 24/7 on call and WhatsApp — {PHONE}. 100% privacy guaranteed.</p>
          </div>
          <div className="btn-row">
            <CallButton label="Call Now" />
            <WhatsAppButton label="WhatsApp" />
          </div>
        </div>
      </div>
    </section>
  );
}
