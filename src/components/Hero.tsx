"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useTypewriter } from "@/hooks/useTypewriter";

export default function Hero() {
  const reduce = useReducedMotion();
  const [started, setStarted] = useState(false);
  const rotating = useTypewriter(["web applications", "business automation", "database solutions", "practical software"], { speed: 62, start: started, loop: true, pause: 1600, deleteSpeed: 30 });
  const headline = useTypewriter("We build digital solutions that matter.", { speed: 38, start: started });
  useEffect(() => {
    if (reduce) { setStarted(true); return; }
    const timer = window.setTimeout(() => setStarted(true), 1900);
    return () => window.clearTimeout(timer);
  }, [reduce]);

  return <section className="intro-hero" id="home">
    <div className="hero-content-wrap">
      <p className="hero-kicker">INDEPENDENT TECHNOLOGY STUDIO <span/> ZIMBABWE</p>
      <p className="hero-pretitle" aria-label={`Marva builds ${rotating.text}`}>Marva builds <span className="rotating-words"><span className="typing-reserve">business automation</span><span aria-hidden="true">{rotating.text}</span>{!rotating.done && <i className="typing-cursor"/>}</span></p>
      <h1 className="intro-title" aria-label="We build digital solutions that matter."><span className="typing-reserve">We build digital solutions that matter.</span><span aria-hidden="true">{headline.text}</span>{!headline.done && <i className="typing-cursor headline-cursor"/>}</h1>
      <p className="intro-copy">Marva Technologies is a growing software brand founded by Malvirn Gomo. We turn practical ideas into useful digital products.</p>
      <div className="intro-actions"><Link href="/projects" className="intro-button button-accent">Explore our work <ArrowUpRight size={17}/></Link><Link href="/contact" className="intro-button button-outline">Start a conversation <ArrowRight size={17}/></Link></div>
    </div>
    <div className="hero-bottomline"><span>TECHNOLOGY. INNOVATION. IMPACT.</span><span>FOUNDED BY MALVIRN GOMO</span></div>
  </section>;
}
