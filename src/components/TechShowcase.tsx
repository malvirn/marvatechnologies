"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const rowOne = ["Web apps", "Dashboards", "Business systems", "Databases", "Integrations", "Mobile-first", "Made in Zimbabwe"];
const rowTwo = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "APIs", "Responsive UI"];

type Stat = { value: number; suffix: string; label: string; visual: "ring" | "clock" | "pulse" };
const stats: Stat[] = [
  { value: 100, suffix: "%", label: "Responsive by design", visual: "ring" },
  { value: 24, suffix: "/7", label: "Always-on systems", visual: "clock" },
  { value: 1, suffix: " idea", label: "Is all we need to start", visual: "pulse" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 1.8, ease: "easeOut", onUpdate: v => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function StatVisual({ kind }: { kind: Stat["visual"] }) {
  if (kind === "ring")
    return (
      <svg className="sv" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="18" className="sv-track" />
        <motion.circle
          cx="24" cy="24" r="18" className="sv-fill" pathLength={1}
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />
        <path className="sv-check" d="M16 25 L22 31 L33 18" />
      </svg>
    );
  if (kind === "clock")
    return (
      <svg className="sv" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="18" className="sv-track" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1="24" y1="8" x2="24" y2={i % 3 === 0 ? 11.5 : 10} className="sv-tick" transform={`rotate(${i * 30} 24 24)`} />
        ))}
        <line x1="24" y1="24" x2="24" y2="12" className="sv-hand sv-hand-m" />
        <line x1="24" y1="24" x2="24" y2="16" className="sv-hand sv-hand-h" />
        <circle cx="24" cy="24" r="2" fill="#fff" />
      </svg>
    );
  return (
    <svg className="sv" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="4" fill="#fff" />
      <circle cx="24" cy="24" r="4" className="sv-ripple" />
      <circle cx="24" cy="24" r="4" className="sv-ripple sv-ripple-2" />
      <circle cx="24" cy="24" r="4" className="sv-ripple sv-ripple-3" />
    </svg>
  );
}

function StatCard({ s, i }: { s: Stat; i: number }) {
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--sx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };
  return (
    <motion.div
      className="tech-stat"
      onPointerMove={onMove}
      initial={{ opacity: 0, y: 60, rotateX: -18, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay: i * 0.15, ease: [0.2, 0.7, 0.2, 1] }}
      whileHover={{ y: -8 }}
    >
      <span className="ts-no">0{i + 1}</span>
      <StatVisual kind={s.visual} />
      <strong><Counter to={s.value} suffix={s.suffix} /></strong>
      <span className="ts-label">{s.label}</span>
      <span className="ts-bar" aria-hidden="true" />
    </motion.div>
  );
}

