"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import BrandMark from "@/components/BrandMark";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    const onResize = () => { if (window.innerWidth >= 900) setOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const active = links.find(link => link.href === pathname)?.href ?? "/";

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-inner">
        <Link href="/" className="brand-lockup" aria-label="Marva Technologies home">
          <span className="brand-emblem" aria-hidden="true"><BrandMark /></span>
          <span className="wordmark"><span className="wordmark-main">MARVA</span><span className="wordmark-sub">TECHNOLOGIES</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(link => <Link key={link.href} href={link.href} aria-current={active === link.href ? "page" : undefined} className="nav-link">{link.label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link className="header-cta" href="/contact">Start a conversation <span aria-hidden="true">↗</span></Link>
          <button className={`menu-button ${open ? "menu-open" : ""}`} type="button" onClick={() => setOpen(value => !value)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation"><span/><span/></button>
        </div>
      </div>
      <div id="mobile-navigation" className={`mobile-navigation ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav className="mobile-links" aria-label="Mobile navigation">
          {links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={active === link.href ? "page" : undefined} className={active === link.href ? "mobile-active" : ""}>{link.label}</Link>)}
        </nav>
        <Link className="mobile-menu-cta" href="/contact" onClick={() => setOpen(false)}>Start a conversation <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
  );
}
