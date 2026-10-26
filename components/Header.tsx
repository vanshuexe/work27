"use client";

import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { CallButton, WhatsAppButton } from "./ContactButtons";
import { NAV, PHONE, SITE_NAME, TAGLINE, TEL } from "@/lib/site";

function Brand() {
  return (
    <a href="#top" className="brand" aria-label={`${SITE_NAME} home`}>
      <img src="/assets/img/logo-kali-charan.webp" alt="" width={52} height={52} />
      <span className="brand__text">
        <span className="brand__pre">Astrologer</span>
        <span className="brand__name">Kali Charan</span>
        <span className="brand__tag">{TAGLINE}</span>
      </span>
    </a>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll and allow Escape to close while the mobile menu is open.
  useEffect(() => {
    document.documentElement.classList.toggle("drawer-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className={`header${scrolled ? " is-scrolled" : ""}`}>
        <div className="container header__inner">
          <Brand />
          <nav className="nav" aria-label="Main">
            <ul>
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="header__actions">
            <CallButton label={PHONE} className="header__call" />
            <a href={TEL} className="icon-btn icon-btn--gold header__phone-icon" aria-label={`Call ${PHONE}`}>
              <Phone size={20} />
            </a>
            <button
              type="button"
              className="icon-btn header__menu"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      <div className="drawer-backdrop" onClick={close} aria-hidden="true" />
      <aside id="mobile-menu" className="drawer" aria-label="Menu" aria-hidden={!open} inert={!open}>
        <div className="drawer__top">
          <Brand />
          <button type="button" className="icon-btn" aria-label="Close menu" onClick={close}>
            <X size={22} />
          </button>
        </div>
        <nav aria-label="Mobile">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={close}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="drawer__cta">
          <CallButton label={`Call ${PHONE}`} />
          <WhatsAppButton label="Chat on WhatsApp" />
        </div>
      </aside>
    </>
  );
}
