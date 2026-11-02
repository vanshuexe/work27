"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Phone, Sparkles, X } from "lucide-react";
import { CallButton, WhatsAppButton } from "./ContactButtons";
import { PHONE, SITE_NAME, TAGLINE, TEL } from "@/lib/site";

const DEFAULT_HEADER_SERVICES = [
  { slug: "love-problem-solution", title: "Love Problem Solution Astrologer", group: "love" },
  { slug: "get-your-ex-love-back", title: "Get Your Ex Love Back Astrologer", group: "love" },
  { slug: "love-marriage-specialist", title: "Love Marriage Specialist Astrologer", group: "love" },
  { slug: "vashikaran-specialist", title: "Love Vashikaran Specialist Astrologer", group: "love" },
  { slug: "husband-wife-problem-solution", title: "Husband Wife Problem Solution", group: "love" },
  { slug: "breakup-problem-solution", title: "Breakup Problem Solution", group: "love" },
  { slug: "relationship-problem-solution", title: "Relationship Problem Solution", group: "love" },
  { slug: "one-sided-love-solution", title: "One Sided Love Solution", group: "love" },
  { slug: "bring-my-love-back", title: "Bring My Love Back", group: "love" },
  { slug: "intercaste-marriage-problem-solution", title: "Intercaste Marriage Problem Solution", group: "love" },
  { slug: "after-marriage-problem", title: "After Marriage Problem Solution", group: "love" },
  { slug: "lost-love-back-specialist", title: "Lost Love Back Specialist", group: "love" },
  { slug: "extra-marital-affairs-solution", title: "Extra Marital Affairs Solution", group: "love" },
  { slug: "divorce-problem-solution", title: "Divorce Problem Solution", group: "life" },
  { slug: "family-problem-solution", title: "Family Problem Solution Astrologer", group: "life" },
  { slug: "childless-problem-solution", title: "Childless Problem Solution", group: "life" },
  { slug: "black-magic-specialist", title: "Black Magic Specialist Astrologer", group: "life" },
  { slug: "famous-astrologer", title: "Famous Astrologer", group: "life" },
  { slug: "business-problem", title: "Business Problem Astrologer", group: "life" },
  { slug: "child-related-problem", title: "Child Related Problem Solution", group: "life" },
  { slug: "love-back-astrologer", title: "Love Back Astrologer", group: "life" },
  { slug: "astrologer-near-me", title: "Astrologer Near Me", group: "life" },
];

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" className="brand" aria-label={`${SITE_NAME} home`} onClick={onClick}>
      <img src="/assets/img/logo-kali-charan.webp" alt="" width={52} height={52} />
      <span className="brand__text">
        <span className="brand__pre">Astrologer</span>
        <span className="brand__name">Kali Charan</span>
        <span className="brand__tag">{TAGLINE}</span>
      </span>
    </Link>
  );
}

type HeaderService = {
  id?: string;
  slug: string;
  title: string;
  group?: string;
  parentId?: string | null;
  location?: string | null;
};

