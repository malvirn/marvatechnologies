"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const links = [
  ["About", "/about"], ["Services", "/services"], ["Projects", "/projects"], ["Insights", "/insights"]
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav-wrap">
      <nav className="nav shell">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">M<span>.</span></span>
          <span>MARVA <b>TECHNOLOGIES</b></span>
        </Link>
        <div className="nav-links">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </div>
        <Link className="nav-cta" href="/contact">Let’s talk <ArrowUpRight size={15} /></Link>
        <button className="menu-toggle" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </nav>
      {open && <div className="mobile-menu">{links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}<Link href="/contact" onClick={() => setOpen(false)}>Contact ↗</Link></div>}
    </header>
  );
}