"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Moon, Sun, Menu } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import { useTypewriter } from "@/hooks/useTypewriter";

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
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [origin, setOrigin] = useState("calc(100% - 34px) 28px");
  const brand = useTypewriter(["MARVA", "TECHNOLOGIES"], { speed: 90 });
  const [brandLine, setBrandLine] = useState(0);
  const [firstLine, setFirstLine] = useState("");
  const [secondLine, setSecondLine] = useState("");
  const first = useTypewriter("MARVA", { speed: 90 });
  const second = useTypewriter("TECHNOLOGIES", { speed: 55, start: first.done });

  useEffect(() => {
    setFirstLine(first.text);
    setSecondLine(second.text);
  }, [first.text, second.text]);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    const onScroll = () => setScrolled(window.scrollY > 12);
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

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("marva-theme", next); } catch {}
  };

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
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="header-inner">
        <Link href="/" className="brand-lockup" aria-label="Marva Technologies home">
          <Logo />
          <span className="wordmark" aria-label="MARVA TECHNOLOGIES">
            <span className="typing-line"><span className="typing-reserve">MARVA</span><span aria-hidden="true">{firstLine}</span>{!first.done && <i className="typing-cursor" />}</span>
            <span className="typing-subline"><span className="typing-reserve">TECHNOLOGIES</span><span aria-hidden="true">{secondLine}</span>{first.done && !second.done && <i className="typing-cursor small" />}</span>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main" onMouseLeave={() => setHovered(null)}>
          {links.map(link => <Link key={link.href} href={link.href} aria-current={active === link.href ? "page" : undefined} onMouseEnter={() => setHovered(link.href)} onFocus={() => setHovered(link.href)} onBlur={() => setHovered(null)} className="nav-link">
            {highlight === link.href && <motion.span className="nav-highlight" layoutId="nav-highlight" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 430, damping: 34 }} />}
            <span>{link.label}</span>
          </Link>)}
        </nav>
        <div className="header-actions">
          <Link className="header-cta" href="/contact">Start a conversation</Link>
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>{theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}</button>
          <button ref={menuButton} className={`menu-button ${open ? "menu-open" : ""}`} type="button" onClick={toggleMenu} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation"><span/><span/></button>
        </div>
      </div>
      <AnimatePresence>
        {open && <motion.nav id="mobile-navigation" className="mobile-navigation" aria-label="Main mobile navigation" initial={reduce ? { opacity: 1 } : { clipPath: `circle(0px at ${origin})` }} animate={{ clipPath: "circle(150% at 50% 50%)" }} exit={reduce ? { opacity: 0 } : { clipPath: `circle(0px at ${origin})` }} transition={reduce ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
          <div className="mobile-links">{links.map((link,i) => <motion.div key={link.href} initial={reduce ? false : { y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: reduce ? 0 : i * 0.06 }}><Link href={link.href} onClick={closeMenu} aria-current={active === link.href ? "page" : undefined} className={active === link.href ? "mobile-active" : ""}>{link.label}{active === link.href && <span className="active-dot"/>}</Link></motion.div>)}</div>
          <div className="mobile-bottom"><Link className="header-cta" href="/contact" onClick={closeMenu}>Start a conversation</Link><p>Technology. Innovation. Impact.</p></div>
        </motion.nav>}
      </AnimatePresence>
    </header>
  );
}
