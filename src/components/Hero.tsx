"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTypewriter } from "@/hooks/useTypewriter";

export default function Hero() {
  const typed = useTypewriter(
    "We build useful software, thoughtful websites and digital tools that help ideas grow.",
    { speed: 34 }
  );

  return (
    <section className="intro-hero hero-single-image hero-no-photo" id="home" aria-label="About Marva Technologies">
      <div className="hero-content-wrap hero-single-content">
        <p className="hero-kicker hero-brand-desktop">
          <span className="hero-kicker-dot" aria-hidden="true" />
          MARVA TECHNOLOGIES <span className="hero-kicker-divider">/</span> ZIMBABWE
        </p>
        <p className="hero-pretitle">A little about us</p>
        <h1 className="intro-title">Ideas into <span className="headline-emphasis">impact.</span></h1>
        <p className="intro-copy hero-type-copy" aria-live="polite">
          {typed.text}<i className="typing-cursor" aria-hidden="true" />
        </p>
        <div className="intro-actions">
          <Link href="/about" className="intro-button button-accent">About Marva <ArrowRight className="button-arrow" size={18}/></Link>
          <Link href="/contact" className="intro-button button-outline">Let’s talk <ArrowRight className="button-arrow" size={18}/></Link>
        </div>
        <div className="hero-bottomline">
          <span>TECHNOLOGY. INNOVATION. IMPACT.</span>
          <span>FOUNDED BY MALVIRN GOMO</span>
        </div>
      </div>
    </section>
  );
}
