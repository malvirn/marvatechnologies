"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTypewriter } from "@/hooks/useTypewriter";

export default function Hero() {
  const typed = useTypewriter("business automation", { speed: 62 });

  return (
    <section className="intro-hero" id="home">
      <div className="hero-photo-wrap">
        <img
          className="hero-photo"
          src="/hero.webp"
          alt="Malvirn Gomo, founder of Marva Technologies"
          width="1024"
          height="1536"
          fetchPriority="high"
        />
      </div>
      <div className="hero-content-wrap">
        <p className="hero-kicker">INDEPENDENT TECHNOLOGY STUDIO <span className="hero-kicker-divider">/</span> ZIMBABWE</p>
        <p className="hero-pretitle">Marva builds <span className="rotating-words"><span>{typed.text}</span><i className="typing-cursor" aria-hidden="true" /></span></p>
        <h1 className="intro-title">We build digital solutions that matter.</h1>
        <p className="intro-copy">Marva Technologies is a growing software brand founded by Malvirn Gomo. We turn practical ideas into useful digital products.</p>
        <div className="intro-actions">
          <Link href="/projects" className="intro-button button-accent">Explore our work <ArrowRight className="button-arrow" size={16}/></Link>
          <Link href="/contact" className="intro-button button-outline">Start a conversation</Link>
        </div>
      </div>
      <div className="hero-bottomline"><span>TECHNOLOGY. INNOVATION. IMPACT.</span><span>FOUNDED BY MALVIRN GOMO</span></div>
    </section>
  );
}
