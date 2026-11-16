"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [origin, setOrigin] = useState("calc(100% - 34px) 28px");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setOpen(false), []);
  useEffect(() => {
    if (!open) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") closeMenu(); };
    const onResize = () => { if (window.innerWidth >= 900) closeMenu(); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, closeMenu]);

  const toggleMenu = () => {
    if (!open && menuButton.current) {
      const rect = menuButton.current.getBoundingClientRect();
      setOrigin(`${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`);
    }
    setOpen(value => !value);
  };

  const active = links.find(link => link.href === pathname)?.href ?? "/";
  const highlight = hovered ?? active;

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-inner">
        <Link href="/" className="brand-lockup" aria-label="Marva Technologies home">
          <span className="brand-emblem" aria-hidden="true">
            <img className="logo-ring" src="/logo-ring.svg" alt="" />
            <img className="logo-m" src="/logo-m.svg" alt="" />
          </span>
          <span className="wordmark"><span className="wordmark-main">MARVA</span><span className="wordmark-sub">TECHNOLOGIES</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main" onMouseLeave={() => setHovered(null)}>
          {links.map(link => <Link key={link.href} href={link.href} aria-current={active === link.href ? "page" : undefined} onMouseEnter={() => setHovered(link.href)} onFocus={() => setHovered(link.href)} onBlur={() => setHovered(null)} className="nav-link">
            {highlight === link.href && <motion.span className="nav-highlight" layoutId="nav-highlight" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 430, damping: 34 }} />}
            <span>{link.label}</span>
          </Link>)}
        </nav>
        <div className="header-actions">
          <Link className="header-cta" href="/contact">Start a conversation <span aria-hidden="true">↗</span></Link>
          <button ref={menuButton} className={`menu-button ${open ? "menu-open" : ""}`} type="button" onClick={toggleMenu} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation"><span/><span/></button>
        </div>
      </div>
      <AnimatePresence>
        {open && <motion.nav id="mobile-navigation" className="mobile-navigation" aria-label="Main mobile navigation" initial={reduce ? { opacity: 1 } : { clipPath: `circle(0px at ${origin})` }} animate={{ clipPath: "circle(150% at 50% 50%)" }} exit={reduce ? { opacity: 0 } : { clipPath: `circle(0px at ${origin})` }} transition={reduce ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
          <div className="mobile-links">{links.map((link,i) => <motion.div key={link.href} initial={reduce ? false : { y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: reduce ? 0 : i * 0.06 }}><Link href={link.href} onClick={closeMenu} aria-current={active === link.href ? "page" : undefined} className={active === link.href ? "mobile-active" : ""}>{link.label}{active === link.href && <span className="active-dot"/>}</Link></motion.div>)}</div>
          <div className="mobile-bottom"><Link className="header-cta" href="/contact" onClick={closeMenu}>Start a conversation <span aria-hidden="true">↗</span></Link><p>Technology. Innovation. Impact.</p></div>
        </motion.nav>}
      </AnimatePresence>
    </header>
  );
}
