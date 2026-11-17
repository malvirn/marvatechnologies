"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowDown, Code2, Database, Layers3 } from "lucide-react";
import { useTypewriter } from "@/hooks/useTypewriter";

const INTRO =
  "We build useful software, thoughtful websites and digital tools that help ideas grow. From the first idea to launch, we make technology work for people.";

const focus = [
  { icon: Code2, no: "01", title: "Web applications", text: "Responsive web experiences designed around real people and practical needs." },
  { icon: Database, no: "02", title: "Business systems", text: "Purpose-built tools that organise operations, information and daily workflows." },
  { icon: Layers3, no: "03", title: "Data & integrations", text: "Solid database design and connected services behind every product." },
];

export default function Hero() {
  const typed = useTypewriter(INTRO, { speed: 34 });

  return (
    <section className="intro" id="home" aria-label="About Marva Technologies">
      <div className="intro-glow" aria-hidden="true" />
      <div className="shell intro-inner">
        <div className="intro-layout">
          <div className="intro-main">
            <p className="intro-kicker">A little about us</p>
            <h1 className="intro-heading">
              Ideas into <span className="intro-accent">impact.</span>
            </h1>
            <p className="intro-lead">
              <span className="sr-only">{INTRO}</span>
              <span className="intro-ghost" aria-hidden="true">{INTRO}</span>
              <span className="intro-live" aria-hidden="true">
                {typed.text}
                <i className="typing-cursor" />
              </span>
            </p>
            <div className="intro-cta">
              <Link className="intro-btn intro-btn-solid" href="/projects">
                View our work <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <Link className="intro-btn intro-btn-ghost" href="/contact">
                Get in touch
              </Link>
            </div>
          </div>

          <ul className="intro-focus" aria-label="What Marva Technologies does">
            {focus.map(({ icon: Icon, no, title, text }) => (
              <li className="focus-item" key={no}>
                <span className="focus-icon"><Icon size={18} aria-hidden="true" /></span>
                <div>
                  <h2 className="focus-title"><small>{no}</small>{title}</h2>
                  <p className="focus-text">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="intro-meta">
          <span>Technology · Innovation · Impact</span>
          <span className="intro-meta-mid">Founded by Malvirn Gomo · Zimbabwe</span>
          <a className="intro-scroll" href="#founder">
            Meet the founder <ArrowDown size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
