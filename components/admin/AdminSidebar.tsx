"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ExternalLink,
  KeyRound,
  LayoutGrid,
  LogOut,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { signOut } from "@/app/admin/actions";

interface AdminSidebarProps {
  currentSection: "services" | "blogs" | "password";
  userEmail: string;
  servicesCount?: number | string;
  blogsCount?: number | string;
}

export default function AdminSidebar({
  currentSection,
  userEmail,
  servicesCount = "—",
  blogsCount = "—",
}: AdminSidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Top Header + Tabs (Visible on screens <= 800px) */}
      <header className="admin-mobile-header">
        <div className="admin-mobile-header__main">
          <Link href="/admin" className="admin-brand" onClick={closeMenu}>
            <Sparkles size={22} className="admin-brand-icon" />
            <span>
              Kali Charan
              <small>WEBSITE MANAGER</small>
            </span>
          </Link>

          <div className="admin-mobile-header__actions">
            <Link
              href="/"
              target="_blank"
              className="admin-icon-button admin-mobile-quick-btn"
              title="View live website"
              aria-label="View live website"
            >
              <ExternalLink size={18} />
            </Link>

            <button
              type="button"
              className={`admin-icon-button admin-mobile-menu-btn ${mobileMenuOpen ? "is-active" : ""}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close admin menu" : "Open admin menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Quick One-Tap Navigation Tabs for Mobile */}
        <nav className="admin-mobile-tabs" aria-label="Quick section navigation">
          <Link
            href="/admin"
            className={`admin-mobile-tab ${currentSection === "services" ? "is-active" : ""}`}
            onClick={closeMenu}
          >
            <LayoutGrid size={15} />
            <span>Services</span>
            <span className="admin-tab-badge">{servicesCount}</span>
          </Link>
          <Link
            href="/admin/blogs"
            className={`admin-mobile-tab ${currentSection === "blogs" ? "is-active" : ""}`}
            onClick={closeMenu}
          >
            <BookOpen size={15} />
            <span>Blogs</span>
            <span className="admin-tab-badge">{blogsCount}</span>
          </Link>
          <Link
            href="/admin/password"
            className={`admin-mobile-tab ${currentSection === "password" ? "is-active" : ""}`}
            onClick={closeMenu}
          >
            <KeyRound size={15} />
            <span>Password</span>
          </Link>
        </nav>

        {/* Mobile Dropdown / Drawer */}
        {mobileMenuOpen && (
          <>
            <div
              className="admin-mobile-backdrop"
              onClick={closeMenu}
              aria-hidden="true"
            />
            <div className="admin-mobile-drawer" role="dialog" aria-modal="true">
              <div className="admin-mobile-drawer__links">
                <div className="admin-sidebar-label">WORKSPACE SECTIONS</div>
                <Link
                  href="/admin"
                  className={`admin-nav ${currentSection === "services" ? "active" : ""}`}
                  onClick={closeMenu}
                >
                  <LayoutGrid size={19} />
                  <span>Services Management</span>
                  <span className="admin-nav-pill">{servicesCount}</span>
                </Link>
                <Link
                  href="/admin/blogs"
                  className={`admin-nav ${currentSection === "blogs" ? "active" : ""}`}
                  onClick={closeMenu}
                >
                  <BookOpen size={19} />
                  <span>Blog Articles</span>
                  <span className="admin-nav-pill">{blogsCount}</span>
                </Link>
                <Link
                  href="/admin/password"
                  className={`admin-nav ${currentSection === "password" ? "active" : ""}`}
                  onClick={closeMenu}
                >
                  <KeyRound size={19} />
                  <span>Change Password</span>
                </Link>
              </div>

              <div className="admin-mobile-drawer__footer">
                <Link
                  href="/"
                  target="_blank"
                  className="admin-nav"
                  onClick={closeMenu}
                >
                  <ExternalLink size={18} />
                  <span>View Live Website</span>
                </Link>

                <div className="admin-account">
                  <span className="admin-avatar">
                    {userEmail?.[0]?.toUpperCase() || "A"}
                  </span>
                  <div>
                    <strong>Administrator</strong>
                    <small>{userEmail}</small>
                  </div>
                </div>

                <form action={signOut}>
                  <button type="submit" className="admin-nav admin-signout">
                    <LogOut size={18} />
                    <span>Sign out</span>
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Desktop Sidebar (Visible on screens > 800px) */}
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          <Sparkles size={24} />
          <span>
            Kali Charan
            <small>WEBSITE MANAGER</small>
          </span>
        </Link>

        <div className="admin-sidebar-label">WORKSPACE</div>
        <Link
          href="/admin"
          className={`admin-nav ${currentSection === "services" ? "active" : ""}`}
          aria-current={currentSection === "services" ? "page" : undefined}
        >
          <LayoutGrid size={19} /> Services <span>{servicesCount}</span>
        </Link>
        <Link
          href="/admin/blogs"
          className={`admin-nav ${currentSection === "blogs" ? "active" : ""}`}
          aria-current={currentSection === "blogs" ? "page" : undefined}
        >
          <BookOpen size={19} /> Blogs <span>{blogsCount}</span>
        </Link>
        <Link
          href="/admin/password"
          className={`admin-nav ${currentSection === "password" ? "active" : ""}`}
          aria-current={currentSection === "password" ? "page" : undefined}
        >
          <KeyRound size={19} /> Account password
        </Link>

        <div className="admin-sidebar-bottom">
          <Link href="/" target="_blank" className="admin-nav">
            <ExternalLink size={18} /> View website
          </Link>
          <div className="admin-account">
            <span className="admin-avatar">
              {userEmail?.[0]?.toUpperCase() || "A"}
            </span>
            <div>
              <strong>Administrator</strong>
              <small>{userEmail}</small>
            </div>
          </div>
          <form action={signOut}>
            <button type="submit" className="admin-nav admin-signout">
              <LogOut size={18} /> Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}

