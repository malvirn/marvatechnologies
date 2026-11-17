"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";

const items = [
  ["Build for people.", "Solve real problems.", "Every feature starts with a person who needs it."],
  ["Ship small,", "learn fast.", "Small releases teach more than big plans."],
  ["Clear words", "are part of the product.", "Good communication saves more time than good code."],
  ["Useful beats", "impressive.", "If it makes someone's day easier, it is working."],
];

export default function Principles() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => setI(v => (v + 1) % items.length), 5200);
    return () => window.clearTimeout(t);
  }, [i, paused]);
  return (
    <div className="in-pr" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <Quote className="in-pr-q" size={46} strokeWidth={1.5} aria-hidden="true" />
      <div className="in-pr-stage" aria-live="polite">
        {items.map(([a, b, c], n) => (
          <figure key={a} className={`in-pr-slide ${n === i ? "is-on" : ""}`} aria-hidden={n !== i}>
            <blockquote><span>{a}</span> <em className="gradient">{b}</em></blockquote>
            <figcaption>{c}</figcaption>
          </figure>
        ))}
      </div>
      <div className="in-pr-nav">
        {items.map(([a], n) => (
          <button key={a} type="button" className={`in-pr-dot ${n === i ? "is-on" : ""}`} onClick={() => setI(n)} aria-label={`Show principle ${n + 1}`}>
            <span key={n === i ? `p${i}` : "x"} style={n === i && !paused ? undefined : { animationPlayState: "paused" }} />
          </button>
        ))}
      </div>
    </div>
  );
}
