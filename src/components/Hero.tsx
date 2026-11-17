"use client";

import { useTypewriter } from "@/hooks/useTypewriter";

export default function Hero() {
  const typed = useTypewriter(
    "We build useful software, thoughtful websites and digital tools that help ideas grow.",
    { speed: 34 }
  );

  return (
    <section className="intro-hero hero-single-image hero-has-bg" id="home" aria-label="About Marva Technologies">
      <div className="hero-content-wrap hero-single-content">
        <p className="hero-pretitle">A little about us</p>
        <h1 className="intro-title">Ideas into <span className="headline-emphasis">impact.</span></h1>
        <p className="intro-copy hero-type-copy" aria-live="polite">
          {typed.text}<i className="typing-cursor" aria-hidden="true" />
        </p>
      </div>
    </section>
  );
}
