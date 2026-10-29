"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { CallButton, WhatsAppButton } from "./ContactButtons";

// Desktop: back-to-top. Mobile: a fixed Call / WhatsApp bar.
export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <button
        type="button"
        className={`fab fab--top${showTop ? " is-visible" : ""}`}
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp size={20} />
      </button>
      <div className="action-bar">
        <CallButton label="Call Now" />
        <WhatsAppButton label="WhatsApp" />
      </div>
    </>
  );
}
