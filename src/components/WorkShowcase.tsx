"use client";

import { useEffect, useState } from "react";

const slides = [
  { src: "/work-dark.webp", label: "Dark mode", alt: "Repair Management System in dark mode, showing the job cards board on a phone in a workshop" },
  { src: "/work-light.webp", label: "Light mode", alt: "Repair Management System in light mode, showing a customer account with balances and history on a phone in a workshop" },
];

export default function WorkShowcase() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIndex(i => (i + 1) % slides.length), 4800);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="work-show"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          className={`work-img ${i === index ? "is-active" : ""}`}
          src={slide.src}
          alt={slide.alt}
          width={1672}
          height={941}
          loading="lazy"
          decoding="async"
          aria-hidden={i !== index}
        />
      ))}
      <div className="work-bar">
        <span className="work-label">{slides[index].label}</span>
        <div className="work-dots" role="tablist" aria-label="Switch screenshot">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={slide.label}
              className={`work-dot ${i === index ? "is-active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