export default function Header({
  services,
}: {
  services?: HeaderService[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(true);
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});
  const [desktopExpandedParents, setDesktopExpandedParents] = useState<Record<string, boolean>>({});
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const desktopTimeout = useRef<NodeJS.Timeout | null>(null);

  const toggleDesktopParent = (parentId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setDesktopExpandedParents((prev) => ({ ...prev, [parentId]: !prev[parentId] }));
  };

  // Use real services from CMS; fallback shows only main services (no fake location entries)
  const allServices: HeaderService[] = services && services.length > 0 ? services : [
    ...DEFAULT_HEADER_SERVICES.map((s, i) => ({ ...s, id: s.group === "love" ? `love-${i + 1}` : `life-${i - 6}` })),
  ];

  const mainServices = allServices.filter((s) => !s.parentId);
  const locationServices = allServices.filter((s) => s.parentId);

  const toggleParent = (parentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setExpandedParents((prev) => ({ ...prev, [parentId]: !prev[parentId] }));
  };

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

  const close = () => {
    setOpen(false);
    setDesktopDropdownOpen(false);
  };

  const handleMouseEnterDesktop = () => {
    if (desktopTimeout.current) clearTimeout(desktopTimeout.current);
    setDesktopDropdownOpen(true);
  };

  const handleMouseLeaveDesktop = () => {
    desktopTimeout.current = setTimeout(() => {
      setDesktopDropdownOpen(false);
    }, 200);
  };

  const loveServices = mainServices.filter((s) => s.group === "love");
  const lifeServices = mainServices.filter((s) => s.group !== "love");

  return (
    <>
      <header className={`header${scrolled ? " is-scrolled" : ""}`}>
        <div className="container header__inner">
          <Brand onClick={close} />

          {/* Desktop Nav */}
          <nav className="nav" aria-label="Main">
            <ul>
              <li>
                <Link href="/" className="nav__link">
                  Home
                </Link>
              </li>
              <li>
                <a href="/#about" className="nav__link">
                  About
                </a>
              </li>

              {/* Desktop Services Dropdown */}
              <li
                className="nav__item--dropdown"
                onMouseEnter={handleMouseEnterDesktop}
                onMouseLeave={handleMouseLeaveDesktop}
              >
                <div className="nav__dropdown-trigger-wrap">
                  <Link href="/services" className="nav__link nav__link--dropdown">
                    Services
                    <ChevronDown
                      size={15}
                      className={`nav__chevron ${desktopDropdownOpen ? "is-rotated" : ""}`}
                      aria-hidden="true"
                    />
                  </Link>
                </div>

                {desktopDropdownOpen && (
                  <div className="nav__dropdown-menu" role="menu">
                    <div className="nav__dropdown-grid">
                      <div className="nav__dropdown-col">
                        <span className="nav__dropdown-heading">
                          <Sparkles size={13} /> Love &amp; Marriage Services
                        </span>
                        <ul className="nav__dropdown-list">
                          {loveServices.map((s) => {
                            const locs = locationServices.filter((l) => l.parentId === s.id || l.parentId === s.slug);
                            const isExpanded = !!desktopExpandedParents[s.id || s.slug];
                            return (
                              <li
                                key={s.slug}
                                className="nav__service-tree-node"
                                onMouseEnter={() => {
                                  if (locs.length > 0) {
                                    setDesktopExpandedParents((prev) => ({ ...prev, [s.id || s.slug]: true }));
                                  }
                                }}
                              >
                                <div className="nav__service-tree-header">
                                  <Link
                                    href={`/services/${s.slug}`}
                                    onClick={close}
                                    className="nav__service-tree-link"
                                  >
                                    {s.title}
                                  </Link>
                                  {locs.length > 0 && (
                                    <button
                                      type="button"
                                      className={`nav__service-tree-toggle ${isExpanded ? "is-open" : ""}`}
                                      onClick={(e) => toggleDesktopParent(s.id || s.slug, e)}
                                      aria-label={`Toggle sub-pages for ${s.title}`}
                                    >
                                      <span className="nav__service-tree-badge">{locs.length}</span>
                                      <ChevronDown size={12} className="nav__service-tree-chevron" />
                                    </button>
                                  )}
                                </div>
                                {locs.length > 0 && isExpanded && (
                                  <ul className="nav__service-tree-sublist">
                                    {locs.map((loc) => (
                                      <li key={loc.slug}>
                                        <Link
                                          href={`/services/${loc.slug}`}
                                          onClick={close}
                                          className="nav__service-tree-subitem"
                                        >
                                          ↳ {loc.title}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <div className="nav__dropdown-col">
                        <span className="nav__dropdown-heading">
                          <Sparkles size={13} /> Family, Career &amp; Life
                        </span>
                        <ul className="nav__dropdown-list">
                          {lifeServices.map((s) => {
                            const locs = locationServices.filter((l) => l.parentId === s.id || l.parentId === s.slug);
                            const isExpanded = !!desktopExpandedParents[s.id || s.slug];
                            return (
                              <li
                                key={s.slug}
                                className="nav__service-tree-node"
                                onMouseEnter={() => {
                                  if (locs.length > 0) {
                                    setDesktopExpandedParents((prev) => ({ ...prev, [s.id || s.slug]: true }));
                                  }
                                }}
                              >
                                <div className="nav__service-tree-header">
                                  <Link
                                    href={`/services/${s.slug}`}
                                    onClick={close}
                                    className="nav__service-tree-link"
                                  >
                                    {s.title}
                                  </Link>
                                  {locs.length > 0 && (
                                    <button
                                      type="button"
                                      className={`nav__service-tree-toggle ${isExpanded ? "is-open" : ""}`}
                                      onClick={(e) => toggleDesktopParent(s.id || s.slug, e)}
                                      aria-label={`Toggle sub-pages for ${s.title}`}
                                    >
                                      <span className="nav__service-tree-badge">{locs.length}</span>
                                      <ChevronDown size={12} className="nav__service-tree-chevron" />
                                    </button>
                                  )}
                                </div>
                                {locs.length > 0 && isExpanded && (
                                  <ul className="nav__service-tree-sublist">
                                    {locs.map((loc) => (
                                      <li key={loc.slug}>
                                        <Link
                                          href={`/services/${loc.slug}`}
                                          onClick={close}
                                          className="nav__service-tree-subitem"
                                        >
                                          ↳ {loc.title}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>

                    <div className="nav__dropdown-footer">
                      <Link href="/services" onClick={close} className="nav__dropdown-all-link">
                        Explore All Services &amp; Detailed Vedic Remedies →
                      </Link>
                    </div>
                  </div>
                )}
              </li>

              <li>
                <a href="/#why-us" className="nav__link">
                  Why Us
                </a>
              </li>
              <li>
                <a href="/#reviews" className="nav__link">
                  Reviews
                </a>
              </li>
              <li>
                <a href="/#faq" className="nav__link">
                  FAQ
                </a>
              </li>
              <li>
                <Link href="/blog" className="nav__link">
                  Blog
                </Link>
              </li>
              <li>
                <a href="/#contact" className="nav__link">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <div className="header__actions">
            <CallButton label={PHONE} className="header__call" />
            <a
              href={TEL}
              className="icon-btn icon-btn--gold header__phone-icon"
              aria-label={`Call ${PHONE}`}
            >
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

      {/* Mobile Drawer */}
      <div className="drawer-backdrop" onClick={close} aria-hidden="true" />
      <aside
        id="mobile-menu"
        className="drawer"
        aria-label="Menu"
        aria-hidden={!open}
      >
        <div className="drawer__top">
          <Brand onClick={close} />
          <button
            type="button"
            className="icon-btn drawer__close-btn"
            aria-label="Close menu"
            onClick={close}
          >
            <X size={22} />
          </button>
        </div>

        <nav aria-label="Mobile Navigation" className="drawer__nav">
          <Link href="/" onClick={close} className="drawer__item-link">
            Home
          </Link>

          <a href="/#about" onClick={close} className="drawer__item-link">
            About
          </a>

          {/* Expandable Services Accordion matching user's screenshot */}
          <div className="drawer__accordion">
            <div className="drawer__accordion-header">
              <Link href="/services" onClick={close} className="drawer__item-link drawer__services-label">
                Services
              </Link>
              <button
                type="button"
                className={`drawer__accordion-toggle ${mobileServicesOpen ? "is-expanded" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileServicesOpen(!mobileServicesOpen);
                }}
                aria-label="Toggle services list"
                aria-expanded={mobileServicesOpen}
              >
                <ChevronDown size={18} className="drawer__accordion-chevron" />
              </button>
            </div>

            {mobileServicesOpen && (
              <div className="drawer__submenu">
                {mainServices.map((main) => {
                  const locations = locationServices.filter(
                    (loc) => loc.parentId === main.id || loc.parentId === main.slug
                  );

                  if (locations.length > 0) {
                    const isExpanded = !!expandedParents[main.id || main.slug];
                    return (
                      <div className="drawer__sub-accordion" key={main.slug}>
                        <div className="drawer__sub-accordion-header">
                          <Link
                            href={`/services/${main.slug}`}
                            onClick={close}
                            className="drawer__sublink drawer__sublink--parent"
                          >
                            <span>{main.title}</span>
                          </Link>
                          <button
                            type="button"
                            className={`drawer__sub-accordion-toggle ${isExpanded ? "is-expanded" : ""}`}
                            onClick={(e) => toggleParent(main.id || main.slug, e)}
                            aria-label={`Toggle locations for ${main.title}`}
                            aria-expanded={isExpanded}
                          >
                            <span className="drawer__sub-count">{locations.length} cities</span>
                            <ChevronDown size={14} className="drawer__sub-chevron" />
                          </button>
                        </div>
                        {isExpanded && (
                          <div className="drawer__sub-location-list">
                            {locations.map((loc) => (
                              <Link
                                key={loc.slug}
                                href={`/services/${loc.slug}`}
                                onClick={close}
                                className="drawer__loc-link"
                              >
                                <span>↳ {loc.title}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={main.slug}
                      href={`/services/${main.slug}`}
                      onClick={close}
                      className="drawer__sublink"
                    >
                      <span>{main.title}</span>
                    </Link>
                  );
                })}
                <Link
                  href="/services"
                  onClick={close}
                  className="drawer__sublink drawer__sublink--all"
                >
                  <span>✨ View All Services &amp; Locations →</span>
                </Link>
              </div>
            )}
          </div>

          <a href="/#why-us" onClick={close} className="drawer__item-link">
            Why Us
          </a>

          <a href="/#reviews" onClick={close} className="drawer__item-link">
            Reviews
          </a>

          <a href="/#faq" onClick={close} className="drawer__item-link">
            FAQ
          </a>

          <Link href="/blog" onClick={close} className="drawer__item-link">
            Blog
          </Link>

          <a href="/#contact" onClick={close} className="drawer__item-link">
            Contact
          </a>
        </nav>

        <div className="drawer__cta">
          <CallButton label={`Call ${PHONE}`} />
          <WhatsAppButton label="Chat on WhatsApp" />
        </div>
      </aside>
    </>
  );
}
