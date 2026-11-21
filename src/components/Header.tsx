"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { House, Layers, Lightbulb, Mail, UserRound, ArrowUpRight } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

const mobileLinks = [
  { label: "Home", href: "/", Icon: House },
  { label: "About", href: "/about", Icon: UserRound },
  { label: "Services", href: "/services", Icon: Layers },
  { label: "Insights", href: "/insights", Icon: Lightbulb },
  { label: "Contact", href: "/contact", Icon: Mail },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      headerRef.current?.style.setProperty("--p", (max > 0 ? Math.min(1, window.scrollY / max) : 0).toFixed(4));
    };
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

  const active = links.find(link => link.href === pathname)?.href
    ?? (pathname.startsWith("/insights/") ? "/insights" : "/");

  return (
    <header ref={headerRef} className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-inner">
        <Link href="/" className="brand-lockup" aria-label="Marva Technologies home">
          <span className="brand-emblem" aria-hidden="true"><BrandMark /></span>
          <span className="wordmark"><span className="wordmark-main" aria-label="MARVA">{"MARVA".split("").map((ch, i) => <span className="wl" aria-hidden="true" key={i} style={{ ["--i" as string]: i }}>{ch}</span>)}</span><span className="wordmark-sub">TECHNOLOGIES</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation" onMouseLeave={() => setHover(null)}>
          {links.map((link, i) => {
            const on = (hover ?? active) === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active === link.href ? "page" : undefined}
                className="nav-link"
                style={{ ["--i" as string]: i }}
                onMouseEnter={() => setHover(link.href)}
                onFocus={() => setHover(link.href)}
                onBlur={() => setHover(null)}
              >
                {on && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: "spring", stiffness: 520, damping: 38 }} />}
                <span className="nl-roll"><span className="nl-text" data-t={link.label}>{link.label}</span></span>
              </Link>
            );
          })}
        </nav>
        <div className="header-actions">
          <ThemeToggle variant="icon" />
          <Link className="header-cta" href="/contact">Start a conversation <span aria-hidden="true">↗</span></Link>
          <button className={`menu-button ${open ? "menu-open" : ""}`} type="button" onClick={() => setOpen(value => !value)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation"><span/><span/></button>
        </div>
      </div>
      <div id="mobile-navigation" className={`mobile-navigation ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav className="mobile-links" aria-label="Mobile navigation">
          {mobileLinks.map(({ label, href, Icon }, i) => <Link key={href} href={href} style={{ ["--i" as string]: i }} onClick={() => setOpen(false)} aria-current={active === href ? "page" : undefined} className={active === href ? "mobile-active" : ""}><span className="ml-icon" aria-hidden="true"><Icon size={18} strokeWidth={2} /></span><span className="ml-label">{label}</span><ArrowUpRight className="ml-arrow" size={16} aria-hidden="true" /></Link>)}
          <div className="mobile-theme" style={{ ["--i" as string]: mobileLinks.length }}><ThemeToggle variant="row" /></div>
        </nav>
        <Link className="mobile-menu-cta" href="/contact" onClick={() => setOpen(false)}>Start a conversation <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
  );
}