export default function TechShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const [expanded, setExpanded] = useState(false);

  // flashlight lens: position (%) and radius (px), all spring-smoothed
  const tx = useMotionValue(50);
  const ty = useMotionValue(50);
  const tr = useMotionValue(150);
  const x = useSpring(tx, { stiffness: 70, damping: 16 });
  const y = useSpring(ty, { stiffness: 70, damping: 16 });
  const r = useSpring(tr, { stiffness: 80, damping: 16 });
  const mask = useMotionTemplate`radial-gradient(circle ${r}px at ${x}% ${y}%, #000 0, #000 72%, transparent 100%)`;
  const ringLeft = useMotionTemplate`${x}%`;
  const ringTop = useMotionTemplate`${y}%`;
  const ringSize = useTransform(r, v => Math.max(0, v * 1.44));

  // wander on its own until the visitor takes over
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      if (!hovering.current && !expanded) {
        const t = (now - t0) / 1000;
        tx.set(50 + 30 * Math.sin(t * 0.55));
        ty.set(50 + 24 * Math.sin(t * 0.9 + 1.2));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tx, ty, expanded]);

  useEffect(() => {
    tr.set(expanded ? 2400 : hovering.current ? 230 : 150);
  }, [expanded, tr]);

  // tilt
  const tiltX = useSpring(0, { stiffness: 120, damping: 16 });
  const tiltY = useSpring(0, { stiffness: 120, damping: 16 });
  const onMove = (e: React.PointerEvent) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    if (!expanded) {
      tx.set(px * 100);
      ty.set(py * 100);
    }
    if (e.pointerType === "mouse") {
      tiltY.set((px - 0.5) * 6);
      tiltX.set(-(py - 0.5) * 6);
    }
  };

  // scroll
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [-60, 100]);
  const stageScale = useTransform(scrollYProgress, [0, 0.35, 0.6], [0.9, 1, 1]);
  const stageRotate = useTransform(scrollYProgress, [0, 0.35], [6, 0]);

  const headline = ["From", "blueprint", "to", "product."];

  return (
    <section className="section tech-section" ref={sectionRef}>
      <motion.div className="tech-glow tech-glow-a" style={{ y: glowY }} aria-hidden />
      <div className="tech-grid" aria-hidden />

      <div className="shell">
        <div className="tech-head">
          <motion.div className="eyebrow" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            How we build
          </motion.div>
          <h2 className="tech-title" aria-label="From blueprint to product.">
            {headline.map((w, i) => (
              <span className="tech-word-mask" key={w} aria-hidden>
                <motion.span
                  className={`tech-word ${w === "product." ? "tech-word-accent" : ""}`}
                  initial={{ y: "110%", rotate: 6 }}
                  whileInView={{ y: "0%", rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  {w}
                </motion.span>{" "}
              </span>
            ))}
          </h2>
          <motion.p className="tech-copy" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.6 }}>
            Every great product starts as a rough sketch. We turn ideas into clean, fast and
            dependable software, from the first wireframe to the finished interface on your
            laptop and in your pocket.
          </motion.p>
        </div>

        <motion.div className="tech-stage-wrap" style={{ scale: stageScale, rotateX: stageRotate }}>
          <motion.div
            ref={stageRef}
            className="tech-stage"
            style={{ rotateX: tiltX, rotateY: tiltY }}
            onPointerEnter={() => {
              hovering.current = true;
              if (!expanded) tr.set(230);
            }}
            onPointerMove={onMove}
            onPointerLeave={() => {
              hovering.current = false;
              tiltX.set(0);
              tiltY.set(0);
              if (!expanded) tr.set(150);
            }}
            onClick={() => setExpanded(v => !v)}
          >
            <img className="tech-img tech-img-base" src="/tech-blueprint.webp" width={1672} height={941} alt="Blueprint wireframe of a dashboard on a laptop and a phone" loading="lazy" decoding="async" draggable={false} />
            <motion.img className="tech-img tech-img-top" style={{ maskImage: mask, WebkitMaskImage: mask }} src="/tech-render.webp" width={1672} height={941} alt="The finished dashboard shown on a laptop and a phone" loading="lazy" decoding="async" draggable={false} />

            <motion.span className="tech-lens" style={{ left: ringLeft, top: ringTop, width: ringSize, height: ringSize }} aria-hidden />

            <i className="tech-corner tc-tl" aria-hidden />
            <i className="tech-corner tc-tr" aria-hidden />
            <i className="tech-corner tc-bl" aria-hidden />
            <i className="tech-corner tc-br" aria-hidden />

            <span className="tech-tag tech-tag-l">Blueprint</span>
            <span className="tech-tag tech-tag-r">{expanded ? "Product" : "Lens"}</span>
            <span className="tech-hint">{expanded ? "Click to shrink" : "Move to explore · Click to expand"}</span>
          </motion.div>
        </motion.div>

        <div className="tech-stats">
          {stats.map((s, i) => <StatCard s={s} i={i} key={s.label} />)}
        </div>
      </div>

      <div className="mq" aria-hidden>
        {[rowOne, rowTwo].map((row, ri) => (
          <div className={`mq-row ${ri === 1 ? "mq-rev" : ""}`} key={ri}>
            <div className="mq-track">
              {[...row, ...row].map((w, i) => (
                <span className="mq-pill" key={i}><i />{w}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
