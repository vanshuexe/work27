"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/lib/site";

export default function Faq() {
  // One answer open at a time; the first starts open.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">FAQ</span>
          <h2 className="title">Frequently Asked Questions</h2>
        </div>
        <div className="faq">
          {FAQS.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div className={`faq__item${open ? " is-open" : ""}`} key={faq.q}>
                <h3>
                  <button
                    type="button"
                    className="faq__q"
                    id={`faq-q-${i}`}
                    aria-expanded={open}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpenIndex(open ? null : i)}
                  >
                    {faq.q}
                    <ChevronDown size={20} aria-hidden="true" />
                  </button>
                </h3>
                <div className="faq__a" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
                  <div>
                    <p>{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
