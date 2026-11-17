"use client";

import { useEffect, useRef } from "react";

/** Fades/slides children in when they scroll into view. Content stays visible if JS or IntersectionObserver is unavailable. */
export default function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92) { el.classList.add("rv-in"); return; }
    el.classList.add("rv-hide");
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.remove("rv-hide"); el.classList.add("rv-in"); io.disconnect(); }
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`rv ${className}`} style={{ ["--rd" as string]: `${delay}ms` }}>{children}</div>;
}
