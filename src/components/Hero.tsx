"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTypewriter } from "@/hooks/useTypewriter";

const INTRO =
  "We build useful software, thoughtful websites and digital tools that help ideas grow. From the first idea to launch, we make technology work for people.";

export default function Hero() {
  const typed = useTypewriter(INTRO, { speed: 34 });

  return (
    <section className="mh" id="home" aria-label="About Marva Technologies">
      <div className="mh-stage">
        {/* Shown at its natural proportions: never cropped, never zoomed */}
        <img
          className="mh-img"
          src="/hero-background.webp"
          alt="Malvirn Gomo, founder of Marva Technologies, at his desk with a laptop and glowing code panels"
          width={1672}
          height={941}
          fetchPriority="high"
          decoding="async"
        />
        <div className="mh-shade" aria-hidden="true" />

        <div className="mh-copy">
          <p className="mh-pretitle">A little about us</p>
          <h1 className="mh-title">
            Ideas into <span className="mh-accent">impact.</span>
          </h1>
          <p className="mh-text">
            <span className="sr-only">{INTRO}</span>
            <span className="mh-ghost" aria-hidden="true">{INTRO}</span>
            <span className="mh-live" aria-hidden="true">
              {typed.text}
              <i className="typing-cursor" />
            </span>
          </p>
          <div className="mh-actions">
            <Link className="mh-btn mh-btn-solid" href="/projects">
              View our work <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <Link className="mh-btn mh-btn-ghost" href="/contact">
              Get in touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
