"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTypewriter } from "@/hooks/useTypewriter";

export default function Hero() {
  const typed = useTypewriter("business automation", { speed: 62 });
  return (
    <section className="intro-hero" id="home">
      <div className="hero-content-wrap">
        <p className="hero-kicker"><span className="hero-kicker-dot" aria-hidden="true" /> INDEPENDENT TECHNOLOGY STUDIO <span className="hero-kicker-divider">/</span> ZIMBABWE</p>
        <p className="hero-pretitle">Marva builds <span className="rotating-words"><span>{typed.text}</span><i className="typing-cursor" aria-hidden="true" /></span></p>
        <h1 className="intro-title">We build <span className="headline-emphasis">digital</span> solutions that matter.</h1>
        <p className="intro-copy">Marva Technologies is a growing software brand founded by Malvirn Gomo. We turn practical ideas into useful digital products.</p>
        <div className="intro-actions">
          <Link href="/projects" className="intro-button button-accent">Explore our work <ArrowRight className="button-arrow" size={18}/></Link>
          <Link href="/contact" className="intro-button button-outline">Start a conversation <ArrowRight className="button-arrow" size={18}/></Link>
        </div>
        <div className="hero-bottomline"><span>TECHNOLOGY. INNOVATION. IMPACT.</span><span>FOUNDED BY MALVIRN GOMO</span></div>
      </div>
      <div className="hero-photo-wrap">
        <img className="hero-photo" src="/hero.webp" srcSet="/hero-800.webp 800w, /hero-1200.webp 1200w, /hero-1600.webp 1600w" sizes="(min-width: 900px) 50vw, 100vw" alt="Malvirn Gomo, founder of Marva Technologies" width="1600" height="2400" fetchPriority="high" />
        <div className="hero-image-overlays">
          <div className="founder-glass"><span className="founder-name">Malvirn Gomo</span><span className="founder-role">Founder, Marva Technologies</span></div>
          <div className="hero-service-chips" aria-label="Marva services"><span>Web Apps</span><span>Automation</span><span>Software</span></div>
        </div>
      </div>
    </section>
  );
}
